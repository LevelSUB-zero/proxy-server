import "dotenv/config";
import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = process.env.GEMINI_API_KEY;

app.get("/gemini", async (req, res) => {
    const userText = req.query.query || "";

    const payload = {
        contents: [
            {
                parts: [{ text: userText }]
            }
        ]
    };

    const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-preview:generateContent?key=${API_KEY}`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        }
    );

    const data = await response.json();

    try {
        const text = data.candidates[0].content.parts[0].text;
        res.send(text);
    } catch (err) {
        res.send("AI error.");
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy running on port ${PORT}`));
