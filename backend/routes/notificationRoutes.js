const express = require("express")
const verifyToken = require("../middleware/authMiddleware")

const {
    getNotifications,
    markAllRead,
    markOneRead
} = require("../controllers/notificationController")

const router = express.Router()

router.get("/", verifyToken, getNotifications)
router.put("/mark-all-read", verifyToken, markAllRead)
router.put("/:id/read", verifyToken, markOneRead)

module.exports = router
