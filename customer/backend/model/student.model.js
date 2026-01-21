const mongoose = require("mongoose")

const studentSchema = new mongoose.Schema({
    studentId: {
        type: String,
        required: [true, "Student ID is required"],
        unique: true,
        trim: true,
        minlength: [6, "Student ID must be atleats 6 characters"],
        maxlength: [20, "Student ID exceeds 20 character"]
    },
    name: {
        type: String,
        required: [true, "Student name is required"],
        trim: true,
        minlength: [2, "Name must be atleats 3 character"],
        maxlength: [40, "Name can not exceeds 40 character"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        trim: true,
        lowercase: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please provide a valid email address'
        ]
    },
    department: {
        type: String,
        required: [true, "Department is required"],
        trim: true,
        enum: {
            values: [
                'Computer Science',
                'Electrical Engineering',
                'Mechanical Engineering',
                'Civil Engineering',
                'Business Administration',
                'Mathematics',
                'Physics',
                'Chemistry',
                'Biology'
            ],
            message: "Please select a valid department"
        }
    },
    semester: {
        type: Number,
        required: [true, "Semester is required"],
    },
    phone: {
        type: String,
        required: [true, "Phone number is required"],
        trim: true,
        match: [
            /^[0-9]{10}$/,
            'Please provide a valid 10-digit phone number'
        ]
    },
    dateOfBirth: {
        type: Date,
        required: [true, " Gender is required"],
        enum: {
            values: ["Male", "Female", "Other"],
            message: "Please select a valid gender"
        }
    },
    gender: {
        type: String,
        required: [true, 'Gender is required'],
        enum: {
            values: ['Male', 'Female', 'Other'],
            message: 'Please select a valid gender'
        }
    },
    address: {
        street: {
            type: String,
            required: [true, 'Street address is required'],
            trim: true
        },
        city: {
            type: String,
            required: [true, 'City is required'],
            trim: true
        },
        state: {
            type: String,
            required: [true, 'State is required'],
            trim: true
        },
        pincode: {
            type: String,
            required: [true, 'Pincode is required'],
            match: [/^[0-9]{6}$/, 'Please provide a valid 6-digit pincode']
        }
    },
    enrollmentDate: {
        type: Date,
        default: Date.now
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true })

const Student = mongoose.model("Student", studentSchema)
module.exports = Student