const fetch = require("node-fetch");

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");

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
};
