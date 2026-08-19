const jwt = require("jsonwebtoken")

const verifyToken = (req, res, next) => {
    console.log("AUTH MIDDLEWARE HIT")
    console.log("Authorization:", req.headers.authorization)

    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            message: "Access denied. Token required"
        })
    }

    const token = authHeader.split(" ")[1]

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "hireconnect_secret")

        console.log("TOKEN DECODED:", decoded)

        req.user = decoded
        next()
    } catch (error) {
        console.log("TOKEN ERROR:", error.message)

        return res.status(401).json({
            message: "Invalid or expired token"
        })
    }
}

module.exports = verifyToken