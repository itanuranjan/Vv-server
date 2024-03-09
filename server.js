// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const CityModel = require("./models/City");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect("mongodb+srv://itanuranjan:ePcw9wWRr8dyoo5k@venturevibe.8usckwk.mongodb.net/?retryWrites=true&w=majority&appName=VentureVibe", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  authSource: "admin",
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

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
