const express = require("express");
const http = require("http");
const { WebSocketServer } = require("ws");
const youtubedl = require("yt-dlp-exec");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const app = express();
app.use(express.json()); 
const ytDlpPath = require('yt-dlp-exec').path;

app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
    credentials: true
}));

// Handle preflight requests for all routes
// Handle preflight requests for all routes


const server = http.createServer(app);
const wss = new WebSocketServer({ server });


const downloadsDir = path.join(__dirname, 'downloads');
if (!fs.existsSync(downloadsDir)) {
    fs.mkdirSync(downloadsDir);
}
app.use('/downloads', express.static(downloadsDir));


app.post("/submit", async (req, res) => {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: "Enter a valid URL" });
    try {
        const vidinfo = await youtubedl(url, {
            dumpSingleJson: true,
            noWarnings: true,
            ytDlpPath: ytDlpPath,
        });
        return res.json(vidinfo);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Something went wrong", details: err.message });
    }
});


wss.on("connection", (ws) => {
    console.log("Client connected for download");
    ws.on("message", async (message) => {
        const { url } = JSON.parse(message);
        if (!url) return ws.send(JSON.stringify({ type: "error", message: "No URL provided" }));
        try {
            const vidinfo = await youtubedl(url, { dumpSingleJson: true, ytDlpPath: ytDlpPath });
            const safeTitle = vidinfo.title.replace(/[^a-z0-9_.-]/gi, "_");
            const finalFilename = `${safeTitle}.mp4`;
            const outputPath = path.join(downloadsDir, finalFilename);
            const downloadProcess = youtubedl.exec(url, {
                format: "bv*[ext=mp4]+ba[ext=m4a]/b[ext=mp4]/best",
                output: outputPath,
                mergeOutputFormat: "mp4",
                ytDlpPath: ytDlpPath,
            });

            const progressRegex = /\[download\]\s+(\d+\.?\d*)%/;

            downloadProcess.stderr.on("data", (data) => {
                const text = data.toString();
                const match = text.match(progressRegex);
                if (match && match[1]) {
                    ws.send(JSON.stringify({ type: "progress", percentage: parseFloat(match[1]) }));
                }
            });

            downloadProcess.on("close", () => {
                console.log("Download finished!");
    
                const publicUrl = process.env.RENDER_EXTERNAL_URL || `http://localhost:3000`;
                ws.send(JSON.stringify({
                    type: "complete",
                    fileUrl: `${publicUrl}/downloads/${finalFilename}`
                }));
            });

            downloadProcess.on("error", (err) => {
                console.error("Error during download process:", err);
                ws.send(JSON.stringify({ type: "error", message: "Failed to process video." }));
            });

        } catch (err) {
            console.error("Initial error:", err);
            ws.send(JSON.stringify({ type: "error", message: "Failed to fetch video information." }));
        }
    });
    ws.on("close", () => console.log("Client disconnected"));
});

app.get('/', (req, res) => res.send("hello biswajit !"));

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));  
