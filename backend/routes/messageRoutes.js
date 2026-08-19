const express = require("express")
const verifyToken = require("../middleware/authMiddleware")

const {
    getConversations,
    getConversation,
    sendMessage
} = require("../controllers/messageController")

const router = express.Router()

router.get("/conversations", verifyToken, getConversations)
router.get("/:userId", verifyToken, getConversation)
router.post("/", verifyToken, sendMessage)

module.exports = router
