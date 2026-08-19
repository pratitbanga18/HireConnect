const express = require("express")

const {
    applyJob,
    getApplications,
    getMyApplications,
    updateApplicationStatus
} = require("../controllers/applicationController")

const verifyToken = require("../middleware/authMiddleware")

const router = express.Router()

router.post("/", verifyToken, applyJob)

router.get("/", verifyToken, getApplications)

router.get("/my", verifyToken, getMyApplications)

router.put("/:id/status", verifyToken, updateApplicationStatus)

module.exports = router