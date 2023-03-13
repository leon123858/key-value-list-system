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
