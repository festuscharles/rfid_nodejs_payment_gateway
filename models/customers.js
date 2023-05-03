const mongoose = require("mongoose")
const Schema = mongoose.Schema

const customerSchema = new Schema ({
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    tagId: {
        type: String,
        required: true
    }
}, { timestamp: true })

exports.Customer = mongoose.model('Customer', customerSchema)