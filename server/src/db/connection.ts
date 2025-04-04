import { MongoClient } from "mongodb";

const url = "mongodb://user:password@localhost:27017/my_db";
const mongoClient = new MongoClient(url);

try {
  // Connect the client to the server
  await mongoClient.connect();
  // Send a ping to confirm a successful connection
  await mongoClient.db("my_db").command({ ping: 1 });
  console.log("You successfully connected to MongoDB!");
} catch (err) {
  console.error(err);
}

const db = mongoClient.db("my_db");

export default db;
