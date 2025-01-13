const express = require('express')
const {authAdmin} = require("./middleware/auth")
const {connectDB} = require("./config/database")
const User = require("./models/user")
const app = express()

app.use(express.json())
app.post("/signup", async (req,res)=>{
    const user = new User(req.body)
    try{
        await user.save()
        res.send("user saved")
    }catch(err){
        res.status(400).send("something went wrong:"+err)
    }
})
app.get("/user", async (req,res)=>{
    const userEmail = req.body.emailId
    try{
        const users = await User.find({ emailId : userEmail})
        if(users.length === 0){
            res.status(400).send("something went wrong")
        }else{
            res.send(users)
        }
       
    } catch(err){
        res.status(400).send("something went wrong")
    }

})
app.get("/feed", async (req,res)=>{
    try{
        const users = await User.find()
        res.send(users)
    }catch(err){
        res.status(400).send("something went wrong")
    }
})

app.delete("/user", async (req,res)=>{
    const userId = req.body.userId
    try{
        await User.findByIdAndDelete({_id: userId})
        res.send("user deleted")
    }catch(err){
        res.status(400).send("something went wrong user not deleted")
    }
})

app.patch("/user",async (req,res)=>{
    const userId = req.body.userId
    const data = req.body
    try{
        const user = await User.findByIdAndUpdate({_id: userId},data, {
            returnDocument:"before", 
            runValidators:true
        } )
        console.log(user )
        res.send("user updated ")
    }catch(err){
        res.status(400).send("UPDATE FAILED:"+err)
    }
})

connectDB()
  .then(()=>{
    console.log("Database connected")
    app.listen(3000, () => {
        console.log("server is listening port 3000")
    })
})
.catch((err)=>{
    console.log("database cannot be connected")
})