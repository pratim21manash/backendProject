require("dotenv").config()

const express = require("express")
const cors = require('cors')
const { connect } = require("./src/routes/bookRoutes")
const connectDb = require("./src/config/database")
const app = express()

//Import Routes
const bookRoutes = require("./src/routes/bookRoutes")

//connect to database
connectDb()

//Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))

// API Routes
app.use('/api/books', bookRoutes)

app.listen(process.env.PORT, () => {
    console.log('Server is running')
})
