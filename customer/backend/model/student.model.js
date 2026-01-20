const { required, types } = require("joi");
const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
    studentId: {
        type: String,
        required: [true, "Student id is required"],
        unique: true,
        trim: true
    },
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        trim: true
    },
    phone: {
        type: String,
        validate: function(v)
    }
})