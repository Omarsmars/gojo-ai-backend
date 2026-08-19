import "dotenv/config";
import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

console.log(
    "OPENROUTER_API_KEY loaded:",
    Boolean(process.env.OPENROUTER_API_KEY)
);

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

        const prompt =
            "You are GOJO AI, a friendly study assistant.\n\n" +
            "Mode: " + mode + "\n\n" +
            "Student request:\n" + message + "\n\n" +
            "Help the student learn.\n" +
            "Explain clearly and simply.\n" +
            "Do not just give answers to homework when teaching " +
            "would be more useful.\n\n" +
            "Keep the response organized and practical.";

        const response = await fetch(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                method: "POST",
                headers: {
                    "Authorization": "Bearer " + process.env.OPENROUTER_API_KEY,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: "openrouter/free",
                    messages: [
                        {
                            role: "user",
                            content: prompt
                        }
                    ]
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            console.error("OpenRouter error:", data);
            throw new Error(
                data?.error?.message || "OpenRouter request failed"
            );
        }

        res.json({
            success: true,
            answer:
                data.choices?.[0]?.message?.content ||
                "No answer received."
        });

    } catch (error) {
        console.error("GOJO AI error:", error);

        res.status(500).json({
            success: false,
            error: "GOJO AI could not process the request."
        });
    }
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(
        "GOJO AI backend running on port " + PORT
    );
});

