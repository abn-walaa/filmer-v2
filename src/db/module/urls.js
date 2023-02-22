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
    }
})

let URLS = mongooes.model('URLS', sac)
module.exports = URLS