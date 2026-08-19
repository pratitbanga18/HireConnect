import { useEffect, useState } from "react"

function MyApplications({ setPage }) {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState("")

  const loadApplications = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/applications/my",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      )

      const data = await response.json()

      if (response.ok) {
        setApplications(data)
      } else {
        setMessage(data.message)
      }
    } catch {
      setMessage("Cannot connect to server")
    }

    setLoading(false)
  }

  useEffect(() => {
    loadApplications()
  }, [])

  const viewJob = (application) => {
    localStorage.setItem(
      "selectedJob",
      JSON.stringify({
        id: application.job_id,
        title: application.title,
        company: application.company,
        location: application.location,
        job_type: application.job_type,
        salary: application.salary,
        description: application.description,
        skills: application.skills
      })
    )

    setPage("job-details")
  }

  if (loading) {
    return (
      <main className="applications-page">
        <div className="applications-loading">
          <div className="loading-spinner"></div>
          <p>Loading your applications...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="applications-page">

      <div className="applications-header">
        <div>
          <span className="page-label">CAREER TRACKER</span>
          <h1>My Applications</h1>
          <p>Track and manage the jobs you've applied for.</p>
        </div>

        <button
          className="find-jobs-button"
          onClick={() => setPage("jobs")}
        >
          Find More Jobs
          <span>→</span>
        </button>
      </div>

      {message && (
        <div className="applications-message">
          {message}
        </div>
      )}

      <div className="application-stats">

        <div className="application-stat">
          <div className="stat-icon">📄</div>
          <div>
            <strong>{applications.length}</strong>
            <span>Total Applications</span>
          </div>
        </div>

        <div className="application-stat">
          <div className="stat-icon">✓</div>
          <div>
            <strong>
              {applications.filter(
                (app) => app.status === "Accepted"
              ).length}
            </strong>
            <span>Accepted</span>
          </div>
        </div>

        <div className="application-stat">
          <div className="stat-icon">◷</div>
          <div>
            <strong>
              {applications.filter(
                (app) => app.status === "Applied"
              ).length}
            </strong>
            <span>In Review</span>
          </div>
        </div>

        <div className="application-stat">
          <div className="stat-icon">×</div>
          <div>
            <strong>
              {applications.filter(
                (app) => app.status === "Rejected"
              ).length}
            </strong>
            <span>Rejected</span>
          </div>
        </div>

      </div>

      {applications.length === 0 ? (
        <div className="applications-empty">
          <div className="empty-icon">📋</div>
          <h2>No applications yet</h2>
          <p>
            Start exploring jobs and apply to opportunities
            that match your skills.
          </p>
          <button onClick={() => setPage("jobs")}>
            Explore Jobs →
          </button>
        </div>
      ) : (
        <div className="applications-list">

          <div className="applications-list-header">
            <h2>Your Applications</h2>
            <span>{applications.length} applications</span>
          </div>

          {applications.map((application) => (

            <div
              className="application-card"
              key={application.id}
            >

              <div className="application-company-logo">
                {application.company
                  ? application.company.charAt(0).toUpperCase()
                  : "C"}
              </div>

              <div className="application-main">

                <div className="application-top">

                  <div>
                    <h2>{application.title}</h2>
                    <p className="application-company">
                      {application.company}
                    </p>
                  </div>

                  <span
                    className={`application-status ${application.status.toLowerCase()}`}
                  >
                    {application.status === "Accepted" && "✓ "}
                    {application.status === "Rejected" && "× "}
                    {application.status === "Applied" && "◷ "}
                    {application.status}
                  </span>

                </div>

                <div className="application-meta">

                  <span>
                    📍 {application.location || "Remote"}
                  </span>

                  <span>
                    💼 {application.job_type || "Full Time"}
                  </span>

                  <span>
                    💰 {application.salary || "Not specified"}
                  </span>

                </div>

                <div className="application-bottom">

                  <span className="applied-date">
                    Applied on{" "}
                    {new Date(
                      application.applied_at
                    ).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric"
                    })}
                  </span>

                  <button
                    className="view-job-button"
                    onClick={() => viewJob(application)}
                  >
                    View Job
                    <span>→</span>
                  </button>

                </div>

              </div>

            </div>

          ))}

        </div>
      )}

    </main>
  )
}

export default MyApplications