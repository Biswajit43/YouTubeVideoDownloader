const express = require("express");
const http = require("http");
const { WebSocketServer } = require("ws");
const youtubedl = require("yt-dlp-exec");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

app.use(cors());
app.use(express.json());

// Create a 'downloads' directory if it doesn't exist
const downloadsDir = path.join(__dirname, 'downloads');
if (!fs.existsSync(downloadsDir)) {
    fs.mkdirSync(downloadsDir);
}
// Serve the downloaded files statically
app.use('/downloads', express.static(downloadsDir));

// Regular endpoint to get video info
app.post("/submit", async (req, res) => {
    const { url } = req.body;
    if (!url) {
        return res.status(400).json({ error: "Enter a valid URL" });
    }
    try {
        const vidinfo = await youtubedl(url, {
            dumpSingleJson: true,
            noWarnings: true,
        });
        return res.json(vidinfo);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Something went wrong", details: err.message });
    }
});

// WebSocket connection for handling downloads with progress
wss.on("connection", (ws) => {
    console.log("Client connected for download");

    ws.on("message", async (message) => {
        const { url } = JSON.parse(message);
        if (!url) {
            ws.send(JSON.stringify({ type: "error", message: "No URL provided" }));
            return;
        }

        try {
            const vidinfo = await youtubedl(url, { dumpSingleJson: true });
            const safeTitle = vidinfo.title.replace(/[^a-z0-9_.-]/gi, "_");
            const finalFilename = `${safeTitle}.mp4`;
            const outputPath = path.join(downloadsDir, finalFilename);

            const downloadProcess = youtubedl.exec(url, {
                // This format string is robust. It gets the best MP4 video and audio.
                // The '/b' is a fallback to the best overall format if specific streams fail.
                format: "bv*[ext=mp4]+ba[ext=m4a]/b[ext=mp4]/best",
                output: outputPath,
                mergeOutputFormat: "mp4",
            });

            // Regex to capture download percentage
            const progressRegex = /\[download\]\s+(\d+\.?\d*)%/;

            downloadProcess.stderr.on("data", (data) => {
                const text = data.toString();
                const match = text.match(progressRegex);
                if (match && match[1]) {
                    const percentage = parseFloat(match[1]);
                    // Send progress update to the client
                    ws.send(JSON.stringify({ type: "progress", percentage }));
                }
                console.log(`STDERR: ${text}`); // Keep this for debugging
            });
            
            downloadProcess.on("close", () => {
                console.log("Download finished!");
                // Send completion message to the client
                ws.send(JSON.stringify({
                    type: "complete",
                    // Provide a URL the client can use to download the file
                    fileUrl: `http://localhost:3000/downloads/${finalFilename}`
                }));
            });

            downloadProcess.on("error", (err) => {
                console.error("Error during download process:", err);
                ws.send(JSON.stringify({ type: "error", message: "Failed to process video. Is FFmpeg installed correctly?" }));
            });

        } catch (err) {
            console.error("Initial error:", err);
            ws.send(JSON.stringify({ type: "error", message: "Failed to fetch video information." }));
        }
    });

    ws.on("close", () => {
        console.log("Client disconnected");
    });
});

// Use the HTTP server to listen, not the Express app
server.listen(3000, () => {
    console.log("✅ App with WebSocket running on http://localhost:3000");
    console.log("⚠️ Make sure FFmpeg is installed and added to your system's PATH.");
});