import { useState } from "react"
import "./App.css"

import Navbar from "./components/Navbar"
import Sidebar from "./components/Sidebar"

import Home from "./pages/Home"
import MyApplications from "./pages/MyApplications"
import JobDetails from "./pages/JobDetails"
import Profile from "./pages/Profile"
import Network from "./pages/Network"
import Messages from "./pages/Messages"
import Notifications from "./pages/Notifications"
import Settings from "./pages/Settings"

import Jobs from "./Jobs"
import PostJob from "./PostJob"
import Applicants from "./Applicants"

function App() {
  const [isLogin, setIsLogin] = useState(true)

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("jobseeker")

  const [message, setMessage] = useState("")
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user")
    return savedUser ? JSON.parse(savedUser) : null
  })

  const [page, setPage] = useState("dashboard")

  const register = async (e) => {
    e.preventDefault()

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            name,
            email,
            password,
            role
          })
        }
      )

      const data = await response.json()

      if (response.ok) {
        setMessage("Registration successful! You can now login.")
        setIsLogin(true)
        setName("")
        setPassword("")
      } else {
        setMessage(data.message)
      }
    } catch {
      setMessage("Cannot connect to server")
    }
  }

  const login = async (e) => {
    e.preventDefault()

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email,
            password
          })
        }
      )

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem("token", data.token)
        localStorage.setItem("user", JSON.stringify(data.user))

        setUser(data.user)
        setPage("dashboard")
        setMessage("")
      } else {
        setMessage(data.message)
      }
    } catch {
      setMessage("Cannot connect to server")
    }
  }

  const updateUser = (updates) => {
    setUser((currentUser) => {
      const updatedUser = { ...currentUser, ...updates }
      localStorage.setItem("user", JSON.stringify(updatedUser))
      return updatedUser
    })
  }

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")

    setUser(null)
    setPage("dashboard")
  }

  if (!user) {
    return (
      <div className="auth-page">

        <div className="auth-box">

          <div className="auth-logo">
            HireConnect
          </div>

          <h1>
            Build your professional future
          </h1>

          <p>
            Connect with professionals, discover opportunities,
            and grow your career.
          </p>

          <div className="tabs">

            <button
              className={isLogin ? "active" : ""}
              onClick={() => {
                setIsLogin(true)
                setMessage("")
              }}
            >
              Login
            </button>

            <button
              className={!isLogin ? "active" : ""}
              onClick={() => {
                setIsLogin(false)
                setMessage("")
              }}
            >
              Register
            </button>

          </div>

          <form onSubmit={isLogin ? login : register}>

            {!isLogin && (
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            )}

            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {!isLogin && (
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="jobseeker">
                  Job Seeker
                </option>

                <option value="recruiter">
                  Recruiter
                </option>
              </select>
            )}

            <button
              type="submit"
              className="submit-button"
            >
              {isLogin ? "Sign In" : "Create Account"}
            </button>

          </form>

          {message && (
            <p className="message">
              {message}
            </p>
          )}

        </div>

      </div>
    )
  }

  return (
    <div className="app-shell">

      <Navbar
        user={user}
        logout={logout}
        setPage={setPage}
      />

      <div className="app-layout">

        <Sidebar
          user={user}
          page={page}
          setPage={setPage}
        />

        {page === "dashboard" && (
          <Home
            user={user}
            setPage={setPage}
          />
        )}

        {page === "jobs" && (
          <div className="page-wrapper">
            <Jobs
              user={user}
              setPage={setPage}
            />
          </div>
        )}

        {page === "job-details" && (
          <JobDetails
            user={user}
            setPage={setPage}
          />
        )}

        {page === "applications" && (
          <div className="page-wrapper">
            <MyApplications
              user={user}
              setPage={setPage}
            />
          </div>
        )}

        {page === "profile" && (
          <div className="page-wrapper">
            <Profile
              user={user}
              setPage={setPage}
              onUserUpdate={updateUser}
            />
          </div>
        )}

        {page === "network" && (
          <div className="page-wrapper">
            <Network
              user={user}
              setPage={setPage}
            />
          </div>
        )}

        {page === "messages" && (
          <div className="page-wrapper">
            <Messages
              user={user}
              setPage={setPage}
            />
          </div>
        )}

        {page === "notifications" && (
          <div className="page-wrapper">
            <Notifications
              user={user}
              setPage={setPage}
            />
          </div>
        )}

        {page === "settings" && (
          <div className="page-wrapper">
            <Settings
              user={user}
              setPage={setPage}
              logout={logout}
            />
          </div>
        )}

        {page === "post-job" && (
          <div className="page-wrapper">
            <PostJob
              user={user}
              setPage={setPage}
            />
          </div>
        )}

        {page === "applicants" && (
          <div className="page-wrapper">
            <Applicants
              user={user}
              setPage={setPage}
            />
          </div>
        )}

      </div>

    </div>
  )
}

export default App