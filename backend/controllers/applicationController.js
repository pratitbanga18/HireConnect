const db = require("../config/db")

const applyJob = (req, res) => {
    const { jobId } = req.body
    const applicantId = req.user.id

    if (!jobId) {
        return res.status(400).json({
            message: "Job is required"
        })
    }

    if (req.user.role !== "jobseeker") {
        return res.status(403).json({
            message: "Only job seekers can apply"
        })
    }

    const checkSql = `
        SELECT * FROM applications
        WHERE job_id = ? AND applicant_id = ?
    `

    db.query(checkSql, [jobId, applicantId], (err, results) => {
        if (err) {
            return res.status(500).json({
                message: "Database error"
            })
        }

        if (results.length > 0) {
            return res.status(400).json({
                message: "You have already applied for this job"
            })
        }

        const sql = `
            INSERT INTO applications (job_id, applicant_id)
            VALUES (?, ?)
        `

        db.query(sql, [jobId, applicantId], (err, result) => {
            if (err) {
                return res.status(500).json({
                    message: "Application failed"
                })
            }

            const jobSql = "SELECT title, recruiter_id FROM jobs WHERE id = ?"

            db.query(jobSql, [jobId], (err2, jobResults) => {
                if (!err2 && jobResults.length > 0) {
                    const { title, recruiter_id } = jobResults[0]

                    const notifSql = `
                        INSERT INTO notifications (user_id, type, title, text, link_page)
                        VALUES (?, 'application', 'New application received', ?, 'applicants')
                    `

                    db.query(notifSql, [
                        recruiter_id,
                        `Someone applied for your job posting: ${title}`
                    ])
                }
            })

            res.status(201).json({
                message: "Application submitted successfully",
                applicationId: result.insertId
            })
        })
    })
}

const getApplications = (req, res) => {
    if (req.user.role !== "recruiter") {
        return res.status(403).json({
            message: "Only recruiters can view applicants"
        })
    }

    const recruiterId = req.user.id

    const sql = `
        SELECT
            applications.id,
            applications.status,
            applications.applied_at,
            jobs.id AS job_id,
            jobs.title,
            jobs.company,
            jobs.recruiter_id,
            users.id AS applicant_id,
            users.name,
            users.email
        FROM applications
        JOIN jobs ON applications.job_id = jobs.id
        JOIN users ON applications.applicant_id = users.id
        WHERE jobs.recruiter_id = ?
        ORDER BY applications.applied_at DESC
    `

    db.query(sql, [recruiterId], (err, results) => {
        if (err) {
            return res.status(500).json({
                message: "Failed to fetch applications"
            })
        }

        res.json(results)
    })
}

const getMyApplications = (req, res) => {
    if (req.user.role !== "jobseeker") {
        return res.status(403).json({
            message: "Only job seekers can view their applications"
        })
    }

    const applicantId = req.user.id

    const sql = `
        SELECT
            applications.id,
            applications.status,
            applications.applied_at,
            jobs.id AS job_id,
            jobs.title,
            jobs.company,
            jobs.description,
            jobs.skills,
            jobs.location,
            jobs.job_type,
            jobs.salary
        FROM applications
        JOIN jobs ON applications.job_id = jobs.id
        WHERE applications.applicant_id = ?
        ORDER BY applications.applied_at DESC
    `

    db.query(sql, [applicantId], (err, results) => {
        if (err) {
            return res.status(500).json({
                message: "Failed to fetch your applications"
            })
        }

        res.json(results)
    })
}

const updateApplicationStatus = (req, res) => {
    if (req.user.role !== "recruiter") {
        return res.status(403).json({
            message: "Only recruiters can update applications"
        })
    }

    const { id } = req.params
    const { status } = req.body
    const recruiterId = req.user.id

    if (!["Accepted", "Rejected", "Applied"].includes(status)) {
        return res.status(400).json({
            message: "Invalid application status"
        })
    }

    const sql = `
        UPDATE applications
        JOIN jobs ON applications.job_id = jobs.id
        SET applications.status = ?
        WHERE applications.id = ?
        AND jobs.recruiter_id = ?
    `

    db.query(sql, [status, id, recruiterId], (err, result) => {
        if (err) {
            return res.status(500).json({
                message: "Failed to update application"
            })
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Application not found"
            })
        }

        const infoSql = `
            SELECT applications.applicant_id, jobs.title
            FROM applications
            JOIN jobs ON applications.job_id = jobs.id
            WHERE applications.id = ?
        `

        db.query(infoSql, [id], (err2, rows) => {
            if (!err2 && rows.length > 0) {
                const { applicant_id, title } = rows[0]

                const notifSql = `
                    INSERT INTO notifications (user_id, type, title, text, link_page)
                    VALUES (?, 'application', 'Application update', ?, 'applications')
                `

                db.query(notifSql, [
                    applicant_id,
                    `Your application for "${title}" was ${status.toLowerCase()}.`
                ])
            }
        })

        res.json({
            message: `Application ${status.toLowerCase()} successfully`
        })
    })
}

module.exports = {
    applyJob,
    getApplications,
    getMyApplications,
    updateApplicationStatus
}
