const db = require("../config/db")

const getProfile = (req, res) => {
    const userId = req.user.id

    const sql = `
        SELECT
            id,
            name,
            email,
            role,
            profile_image,
            headline,
            about,
            location,
            resume_file
        FROM users
        WHERE id = ?
    `

    db.query(sql, [userId], (err, results) => {
        if (err) {
            return res.status(500).json({
                message: "Failed to fetch profile"
            })
        }

        if (results.length === 0) {
            return res.status(404).json({
                message: "Profile not found"
            })
        }

        res.json(results[0])
    })
}

const updateProfile = (req, res) => {
    const userId = req.user.id
    const { name, headline, about, location } = req.body

    const sql = `
        UPDATE users
        SET name = ?,
            headline = ?,
            about = ?,
            location = ?
        WHERE id = ?
    `

    db.query(sql, [name, headline, about, location, userId], (err) => {
        if (err) {
            return res.status(500).json({
                message: "Failed to update profile"
            })
        }

        res.json({
            message: "Profile updated successfully"
        })
    })
}

const uploadProfileImage = (req, res) => {
    const userId = req.user.id

    if (!req.file) {
        return res.status(400).json({
            message: "Please select an image"
        })
    }

    const imagePath = `/uploads/profiles/${req.file.filename}`

    db.query(
        "UPDATE users SET profile_image = ? WHERE id = ?",
        [imagePath, userId],
        (err) => {
            if (err) {
                return res.status(500).json({
                    message: "Failed to save profile image"
                })
            }

            res.json({
                message: "Profile image updated successfully",
                profile_image: imagePath
            })
        }
    )
}

const uploadResume = (req, res) => {
    const userId = req.user.id

    if (!req.file) {
        return res.status(400).json({
            message: "Please select a CV"
        })
    }

    const resumePath = `/uploads/resumes/${req.file.filename}`

    db.query(
        "UPDATE users SET resume_file = ? WHERE id = ?",
        [resumePath, userId],
        (err) => {
            if (err) {
                return res.status(500).json({
                    message: "Failed to save CV"
                })
            }

            res.json({
                message: "CV uploaded successfully",
                resume_file: resumePath
            })
        }
    )
}

const removeResume = (req, res) => {
    const userId = req.user.id

    db.query(
        "UPDATE users SET resume_file = NULL WHERE id = ?",
        [userId],
        (err) => {
            if (err) {
                return res.status(500).json({
                    message: "Failed to remove CV"
                })
            }

            res.json({
                message: "CV removed successfully"
            })
        }
    )
}

module.exports = {
    getProfile,
    updateProfile,
    uploadProfileImage,
    uploadResume,
    removeResume
}
