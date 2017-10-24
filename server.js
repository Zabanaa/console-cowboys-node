const express   = require("express")
const app       = express()
const port      = process.env.PORT || 3000
const bodyParser = require("body-parser")
const mongoose  = require("mongoose")
const Job       = require("./models/jobs")
const helpers   = require("./helpers")

mongoose.connect("mongodb://localhost/console_cowboys")

const db = mongoose.connection

// Middleware
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, X-Access-Token, Content-Type, Accept")
    next()
})

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.disable('x-powered-by')

// Check DB connection
db.once("open", () => console.log("Connected !") )

// Check DB Error
db.on("error", err => console.log(err) )

app.get("/jobs", (req, res) => {

    let jobs = Job.find({}, (err, jobs) => {
        if (err) console.log(err)
        return res.status(200).json(jobs)
    })
})

app.post("/jobs", (req, res) => {

    let body = req.body
    let job  = new Job()

    job.title           = req.body.title
    job.location        = req.body.location
    job.contract_type   = req.body.contract_type
    job.company_name    = req.body.company_name
    job.listing_url     = req.body.listing_url

    job.save()
        .then( job => {
            return res.status(201).json({
                "type": "success",
                "data": job
            })
        })
        .catch( err => {

            let errorMessage = err.message

            if (err.message.includes("duplicate key")) {
                return res.status(409).json({
                    "type": "error",
                    "message": "This listing URL already exists"
                })
            }
            else if (err.message.includes("enum")) {
                let fields = helpers.extractFields(err.message)
                console.log("Fields", fields)
                return res.status(422).json({
                    type: "error",
                    message: `${fields[0]} is not a valid ${fields[1]}`,
                    fields: fields,
                })
            }
            else if (err.message.includes("is required")) {
                let fields = helpers.extractFields(err.message)
                return res.status(422).json({
                    "type": "error",
                    "message": "Some fields are missing",
                    "missingFields": fields
                })
            }
            else {
                return res.status(500).json({
                    "type": "error",
                    "message": "Something happened server side",
                    "error": err.message
                })
            }
        })
})

app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})
