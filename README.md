```

```

## Getting Started

#### First, run the development server:

```bash
yarn dev:all
```

```bash
docker build -t app:v0 .
docker run -p 4000:3000 -p 5555:5555 -e DATABASE_URL="" --name myApp app:v0
#or
docker compose up --build
```

#### Set MongoDB Environment Variables

```env
DATABASE_URL=mongodb://127.0.0.1:27017/app?replicaSet=rs0
```

#### Start Local MongoDB Replica Set

[https://www.mongodb.com/docs/manual/tutorial/deploy-replica-set/](https://www.mongodb.com/docs/manual/tutorial/deploy-replica-set/)

```bash
mongod --dbpath /Users/name/DB/db/ --port 27017 --replSet rs0
#or
docker run -p 27017:27017 --name mongodb mongo mongod --replSet rs0
```

```bash
mongosh --port 27017 --eval 'rs.status()'
#if Error
mongosh --port 27017 --eval 'rs.initiate({ _id: "rs0", members: [{ _id: 0, host: "localhost:27017" }] });'
```
