import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import db from "../db/connection.js";

// The router will take control of requests starting with path /record.
const pw = express.Router();

// checking password
pw.post("/", async (req: Request, res: Response) => {
  try {
    const enteredPassword = req.body.password;
    const collection = await db.collection("password");
    const result = await collection.find({}).toArray();
    const hash = result[0].passwd;

    bcrypt.compare(enteredPassword, hash, function (error, isMatch) {
      if (error) {
        throw error;
      } else if (!isMatch) {
        res.status(250).send("password doesn't match");
      } else {
        res.status(200).send("password ok");
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("password error");
  }
});

export default pw;
