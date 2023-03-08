let mongooes = require('mongoose')

let sac = new mongooes.Schema({
    url: {
        type: String,
        unique: true,
        required: true
    },
    check: {
        type: Boolean,
        default: false
    },
    error: {
        type: Boolean,
        default: false
    },
    justMain: {
        type: Boolean,
        default: true
    }
})

let URLS = mongooes.model('URLS', sac)
module.exports = URLS