const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");
const app = express();
const port = 3000;
const host = "http://localhost";
const process = require("child_process");
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/views", (req, res) => {
  res.send("Hello World!");
});

app.post("/upload", async (req, res) => {
  await fs.writeFileSync("./index.js", req.body.text, (err) => {
    if (err) throw err;
  });
  process.exec("webpack ", (error) => {
    console.log("???");
    if (error) {
      console.log(error);

      res.send({
        code: 401,
        msg: error,
      });
    } else {
      console.log(res);
      res.send({
        code: 200,
        msg: "檔案上傳成功",
        url: host + "8080" + "/dist/index.html",
      });
    }
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
