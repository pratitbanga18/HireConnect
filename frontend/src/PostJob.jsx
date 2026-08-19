import { useState } from "react"

function PostJob({ user, setPage }) {
  const [title, setTitle] = useState("")
  const [company, setCompany] = useState("")
  const [description, setDescription] = useState("")
  const [skills, setSkills] = useState("")
  const [location, setLocation] = useState("")
  const [jobType, setJobType] = useState("Full Time")
  const [salary, setSalary] = useState("")
  const [message, setMessage] = useState("")

  const postJob = async (e) => {
    e.preventDefault()

    try {
        const response = await fetch(
            "http://localhost:5000/api/jobs",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({
                    title,
                    company,
                    description,
                    skills,
                    location,
                    job_type: jobType,
                    salary
                })
            }
        )

        const data = await response.json()

        if (response.ok) {
            setMessage("Job posted successfully!")

            setTitle("")
            setCompany("")
            setDescription("")
            setSkills("")
            setLocation("")
            setSalary("")
        } else {
            setMessage(data.message)
        }
    } catch {
        setMessage("Cannot connect to server")
    }
  }

  return (
    <div className="post-job-page">
      <div className="post-job-box">
        <h1>Post a Job</h1>

        <p>
          Find the right candidate for your organization.
        </p>

        <form onSubmit={postJob}>
          <label>Job Title</label>

          <input
            type="text"
            placeholder="e.g. Software Developer"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <label>Company</label>

          <input
            type="text"
            placeholder="e.g. Google"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            required
          />

          <label>Job Description</label>

          <textarea
            placeholder="Describe the job role and responsibilities"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          <label>Skills</label>

          <input
            type="text"
            placeholder="e.g. React, Node.js, MySQL"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            required
          />

          <label>Location</label>

          <input
            type="text"
            placeholder="e.g. Mumbai"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />

          <label>Job Type</label>

          <select
            value={jobType}
            onChange={(e) => setJobType(e.target.value)}
          >
            <option>Full Time</option>
            <option>Part Time</option>
            <option>Internship</option>
            <option>Remote</option>
            <option>Contract</option>
          </select>

          <label>Salary</label>

          <input
            type="text"
            placeholder="e.g. ₹6 - ₹10 LPA"
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
          />

          <button type="submit">
            Post Job
          </button>
        </form>

        {message && (
          <p className="job-message">
            {message}
          </p>
        )}

        <button
          className="back-button"
          onClick={() => setPage("dashboard")}
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  )
}

export default PostJob