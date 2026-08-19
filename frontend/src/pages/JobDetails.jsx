import { useEffect, useState } from "react"

function JobDetails({ user, setPage }) {
  const [job, setJob] = useState(null)
  const [message, setMessage] = useState("")
  const [applied, setApplied] = useState(false)

  useEffect(() => {
    const selectedJob = localStorage.getItem("selectedJob")

    if (selectedJob) {
      setJob(JSON.parse(selectedJob))
    }
  }, [])

  const applyJob = async () => {
    if (!job) return

    try {
      const response = await fetch(
        "http://localhost:5000/api/applications",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`
          },
          body: JSON.stringify({
            jobId: job.id
          })
        }
      )

      const data = await response.json()

      if (response.ok) {
        setApplied(true)
        setMessage("Application submitted successfully!")
      } else {
        setMessage(data.message)
      }

    } catch {
      setMessage("Unable to submit application")
    }
  }

  if (!job) {
    return (
      <main className="job-details-page">
        <div className="empty-card">
          <h3>Job not found</h3>

          <button onClick={() => setPage("jobs")}>
            Back to Jobs
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="job-details-page">

      <button
        className="back-button"
        onClick={() => setPage("jobs")}
      >
        ← Back to Jobs
      </button>

      <div className="job-details-layout">

        <section className="job-details-main">

          <div className="job-hero">

            <div className="details-company-logo">
              {job.company
                ? job.company.charAt(0).toUpperCase()
                : "C"}
            </div>

            <div>
              <h1>{job.title}</h1>

              <p className="details-company">
                {job.company}
              </p>

              <div className="details-meta">
                <span>📍 {job.location || "Remote"}</span>
                <span>💼 {job.job_type || "Full Time"}</span>
                <span>💰 {job.salary || "Not specified"}</span>
              </div>
            </div>

          </div>

          <div className="details-card">

            <h2>About the Job</h2>

            <p className="long-description">
              {job.description}
            </p>

          </div>

          <div className="details-card">

            <h2>Skills & Requirements</h2>

            <div className="details-skills">

              {(job.skills || "")
                .split(",")
                .map((skill, index) => (
                  <span key={index}>
                    {skill.trim()}
                  </span>
                ))}

            </div>

          </div>

          <div className="details-card">

            <h2>About the Company</h2>

            <p>
              {job.company} is looking for talented professionals
              to join its growing team. This opportunity provides
              an excellent environment to develop your skills and
              build your professional career.
            </p>

          </div>

        </section>

        <aside className="job-details-sidebar">

          <div className="apply-card">

            <h2>
              Interested in this opportunity?
            </h2>

            {user.role === "jobseeker" ? (
              <button
                className={
                  applied
                    ? "apply-button applied"
                    : "apply-button"
                }
                onClick={applyJob}
                disabled={applied}
              >
                {applied
                  ? "✓ Applied"
                  : "Apply Now"}
              </button>
            ) : (
              <p>
                Recruiters cannot apply to jobs.
              </p>
            )}

            {message && (
              <div className="application-message">
                {message}
              </div>
            )}

          </div>

          <div className="details-side-card">

            <h3>Job Overview</h3>

            <div className="overview-item">
              <span>💼</span>
              <div>
                <small>Job Type</small>
                <strong>
                  {job.job_type || "Full Time"}
                </strong>
              </div>
            </div>

            <div className="overview-item">
              <span>📍</span>
              <div>
                <small>Location</small>
                <strong>
                  {job.location || "Remote"}
                </strong>
              </div>
            </div>

            <div className="overview-item">
              <span>💰</span>
              <div>
                <small>Salary</small>
                <strong>
                  {job.salary || "Not specified"}
                </strong>
              </div>
            </div>

          </div>

        </aside>

      </div>

    </main>
  )
}

export default JobDetails