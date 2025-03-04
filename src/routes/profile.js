const express = require("express");
const router = express.Router();
const { userAuth } = require("../middleware/auth");
const validateEditDataByuser = require("../utils/validation");
const validator = require("validator");
const bcyrpt = require("bcrypt");
router.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR:" + err.message);
  }
});
router.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    validateEditDataByuser(req);
    const loggedInUser = req.user;
    Object.keys(req.body).forEach((feild) => {
      loggedInUser[feild] = req.body[feild];
    });
    await loggedInUser.save();
    res.json({
      message: loggedInUser.firstName + " your profile has been updated",
      data: loggedInUser,
    });
  } catch (err) {
    res.status(400).send("ERROR:" + err.message);
  }
});

router.patch("/profile/password", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    console.log(loggedInUser);
    const { currentPassword, newPassword, confirmNewPassword } = req.body;
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      throw new Error("All fields are required");
    }

    const validate = await loggedInUser.validatePassword(currentPassword);
    if (!validate) {
      throw new Error("WRONG PASSWORD ENTERED");
    }
    if (newPassword != confirmNewPassword) {
      throw new Error("NEW PASSWORD ENTERED DOES NOT MATCH");
    }
    if (!validator.isStrongPassword(newPassword)) {
      throw new Error("ENTER A STRONG PASSWORD");
    }
    const hashPassword = await bcyrpt.hash(newPassword, 10);
    loggedInUser.password = hashPassword;
    loggedInUser.save();
    res.send("Password changed");
  } catch (err) {
    res.status(400).send("ERROR:" + err.message);
  }
});

module.exports = router;
