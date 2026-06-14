const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const dns = require("dns");

dns.setServers(["8.8.8.8", "8.8.4.4"]);

require("dotenv").config();
const User = require("./models/User");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.static(__dirname));

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));


// =====================
// Registration Route
// =====================
app.post("/register", async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      gender,
      address,
      state,
      pincode,
      eventType,
      eventDate,
      eventTime,
    } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "Email already registered",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      phone,
      gender,
      address,
      state,
      pincode,
      eventType,
      eventDate,
      eventTime,
    });

    await user.save();

    console.log("User saved:", user.email);

    res.status(200).json({
      message: "Registration Successful",
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
});


// =====================
// Login Route
// =====================
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    // Compare passwords
    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(400).json({
        message: "Wrong Password",
      });
    }

    // Create JWT token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Send user details (without password)
    res.status(200).json({
      token,
      message: "Login Success",
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        gender: user.gender,
        address: user.address,
        state: user.state,
        pincode: user.pincode,
        eventType: user.eventType,
        eventDate: user.eventDate,
        eventTime: user.eventTime,
      },
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
});

app.post("/forgot-password", async (req, res) => {
  try {
    console.log("Forgot Password Request:", req.body);

    const { email, phone, newPassword } = req.body;

    const user = await User.findOne({ email, phone });

    console.log("User Found:", user);

    if (!user) {
      return res.status(400).json({
        message: "Email and Phone Number do not match."
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;

    await user.save();

    res.json({
      message: "Password updated successfully."
    });

  } catch (error) {
    console.error("Forgot Password Error:", error);

    res.status(500).json({
      message: "Server Error"
    });
  }
});

// =====================
// Start Server
// =====================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
