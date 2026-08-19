import { useEffect, useState } from "react"

function Applicants() {
    const [applications, setApplications] = useState([])
    const [loading, setLoading] = useState(true)
    const [message, setMessage] = useState("")

    const loadApplications = () => {
        fetch("http://localhost:5000/api/applications", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        })
            .then((response) => response.json())
            .then((data) => {
                if (Array.isArray(data)) {
                    setApplications(data)
                } else {
                    setMessage(data.message || "Failed to load applications")
                }

                setLoading(false)
            })
            .catch(() => {
                setMessage("Cannot connect to server")
                setLoading(false)
            })
    }

    useEffect(() => {
        loadApplications()
    }, [])

    const updateStatus = async (id, status) => {
        try {
            const response = await fetch(
                `http://localhost:5000/api/applications/${id}/status`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    },
                    body: JSON.stringify({
                        status
                    })
                }
            )

            const data = await response.json()

            setMessage(data.message)

            if (response.ok) {
                loadApplications()
            }
        } catch {
            setMessage("Cannot connect to server")
        }
    }

    if (loading) {
        return (
            <div className="applicants-page">
                <p>Loading applicants...</p>
            </div>
        )
    }

    return (
        <div className="applicants-page">

            <h1>Applicants</h1>

            <p className="applicants-subtitle">
                Manage candidates who applied for your jobs.
            </p>

            {message && (
                <div className="applicant-message">
                    {message}
                </div>
            )}

            {applications.length === 0 ? (
                <div className="no-applicants">
                    <h2>No applicants yet</h2>

                    <p>
                        Candidates who apply for your jobs will appear here.
                    </p>
                </div>
            ) : (
                <div className="applicant-list">

                    {applications.map((application) => (

                        <div
                            className="applicant-card"
                            key={application.id}
                        >

                            <div className="applicant-header">

                                <div className="applicant-avatar">
                                    {application.name
                                        ? application.name.charAt(0).toUpperCase()
                                        : "U"}
                                </div>

                                <div>
                                    <h2>{application.name}</h2>

                                    <p>
                                        {application.email}
                                    </p>
                                </div>

                            </div>

                            <div className="application-info">

                                <div>
                                    <strong>Job</strong>
                                    <span>{application.title}</span>
                                </div>

                                <div>
                                    <strong>Company</strong>
                                    <span>{application.company}</span>
                                </div>

                                <div>
                                    <strong>Applied On</strong>
                                    <span>
                                        {new Date(
                                            application.applied_at
                                        ).toLocaleDateString()}
                                    </span>
                                </div>

                                <div>
                                    <strong>Status</strong>

                                    <span
                                        className={`status ${application.status.toLowerCase()}`}
                                    >
                                        {application.status}
                                    </span>
                                </div>

                            </div>

                            <div className="applicant-actions">

                                <button
                                    className="accept-button"
                                    onClick={() =>
                                        updateStatus(
                                            application.id,
                                            "Accepted"
                                        )
                                    }
                                    disabled={application.status === "Accepted"}
                                >
                                    Accept
                                </button>

                                <button
                                    className="reject-button"
                                    onClick={() =>
                                        updateStatus(
                                            application.id,
                                            "Rejected"
                                        )
                                    }
                                    disabled={application.status === "Rejected"}
                                >
                                    Reject
                                </button>

                            </div>

                        </div>

                    ))}

                </div>
            )}

        </div>
    )
}

export default Applicants