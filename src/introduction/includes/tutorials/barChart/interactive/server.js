const http = require("http");
const fs = require("fs");

const files = {
    "/": {path: "index.html", type: "text/html; charset=utf-8"},
    "/example.mjs": {path: "example.mjs", type: "text/javascript; charset=utf-8"},
    "/drawing.mjs": {path: "drawing.mjs", type: "text/javascript; charset=utf-8"},
    "/dapentryLib.mjs": {path: "dapentryLib.mjs", type: "text/javascript; charset=utf-8"}
}

const requestListener = function (req, res) {
    const file = files[req.url];
    if (file) {
        fs.readFile(file.path, (err, data) => {
            res.setHeader("Content-Type", file.type);
            res.setHeader("Content-Disposition", `filename="${file.path}"`);
            res.writeHead(200)
            res.end(data);
        })
    } else {
        res.writeHead(404);
        res.end("not found");
    }
};

const server = http.createServer(requestListener);
server.listen(0, "localhost", () => {
    console.log(`Server is running on http://localhost:${server.address().port}`);
});
