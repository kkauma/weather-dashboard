const fetch = require("node-fetch");

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");

  const { lat, lon } = req.query;

  if (!process.env.WEATHER_API_KEY) {
    return res.status(500).json({ error: "Weather API key is not configured" });
  }

  if (!lat || !lon) {
    return res.status(400).json({ error: "Missing latitude or longitude" });
  }

  try {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${process.env.WEATHER_API_KEY}`;

    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data.cod && data.cod !== 200) {
      console.error("Weather API Error:", data);
      return res
        .status(500)
        .json({ error: data.message || "Weather API error" });
    }

    return res.json(data);
  } catch (error) {
    console.error("Server Error:", error);
    return res.status(500).json({
      error: "Failed to fetch weather data",
      details: error.message,
    });
  }
};
