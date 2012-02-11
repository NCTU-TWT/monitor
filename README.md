這是後端。

前端的 repo 在 [monitor-client](https://github.com/NCTU-TWT/monitor-client)。

# 安裝

    $ git clone https://github.com/NCTU-TWT/monitor
    $ npm install
    
# 執行

    $ node index.js
    
# 佈署

    $ forever start index.js

# 輸出前端

只要將 [monitor-client](https://github.com/NCTU-TWT/monitor-client) 與這個 repo 的資料夾放在同一個地方即可

    monitor/            
    monitor-client/
    
# lib/

`lib/` 中模組的簡介

## stream.js

    將從 sensor 送來的資料解析並抽象化成串流
    
### createStream([port=4900])

    回傳一 `EventEmitter`
    
    `chart`, `value`, `error` 三種事件
    
