const db = require("../config/db")

const getConversations = (req, res) => {
    const userId = req.user.id

    const sql = `
        SELECT
            u.id AS user_id,
            u.name,
            u.headline,
            lm.content AS last_message,
            lm.created_at AS last_message_at,
            (
                SELECT COUNT(*) FROM messages
                WHERE sender_id = u.id AND receiver_id = ? AND is_read = FALSE
            ) AS unread_count
        FROM connections c
        JOIN users u ON u.id = CASE
            WHEN c.requester_id = ? THEN c.receiver_id
            ELSE c.requester_id
        END
        LEFT JOIN messages lm ON lm.id = (
            SELECT id FROM messages
            WHERE (sender_id = u.id AND receiver_id = ?)
               OR (sender_id = ? AND receiver_id = u.id)
            ORDER BY created_at DESC
            LIMIT 1
        )
        WHERE (c.requester_id = ? OR c.receiver_id = ?)
        AND c.status = 'accepted'
        ORDER BY lm.created_at IS NULL, lm.created_at DESC
    `

    db.query(
        sql,
        [userId, userId, userId, userId, userId, userId],
        (err, results) => {
            if (err) {
                return res.status(500).json({
                    message: "Failed to fetch conversations"
                })
            }

            res.json(results)
        }
    )
}

const getConversation = (req, res) => {
    const userId = req.user.id
    const otherId = req.params.userId

    const sql = `
        SELECT id, sender_id, receiver_id, content, is_read, created_at
        FROM messages
        WHERE (sender_id = ? AND receiver_id = ?)
           OR (sender_id = ? AND receiver_id = ?)
        ORDER BY created_at ASC
    `

    db.query(sql, [userId, otherId, otherId, userId], (err, results) => {
        if (err) {
            return res.status(500).json({
                message: "Failed to fetch messages"
            })
        }

        const markReadSql = `
            UPDATE messages
            SET is_read = TRUE
            WHERE sender_id = ? AND receiver_id = ? AND is_read = FALSE
        `

        db.query(markReadSql, [otherId, userId])

        res.json(results)
    })
}

const sendMessage = (req, res) => {
    const senderId = req.user.id
    const { receiverId, content } = req.body

    if (!receiverId || !content || !content.trim()) {
        return res.status(400).json({
            message: "Message content is required"
        })
    }

    const checkSql = `
        SELECT * FROM connections
        WHERE ((requester_id = ? AND receiver_id = ?) OR (requester_id = ? AND receiver_id = ?))
        AND status = 'accepted'
    `

    db.query(
        checkSql,
        [senderId, receiverId, receiverId, senderId],
        (err, results) => {
            if (err) {
                return res.status(500).json({
                    message: "Database error"
                })
            }

            if (results.length === 0) {
                return res.status(403).json({
                    message: "You can only message your connections"
                })
            }

            const sql = `
                INSERT INTO messages (sender_id, receiver_id, content)
                VALUES (?, ?, ?)
            `

            db.query(sql, [senderId, receiverId, content.trim()], (err2, result) => {
                if (err2) {
                    return res.status(500).json({
                        message: "Failed to send message"
                    })
                }

                res.status(201).json({
                    id: result.insertId,
                    sender_id: senderId,
                    receiver_id: Number(receiverId),
                    content: content.trim(),
                    is_read: false,
                    created_at: new Date()
                })
            })
        }
    )
}

module.exports = {
    getConversations,
    getConversation,
    sendMessage
}
