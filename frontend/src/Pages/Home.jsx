import React, { useState, useRef } from "react";

// --- FIX ---
// Use environment variables for the backend URLs
const VITE_BACKEND_API_URL =  "http://localhost:3000";
const VITE_BACKEND_WS_URL = "ws://localhost:3000";
console.log("API URL =>", VITE_BACKEND_API_URL);
console.log("WS URL  =>", VITE_BACKEND_WS_URL);


const Home = () => {
    const [url, setUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [vidInfo, setVidInfo] = useState(null);
    const [error, setError] = useState(null);
    const [downloading, setDownloading] = useState(false);
    const [downloadProgress, setDownloadProgress] = useState(0);
    const ws = useRef(null);

    const handleChange = (e) => setUrl(e.target.value);

    const handleSubmit = async () => {
        setVidInfo(null);
        setError(null);
        setLoading(true);
        try {
            const res = await fetch(`${VITE_BACKEND_API_URL}/submit`, { // Use variable
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url }),
            });
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.details || res.statusText);
            }
            const data = await res.json();
            if (data.error) throw new Error(data.error);
            setVidInfo(data);
        } catch (err) {
            setError(err.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = () => {
        if (!url || !vidInfo) return alert("Please generate video details first.");
        setDownloading(true);
        setDownloadProgress(0);

        ws.current = new WebSocket(VITE_BACKEND_WS_URL); // Use variable

        ws.current.onopen = () => ws.current.send(JSON.stringify({ url }));
        ws.current.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === "progress") {
                setDownloadProgress(data.percentage);
            } else if (data.type === "complete") {
                const link = document.createElement("a");
                link.href = data.fileUrl;
                link.setAttribute("download", vidInfo.title.replace(/[^a-z0-9_.-]/gi, "_") + ".mp4");
                document.body.appendChild(link);
                link.click();
                link.remove();
                setDownloading(false);
                ws.current.close();
            } else if (data.type === "error") {
                setError(data.message);
                setDownloading(false);
                ws.current.close();
            }
        };
        ws.current.onerror = () => {
            setError("Connection failed. Is the server running?");
            setDownloading(false);
        };
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col items-center justify-center p-6">
            <div className="w-full max-w-2xl">
                <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 drop-shadow-lg text-center">
                    URL Video Downloader
                </h2>
                <div className="bg-gray-800 p-6 md:p-8 rounded-2xl shadow-2xl flex flex-col md:flex-row items-center gap-4">
                    <input type="text" value={url} onChange={handleChange} placeholder="Paste a video link here..." className="flex-1 px-4 py-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition duration-200 w-full" />
                    <button onClick={handleSubmit} disabled={loading} className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold px-6 py-3 rounded-lg shadow-lg transition duration-300 transform hover:scale-105 w-full md:w-auto disabled:opacity-50 disabled:cursor-not-allowed">
                        {loading ? "Loading..." : "Generate"}
                    </button>
                </div>
                {error && <div className="bg-red-500/20 text-red-300 p-4 rounded-lg mt-6 text-center"><p><strong>Error:</strong> {error}</p></div>}
                {vidInfo && !loading && (
                    <div className="text-gray-300 mt-6 text-center bg-gray-800 p-6 rounded-2xl shadow-xl">
                        <img src={vidInfo.thumbnail} alt={`Thumbnail for ${vidInfo.title}`} className="mx-auto rounded-lg mb-4" />
                        <p className="font-bold text-lg mb-2">{vidInfo.title}</p>
                        <p>Channel: {vidInfo.channel}</p>
                        <p>Duration: {vidInfo.duration_string}</p>
                        {!downloading ? (
                            <button onClick={handleDownload} className="mt-4 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold px-6 py-3 rounded-lg shadow-lg transition duration-300 transform hover:scale-105">
                                Download
                            </button>
                        ) : (
                            <div className="mt-4">
                                <p className="text-white mb-2">Downloading... {downloadProgress.toFixed(2)}%</p>
                                <div className="w-full bg-gray-600 rounded-full h-4"><div className="bg-yellow-400 h-4 rounded-full transition-all duration-200" style={{ width: `${downloadProgress}%` }}></div></div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;