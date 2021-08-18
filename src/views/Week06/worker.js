let worker;
process.on("message", (msg, socket) => {
  if (msg === "socket" && socket) {
    worker = socket;
    setTimeout(() => {
      socket.end("Request handled by worker-" + process.pid);
    }, 100);

    // 測試自殺重啟
    // throw new Error("worker process exception!");
  }
});

process.on("uncaughtException", (err) => {
  console.log("進程發生未預期錯誤", err);
  process.send("suicide");
  worker.close(function () {
    process.exit(1);
  });
});
