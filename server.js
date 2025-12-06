import dotenv from "dotenv";
dotenv.config();
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
                parts: [{ text: userText + "\n\n(Respond in plain text, no markdown, use UTF-8 encoding)" }]
            }
        ]
    };

    const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite-preview-02-05:generateContent?key=${API_KEY}`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        }
    );

    const data = await response.json();

    try {
        let answer = data.candidates?.[0]?.content?.parts?.[0]?.text || "No reply.";

        // XML-escape
        answer = answer
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&apos;");

        res.setHeader("Content-Type", "text/xml; charset=utf-8");
        res.status(200).send(`<result>${answer.trim()}</result>`);
    } catch (err) {
        console.error("Error details:", err);
        res.setHeader("Content-Type", "text/xml; charset=utf-8");
        res.status(200).send(`<result>AI error.</result>`);
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy running on port ${PORT}`));
