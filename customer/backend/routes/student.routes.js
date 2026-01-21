const express = require("express");
const { createStudent } = require("../controllers/Student.controller");
const router = express.Router()


router.route('/').post(createStudent)

module.exports = router