const mongoose = require("mongoose")

const authorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    biography: {
        type: String,
        trim: true
    },
    birthYear: {
        type: Number
    }
}, {timestamps: true})

const Author = mongoose.model("Author", authorSchema)
module.exports = Author