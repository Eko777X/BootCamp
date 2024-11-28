const http = require ("http");
const fs = require ("fs");
const Port = 3000;

http
.createServer((req,res) => {
    const url = req.url;
    console.log(url);
    const renderHtml = (path, res) => {

        res.writeHead(200, {"content-type" : "text/html"});
        fs.readFile(path,(err,data) => {
            if (err) {
                console.log(err);
                res.write("Error");
                res.end();
            } else {
                res.write(data);
                res.end();
            }
        });

    }

    
    if (url === "/about"){
        renderHtml ("views/about.html",res);
    } else if (url === "/contact"){
        renderHtml ("views/contact.html",res);
    } else if (url === "/") {
        renderHtml ("views/index.html",res);
    } else {
        res.writeHead(404, {"content-type" : "text/html"});
        res.write("Halaman Tidak Ditemukan");
        res.end();
    }
   
})

.listen(Port, () => {
    console.log(`Server Running on Port ${Port}`);
});