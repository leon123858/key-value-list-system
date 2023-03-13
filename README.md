# Key Value list system

Dcard 2023 Backend Intern Homework

## How to set your environment

install [node](https://nodejs.org/en/download/) in local suggest version >= v16

use `npm install --global yarn` install _yarn_ to manage packages for project

install [mongodb](https://www.mongodb.com/) local or you can use docker image for [mongodb](https://hub.docker.com/_/mongo)

## How to build

note: should start local mongodb or mongodb image

```shell
# install project
git clone https://github.com/leon123858/key-value-list-system.git
cd key-value-list-system
# install dependence packages
yarn
# start project
yarn start
```

## How to test

note: should stop local mongodb, because unit test use mongodb-in-memory

```shell
# install dependence packages
yarn
# unit test project
yarn test
```

## How to use REST API

Go to http://localhost:3000/ after starting the project, their is an openAPI document for this project

## How to use GRPC API

Go to [grpc client](test/grpcClient.ts) after starting the project, their is a client for 4 services in grpc, can use `yarn grpc` to try them, even you can edit parameters.

## Comments for each requirement

- 設計與實作 RESTful API

  詳見 How to use REST API

  在製作時為了達到說明文件中的要求, 每一個 API 的響應時間(不包含錯誤處理)都控制在 1 RTT(round time trip)內

- storage 的選擇,文章內是提到 PostgreSQL,但不一定要用 PostgreSQL,請在 README.md 裡面說明一下選擇理由。如果一樣用 PostgreSQL,也還是需說明一下原因

  選用 mongodb, 因為在 Get/ Set 方面的需求未牽涉到複雜關聯性, 在這方面的請求 NOSQL 於效能和開發成本上皆有較高的優勢
  而 Dcard 技術需求裡只有 mongodb 和 redis 兩種 NOSQL, redis 比較偏 web cache 在使用, 所以我優先選擇 mongodb

- 每個列表的內容只須要保留一天,但是為了避免 storage 儲存太多請清掉不用內容,可以想想除了一筆筆刪之外怎麼清除更有效率 ?

  如果採用雲端版的 mongodb Atlas, 支援 event trigger, 可以在設定文件過期時觸發刪除函數, 但本專案採用開源版, 所以僅假設用戶會紀錄各列表何時過期, 調用 RESTful 的刪除 API, 我在連接 link-list 每個節點時都有指向唯一的搜索關鍵字, 所以可以同時刪除

- 請寫相對應的 unit test

  可以輸入 `yarn test` 測試

- 對內 Set 相關的 API 不一定要用 RESTful API 來進行溝通,也可以像文章提到的 gRPC Bidirectional
  Streaming 的方式,或者有其他的想法都可以實作看看

  詳見 [grpc service](src/services/setter.ts)
