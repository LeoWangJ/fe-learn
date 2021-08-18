const child = require("child_process");
const net = require("net");
const cpus = require("os").cpus().length;

let workers = {};

const server = net.createServer();
process.title = "master";

for (let i = 0; i < cpus; i++) {
  createWorker();
}
let current = 0;
server.on("connection", (socket) => {
  let pidKeys = Object.keys(workers);
  let pid = pidKeys[current] ? pidKeys[current] : pidKeys[0];
  console.log("派發子進程 ---->", pid);
  workers[pid].send("socket", socket);
  current = Number.parseInt((current + 1) % cpus);
});

server.listen(9000, () => {
  console.log("Tcp Server: 127.0.0.1:9000");
});

function createWorker() {
  const worker = child.fork("./worker.js");
  worker.on("message", (message) => {
    if (message === "suicide") {
      // 自殺重啟
      createWorker();
    }
  });
  worker.on("exit", () => {
    console.log("子進程已離開, pid: ", worker.pid);
    delete workers[worker.pid];
    // 關閉後重啟
    // createWorker();
  });
  worker.send("server", server);
  workers[worker.pid] = worker;
  console.log("子進程已創建, pid: ", worker.pid);
}
