import { useEffect, useState } from "react"

function Network({ setPage }) {
  const [connections, setConnections] = useState([])
  const [suggestions, setSuggestions] = useState([])
  const [pending, setPending] = useState([])
  const [stats, setStats] = useState({ connections: 0, pending: 0 })
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState("")

  const authHeader = {
    Authorization: `Bearer ${localStorage.getItem("token")}`
  }

  const loadAll = async () => {
    try {
      const [connRes, suggRes, pendRes, statsRes] = await Promise.all([
        fetch("http://localhost:5000/api/connections", { headers: authHeader }),
        fetch("http://localhost:5000/api/connections/suggestions", { headers: authHeader }),
        fetch("http://localhost:5000/api/connections/pending", { headers: authHeader }),
        fetch("http://localhost:5000/api/connections/stats", { headers: authHeader })
      ])

      setConnections(await connRes.json())
      setSuggestions(await suggRes.json())
      setPending(await pendRes.json())
      setStats(await statsRes.json())
    } catch {
      setMessage("Cannot connect to server")
    }

    setLoading(false)
  }

  useEffect(() => {
    loadAll()
  }, [])

  const sendRequest = async (receiverId) => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/connections/request",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...authHeader
          },
          body: JSON.stringify({ receiverId })
        }
      )

      const data = await response.json()
      setMessage(data.message)

      if (response.ok) {
        loadAll()
      }
    } catch {
      setMessage("Cannot connect to server")
    }
  }

  const respondRequest = async (connectionId, accept) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/connections/${connectionId}/${
          accept ? "accept" : "reject"
        }`,
        {
          method: accept ? "PUT" : "DELETE",
          headers: authHeader
        }
      )

      const data = await response.json()
      setMessage(data.message)

      if (response.ok) {
        loadAll()
      }
    } catch {
      setMessage("Cannot connect to server")
    }
  }

  const roleLabel = (person) =>
    person.headline || (person.role === "recruiter" ? "Recruiter" : "Job Seeker")

  if (loading) {
    return (
      <main className="network-page">
        <p>Loading your network...</p>
      </main>
    )
  }

  return (
    <main className="network-page">

      <div className="network-header">
        <div>
          <p className="page-label">PROFESSIONAL NETWORK</p>
          <h1>My Network</h1>
          <p>Connect with professionals and grow your career.</p>
        </div>

        <button onClick={() => setPage("dashboard")}>
          Back to Home
        </button>
      </div>

      {message && (
        <div className="network-message">
          {message}
        </div>
      )}

      <div className="network-stats">
        <div>
          <strong>{stats.connections}</strong>
          <span>Connections</span>
        </div>

        <div>
          <strong>{stats.pending}</strong>
          <span>Pending</span>
        </div>
      </div>

      {pending.length > 0 && (
        <div className="network-section">
          <h2>Pending requests</h2>

          <div className="people-grid">
            {pending.map((request) => (
              <div className="person-card" key={request.connection_id}>

                <div className="person-avatar">
                  {request.name.charAt(0)}
                </div>

                <h3>{request.name}</h3>

                <p>{roleLabel(request)}</p>

                <div className="request-actions">
                  <button onClick={() => respondRequest(request.connection_id, true)}>
                    Accept
                  </button>

                  <button onClick={() => respondRequest(request.connection_id, false)}>
                    Ignore
                  </button>
                </div>

              </div>
            ))}
          </div>
        </div>
      )}

      <div className="network-section">
        <h2>Your connections</h2>

        {connections.length === 0 ? (
          <p>You have no connections yet. Connect with people below.</p>
        ) : (
          <div className="people-grid">
            {connections.map((person) => (
              <div className="person-card" key={person.id}>

                <div className="person-avatar">
                  {person.name.charAt(0)}
                </div>

                <h3>{person.name}</h3>

                <p>{roleLabel(person)}</p>

                <span>{person.location || "Location not added"}</span>

              </div>
            ))}
          </div>
        )}
      </div>

      <div className="network-section">
        <h2>People you may know</h2>

        {suggestions.length === 0 ? (
          <p>No new suggestions right now.</p>
        ) : (
          <div className="people-grid">
            {suggestions.map((person) => (
              <div className="person-card" key={person.id}>

                <div className="person-avatar">
                  {person.name.charAt(0)}
                </div>

                <h3>{person.name}</h3>

                <p>{roleLabel(person)}</p>

                <span>{person.location || "Location not added"}</span>

                <button onClick={() => sendRequest(person.id)}>
                  + Connect
                </button>

              </div>
            ))}
          </div>
        )}
      </div>

    </main>
  )
}

export default Network
