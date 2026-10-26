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

//import {Device} from './device/Device.js';

//const device=new Device(process.env.SIM_DATA_DIR||path.join(root,'data'));

//await device.begin(defaultTemplate);

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



// //     // ---------- SENSOR API ----------
// //     if (url.pathname === "/api/sensors" && req.method === "GET") {
// //         sendJson(res, 200, sensors.update());
// //         return;
// //     }

//   if(url.pathname==='/api/events'&&req.method==='GET'){res.writeHead(200,{'Content-Type':'text/event-stream','Cache-Control':'no-cache','Connection':'keep-alive'});res.write(`data: ${JSON.stringify({type:'snapshot',data:{sensors:Object.fromEntries(device.sensors.values),state:device.connection.state}})}\n\n`);clients.add(res);req.on('close',()=>clients.delete(res));return;}
//   if(url.pathname==='/api/settings'&&req.method==='GET')return send(res,200,{...device.settings,hasToken:!!device.token,connectionState:device.connection.state});
//   if(url.pathname==='/api/settings'&&req.method==='PUT'){await device.updateSettings(await body(req));return send(res,200,{ok:true});}

    //if(url.pathname === '/api/token' && req.method === 'PUT'){await device.setToken((await body(req)).token);return send(res,200,{ok:true});}

    //if(url.pathname === '/api/token' && req.method === 'DELETE'){await device.clearToken();return send(res,200,{ok:true});}

    //if(url.pathname === '/api/template' && req.method === 'GET')
    //    return send(res, 200, device.template);

//   if(url.pathname==='/api/template'&&req.method==='PUT'){await device.updateTemplate(await body(req));return send(res,200,{ok:true});}
//   if(url.pathname==='/api/connect'&&req.method==='POST'){device.connect();return send(res,200,{ok:true});}
//   if(url.pathname==='/api/disconnect'&&req.method==='POST'){device.disconnect();return send(res,200,{ok:true});}
//   if(url.pathname==='/api/sensor'&&req.method==='POST'){const {id,value}=await body(req);if(typeof id!=='string'||!id||typeof value!=='number'||!Number.isFinite(value))throw Error('Invalid sensor');device.sensors.update(id,value);return send(res,200,{ok:true});}
//   if(url.pathname.startsWith('/api/'))return send(res,404,{error:'Not found'});
//   const name=url.pathname==='/'?'/public/index.html':url.pathname;
//   if(!name.startsWith('/public/')&&!name.startsWith('/src/'))return send(res,404,{error:'Not found'});
//   const file=path.resolve(root,'.'+name);if(!file.startsWith(root+path.sep))throw Error('Invalid path');const data=await readFile(file);res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','X-Content-Type-Options':'nosniff'});res.end(data);

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
