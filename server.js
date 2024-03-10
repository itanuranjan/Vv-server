const express = require("express");
const cors = require("cors");
const CityModel = require("./models/City");
const connectToDatabase = require("./database/db");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectToDatabase();

// API endpoint to insert a new city
app.post("/api/cities", async (req, res) => {
  try {
    const { title, description, imageUrl, route } = req.body;
    const newCity = new CityModel({ title, description, imageUrl, route });
    await newCity.save();
    res.json(newCity);
  } catch (error) {
    console.error("Error inserting city:", error);
    res.status(500).send("Internal Server Error");
  }
});

// API endpoint to retrieve all cities
app.get("/api/cities", async (req, res) => {
  try {
    const cities = await CityModel.find();
    res.json(cities);
  } catch (error) {
    console.error("Error fetching cities:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "server is healthy" });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});