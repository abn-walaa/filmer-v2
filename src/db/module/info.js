let mongooes = require('mongoose')

let sac = new mongooes.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
    },
    type: {
        type: String,

    },
    pic: {
        type: String,
        required: true
    },
    story: {
        type: String,

    },
    dataFilm: {
        q: {
            type: String,

        },
        section: { type: String },
        year: {
            type: String
        },
        types: [{
            name: String
        }]
    },
    Teams: [{
        name: {
            type: String
        },
        pic: {
            type: String
        }
    }],
    myvid: {
        type: String
    },
    upbom: {
        type: String
    }
})

let Filme = mongooes.model('Filmes', sac)
module.exports = Filme