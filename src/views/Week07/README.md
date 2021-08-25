# 用 Express 或 Koa 或 Nest 或 Fastify 實現練習 Fastify 裡的以下功能
- MySQL
- Redis
- MongoDB
- ElasticSearch

## 操作

1. 終端進入到 `fastify` 資料夾

```
cd src/views/Week07/fastify
```

2. 執行各個依賴的 `docker` 容器

```
docker-compose up
```

3. 添加資料到 `mongo` 資料庫(開啟另一個終端)，記得要先 `npm install`

```
cd mongo-init
node db.js
```

4. 進入 `fastify` 開啟服務，記得要先 `npm install`

```
node app.js
```

## mongo CRUD

服務位置 : `http:localhost:9700`
為了方便調試，皆用 `GET` 請求

1. 新增

```
/mongo/add
```

2. 查詢

```
/mongo/query
```

3. 更新 - 目前自動更新 {`subject`: `我成功更新文檔囉`}

```
/mongo/edit/:id
```

4. 刪除 

```
/mongo/delete/:id
```