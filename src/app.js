const express = require('express')
const app = express()
const {authAdmin} = require("./middleware/auth")

app.use("/admin",(req,res,next)=>{
    console.log('admin auth')
    const token="xyz"
    const authenticateToken = token==="xyz"
    if(authenticateToken){
        next()
    }else{
        res.status(401).send('auth failed')
    }

})

 app.get("/user", authAdmin)
 

app.get("/admin/getalldata",(req,res,next)=>{
    res.send('test')
})
app.get("/id/:userId/:name/:password",(req,res,next)=>{
    console.log(req.params)
    res.send('id verified')
},)


app.listen(3000, () => {
    console.log("server is listening port 3000")
})
