import { useEffect, useState } from "react"

function Jobs({ setPage }) {
    const [jobs, setJobs] = useState([])
    const [loading, setLoading] = useState(true)
    const [message, setMessage] = useState("")

    const [search, setSearch] = useState(() => {
        const saved = localStorage.getItem("jobSearch") || ""
        localStorage.removeItem("jobSearch")
        return saved
    })
    const [location, setLocation] = useState("")
    const [jobType, setJobType] = useState("")

    useEffect(() => {
        fetch("https://hireconnect-production-220e.up.railway.app/api/jobs")
            .then((response) => response.json())
            .then((data) => {
                setJobs(data)
                setLoading(false)
            })
            .catch(() => {
                setLoading(false)
                setMessage("Cannot connect to server")
            })
    }, [])

    const applyJob = async (jobId) => {
        try {
            const response = await fetch(
                "https://hireconnect-production-220e.up.railway.app/api/applications",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    },
                    body: JSON.stringify({
                        jobId
                    })
                }
            )

            const data = await response.json()

            setMessage(data.message)
        } catch {
            setMessage("Cannot connect to server")
        }
    }

    const viewJob = (job) => {
        localStorage.setItem("selectedJob", JSON.stringify(job))
        setPage("job-details")
    }

    const filteredJobs = jobs.filter((job) => {
        const searchText = search.toLowerCase()

        const matchesSearch =
            job.title.toLowerCase().includes(searchText) ||
            job.company.toLowerCase().includes(searchText) ||
            (job.skills || "").toLowerCase().includes(searchText)

        const matchesLocation =
            !location ||
            (job.location || "").toLowerCase() === location.toLowerCase()

        const matchesJobType =
            !jobType ||
            (job.job_type || "Full Time").toLowerCase() ===
                jobType.toLowerCase()

        return matchesSearch && matchesLocation && matchesJobType
    })

    const locations = [
        ...new Set(
            jobs
                .map((job) => job.location)
                .filter((location) => location)
        )
    ]

    const clearFilters = () => {
        setSearch("")
        setLocation("")
        setJobType("")
    }

    if (loading) {
        return (
            <div className="jobs-page">
                <p>Loading jobs...</p>
            </div>
        )
    }

    return (
        <div className="jobs-page">

            <h1>Find Jobs</h1>

            <p className="jobs-subtitle">
                Discover opportunities that match your skills.
            </p>

            <div className="job-filters">

                <input
                    type="text"
                    placeholder="Search jobs, companies or skills..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                >
                    <option value="">All Locations</option>

                    {locations.map((item) => (
                        <option key={item} value={item}>
                            {item}
                        </option>
                    ))}
                </select>

                <select
                    value={jobType}
                    onChange={(e) => setJobType(e.target.value)}
                >
                    <option value="">All Job Types</option>
                    <option value="Full Time">Full Time</option>
                    <option value="Part Time">Part Time</option>
                    <option value="Internship">Internship</option>
                    <option value="Remote">Remote</option>
                    <option value="Contract">Contract</option>
                </select>

                <button
                    className="clear-filter-button"
                    onClick={clearFilters}
                >
                    Clear Filters
                </button>

            </div>

            {message && (
                <div className="job-message">
                    {message}
                </div>
            )}

            <p className="job-count">
                {filteredJobs.length} job
                {filteredJobs.length !== 1 ? "s" : ""} found
            </p>

            {filteredJobs.length === 0 ? (
                <div className="no-jobs">
                    <h2>No jobs found</h2>

                    <p>
                        Try changing your search or filters.
                    </p>

                    <button onClick={clearFilters}>
                        Clear Filters
                    </button>
                </div>
            ) : (
                <div className="job-list">

                    {filteredJobs.map((job) => (

                        <div
                            className="job-card"
                            key={job.id}
                        >

                            <h2>
                                {job.title}
                            </h2>

                            <h3>
                                {job.company}
                            </h3>

                            <p>
                                {job.description}
                            </p>

                            <div className="job-details">

                                <span>
                                    📍 {job.location || "Not specified"}
                                </span>

                                <span>
                                    💼 {job.job_type || "Full Time"}
                                </span>

                                <span>
                                    💰 {job.salary || "Not specified"}
                                </span>

                            </div>

                            <p className="skills">
                                <strong>Skills:</strong> {job.skills}
                            </p>

                            <div className="job-actions">

                                <button
                                    onClick={() => viewJob(job)}
                                >
                                    View Details
                                </button>

                                <button
                                    onClick={() => applyJob(job.id)}
                                >
                                    Apply Now
                                </button>

                            </div>

                        </div>

                    ))}

                </div>
            )}

        </div>
    )
}

export default Jobs
