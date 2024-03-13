const express = require("express");
const router = new express.Router();
const controllers = require("../controllers/userControllers");
const City = require("../models/City"); // Assuming your City model is defined in City.js


router.post("/user/register",controllers.userregister);
router.post("/user/sendotp",controllers.userOtpSend);
router.post("/user/login",controllers.userLogin);

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





module.exports = router;
