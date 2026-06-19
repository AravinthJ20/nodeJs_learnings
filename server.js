const http = require('http')
const fs = require('fs')
const server = http.createServer(
    (req, res) => {

        if (req.url === '/') {

            res.setHeader("Content-Type", "text/html")
            res.write("<html>")
            res.write("<head><titleEnter the form details</title></head>")
            res.write('<body><form action="/sendMessage" method="POST"><input type="text" name="name"><input type="submit"></form></body></html>')
            return res.end()
        }
        if (req.url === "/sendMessage" && req.method === "POST") {
            let body = []
            req.on('data', (chunk) => {
                body.push(chunk)
                console.log('data', chunk)
            })
            req.on('end', () => {
                console.log('end event received')
                const parsedBody = Buffer.concat(body).toString()
                const message = parsedBody.split("=")
                console.log('message', message)
                console.log('parsed Body', parsedBody)
                fs.writeFile("hello.text", message[1], (err) => {
                    console.log('file writing completed')
                    res.setHeader("Location", "/")
                    res.statusCode = 200
                    return res.end()
                })
            })
        }

        if (req.url == '/getData') {

            res.setHeader("Content-Type", "text/html")
            res.write("<html><body>Get Data<body></html>")
            return res.end()
        }
        res.setHeader("Content-Type", "text/html")
        res.write("<html><body>Hello world<body></html>")

        res.end()
    }
)
server.listen(3000, () => {
    console.log('server is listening')
})