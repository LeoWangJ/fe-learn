const child = require("child_process");
const net = require("net");
const cpus = require("os").cpus().length;

let workers = [];
let current = 0;

for (let i = 0; i < cpus; i++) {
  workers.push(child.fork("./worker.js"));
  console.log("worker process-", workers[i].pid);
}

const tcpServer = net.createServer();

tcpServer.on("connection", (socket) => {
  workers[current].send("socket", socket);
  current = Number.parseInt((current + 1) % cpus);
});

tcpServer.listen(8989, () => {
  console.log("Tcp Server: 127.0.0.1:8989");
  for (let i = 0; i < cpus; i++) {
    workers[i].on(
      "exit",
      ((i) => {
        return () => {
          console.log("worker-" + workers[i].pid + " exited");
          workers[i] = child.fork("./worker.js");
          console.log("Create worker-" + workers[i].pid);
          workers[i].send("tcpServer", tcpServer);
        };
      })(i)
    );
  }
});
