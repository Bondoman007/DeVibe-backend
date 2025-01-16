const express = require("express")
const {userAuth} = require("./middleware/auth")
const {connectDB} = require("./config/database")
const User = require("./models/user")
const app = express()
const bcyrpt = require("bcrypt")
const cookieParser = require("cookie-parser")
const jwt = require("jsonwebtoken")
app.use(express.json())
app.use(cookieParser())
//NEVER TRUST req.body always validate your data
app.post("/signup", async (req,res)=>{
    
    const {password,firstName,lastName,emailId,gender,age} = req.body
    try{
        //encrypting the password 
        const hashPassword = await bcyrpt.hash(password,10)
        console.log(hashPassword)
        const user = new User({
            firstName,
            lastName,
            emailId,
            password: hashPassword,
            gender,
             age,
        }) 
        await user.save()
        res.send("user saved")
    }catch(err){
        res.status(400).send("ERROR:"+err.message)
    }
})
app.get("/profile",userAuth,async (req,res)=>{
    
    const user = req.user
    res.send(user)
})
app.post("/login", async (req,res)=>{
    const { emailId , password} = req.body
    try{
        const user = await User.findOne({emailId : emailId})
        if(!user){
            throw new Error("Invalid credentials")
        }
        
        const cmp = await user.validatePassword(password)
        if(!cmp){
            throw new Error("Invalid credentials")
        }else{
            const token = await user.getJWT()
            res.cookie("token",token,{
                expires : new Date(Date.now() + 1 * 3600000)
            })
            res.send("user login succesfully")
        }
    }catch(err){
        res.status(400).send("ERROR:"+err)
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
    }catch(err){
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

app.patch("/user/:userId",async (req,res)=>{
    const userId = req.params.userId
    const data = req.body
    try{
        ALLOWED = ["gender","age","skills","photoUrl"]
        const isUpdateAllowed = Object.keys(data).every((x) =>
            ALLOWED.includes(x)
        )
        if(!isUpdateAllowed){
            throw new Error("update not allowed")
        }
        if(data?.skills.length > 10){
            throw new Error("skills cannot be more than 10")
        }
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