const mongoose = require("mongoose");

const verifySchema = new mongoose.Schema({
  NAME: String,
  DOMAIN: String,
  DURATION: String,
  CERTIFICATION_ID: { type: String, unique: true },
  DATE_OF_JOINING: {
    type: Date,
    get: function(date) {
      // Convert date to string in "YYYY-MM-DD" format
      return date.toISOString().split('T')[0];
    }
  },
  COMPLETION_DATE: {
    type: Date,
    get: function(date) {
      // Convert date to string in "YYYY-MM-DD" format
      return date.toISOString().split('T')[0];
    }
  }
});

const VerifyModel = mongoose.model("Verify", verifySchema);

module.exports = VerifyModel;
