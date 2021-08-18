# Master/Worker 主從網路處理架構實現

## 概述
1. 創建一個主從網路架構，Master 接受 Socket 連接，根據負載均衡，分發給 Worker，Worker 處理具體業務。
2. 監聽 Worker 狀態，如果 Worker 發生異常退出之後，Master 重啟一個進程

## 實作
1. 先判斷 cpu 數量, 並且創建與 cpu 相同數量的子進程
2.  `createWorker` 函式來實作創建子進程功能,包含自殺重啟 
3. 創建一個 `server`, 並且監聽 `server`, 當有連接時派發子進程進行處理
4. 使用輪詢方式 `(current + 1) % cpus ` 來模擬負載均衡

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

目前子進程重啟機制僅在 `uncaughtException` 觸發時才會執行
若要測試異常, 將 `worker.js` 第 10 行註解打開, 然後執行
```
node client.js
```
