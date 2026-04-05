import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

const API_KEY = process.env.ROBOFLOW_API_KEY;

app.get("/", (req, res) => {
  res.json({ message: "Roboflow backend running" });
});

app.post("/analyze-durian", async (req, res) => {
  try {
    const { imageBase64 } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: "image required" });
    }

    const base64 = imageBase64.split(",")[1];

    const response = await axios({
      method: "POST",
      url: "https://serverless.roboflow.com/scius-tu-xr5yf/20",
      params: {
        api_key: API_KEY
      },
      data: base64,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    });

    res.json(response.data);
  } catch (err) {
    console.error(err?.response?.data || err.message);
    res.status(500).json({ error: "failed to analyze" });
  }
});

app.listen(3000, "0.0.0.0", () => {
  console.log("Server running on http://0.0.0.0:3000");
});