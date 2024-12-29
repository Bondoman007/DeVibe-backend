const express = require('express')
const app = express()
 
app.use("/test",(req,res)=>{
    res.send('hello testing')
})
app.get("/id",(req,res)=>{
    res.send('id verified')
})
app.listen(3000, () => {
    console.log("server is listening port 3000")
})




