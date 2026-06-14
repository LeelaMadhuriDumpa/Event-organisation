const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    unique: true
  },
  password: String,
  phone: String,
  gender: String,
  address: String,
  state: String,
  pincode: String,
  eventType: String,
  eventDate: String,
  eventTime: String
});

module.exports = mongoose.model("User", userSchema);
