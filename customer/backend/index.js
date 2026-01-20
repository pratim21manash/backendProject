require("dotenv").config()

const express = require("express")
const connectDB = require("./config/database")

const app = express()
connectDB();

app.get('/', (req,res) => {
    res.send("Smart campus API is running")
})

app.listen(process.env.PORT || 3000, () => {
    console.log("Server is running")
})