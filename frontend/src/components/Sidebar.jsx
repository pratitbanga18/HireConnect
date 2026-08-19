import { useEffect, useState } from "react"

function Sidebar({ user, page, setPage }) {
  const [displayUser, setDisplayUser] = useState(user)

  useEffect(() => {
    const refreshUser = () => {
      const savedUser = localStorage.getItem("user")
      setDisplayUser(savedUser ? JSON.parse(savedUser) : user)
    }

    refreshUser()

    window.addEventListener("hireconnect-profile-updated", refreshUser)

    return () => {
      window.removeEventListener("hireconnect-profile-updated", refreshUser)
    }
  }, [user])

  const currentUser = displayUser || user

  return (
    <aside className="sidebar">

      <div className="profile-mini" onClick={() => setPage("profile")}>
        <div className="profile-cover"></div>

        <div className="profile-mini-content">
          <div className="large-avatar">
            {currentUser.profile_image ? (
              <img
                src={`https://hireconnect-production-220e.up.railway.app${currentUser.profile_image}`}
                alt={currentUser.name}
              />
            ) : (
              currentUser.name.charAt(0).toUpperCase()
            )}
          </div>

          <h3>{currentUser.name}</h3>

          <p>
            {currentUser.role === "recruiter"
              ? "Recruiter"
              : "Job Seeker"}
          </p>
        </div>
      </div>

      <div className="sidebar-menu">

        <div
          className={page === "dashboard" ? "menu-item active" : "menu-item"}
          onClick={() => setPage("dashboard")}
        >
          <span>⌂</span>
          Home
        </div>

        {currentUser.role === "jobseeker" && (
          <>
            <div
              className={page === "jobs" ? "menu-item active" : "menu-item"}
              onClick={() => setPage("jobs")}
            >
              <span>▣</span>
              Jobs
            </div>

            <div
              className={page === "applications" ? "menu-item active" : "menu-item"}
              onClick={() => setPage("applications")}
            >
              <span>▤</span>
              My Applications
            </div>

            <div
              className={page === "network" ? "menu-item active" : "menu-item"}
              onClick={() => setPage("network")}
            >
              <span>♧</span>
              My Network
            </div>
          </>
        )}

        {currentUser.role === "recruiter" && (
          <>
            <div
              className={page === "post-job" ? "menu-item active" : "menu-item"}
              onClick={() => setPage("post-job")}
            >
              <span>＋</span>
              Post a Job
            </div>

            <div
              className={page === "applicants" ? "menu-item active" : "menu-item"}
              onClick={() => setPage("applicants")}
            >
              <span>♙</span>
              Applicants
            </div>

            <div
              className={page === "network" ? "menu-item active" : "menu-item"}
              onClick={() => setPage("network")}
            >
              <span>♧</span>
              My Network
            </div>
          </>
        )}

        <div
          className={page === "messages" ? "menu-item active" : "menu-item"}
          onClick={() => setPage("messages")}
        >
          <span>▢</span>
          Messages
        </div>

        <div
          className={page === "notifications" ? "menu-item active" : "menu-item"}
          onClick={() => setPage("notifications")}
        >
          <span>♢</span>
          Notifications
        </div>

        <div
          className={page === "settings" ? "menu-item active" : "menu-item"}
          onClick={() => setPage("settings")}
        >
          <span>⚙</span>
          Settings
        </div>

      </div>

      <div className="sidebar-footer">
        <p>© 2026 HireConnect</p>
        <span>Privacy • Terms • Help</span>
      </div>

    </aside>
  )
}

export default Sidebar
