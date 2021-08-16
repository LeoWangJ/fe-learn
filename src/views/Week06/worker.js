process.on("message", (msg, socket) => {
  if (msg === "socket" && socket) {
    setTimeout(() => {
      socket.end("Request handled by worker-" + process.pid);
    }, 100);
  }
});
