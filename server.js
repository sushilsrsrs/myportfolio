import express from "express";
import cors from "cors";
import { OpenAI } from "openai";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// CORS Configuration
const allowedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:5501",
  "http://localhost:5501",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
  })
);

app.use(express.json());

// Personal context data
const PERSONAL_CONTEXT = `
Sushil Raj - Computer Science Undergraduate at IIT Bhilai

Technical Skills:
- Languages: C++, Python, JavaScript (ES6+)
- Frontend: React, HTML5, CSS3, Bootstrap
- Backend: Node.js, Express, Flask
- Databases: MongoDB, MySQL, PostgreSQL
- ML/AI: TensorFlow, PyTorch, Scikit-learn

Professional Experience:
- Developed SmartTestify: AI-powered assessment platform
- Created CreditSea financial management system
- Built recommendation systems using collaborative filtering

Education:
- B.Tech in Computer Science, IIT Bhilai (2021-2025)
- CGPA: 8.9/10.0

Achievements:
- Secured AIR 1500 in JEE Advanced 2021
- Winner of Smart India Hackathon 2023
`;

// OpenAI configuration
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Chat endpoint
app.post("/chat", async (req, res) => {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are Sushil Raj's AI assistant. Strictly use this context:
          ${PERSONAL_CONTEXT}
          For unavailable information: "I don't have that information."`,
        },
        { role: "user", content: req.body.message },
      ],
      temperature: 0.2,
      max_tokens: 150,
    });

    res.json({ reply: completion.choices[0].message.content });
  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Handle preflight
app.options("/chat", (req, res) => {
  res.set("Access-Control-Allow-Origin", allowedOrigins.join(", "));
  res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type");
  res.sendStatus(204);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
