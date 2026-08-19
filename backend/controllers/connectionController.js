const db = require("../config/db")

const getConnections = (req, res) => {
    const userId = req.user.id

    const sql = `
        SELECT
            users.id,
            users.name,
            users.headline,
            users.role,
            users.location
        FROM connections
        JOIN users ON users.id = CASE
            WHEN connections.requester_id = ? THEN connections.receiver_id
            ELSE connections.requester_id
        END
        WHERE (connections.requester_id = ? OR connections.receiver_id = ?)
        AND connections.status = 'accepted'
    `

    db.query(sql, [userId, userId, userId], (err, results) => {
        if (err) {
            return res.status(500).json({
                message: "Failed to fetch connections"
            })
        }

        res.json(results)
    })
}

const getSuggestions = (req, res) => {
    const userId = req.user.id

    const sql = `
        SELECT id, name, headline, role, location
        FROM users
        WHERE id != ?
        AND id NOT IN (
            SELECT CASE
                WHEN requester_id = ? THEN receiver_id
                ELSE requester_id
            END
            FROM connections
            WHERE requester_id = ? OR receiver_id = ?
        )
        LIMIT 10
    `

    db.query(sql, [userId, userId, userId, userId], (err, results) => {
        if (err) {
            return res.status(500).json({
                message: "Failed to fetch suggestions"
            })
        }

        res.json(results)
    })
}

const getPendingRequests = (req, res) => {
    const userId = req.user.id

    const sql = `
        SELECT
            connections.id AS connection_id,
            users.id AS user_id,
            users.name,
            users.headline,
            users.role
        FROM connections
        JOIN users ON users.id = connections.requester_id
        WHERE connections.receiver_id = ?
        AND connections.status = 'pending'
        ORDER BY connections.created_at DESC
    `

    db.query(sql, [userId], (err, results) => {
        if (err) {
            return res.status(500).json({
                message: "Failed to fetch pending requests"
            })
        }

        res.json(results)
    })
}

const getStats = (req, res) => {
    const userId = req.user.id

    const sql = `
        SELECT
            (SELECT COUNT(*) FROM connections
                WHERE (requester_id = ? OR receiver_id = ?) AND status = 'accepted') AS connections,
            (SELECT COUNT(*) FROM connections
                WHERE receiver_id = ? AND status = 'pending') AS pending
    `

    db.query(sql, [userId, userId, userId], (err, results) => {
        if (err) {
            return res.status(500).json({
                message: "Failed to fetch stats"
            })
        }

        res.json(results[0])
    })
}

const sendRequest = (req, res) => {
    const requesterId = req.user.id
    const { receiverId } = req.body

    if (!receiverId) {
        return res.status(400).json({
            message: "Receiver is required"
        })
    }

    if (Number(receiverId) === requesterId) {
        return res.status(400).json({
            message: "You cannot connect with yourself"
        })
    }

    const checkSql = `
        SELECT * FROM connections
        WHERE (requester_id = ? AND receiver_id = ?)
        OR (requester_id = ? AND receiver_id = ?)
    `

    db.query(
        checkSql,
        [requesterId, receiverId, receiverId, requesterId],
        (err, results) => {
            if (err) {
                return res.status(500).json({
                    message: "Database error"
                })
            }

            if (results.length > 0) {
                return res.status(400).json({
                    message: "Connection already exists or is pending"
                })
            }

            const sql = `
                INSERT INTO connections (requester_id, receiver_id, status)
                VALUES (?, ?, 'pending')
            `

            db.query(sql, [requesterId, receiverId], (err2) => {
                if (err2) {
                    return res.status(500).json({
                        message: "Failed to send connection request"
                    })
                }

                const notifSql = `
                    INSERT INTO notifications (user_id, type, title, text, link_page)
                    VALUES (?, 'connection', 'New connection request', 'Someone wants to connect with you.', 'network')
                `

                db.query(notifSql, [receiverId])

                res.status(201).json({
                    message: "Connection request sent"
                })
            })
        }
    )
}

const acceptRequest = (req, res) => {
    const userId = req.user.id
    const { id } = req.params

    const sql = `
        UPDATE connections
        SET status = 'accepted'
        WHERE id = ? AND receiver_id = ?
    `

    db.query(sql, [id, userId], (err, result) => {
        if (err) {
            return res.status(500).json({
                message: "Failed to accept request"
            })
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Connection request not found"
            })
        }

        db.query(
            "SELECT requester_id FROM connections WHERE id = ?",
            [id],
            (err2, rows) => {
                if (!err2 && rows.length > 0) {
                    const notifSql = `
                        INSERT INTO notifications (user_id, type, title, text, link_page)
                        VALUES (?, 'connection', 'Connection accepted', 'Your connection request was accepted.', 'network')
                    `

                    db.query(notifSql, [rows[0].requester_id])
                }
            }
        )

        res.json({
            message: "Connection accepted"
        })
    })
}

const rejectRequest = (req, res) => {
    const userId = req.user.id
    const { id } = req.params

    const sql = `
        DELETE FROM connections
        WHERE id = ? AND receiver_id = ?
    `

    db.query(sql, [id, userId], (err, result) => {
        if (err) {
            return res.status(500).json({
                message: "Failed to reject request"
            })
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Connection request not found"
            })
        }

        res.json({
            message: "Connection request rejected"
        })
    })
}

module.exports = {
    getConnections,
    getSuggestions,
    getPendingRequests,
    getStats,
    sendRequest,
    acceptRequest,
    rejectRequest
}
