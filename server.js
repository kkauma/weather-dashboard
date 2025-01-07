require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.static("public")); // Serve your static files from 'public' directory

app.get("/api/weather", async (req, res) => {
  const { lat, lon } = req.query;
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${process.env.WEATHER_API_KEY}`
    );
    const data = await response.json();

    if (data.cod && data.cod !== 200) {
      throw new Error(data.message || "Failed to fetch weather data");
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch weather data" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
