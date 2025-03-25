import { MongoClient } from "mongodb";

const url = "mongodb://username:password@localhost:27017/realtor_db";
const mongoClient = new MongoClient(url);

try {
  await mongoClient.connect();
  await mongoClient.db("realtor_db").command({ ping: 1 });
} catch (err) {
  console.error(err);
}

const db = mongoClient.db("realtor_db");

export default db;
