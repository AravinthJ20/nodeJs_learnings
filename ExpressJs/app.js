const express=require('express')
const app=express()
const PORT=3000;

// app.use('/test/2', (req, res) => {
//     console.log(`${req.url} ${req.method}`)
//     res.send('middleware test 2')
// })
// app.use('/test', (req, res) => {
//     console.log(`${req.url} ${req.method}`)
//     res.send('middleware test')
// })
// app.use('/', (req, res) => {
//     console.log(`${req.url} ${req.method}`)
//     res.send('welcome to express')
// })



app.listen(
    PORT,()=>{
        console.log(`app listening http://localhost:${PORT}`)
    }
)