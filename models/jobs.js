const mongoose = require("mongoose")

const jobSchema = mongoose.Schema({

    title: { type: String, required: true },
    location: { type: String, required: true },
    contract_type: {
        type: String,
        enum: ["full-time", "freelance", "internship"],
        default: "full-time",
        required: true
    },
    company_name: { type: String, required: true },
    listing_url: { type: String, required: true, unique: true},
    is_remote: { type: Boolean, required: true, default: false},
    is_paid: { type: String, required: false, default: false },
    date_added: { type: String, required: true, default: Date.now },
    stripe_charge_id: { type: String, required: false },
})

let Job = mongoose.model("Job", jobSchema)

module.exports = Job
