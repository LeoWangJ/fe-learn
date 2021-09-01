const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const port = process.env.PORT || 3001;

app.use(express.static(__dirname + "/public"));

function findNowRoom(client) {
  return Object.keys(client.rooms).find((item) => {
    return item !== client.id;
  });
}

io.on("connection", (client) => {
  console.log(`socket 用戶連接 ${client.id}`);

  client.on("joinRoom", async (room) => {
    console.log(room);

    const nowRoom = findNowRoom(client);
    if (nowRoom) {
      client.leave(nowRoom);
    }
    await client.join(room);
    io.sockets.in(room).emit("roomBroadcast", "已有新人加入聊天室！");
  });

  client.on("peerconnectSignaling", (message) => {
    console.log("接收資料：", message);

    const nowRoom = findNowRoom(client);
    client.to(nowRoom).emit("peerconnectSignaling", message);
  });

  client.on("disconnect", () => {
    console.log(`socket 用戶離開 ${client.id}`);
  });

  client.on("draw", (data) => {
    client.broadcast.emit("draw", data);
    console.log(data);
  });
});

http.listen(port, () =>
  console.log(`listening on port http://localhost:${port}`)
);
