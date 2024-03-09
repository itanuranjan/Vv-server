const express = require("express");
const router = express.Router();
const City = require("../models/City"); // Assuming your City model is defined in City.js

// Route to get all cities
router.get("/api/cities", async (req, res) => {
  try {
    const cities = await City.find();
    res.json(cities);
  } catch (error) {
    console.error("Error fetching cities:", error);
    res.status(500).send("Internal Server Error");
  }
});
// router.get("/api/health", (req, res) => {

//     response.status(200).json({message :"server is healthy"});
  
// });


  


// Additional routes for creating, updating, or deleting cities can be added here

module.exports = router;
