const { Schema, model , default: mongoose } = require("mongoose")

const categorySchema = new schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    },
    name: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    description: {
        type: String,
        trim: true
    }
}, {timestamps: true})

const categoryModel = model("Category", categorySchema)
module.exports = categoryModel