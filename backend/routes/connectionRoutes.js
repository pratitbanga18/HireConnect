const express = require("express")
const verifyToken = require("../middleware/authMiddleware")

const {
    getConnections,
    getSuggestions,
    getPendingRequests,
    getStats,
    sendRequest,
    acceptRequest,
    rejectRequest
} = require("../controllers/connectionController")

const router = express.Router()

router.get("/", verifyToken, getConnections)
router.get("/suggestions", verifyToken, getSuggestions)
router.get("/pending", verifyToken, getPendingRequests)
router.get("/stats", verifyToken, getStats)
router.post("/request", verifyToken, sendRequest)
router.put("/:id/accept", verifyToken, acceptRequest)
router.delete("/:id/reject", verifyToken, rejectRequest)

module.exports = router
