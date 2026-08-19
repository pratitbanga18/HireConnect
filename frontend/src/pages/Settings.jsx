import { useState } from "react"

function Settings({ user, logout }) {
  const [message, setMessage] = useState("")

  const saveSettings = () => {
    setMessage("Settings saved successfully")
  }

  return (
    <main className="settings-page">

      <div className="settings-header">
        <p className="page-label">ACCOUNT</p>
        <h1>Settings</h1>
        <p>Manage your HireConnect account and preferences.</p>
      </div>

      {message && (
        <div className="settings-message">
          {message}
        </div>
      )}

      <div className="settings-layout">

        <section className="settings-card">

          <h2>Account Information</h2>
          <p className="settings-description">
            Your basic account information.
          </p>

          <div className="setting-row">
            <div>
              <strong>Name</strong>
              <span>{user.name}</span>
            </div>
          </div>

          <div className="setting-row">
            <div>
              <strong>Email</strong>
              <span>{user.email}</span>
            </div>
          </div>

          <div className="setting-row">
            <div>
              <strong>Account Type</strong>
              <span>
                {user.role === "recruiter"
                  ? "Recruiter"
                  : "Job Seeker"}
              </span>
            </div>
          </div>

        </section>

        <section className="settings-card">

          <h2>Preferences</h2>
          <p className="settings-description">
            Customize your experience.
          </p>

          <div className="toggle-row">
            <div>
              <strong>Email Notifications</strong>
              <span>Receive important updates by email.</span>
            </div>

            <input type="checkbox" defaultChecked />
          </div>

          <div className="toggle-row">
            <div>
              <strong>Job Recommendations</strong>
              <span>Get personalized job suggestions.</span>
            </div>

            <input type="checkbox" defaultChecked />
          </div>

          <button
            className="save-settings"
            onClick={saveSettings}
          >
            Save Preferences
          </button>

        </section>

        <section className="settings-card danger-card">

          <h2>Account Actions</h2>

          <p>
            Sign out from your HireConnect account on this device.
          </p>

          <button
            className="logout-settings"
            onClick={logout}
          >
            Sign Out
          </button>

        </section>

      </div>

    </main>
  )
}

export default Settings