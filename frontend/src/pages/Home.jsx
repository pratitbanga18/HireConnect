import { useEffect, useState } from "react"
import JobCard from "../components/JobCard"

function Home({ user, setPage }) {
  const [jobs, setJobs] = useState([])
  const [profile, setProfile] = useState(null)

  const API = "http://localhost:5000"

  const loadProfile = async () => {
    try {
      const response = await fetch(`${API}/api/profile`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      })

      const data = await response.json()

      if (response.ok) {
        setProfile(data)
      }
    } catch {
      setProfile(null)
    }
  }

  useEffect(() => {
    fetch(`${API}/api/jobs`)
      .then((response) => response.json())
      .then((data) => {
        setJobs(Array.isArray(data) ? data : [])
      })
      .catch(() => {
        setJobs([])
      })

    loadProfile()

    const refresh = () => loadProfile()
    window.addEventListener("hireconnect-profile-updated", refresh)

    return () => {
      window.removeEventListener("hireconnect-profile-updated", refresh)
    }
  }, [])

  const profileStrength = () => {
    if (!profile) return 0

    let score = 0

    if (profile.name?.trim()) score += 15
    if (profile.email?.trim()) score += 15
    if (profile.headline?.trim()) score += 15
    if (profile.location?.trim()) score += 15
    if (profile.about?.trim()) score += 15
    if (profile.profile_image) score += 15
    if (profile.resume_file) score += 10

    return score
  }

  const viewJob = (job) => {
    localStorage.setItem("selectedJob", JSON.stringify(job))
    setPage("job-details")
  }

  const score = profileStrength()

  return (
    <main className="home-content">

      <div className="welcome-section">
        <div>
          <p className="welcome-small">Welcome back</p>

          <h1>
            Good evening, {user.name.split(" ")[0]} 👋
          </h1>

          <p>
            Discover opportunities and grow your professional network.
          </p>
        </div>

        {user.role === "recruiter" && (
          <button
            className="primary-action"
            onClick={() => setPage("post-job")}
          >
            + Post a Job
          </button>
        )}
      </div>

      <div className="dashboard-grid">

        <section className="feed">

          <div className="section-heading">
            <div>
              <h2>Recommended Jobs</h2>
              <p>Opportunities based on your profile</p>
            </div>

            <button
              className="text-button"
              onClick={() => setPage("jobs")}
            >
              View all →
            </button>
          </div>

          {jobs.length === 0 ? (
            <div className="empty-card">
              <div>💼</div>
              <h3>No jobs available</h3>
              <p>New opportunities will appear here.</p>
            </div>
          ) : (
            jobs.slice(0, 4).map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onView={viewJob}
              />
            ))
          )}

        </section>

        <aside className="right-panel">

          <div className="side-card">

            <h3>Profile Strength</h3>

            <div className="progress-container">

              <div className="progress-bar">
                <div style={{ width: `${score}%` }}></div>
              </div>

              <strong>{score}%</strong>

            </div>

            <p>
              {score === 100
                ? "Your profile is complete."
                : score >= 90
                  ? "Upload your CV to unlock the final 10%."
                  : "Complete your profile to get better job recommendations."}
            </p>

            <button onClick={() => setPage("profile")}>
              {score === 100
                ? "View Profile"
                : score >= 90
                  ? "Upload CV"
                  : "Complete Profile"}
            </button>

          </div>

          <div className="side-card">

            <h3>Quick Actions</h3>

            <div
              className="quick-action"
              onClick={() => setPage("jobs")}
            >
              <span>🔎</span>

              <div>
                <strong>Find Jobs</strong>
                <p>Explore opportunities</p>
              </div>
            </div>

            <div className="quick-action" onClick={() => setPage("network")}>
              <span>🤝</span>

              <div>
                <strong>Grow Network</strong>
                <p>Connect with professionals</p>
              </div>
            </div>

          </div>

          <div className="side-card tips-card">
            <span className="tip-icon">✨</span>
            <h3>Career Tip</h3>
            <p>
              Keep your profile updated with your latest skills and projects
              to improve your chances of getting noticed.
            </p>
          </div>

        </aside>

      </div>

    </main>
  )
}

export default Home
