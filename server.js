import "dotenv/config";
import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const client = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY
});

app.get("/", (req, res) => {
    res.json({
        name: "GOJO AI",
        status: "online"
    });
});

app.post("/api/ai", async (req, res) => {
    try {
        const { message, mode = "coach" } = req.body;

        if (!message || !message.trim()) {
            return res.status(400).json({
                success: false,
                error: "Please provide a message."
            });
        }

        const prompt = `
You are GOJO AI, a friendly study assistant.

Mode: ${mode}

Student request:
${message}

Help the student learn.
Explain clearly and simply.
Do not just give answers to homework when teaching
would be more useful.

Keep the response organized and practical.
`;

        const response = await client.chat.completions.create({
            model: "openrouter/free",
            messages: [
                {
                    role: "user",
                    content: prompt
                }
            ]
        });

        res.json({
            success: true,
            answer: response.choices[0].message.content
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            error: "GOJO AI could not process the request."
        });
    }
});

app.listen(PORT, () => {
    console.log(`GOJO AI backend running on http://localhost:${PORT}`);
});