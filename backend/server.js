const express = require("express")
const cors = require("cors")
const path = require("path")
const db = require("./config/db")

const authRoutes = require("./routes/authRoutes")
const jobRoutes = require("./routes/jobRoutes")
const applicationRoutes = require("./routes/applicationRoutes")
const profileRoutes = require("./routes/profileRoutes")
const connectionRoutes = require("./routes/connectionRoutes")
const messageRoutes = require("./routes/messageRoutes")
const notificationRoutes = require("./routes/notificationRoutes")

const app = express()

app.use(cors())
app.use(express.json())

app.use(
    "/uploads",
    express.static(path.join(__dirname, "uploads"))
)

app.use("/api/auth", authRoutes)
app.use("/api/jobs", jobRoutes)
app.use("/api/applications", applicationRoutes)
app.use("/api/profile", profileRoutes)
app.use("/api/connections", connectionRoutes)
app.use("/api/messages", messageRoutes)
app.use("/api/notifications", notificationRoutes)

app.get("/", (req, res) => {
    res.json({
        message: "HireConnect Backend Running"
    })
})

app.listen(5000, () => {
    console.log("Server running on port 5000")
})
