const mongoose = require('mongoose')

const Schema = mongoose.Schema

const pelangganSchema = new Schema({
    date: {
        type: Date,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true
    },
}, { timestamps: true })

module.exports = mongoose.model('Pelanggan', pelangganSchema)

