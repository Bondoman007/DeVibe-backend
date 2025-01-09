const express = require('express')
const {authAdmin} = require("./middleware/auth")
const {connectDB} = require("./config/database")
const User = require("./models/user")
const app = express()

app.post("/signup", async (req,res)=>{
    const user = new User({
        firstName : "anirudhra",
        lastName : "chauhan",
        emailId : "ani000@gmail.com",
        password : "1238",
        age : 21,
        gender : "male"
    })
    await user.save()
    res.send("user saved")
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
