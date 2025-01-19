const express  = require("express")
const { userAuth } = require("../middleware/auth")
const router = express.Router()
const   ConnectionRequest = require("../models/connectionRequest")
router.get("/user/request",userAuth, async (req,res)=>{
   try{ const loggedInUser = req.user
    const request = await ConnectionRequest.find({
        toUserId : loggedInUser._id,
        status: "interested"
    }).populate(
        "fromUserId",
        "firstName lastName photoUrl age gender about skills"
    )
    if(!request){
        return res.json({message: "no request found"})
    }
    res.json({
        message: "your requests",
        data : request
    })}catch(err){
        res.status(400).send("ERROR:"+err.message)
    }
})

router.get("/user/connections",userAuth, async (req,res)=>{
    try{
        const loggedInUser = req.user
        const connections = await ConnectionRequest.find({
            $or: [{
                fromUserId : loggedInUser._id,
                status:"accepted"
            },{
                toUserId : loggedInUser._id,
                status:"accepted"
            }]
        }).populate(
            "fromUserId",
            "firstName lastName photoUrl age gender about skills"
        )
        if(!connections){
           throw new Error("No connections found")
        }
        const data = connections.map((row)=>row.fromUserId)
        res.json({
            message: "connections:",
            data: data
        })
    }catch(err){
        res.status(400).send("ERROR:"+err.message)
    }
})

router.get("/user/feed",userAuth, async (req,res)=>{})


module.exports = router