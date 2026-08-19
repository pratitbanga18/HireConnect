const db = require("../config/db")

const getNotifications = (req, res) => {
    const userId = req.user.id

    const sql = `
        SELECT id, type, title, text, link_page, is_read, created_at
        FROM notifications
        WHERE user_id = ?
        ORDER BY created_at DESC
        LIMIT 50
    `

    db.query(sql, [userId], (err, results) => {
        if (err) {
            return res.status(500).json({
                message: "Failed to fetch notifications"
            })
        }

        res.json(results)
    })
}

const markAllRead = (req, res) => {
    const userId = req.user.id

    const sql = `
        UPDATE notifications
        SET is_read = TRUE
        WHERE user_id = ?
    `

    db.query(sql, [userId], (err) => {
        if (err) {
            return res.status(500).json({
                message: "Failed to update notifications"
            })
        }

        res.json({
            message: "All notifications marked as read"
        })
    })
}

const markOneRead = (req, res) => {
    const userId = req.user.id
    const { id } = req.params

    const sql = `
        UPDATE notifications
        SET is_read = TRUE
        WHERE id = ? AND user_id = ?
    `

    db.query(sql, [id, userId], (err, result) => {
        if (err) {
            return res.status(500).json({
                message: "Failed to update notification"
            })
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Notification not found"
            })
        }

        res.json({
            message: "Notification marked as read"
        })
    })
}

module.exports = {
    getNotifications,
    markAllRead,
    markOneRead
}
