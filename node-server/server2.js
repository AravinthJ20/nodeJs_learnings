const http=require("http")
const server=http.createServer((req,res)=>{
res.write("hello")
    res.end()
})