const http = require("http");
const fs = require("fs");
const path = require("path");

const config = require("./config");

const contentTypes = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".svg": "image/svg+xml",
    ".ico": "image/x-icon"
};

function returnFile(res, relativePath) {

    const safePath = path.normalize(relativePath).replace(/^([.][.][/\\])+/, "");
    const filePath = path.join(config.webRoot, safePath);

    if (!filePath.startsWith(config.webRoot)) {
        res.writeHead(403);
        res.end("Forbidden");
        return;
    }

    fs.readFile(filePath, (err, data) => {

        if (err) {
            res.writeHead(err.code === "ENOENT" ? 404 : 500);
            res.end(err.code === "ENOENT" ? "File not found" : "Internal server error (1)");
            return;
        }

        const ext = path.extname(filePath).toLowerCase();

        res.writeHead(200, { "Content-Type": contentTypes[ext] || "application/octet-stream" });

        res.end(data);

    });

}

function isWebFile(relativePath) {

    const safePath = path.normalize(relativePath).replace(/^([.][.][/\\])+/, "");
    const filePath = path.join(config.webRoot, safePath);

    return fs.existsSync(filePath) && fs.statSync(filePath).isFile()

}

const server = http.createServer(async (req, res) => {
    
    const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
    
    // -------------------------------
    // ---- WEB
    // ----

    // ---------- STATIC ASSETS ----------

    console.log(url.href);

    const webFile = url.pathname.slice(1);

    // ----------  WEB FILES (if file exists inside web folder) ----------
    if (isWebFile(webFile)) {
        returnFile(res, webFile);
        return;        
    }

    // ---------- DEFAULT PAGE ----------
    if (url.pathname === "/" && req.method === "GET") {
        returnFile(res, "index.html");
        return;
    }

// //     // ---------- SENSOR API ----------
// //     if (url.pathname === "/api/sensors" && req.method === "GET") {
// //         sendJson(res, 200, sensors.update());
// //         return;
// //     }

    res.writeHead(404);
    res.end("not found");

});

// -------------------------------------------------

server.listen(config.port, () => {
    console.log("");
    console.log("pmgDevice Simulator");
    console.log("---------------------");
    console.log(`Web: http://localhost:${config.port}`);
    console.log(`Web root: ${config.webRoot}`);
    console.log("");
});
