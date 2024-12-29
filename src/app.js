const express = require('express')
const app = express()
 
app.use("/test",(req,res)=>{
    res.send('hello testing')
})
app.get("/id/:userId/:name/:password",(req,res)=>{
    console.log(req.params)
    res.send('id verified')
})

app.get("/test/:")
app.listen(3000, () => {
    console.log("server is listening port 3000")
})




