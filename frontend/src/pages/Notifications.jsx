import { useEffect, useState } from "react"

function Notifications({ setPage }) {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState("")

  const authHeader = {
    Authorization: `Bearer ${localStorage.getItem("token")}`
  }

  const loadNotifications = async () => {
    try {
      const response = await fetch("https://hireconnect-production-220e.up.railway.app/api/notifications", {
        headers: authHeader
      })

      const data = await response.json()

      if (response.ok) {
        setNotifications(data)
      } else {
        setMessage(data.message)
      }
    } catch {
      setMessage("Cannot connect to server")
    }

    setLoading(false)
  }

  useEffect(() => {
    loadNotifications()
  }, [])

  const markAllRead = async () => {
    try {
      await fetch("https://hireconnect-production-220e.up.railway.app/api/notifications/mark-all-read", {
        method: "PUT",
        headers: authHeader
      })

      loadNotifications()
    } catch {
      setMessage("Cannot connect to server")
    }
  }

  const openNotification = async (notification) => {
    if (!notification.is_read) {
      try {
        await fetch(
          `https://hireconnect-production-220e.up.railway.app/api/notifications/${notification.id}/read`,
          {
            method: "PUT",
            headers: authHeader
          }
        )

        loadNotifications()
      } catch {
        setMessage("Cannot connect to server")
      }
    }

    if (notification.link_page && setPage) {
      setPage(notification.link_page)
    }
  }

  const icons = {
    application: "💼",
    connection: "🤝",
    system: "✨"
  }

  if (loading) {
    return (
      <main className="notifications-page">
        <p>Loading notifications...</p>
      </main>
    )
  }

  return (
    <main className="notifications-page">

      <div className="notifications-header">
        <div>
          <p className="page-label">UPDATES</p>
          <h1>Notifications</h1>
          <p>Stay updated with your latest activities.</p>
        </div>

        <button onClick={markAllRead}>
          Mark all as read
        </button>
      </div>

      {message && (
        <div className="applicant-message">
          {message}
        </div>
      )}

      {notifications.length === 0 ? (
        <div className="empty-card">
          <div>🔔</div>
          <h3>No notifications yet</h3>
          <p>Updates about your jobs and network will show up here.</p>
        </div>
      ) : (
        <div className="notification-list">

          {notifications.map((notification) => (
            <div
              className="notification-card"
              key={notification.id}
              onClick={() => openNotification(notification)}
              style={{ cursor: "pointer" }}
            >

              <div className="notification-icon">
                {icons[notification.type] || "🔔"}
              </div>

              <div className="notification-content">
                <h3>{notification.title}</h3>
                <p>{notification.text}</p>
                <span>
                  {new Date(notification.created_at).toLocaleString()}
                </span>
              </div>

              {!notification.is_read && (
                <div className="notification-dot"></div>
              )}

            </div>
          ))}

        </div>
      )}

    </main>
  )
}

export default Notifications
