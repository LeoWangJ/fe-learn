const child = require("child_process");
const net = require("net");
const cpus = require("os").cpus().length;

let workers = [];
let current = 0;

for (let i = 0; i < cpus; i++) {
  workers.push(child.fork("./worker.js"));
  console.log("worker process-", workers[i].pid);
  workerRestart(workers[i]);
}

const master = net.createServer();

master.on("connection", (socket) => {
  console.log("派發子進程 ---->", workers[current].pid);
  workers[current].send("socket", socket);
  current = Number.parseInt((current + 1) % cpus);
});

master.listen(8989, () => {
  console.log("Tcp Server: 127.0.0.1:8989");
});

function workerRestart(worker) {
  worker.on(
    "exit",
    (() => {
      return () => {
        console.log(worker.pid, "進程已離開");
        worker = child.fork("./worker.js");
        console.log("創建新進程:", worker.pid);
      };
    })()
  );
}
