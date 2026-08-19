import { useEffect, useRef, useState } from "react"

function Profile() {
    const [profile, setProfile] = useState(null)
    const [editing, setEditing] = useState(false)
    const [message, setMessage] = useState("")
    const [uploadingImage, setUploadingImage] = useState(false)
    const [uploadingResume, setUploadingResume] = useState(false)

    const [name, setName] = useState("")
    const [headline, setHeadline] = useState("")
    const [about, setAbout] = useState("")
    const [location, setLocation] = useState("")

    const imageInputRef = useRef(null)
    const resumeInputRef = useRef(null)

    const token = localStorage.getItem("token")
    const API = "https://hireconnect-production-220e.up.railway.app"

    const loadProfile = async () => {
        try {
            const response = await fetch(`${API}/api/profile`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            const data = await response.json()

            if (response.ok) {
                setProfile(data)
                setName(data.name || "")
                setHeadline(data.headline || "")
                setAbout(data.about || "")
                setLocation(data.location || "")

                const currentUser = JSON.parse(localStorage.getItem("user") || "{}")

                localStorage.setItem(
                    "user",
                    JSON.stringify({
                        ...currentUser,
                        name: data.name,
                        email: data.email,
                        role: data.role,
                        profile_image: data.profile_image,
                        resume_file: data.resume_file
                    })
                )

                window.dispatchEvent(new Event("hireconnect-profile-updated"))
            } else {
                setMessage(data.message || "Failed to load profile")
            }
        } catch {
            setMessage("Cannot connect to server")
        }
    }

    useEffect(() => {
        loadProfile()
    }, [])

    const completion = () => {
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

    const updateProfile = async (e) => {
        e.preventDefault()

        try {
            const response = await fetch(`${API}/api/profile`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    name,
                    headline,
                    about,
                    location
                })
            })

            const data = await response.json()

            if (response.ok) {
                setMessage("Profile updated successfully")
                setEditing(false)
                await loadProfile()
            } else {
                setMessage(data.message)
            }
        } catch {
            setMessage("Cannot connect to server")
        }
    }

    const uploadImage = async (e) => {
        const file = e.target.files?.[0]
        if (!file) return

        const formData = new FormData()
        formData.append("profileImage", file)

        setUploadingImage(true)
        setMessage("")

        try {
            const response = await fetch(`${API}/api/profile/image`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: formData
            })

            const data = await response.json()

            if (response.ok) {
                setMessage("Profile image updated successfully")
                await loadProfile()
            } else {
                setMessage(data.message || "Image upload failed")
            }
        } catch {
            setMessage("Cannot connect to server")
        }

        setUploadingImage(false)
        e.target.value = ""
    }

    const uploadResume = async (e) => {
        const file = e.target.files?.[0]
        if (!file) return

        const formData = new FormData()
        formData.append("resume", file)

        setUploadingResume(true)
        setMessage("")

        try {
            const response = await fetch(`${API}/api/profile/resume`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: formData
            })

            const data = await response.json()

            if (response.ok) {
                setMessage("CV uploaded successfully. Profile is now 100% complete!")
                await loadProfile()
            } else {
                setMessage(data.message || "CV upload failed")
            }
        } catch {
            setMessage("Cannot connect to server")
        }

        setUploadingResume(false)
        e.target.value = ""
    }

    const removeResume = async () => {
        try {
            const response = await fetch(`${API}/api/profile/resume`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            const data = await response.json()
            setMessage(data.message)

            if (response.ok) {
                await loadProfile()
            }
        } catch {
            setMessage("Cannot connect to server")
        }
    }

    if (!profile) {
        return (
            <div className="profile-page">
                <p>Loading profile...</p>
            </div>
        )
    }

    const score = completion()

    return (
        <main className="profile-page">
            <div className="profile-header">
                <div className="profile-avatar profile-avatar-upload">
                    {profile.profile_image ? (
                        <img
                            src={`${API}${profile.profile_image}`}
                            alt={profile.name}
                        />
                    ) : (
                        profile.name
                            ? profile.name.charAt(0).toUpperCase()
                            : "U"
                    )}

                    <button
                        type="button"
                        className="profile-camera-button"
                        onClick={() => imageInputRef.current?.click()}
                        disabled={uploadingImage}
                        title="Upload profile photo"
                    >
                        {uploadingImage ? "..." : "📷"}
                    </button>

                    <input
                        ref={imageInputRef}
                        className="hidden-file-input"
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={uploadImage}
                    />
                </div>

                <div className="profile-header-info">
                    <h1>{profile.name}</h1>

                    <p>
                        {profile.headline ||
                            (profile.role === "recruiter"
                                ? "Recruiter"
                                : "Job Seeker")}
                    </p>

                    <span>
                        {profile.location || "Location not added"}
                    </span>
                </div>

                {!editing && (
                    <button
                        className="edit-profile-button"
                        onClick={() => setEditing(true)}
                    >
                        Edit Profile
                    </button>
                )}
            </div>

            {message && (
                <div className="profile-message">
                    {message}
                </div>
            )}

            <section className="profile-completion-card">
                <div className="profile-completion-top">
                    <div>
                        <span className="profile-completion-label">
                            PROFILE COMPLETION
                        </span>
                        <h2>{score}% Complete</h2>
                    </div>

                    <strong>{score}%</strong>
                </div>

                <div className="profile-completion-track">
                    <div style={{ width: `${score}%` }}></div>
                </div>

                <p>
                    {score === 100
                        ? "Your profile is complete."
                        : profile.resume_file
                            ? "Complete the remaining profile details to reach 100%."
                            : "Complete your profile to 90%, then upload your CV for the final 10%."}
                </p>
            </section>

            {editing ? (
                <form
                    className="profile-edit-card"
                    onSubmit={updateProfile}
                >
                    <h2>Edit Profile</h2>

                    <label>Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />

                    <label>Headline</label>
                    <input
                        type="text"
                        placeholder="e.g. Software Developer"
                        value={headline}
                        onChange={(e) => setHeadline(e.target.value)}
                    />

                    <label>Location</label>
                    <input
                        type="text"
                        placeholder="e.g. Mumbai"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                    />

                    <label>About</label>
                    <textarea
                        placeholder="Tell something about yourself..."
                        value={about}
                        onChange={(e) => setAbout(e.target.value)}
                    />

                    <div className="profile-form-actions">
                        <button type="submit">
                            Save Changes
                        </button>

                        <button
                            type="button"
                            onClick={() => setEditing(false)}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            ) : (
                <div className="profile-content">
                    <section className="profile-card">
                        <h2>About</h2>
                        <p>
                            {profile.about ||
                                "No information added yet."}
                        </p>
                    </section>

                    <section className="profile-card">
                        <h2>Contact Information</h2>

                        <div className="profile-info">
                            <div>
                                <strong>Email</strong>
                                <span>{profile.email}</span>
                            </div>

                            <div>
                                <strong>Location</strong>
                                <span>
                                    {profile.location || "Not added"}
                                </span>
                            </div>

                            <div>
                                <strong>Account Type</strong>
                                <span>
                                    {profile.role === "recruiter"
                                        ? "Recruiter"
                                        : "Job Seeker"}
                                </span>
                            </div>
                        </div>
                    </section>

                    <section className="profile-card resume-card">
                        <div className="resume-card-header">
                            <div>
                                <span className="resume-kicker">
                                    FINAL 10%
                                </span>
                                <h2>CV / Resume</h2>
                                <p>
                                    Upload your CV to complete your HireConnect profile.
                                </p>
                            </div>

                            <div className={`resume-score-badge ${profile.resume_file ? "complete" : ""}`}>
                                {profile.resume_file ? "+10%" : "10%"}
                            </div>
                        </div>

                        {profile.resume_file ? (
                            <div className="resume-uploaded-box">
                                <div className="resume-file-icon">📄</div>

                                <div className="resume-file-info">
                                    <strong>CV uploaded</strong>
                                    <span>Your profile can now reach 100%.</span>
                                </div>

                                <a
                                    href={`${API}${profile.resume_file}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="resume-view-button"
                                >
                                    View CV
                                </a>

                                <button
                                    type="button"
                                    className="resume-replace-button"
                                    onClick={() => resumeInputRef.current?.click()}
                                >
                                    Replace
                                </button>

                                <button
                                    type="button"
                                    className="resume-remove-button"
                                    onClick={removeResume}
                                >
                                    Remove
                                </button>
                            </div>
                        ) : (
                            <div
                                className="resume-dropzone"
                                onClick={() => resumeInputRef.current?.click()}
                            >
                                <div className="resume-upload-icon">⬆</div>
                                <h3>
                                    {uploadingResume
                                        ? "Uploading CV..."
                                        : "Upload your CV"}
                                </h3>
                                <p>PDF, DOC or DOCX • Maximum 10 MB</p>

                                <button
                                    type="button"
                                    disabled={uploadingResume}
                                >
                                    Choose CV
                                </button>
                            </div>
                        )}

                        <input
                            ref={resumeInputRef}
                            className="hidden-file-input"
                            type="file"
                            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                            onChange={uploadResume}
                        />
                    </section>
                </div>
            )}
        </main>
    )
}

export default Profile
