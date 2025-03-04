const express = require("express");
const router = express.Router();
const { userAuth } = require("../middleware/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const sendEmail = require("../utils/sendEmail");
router.post("/request/send/:status/:toUserID", userAuth, async (req, res) => {
  try {
    const fromUserId = req.user._id;
    const toUserId = req.params.toUserID;
    const status = req.params.status;
    if (fromUserId.equals(toUserId)) {
      throw new Error("can not sent request to youself");
    }
    const allowedStatus = ["ignored", "interested"];
    if (!allowedStatus.includes(status)) {
      throw new Error("Invalid status: " + status);
    }
    const ToUser = await User.findOne({
      _id: toUserId,
    });
    if (!ToUser) {
      return res.status(404).json({ message: "user not found" });
    }
    const existingConnection = await ConnectionRequest.findOne({
      $or: [
        {
          fromUserId,
          toUserId,
        },
        {
          fromUserId: toUserId,
          toUserId: fromUserId,
        },
      ],
    });
    if (existingConnection) {
      return res.status(404).json({ message: "connection already sent" });
    }

    const connectionRequest = new ConnectionRequest({
      fromUserId,
      toUserId,
      status,
    });

    const data = await connectionRequest.save();
    const emailRes = await sendEmail.run(
      "A new friend request from:" + req.user.firstName,
      req.user.firstName + " is " + status + " in " + ToUser.firstName
    );
    console.log(emailRes);
    res.json({
      message: "Connection request sent",
      data: data,
    });
  } catch (err) {
    res.status(400).send("ERROR:" + err.message);
  }
});
router.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;
      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({ message: "status not allowed!" });
      }
      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });
      if (!connectionRequest) {
        return res
          .status(400)
          .json({ message: "connection request not found" });
      }
      connectionRequest.status = status;
      const data = await connectionRequest.save();
      res.json({
        message: "connection updated",
        data: data,
      });
    } catch (err) {
      res.status(400).send("ERROR:" + err.message);
    }
  }
);

module.exports = router;
