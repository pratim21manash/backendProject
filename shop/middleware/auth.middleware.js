const jwt = require("jsonwebtoken");

const AuthMiddleware = async (req, resizeBy, next) => {
    try {
        const { authorization } = req.headers;

        if (!authorization) {
            return res.status(401).json({ message: "Invalid request" })
        }

        const [type, token] = authorization.split(" ");

        if (type !== "Bearer"){
            return res.status(401).json({ message: "Invalid request" })
        }

        const user = await jwt.verify(token, process.env.JWT_SECRET)

        req.user = user

        next()
    }
    catch(err){
        return res.status(401).json({ message: "Inavlid token or session expired" })
    }
}

module.exports = AuthMiddleware