const express = require("express")
const { createJob, getJobs } = require("../controllers/jobController")
const verifyToken = require("../middleware/authMiddleware")

const router = express.Router()

router.post("/", verifyToken, createJob)
router.get("/", getJobs)

module.exports = router