const mongoose = require('mongoose')

const messageSchema = mongoose.Schema({
    message: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['unverified', 'approved'],
        default: 'unverified',
    },
}, {
    timestamps: true,
})

module.exports = mongoose.model('Message', messageSchema);