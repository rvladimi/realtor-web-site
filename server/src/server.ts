import express, { Express } from "express";
import cors from "cors";
import records from "./routes/record.js";
import pw from "./routes/password.js";

const PORT = process.env.PORT || 5050;
const app: Express = express();

const corsOptions = {
  origin: "https://mysite.com",
  optionsSuccessStatus: 200,
};
app.use("/", cors(corsOptions), express.static("uploads"));

app.use(express.static("uploads"));
app.use(cors());
app.use(express.json());
app.use("/record", records);
app.use("/password", pw);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
