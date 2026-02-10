const Student = require("../model/student.model")
const ErrorResponse = require("../utils/errorResponse")

exports.createStudent = async (req, res, next) => {
    try {
        const {
            studentId,
            name,
            email,
            department,
            semester,
            phone,
            dateOfBirth,
            address,
            enrollmentDate,
            gender
        } = req.body
    
       //validate requirred data
       if(!studentId || !name || !email || !department || !semester || !phone || !dateOfBirth || !gender || !address){
            return next(new ErrorResponse("Please provide all the required fields", 400))
       }

       //check if student already exist
       const existingStudent = await Student.findOne({
         $or: [{studentId}, {email}, {phone}]
       })

       if (existingStudent){
        let message = "Student already exist"

        if(existingStudent.studentId == studentId)
            message = "Student ID already exists"

        if(existingStudent.email = email)
            message = "Emal already exists"

        if(existingStudent.phone === phone)
            message = "Phone number already registered"

        return next(new ErrorResponse(message, 400))
       }

       //Create new Student
       const student = await Student.create({
        studentId,name,email,department,semester,phone,dateOfBirth,gender,address,
        enrollmentDate: new Date()
       });

       res.status(201).json({
        success: true,
        message: "Student created successfully",
        date: student
       })
    }
    catch(err){
        next(err)
    }
}