const express = require("express")
const {connectDB} = require("./config/database")
const app = express()
const cookieParser = require("cookie-parser")


app.use(express.json())
app.use(cookieParser())
//NEVER TRUST req.body always validate your data
const authRouter = require("./routes/auth")
const profileRouter = require("./routes/profile")
const requestRouter = require("./routes/request")

app.use("/",authRouter)
app.use("/",profileRouter)
app.use("/",requestRouter)

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