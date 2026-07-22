/*
    JSXGraph Artificial Intelligence Renderer – AIR for VS Code

    License:    The MIT License
    Copyright:  2026 – Center for Mobile Learning with Digital Technology, University of Bayreuth, Germany
    Author:     Carsten Miller
    Web:        https://jsxgraph.org

    Version:    1.01
*/

const fs = require("fs");
const path = require("path");
const WebSocket = require("ws");
const CONSTRUCTION_FILE = path.resolve(process.argv[2] || path.join(__dirname, "construction.js"));
const HEADER_FILE = path.resolve(process.argv[3] || path.join(__dirname, "header.js"));
const PORT = process.argv[4] ? Number(process.argv[4]) : 8787;

function ensureFile(filePath, defaultContent) {
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, defaultContent);
        console.log("File not found - created a template: " + filePath)
    }
}
ensureFile(CONSTRUCTION_FILE, "// BOARD is a constant provided by the preview page itself (it holds the id of the\n" + "// div JSXGraph renders into) - always reference BOARD here, never a hardcoded string.\n" + "var board = JXG.JSXGraph.initBoard(BOARD, {\n" + "    boundingbox: [-10, 10, 10, -10],\n" + "    axis: true,\n" + "    grid: true,\n" + "    keepaspectratio: true\n" + "});\n\n" + "// Copilot (or you) writes the JSXGraph code here.\n" + "// Saving the file automatically loads it into the preview.\n");
ensureFile(HEADER_FILE, "\x3c!-- Additional <script src>, <link>, <meta> or <style> elements for the <head> --\x3e\n" + "\x3c!-- Example (commented out):\n" + '<script src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"><\/script>\n' + "--\x3e\n");
const wss = new WebSocket.Server({
    port: PORT
});
console.log("AIR VS Code Bridge is running.");
console.log("  WebSocket:       ws://localhost:" + PORT);
console.log("  construction.js: " + CONSTRUCTION_FILE);
console.log("  header.js:       " + HEADER_FILE);
console.log("Press Ctrl+C to stop.");

function sendFile(ws, type, filePath) {
    fs.readFile(filePath, "utf8", function(err, data) {
        if (err) {
            console.error("Could not read " + filePath + ": " + err.message);
            return
        }
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({
                type: type,
                content: data
            }))
        }
    })
}
wss.on("connection", function(ws) {
    console.log("Browser connected - sending the current content of both files.");
    sendFile(ws, "header", HEADER_FILE);
    sendFile(ws, "construction", CONSTRUCTION_FILE);
    ws.on("error", function(err) {
        console.error("WebSocket error: " + err.message)
    })
});

function watchFile(filePath, type) {
    let debounceTimer = null;
    fs.watch(filePath, {
        persistent: true
    }, function() {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(function() {
            console.log(path.basename(filePath) + " changed - sending to " + wss.clients.size + " connected browser(s).");
            wss.clients.forEach(function(client) {
                sendFile(client, type, filePath)
            })
        }, 150)
    })
}
watchFile(CONSTRUCTION_FILE, "construction");
watchFile(HEADER_FILE, "header");