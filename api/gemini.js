import fetch from "node-fetch";

export default async function handler(req, res) {
    const API_KEY = process.env.GEMINI_API_KEY;
    const userText = req.query.query || "";

    const payload = {
        contents: [
            {
                parts: [{ text: userText }]
            }
        ]
    };

    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite-preview-02-05:generateContent?key=${API_KEY}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            }
        );

        const data = await response.json();
        let answer = data.candidates?.[0]?.content?.parts?.[0]?.text || "No reply.";

        // XML-escape
        answer = answer
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&apos;");

        // set correct type
        res.setHeader("Content-Type", "text/xml; charset=utf-8");
        res.status(200).send(`<result>${answer.trim()}</result>`);
    } catch (err) {
        console.error("AI Error:", err);
        res.setHeader("Content-Type", "text/xml; charset=utf-8");
        res.status(200).send(`<result>AI error.</result>`);
    }
}
