const mongoose = require("mongoose");

const connectToDatabase = async () => {
  try {
    await mongoose.connect("mongodb+srv://itanuranjan:ePcw9wWRr8dyoo5k@venturevibe.8usckwk.mongodb.net/?retryWrites=true&w=majority&appName=VentureVibe", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      authSource: "admin",
    });

    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
};

module.exports = connectToDatabase;