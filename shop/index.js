// 1️⃣ Core / Third-party imports
const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

// 2️⃣ Load environment variables FIRST
dotenv.config();

// 3️⃣ Initialize app
const app = express();

// 4️⃣ Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// 5️⃣ Routes / Controllers
const { signup, login } = require("./controller/user.controller");

// Example routes (you forgot to define them)
app.post("/signup", signup);
app.post("/login", login);

// 6️⃣ Database connection
mongoose.connect(process.env.DB)
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.log("Database connection failed:", err.message);
  });

// Auth Routes (Public)
app.post("/api/signup", signup);
app.post("/api/login", login);


// 7️⃣ Start server
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log("Server is started on port", PORT);
});
