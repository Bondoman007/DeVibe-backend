const express = require('express')
const app = express()
 
app.get("/test",(req,res,next)=>{
    next()
},(req,res,next)=>{
    res.send(' testing')
})
app.get("/id/:userId/:name/:password",(req,res,next)=>{
    console.log(req.params)
    res.send('id verified')
},)

app.get("/test/:")
app.listen(3000, () => {
    console.log("server is listening port 3000")
})
