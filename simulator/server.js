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
    let filePath = path.join(config.webRoot, safePath);

    if (safePath.startsWith('src/')) filePath = path.join(config.webRoot + "/../", safePath);

    console.log(config.webRoot + " " +  filePath);

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
    let filePath = path.join(config.webRoot, safePath);

    if (safePath.startsWith('src/')) filePath = path.join(config.webRoot + "/../", safePath);

    return fs.existsSync(filePath) && fs.statSync(filePath).isFile();

}

function readJsonBody(req) {

    return new Promise((resolve, reject) => {
    
        let body = "";

        req.on("data", chunk => {
             
            body += chunk;

            if (body.length > 1024 * 64) {
                reject(new Error("Payload too big"));
                req.destroy();
            }

        });

        req.on("end", () => {
            try {
                 resolve(body ? JSON.parse(body) : {});
            } catch {
                reject(new Error("JSON invalide"));
            }
        });

        req.on("error", reject);

    });

}

function sendJson(res, statusCode, data) {
    res.writeHead(statusCode, { "Content-Type": "application/json; charset=utf-8" });
    res.end(JSON.stringify(data));
}

const server = http.createServer(async (req, res) => {
    
    const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
    
    if(req.method !=='GET' && req.headers.origin && req.headers.origin!==`http://localhost:${config.port}` && req.headers.origin !== `http://127.0.0.1:${config.port}`)
        return send(res,403,{error:'Forbidden origin'});

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

    if (url.pathname === "/api/getdevicelist" && req.method === "GET") {

        const data = { 'devices': [] };

        const entries = fs.readdirSync(`data`, { withFileTypes: true });
        for (const entry of entries) {
            if (entry.isDirectory) {
                //Read json
                const jsonText = fs.readFileSync(`data/${entry.name}/config.json`, 'utf8');
                data.devices.push(JSON.parse(jsonText));
            }
        }

        sendJson(res, 200, data);
        return;

    }

    // ---------- API ----------
    if (url.pathname === "/api/getdevicedata" && req.method === "POST") {

        const data = { 'mac': null, 
                        'token': null, 
                        'display': { 'round': true, 'width': 480, 'height': 480 }, 
                        'find': true,
                        'template': null,
                        'images': [],
                        'fonts': []
                    };

        try {

            const body = await readJsonBody(req);
            
            data.mac = body.mac;
            
            if (fs.existsSync(`data/${data.mac}/config.json`)) {
                const jsonText = fs.readFileSync(`data/${data.mac}/config.json`, 'utf8');
                const configData = JSON.parse(jsonText);
                data.token = configData.token;
            }

        } catch (error) {
            sendJson(res, 400, { error: error.message });
            return;
        }

        const dataFolder = `data/${data.mac}`;

        try {   
            const jsonText = fs.readFileSync(`${dataFolder}/template.json`, 'utf8');
            data["template"] = JSON.parse(jsonText);
        }
        catch(err) {
        }

        let files = fs.readdirSync(`${dataFolder}/images`);
        for (const file of files) {
            const dataFile = fs.readFileSync(`${dataFolder}/images/${file}`);
            data.images.push({
                'name': file,
                'data': `data:image/png;base64,${dataFile.toString('base64')}`
            });
        }

        files = fs.readdirSync(`${dataFolder}/fonts`);
        for (const file of files) {
            const dataFile = fs.readFileSync(`${dataFolder}/fonts/${file}`);
            data.fonts.push({
                'name': path.parse(file).name,
                'data': `data:font/ttf;base64,${dataFile.toString('base64')}`
            });
        }

        sendJson(res, 200, data);
        return;
    }

    if (url.pathname === "/api/setdeviceconfig" && req.method === "POST") {

        try {

            const body = await readJsonBody(req);
            
            let cfgData = null;

            if (!fs.existsSync(`data/${body.mac}/config.json`)) {
                const jsonText = fs.readFileSync(`data/${data.mac}/config.json`, 'utf8');
                cfgData = JSON.parse(jsonText);
            }
            else {
                cfgData = {
                    "mac": body.mac,
                    "token": "",
                    "name": ""
                };
            }

            if (Object.hasOwn(body, 'token')) cfgData.token = body.token;

            fs.mkdirSync(path.dirname(`data/${body.mac}`), { recursive: true });
            fs.writeFileSync(`data/${body.mac}/config.json`, JSON.stringify(cfgData, null, 2), 'utf8');

            sendJson(res, 200, {});

        } catch (error) {
            sendJson(res, 400, { error: error.message });
        }

        return;

    }

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
