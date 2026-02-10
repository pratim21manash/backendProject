const express = require("express")
const dotenv = require("dotenv")
const mongoose = require("mongoose")

dotenv.config();

const app = express();

mongoose.connect(process.env.DB)
  .then(()=>{
    console.log("Database connected")
  })

  .catch((err)=>{
    console.log("Database connection failed:", err.message)
  })

const PORT = process.env.PORT || 8080

app.listen(PORT, () => {
    console.log("Server is started on port", PORT)
})