import express from "express";
import cors from "cors";
import { config } from "dotenv";
config();

const app = express();

app.use(cors());

app.listen(process.env.PORT || 3003, () => {
    console.log(`Server run..`);
})