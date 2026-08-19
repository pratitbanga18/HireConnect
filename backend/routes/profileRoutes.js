const express = require("express")
const multer = require("multer")
const path = require("path")
const fs = require("fs")
const verifyToken = require("../middleware/authMiddleware")

const {
    getProfile,
    updateProfile,
    uploadProfileImage,
    uploadResume,
    removeResume
} = require("../controllers/profileController")

const router = express.Router()

const profileDir = path.join(__dirname, "..", "uploads", "profiles")
const resumeDir = path.join(__dirname, "..", "uploads", "resumes")

fs.mkdirSync(profileDir, { recursive: true })
fs.mkdirSync(resumeDir, { recursive: true })

const imageStorage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, profileDir),
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase()
        cb(null, `profile-${req.user.id}-${Date.now()}${ext}`)
    }
})

const resumeStorage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, resumeDir),
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase()
        cb(null, `cv-${req.user.id}-${Date.now()}${ext}`)
    }
})

const imageUpload = multer({
    storage: imageStorage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowed = ["image/jpeg", "image/png", "image/webp"]
        if (allowed.includes(file.mimetype)) {
            cb(null, true)
        } else {
            cb(new Error("Only JPG, PNG and WEBP images are allowed"))
        }
    }
})

const resumeUpload = multer({
    storage: resumeStorage,
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowedMime = [
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ]

        const ext = path.extname(file.originalname).toLowerCase()

        if (allowedMime.includes(file.mimetype) || [".pdf", ".doc", ".docx"].includes(ext)) {
            cb(null, true)
        } else {
            cb(new Error("Only PDF, DOC and DOCX files are allowed"))
        }
    }
})

router.get("/", verifyToken, getProfile)
router.put("/", verifyToken, updateProfile)

router.post(
    "/image",
    verifyToken,
    imageUpload.single("profileImage"),
    uploadProfileImage
)

router.post(
    "/resume",
    verifyToken,
    resumeUpload.single("resume"),
    uploadResume
)

router.delete("/resume", verifyToken, removeResume)

module.exports = router
