import { useEffect, useState } from "react"

function Navbar({ user, logout, setPage }) {
  const [search, setSearch] = useState("")
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

  const submitSearch = (e) => {
    e.preventDefault()

    if (search.trim()) {
      localStorage.setItem("jobSearch", search.trim())
      setPage("jobs")
    }
  }

  const profileImage = displayUser?.profile_image

  return (
    <nav className="navbar">

      <div className="navbar-left">
        <div
          className="navbar-logo"
          onClick={() => setPage("dashboard")}
        >
          HireConnect
        </div>

        <form className="navbar-search" onSubmit={submitSearch}>
          <span>⌕</span>

          <input
            type="text"
            placeholder="Search jobs, people, companies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </form>
      </div>

      <div className="navbar-right">

        <div
          className="nav-action"
          onClick={() => setPage("network")}
        >
          <span>◌</span>
          <small>Network</small>
        </div>

        <div
          className="nav-action"
          onClick={() => setPage("messages")}
        >
          <span>✉</span>
          <small>Messages</small>
        </div>

        <div
          className="nav-action notification-action"
          onClick={() => setPage("notifications")}
        >
          <span>♢</span>
          <small>Alerts</small>
          <b>2</b>
        </div>

        <div
          className="navbar-profile"
          onClick={() => setPage("profile")}
        >
          <div className="navbar-avatar">
            {profileImage ? (
              <img
                src={`http://localhost:5000${profileImage}`}
                alt={displayUser?.name || "Profile"}
              />
            ) : (
              displayUser?.name?.charAt(0).toUpperCase() || "U"
            )}
          </div>

          <span>{displayUser?.name || user.name}</span>
        </div>

        <button
          className="logout-button"
          onClick={logout}
        >
          Logout
        </button>

      </div>

    </nav>
  )
}

export default Navbar
