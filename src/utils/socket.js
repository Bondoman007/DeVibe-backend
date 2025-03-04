const socket = require("socket.io");
const { Chat } = require("../models/chat");

const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });

  io.on("connection", (socket) => {
    socket.on("joinChat", ({ userId, targetUserId }) => {
      const room = [userId, targetUserId].sort().join("_");
      console.log(room);
      socket.join(room);
    });
    socket.on("sendMessage", async ({ userId, targetUserId, text, time }) => {
      try {
        const room = [userId, targetUserId].sort().join("_");
        const Id = userId;
        let chat = await Chat.findOne({
          participants: { $all: [userId, targetUserId] },
        });
        if (!chat) {
          chat = new Chat({
            participants: [userId, targetUserId],
            messages: [],
          });
        }
        chat.messages.push({
          senderId: userId,
          text,
          time,
        });
        await chat.save();
        io.to(room).emit("messageReceived", { text, Id, time });
      } catch (err) {
        console.log(err);
      }
    });
    socket.on("disconnect", () => {});
  });
};

module.exports = initializeSocket;
