const UserModel = require("../model/user.model")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const signup = async (req, res) => {
    try {
        const user = await UserModel.create(req.body)

        const payload = {
            id: user._id,
            email: user.email,
            fullName: user.fullName,
            role: user.role,
            storeName: user.storeName
        }

        const token = await jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: "7d"})

        res.status(200).json({
            message: "Account created successfully",
            token: token, 
            user: payload
        })
    }
    catch (err) {
        res.status(500).json({ message: err.message })
    }
}


const login = async (req, res) => {
    try {
        const { email,password } = req.body
        const user = await UserModel.findOne({email: email.toLowerCase()})

        if(!user)
            return res.status(404).json({ message: "Account not found" })

        const isLogin = bcrypt.compareSync(password, user.password)

        if(!isLogin)
            return res.status(401).json({ message: "Incorrect password" })

        const payload = {
            id: user._id,
            email: user.email,
            fullName: user.fullName,
            role: user.role,
            storeName: user.storeName
        }

        const token = await jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: "7d"})

        res.status(200).json({
            message: "Login successful",
            token: token,
            user: payload
        })
    }
    catch (err) {
        res.status(500).json({ message: err.message })
    }
}


module.exports = {
    signup,
    login
}