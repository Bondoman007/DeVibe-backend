const express = require("express");
const { userAuth } = require("../middleware/auth");
const router = express.Router();
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
router.get("/user/request", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const request = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    })
      .populate(
        "fromUserId",
        "firstName lastName photoUrl age gender about skills"
      )
      .populate(
        "toUserId",
        "firstName lastName photoUrl age gender about skills"
      );
    if (!request) {
      return res.json({ message: "no request found" });
    }
    res.json({
      message: "your requests",
      data: request,
    });
  } catch (err) {
    res.status(400).send("ERROR:" + err.message);
  }
});

router.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connections = await ConnectionRequest.find({
      $or: [
        {
          fromUserId: loggedInUser._id,
          status: "accepted",
        },
        {
          toUserId: loggedInUser._id,
          status: "accepted",
        },
      ],
    })
      .populate("fromUserId", "firstName lastName photoUrl gender about skills")
      .populate("toUserId", "firstName lastName photoUrl gender about skills");
    if (!connections) {
      throw new Error("No connections found");
    }
    const data = connections.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });
    res.json({
      message: "connections:",
      data: data,
    });
  } catch (err) {
    res.status(400).send("ERROR:" + err.message);
  }
});

router.get("/user/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit - limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;
    const connections = await ConnectionRequest.find({
      $or: [
        {
          fromUserId: loggedInUser._id,
        },
        {
          toUserId: loggedInUser._id,
        },
      ],
    });
    const hideUsers = new Set();
    connections.forEach((req) => {
      hideUsers.add(req.fromUserId.toString());
      hideUsers.add(req.toUserId.toString());
    });
    const users = await User.find({
      $and: [
        //id is not in the set hideUser
        { _id: { $nin: Array.from(hideUsers) } },
        //id is not equall loggedin user
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select("firstName lastName photoUrl age gender about skills")
      .skip(skip)
      .limit(limit);

    res.json({
      message: "feed",
      data: users,
    });
  } catch (err) {
    res.status(400).send("ERROR:" + err.message);
  }
});

module.exports = router;
