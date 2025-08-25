import express from "express";
import { config } from "dotenv";
config();

const app = express();


app.use(express.static('public'));

app.get("/news", async (req, res) => {
    try {
        const API_KEY = process.env.APIKEY;
        const response = await fetch(`https://newsapi.org/v2/everything?q=Apple&from=2025-08-18&sortBy=popularity&apiKey=${API_KEY}`);
        const data = await response.json();
        res.json(data);
    } catch (err) {
        console.log(err);
        res.status(500).json({error: "failed to fetch news"});
    } 
})

app.listen(process.env.PORT || 3003, () => {
    console.log(`Server run..`);
});