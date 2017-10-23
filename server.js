const express   = require("express")
const app       = express()
const port      = process.env.PORT || 3000
const bodyParser = require("body-parser")
const mongoose  = require("mongoose")
const Job       = require("./models/jobs")

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

app.get("/", (req, res) => {

    let jobs = Job.find({}, (err, jobs) => {
        if (err) console.log(err)
        return res.status(200).json(jobs)
    })
})

app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})
