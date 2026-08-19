function JobCard({ job, onView }) {
  return (
    <div className="home-job-card">

      <div className="company-logo">
        {job.company
          ? job.company.charAt(0).toUpperCase()
          : "C"}
      </div>

      <div className="job-card-main">

        <h3>{job.title}</h3>

        <p className="company-name">
          {job.company}
        </p>

        <div className="job-meta">
          <span>📍 {job.location || "Remote"}</span>
          <span>💼 {job.job_type || "Full Time"}</span>
          <span>💰 {job.salary || "Not specified"}</span>
        </div>

        <div className="skill-tags">

          {(job.skills || "")
            .split(",")
            .slice(0, 4)
            .map((skill, index) => (
              <span key={index}>
                {skill.trim()}
              </span>
            ))}

        </div>

        <p className="job-description">
          {job.description}
        </p>

        <div className="job-card-bottom">

          <span className="posted-text">
            Recently posted
          </span>

          <button onClick={() => onView(job)}>
            View Details
          </button>

        </div>

      </div>

    </div>
  )
}

export default JobCard