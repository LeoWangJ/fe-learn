# Master/Worker 主从网络处理架构实现

## 概述
1. 创建一个主从网络架构，Master 接受 Socket 连接，根据负载均衡，分发给 Worker，Worker 处理具体业务。
2. 监听 Worker 状态，如果 Worker 发生异常退出之后，Master 重启一个进程

## 實作
1. 先判斷cpu數量, 並且創建與cpu相同數量的子進程
2.  `workerRestart` 函式來實作子進程斷線後重啟新的子進程的功能, 
3. 創建一個 `server`, 並且監聽 `server`, 當有連接時派發子進程進行處理
4. 使用 `(current + 1) % cpus ` 來模擬負載均衡

## 操作
從 `fe-learn` 資料夾進入 `Week06`

```
cd src/views/Week06
```

執行主進程

```
node master.js
```

執行客戶端測試負載均衡 

```
node client.js
```
