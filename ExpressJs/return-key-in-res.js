const express=require('express')
const app=express()
const PORT=3000;

app.use((req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).send("Unauthorized"); // ⛔ stop function here
  }
  next();   // runs only when authorized
});


app.post("/login", (req, res) => {
  if (!req.body.username) {
    return res.status(400).send("Username required");
  }

  if (!req.body.password) {
    return res.status(400).send("Password required");
  }

  res.send("Login success");
});

app.listen(
    PORT,()=>{
        console.log(`app listening http://localhost:${PORT}`)
    }
)