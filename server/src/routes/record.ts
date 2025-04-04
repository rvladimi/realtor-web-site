import express, { Request, Response } from "express";
import multer from "multer";
import fs from "fs";
// converting the id from string to ObjectId for the _id.
import { ObjectId } from "mongodb";
import db from "../db/connection.js";

const upload = multer({ dest: "uploads/" });
const router = express.Router();

// Getting all the records
router.get("/", async (req, res) => {
  let collection = await db.collection("records");
  let results = await collection.find({}).toArray();
  res.send(results).status(200);
});

// creating a new record or changing an existing one
router.post("/", upload.array("files"), async (req: Request, res: Response) => {
  try {
    // These types is the same as for the client components, but client
    // is outside of the 'rootDir' which is expected to contain all source files.
    // Probably it's possible to fix it (via the bundler configurations?)
    // But here the types are just duplicated
    type RealtyType =
      | "choice"
      | "flat"
      | "room"
      | "land"
      | "garage"
      | "cottage"
      | "dacha"
      | "townhouse"
      | "commercial";

    type RealtyObject = {
      id?: string;
      type?: string;
      infoType: RealtyType;
      shortDescription?: string;
      infoPrice?: string;
      infoAddress?: string;
      position?: [number, number];
      infoArea?: string;
      infoDescription?: string;
      infoDetails?: {
        totalArea: string;
        numberOfRooms?: number;
        residentialArea?: string;
        kitchenArea?: string;
        landArea?: string;
        floor?: number;
        totalFloors?: number;
      };
      images?: string[];
    };

    type MyFileType = {
      fieldname: string;
      originalname: string;
      encoding: string;
      mimetype: string;
      destination: string;
      filename: string;
      path: string;
      size: number;
    };
    // req.files type -- { [fieldname: string]: File[]; } | File[] | undefined

    let collection = await db.collection("records");

    const id = req.body.id;
    const type = req.body.type;
    const infoType = req.body.infoType;
    const shortDescription = req.body.shortDescription;
    const infoPrice = req.body.infoPrice;
    const infoAddress = req.body.infoAddress;
    const addressExtension = req.body.addressExtension;
    const latitude = req.body.latitude;
    const longitude = req.body.longitude;
    const position: [number, number] = [Number(latitude), Number(longitude)];
    const infoArea = req.body.infoArea;
    const infoDescription = req.body.infoDescription;
    const totalArea = req.body.totalArea;
    const numberOfRooms = req.body.numberOfRooms;
    const residentialArea = req.body.residentialArea;
    const kitchenArea = req.body.kitchenArea;
    const landArea = req.body.landArea;
    const floor = req.body.floor;
    const totalFloors = req.body.totalFloors;
    const reqImages = req.files as MyFileType[];
    const images = reqImages?.map((item) => item.filename);
    const imagesToDelete: string[] = req.body.filesToDelete
      ? JSON.parse(req.body.filesToDelete)
      : [];

    // If the record exist, it will be completely replace.
    // But the previous images will remain until the user
    // will decide to delete some of them
    let oldImages: string[] = [];
    if (id) {
      let proj = { images: 1, _id: 0 };
      let res = await collection
        .find({ _id: ObjectId.createFromHexString(id) })
        .project(proj)
        .toArray();
      oldImages = res[0].images;

      oldImages.forEach((item) => {
        // Deleting previously saved images from the "uploads" directory,
        // which the user marked for deleting
        if (imagesToDelete.includes(item)) {
          fs.unlinkSync(`uploads/${item}`);
        } else {
          images.push(item);
        }
      });
    }

    const infoDetails = {
      totalArea,
      numberOfRooms,
      residentialArea,
      kitchenArea,
      landArea,
      floor,
      totalFloors,
    };

    const address = addressExtension
      ? addressExtension + infoAddress
      : infoAddress;

    const realtyObject: RealtyObject = {
      type,
      infoType,
      shortDescription,
      infoPrice,
      infoAddress: address,
      position,
      infoArea,
      infoDescription,
      infoDetails,
      images,
    };

    if (id) {
      // Only existing realty objects have id,
      // so it's a case of changing an existing record

      const query = { _id: ObjectId.createFromHexString(id) };
      const result = await collection.replaceOne(query, realtyObject);
      res.send(result).status(204);
    } else {
      const result = await collection.insertOne(realtyObject);
      res.send(result).status(204);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding record");
  }
});

// deleting a record
router.delete("/:id", async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };

    const collection = db.collection("records");
    let result = await collection.deleteOne(query);

    res.send(result).status(200);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting record");
  }
});

export default router;
