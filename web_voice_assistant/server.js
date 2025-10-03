const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const Gree = require("gree-hvac-client");

const AC_IP = "IP_ADDRESS"; // AC IP
const client = new Gree.Client({ host: AC_IP });

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static("public"));

let lastStatus = {};

// AC olayları
client.on("update", (updated, allProps) => {
  lastStatus = allProps;
  io.emit("statusUpdate", lastStatus);
});

client.on("connect", () => console.log("✅ AC Bağlandı!"));
client.on("error", (err) => console.error("❌ AC Hata:", err));

// Socket.IO ile kontrol
io.on("connection", (socket) => {
  console.log("Yeni web panel bağlantısı");

  // Durumu gönder
  socket.emit("statusUpdate", lastStatus);

  socket.on("setProperty", async ({ prop, value }) => {
    try {
      await client.setProperty(prop, value);
      socket.emit("actionResult", { success: true, prop, value });
    } catch (err) {
      socket.emit("actionResult", { success: false, error: err.message });
    }
  });
});

server.listen(3000, () => console.log("🌐 Web panel http://localhost:3000"));
