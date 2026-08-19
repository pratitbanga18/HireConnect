const db = require("../config/db")

const createJob = (req, res) => {
    const {
        title,
        company,
        description,
        skills,
        location,
        job_type,
        salary
    } = req.body

    if (req.user.role !== "recruiter") {
        return res.status(403).json({
            message: "Only recruiters can post jobs"
        })
    }

    if (!title || !company || !description || !skills) {
        return res.status(400).json({
            message: "Required fields are missing"
        })
    }

    const recruiterId = req.user.id

    const sql = `
        INSERT INTO jobs
        (recruiter_id, title, company, description, skills, location, job_type, salary)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `

    db.query(
        sql,
        [
            recruiterId,
            title,
            company,
            description,
            skills,
            location,
            job_type,
            salary
        ],
        (err, result) => {
            if (err) {
                console.log("JOB CREATION SQL ERROR:", err.code, err.sqlMessage)

                return res.status(500).json({
                    message: "Job creation failed"
                })
            }

            res.status(201).json({
                message: "Job posted successfully",
                jobId: result.insertId
            })
        }
    )
}

const getJobs = (req, res) => {
    const sql = "SELECT * FROM jobs ORDER BY created_at DESC"

    db.query(sql, (err, results) => {
        if (err) {
            console.log("GET JOBS SQL ERROR:", err.code, err.sqlMessage)

            return res.status(500).json({
                message: "Failed to fetch jobs"
            })
        }

        res.json(results)
    })
}

module.exports = {
    createJob,
    getJobs
}
