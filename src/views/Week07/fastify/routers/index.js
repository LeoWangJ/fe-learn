const mongodb = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
async function routes(fastify) {
  const db = fastify.mongo.db;

  fastify.get("/", async () => {
    return { hello: "fastify" };
  });

  fastify.get("/mongo/add", async () => {
    const collection = db.collection("todos");
    await collection.insertMany([
      {
        subject: "为什么Fastify这么快？",
        datetime: Date.now(),
        state: 0,
      },
      {
        subject: "插入文档",
        datetime: Date.now(),
        state: 1,
      },
      {
        subject: "更新文档",
        datetime: Date.now(),
        state: 0,
      },
      {
        subject: "删除文档",
        datetime: Date.now(),
        state: 0,
      },
    ]);
    return { error: "", errorCode: 0, result: {} };
  });

  fastify.get("/mongo/query", async () => {
    const collection = db.collection("todos");
    const result = await collection.find({}).toArray();
    console.log(result);
    return { error: "", errorCode: 0, result };
  });

  fastify.get("/mongo/edit/:id", async (request, reply) => {
    const collection = db.collection("todos");
    let findID = await collection
      .find({ _id: ObjectId(request.params.id) })
      .toArray();
    if (findID.length !== 0) {
      await collection.updateOne(
        { _id: ObjectId(request.params.id) },
        { $set: { subject: "我成功更新文檔囉" } },
        { upsert: true }
      );
      return { error: "", errorCode: 0, result: "success" };
    } else {
      return { error: "", errorCode: 1, result: "not found id" };
    }
  });

  fastify.get("/mongo/delete/:id", async (request, reply) => {
    const collection = db.collection("todos");
    let findID = await collection
      .find({ _id: ObjectId(request.params.id) })
      .toArray();
    if (findID.length !== 0) {
      await collection.remove({ _id: ObjectId(request.params.id) });
      return { error: "", errorCode: 0, result: "success" };
    } else {
      return { error: "", errorCode: 1, result: "not found id" };
    }
  });

  fastify.get("/redis/set", async (request, reply) => {
    console.log(request.query);
    if (!request.query)
      return { error: "401", errorCode: "param key is required" };
    const { redis } = fastify;
    Object.keys(request.query).forEach((key) => {
      redis.set(key, request.query[key]);
    });
    return { error: "", errorCode: 0, result: request.query };
  });

  fastify.get("/redis/get/:key", async (request, reply) => {
    if (!request.params.key)
      return { error: "401", errorCode: "param key is required" };
    const { redis } = fastify;
    let val = await redis.get(request.params.key);
    return { error: "", errorCode: 0, result: val };
  });

  fastify.get("/mysql/insert", async (req, reply) => {
    fastify.mysql.getConnection((err, connection) => {
      if (err) {
        return reply
          .code(500)
          .header("Content-Type", "application/json; charset=utf-8")
          .send(err);
      }
      connection.execute(
        "INSERT INTO todos VALUES (0, 'mysql', '2021-08-10 20:20:20', 0)",
        (err, result, fields) => {
          return reply
            .code(200)
            .header("Content-Type", "application/json; charset=utf-8")
            .send({ result });
        }
      );
    });
  });

  fastify.get("/mysql/query", async (req, reply) => {
    fastify.mysql.getConnection((err, connection) => {
      if (err)
        return reply
          .code(500)
          .header("Content-Type", "application/json; charset=utf-8")
          .send(err);
      connection.query("SELECT * FROM todos", (err, result, fields) => {
        return reply
          .code(200)
          .header("Content-Type", "application/json; charset=utf-8")
          .send({ result });
      });
    });
  });

  fastify.get("/leveldb/set", async (request, reply) => {
    if (!request.query)
      return { error: "401", errorCode: "param key is required" };
    const level = fastify.level.db;
    Object.keys(request.query).forEach((key) => {
      level.put(key, request.query[key]);
    });
    return { error: "", errorCode: 0, result: request.query };
  });

  fastify.get("/leveldb/get/:key", async (request, reply) => {
    if (!request.params.key)
      return { error: "401", errorCode: "param key is required" };
    const level = fastify.level.db;
    let val = await level.get(request.params.key);
    return { error: "", errorCode: 0, result: val };
  });

  fastify.get("/es/add", async (request, reply) => {
    let result = await fastify.elastic.index({
      index: "todos", //相当于database
      body: {
        //文档到内容
        subject: "tiger is a danger animal",
        datetime: Date.now(),
        state: 0,
      },
    });
    return result;
  });

  fastify.get("/es/get", async (request, reply) => {
    let result = await fastify.elastic.search({
      index: "todos",
      type: "todos",
      body: {
        query: {
          match: {
            state: 0,
          },
        },
      },
    });
    return result;
  });
}

module.exports = routes;
