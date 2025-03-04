const express = require("express");
const router = express.Router();
const bcyrpt = require("bcrypt");
const User = require("../models/user");

router.post("/login", async (req, res) => {
  const { emailId, password } = req.body;
  try {
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid credentials");
    }

    const cmp = await user.validatePassword(password);
    if (!cmp) {
      throw new Error("Invalid credentials");
    } else {
      const token = await user.getJWT();
      res.cookie("token", token, {
        expires: new Date(Date.now() + 1 * 3600000),
      });
      res.send(user);
    }
  } catch (err) {
    res.status(400).send("ERROR:" + err);
  }
});

router.post("/signup", async (req, res) => {
  const { password, firstName, lastName, emailId, gender, age } = req.body;
  try {
    //encrypting the password
    const hashPassword = await bcyrpt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: hashPassword,
      gender,
      age,
    });
    const saveUser = await user.save();
    const token = await saveUser.getJWT();
    res.cookie("token", token, {
      expires: new Date(Date.now() + 1 * 3600000),
    });
    res.json({ message: "signup done!", data: saveUser });
  } catch (err) {
    res.status(400).send("ERROR:" + err.message);
  }
});
router.post("/logout", async (req, res) => {
  res
    .cookie("token", null, {
      expires: new Date(Date.now()),
    })
    .send("logout done!");
});

module.exports = router;
