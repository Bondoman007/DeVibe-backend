const express = require("express");
const { connectDB } = require("./config/database");
const app = express();
require("dotenv").config({ path: "./src/.env" });
const http = require("http");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const initializeSocket = require("./utils/socket");
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
//NEVER TRUST req.body always validate your data
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");
const chatRouter = require("./routes/chat");
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/", chatRouter);

const server = http.createServer(app);
initializeSocket(server);
connectDB()
  .then(() => {
    console.log("Database connected");
    server.listen(3000, () => {
      console.log("server is listening port 3000");
    });
  })
  .catch((err) => {
    console.log("database cannot be connected");
  });
