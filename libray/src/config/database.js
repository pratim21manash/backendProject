const mongoose = require("mongoose")
require("dotenv").config();

const connectDB = async() => {
    try{
        await mongoose.connect(process.env.MONGODB_URI,{
            userNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log("Mongodb connected successfully")
    }
    catch(error){
        console.log("Mongodb connection fail", error.message);
        process.exit(1)
    }
}

//Event listers for mongoDB connection
mongoose.connection.on('connected', () => {
    console.log("Mongoose connected to MOngoDb")
})

mongoose.connection.on("error", (err) => {
    console.log("Mongoose connection error:", err)
})

mongoose.connection.on("disconnect", () => {
    console.log("Monngoose connection from  mongodb")
})

mondule.exports = connectDB