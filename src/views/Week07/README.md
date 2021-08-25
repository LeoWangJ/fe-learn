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
npm run start
```


服務位置 : `http:localhost:9700`
以下為了方便調試，皆用 `GET` 請求

## Mongo

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

## Redis 

1. 新增

```
/redis/set?key=value
```

2. 刪除

```
/redis/get/:key
```

## MySQL
建議搭配 `phpmyadmin` 查詢
服務位置 : `http:localhost:9090`
帳號: `dataUser`
密碼: `123qwe`

1. 創建 `todos` 資料表

```
/mysql/createTable
```

2. 新增

```
/mysql/add
```

3. 查詢

```
/mysql/query
```

4. 更新 - 目前自動更新 {`name`: `jack`}

```
/mysql/edit/:id
```

5. 刪除 

```
/mysql/delete/:id
```

## elasticsearch

1. 新增
```
/es/add
```

2. 查詢
```
/es/get
```