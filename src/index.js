let express = require('express')
const { it } = require('node:test')
let app = express()
const path = require('path')
const request = require('request');
let jsdom = require('jsdom');
const { URLSearchParams } = require('url');
const publicDirectoryPath = path.join(__dirname, '../public')
let fs = require('fs');
let hbs = require('hbs')
const exp = require('constants');
const e = require('express');
app.use(express.static(publicDirectoryPath))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const viewsPath = path.join(__dirname, '../public/')
app.set('views', viewsPath)
hbs.registerPartials(viewsPath)
app.post('/serach/', async (req, res) => {
    try {
        let item = req.body.item;
        console.log(item)
        let ok = await a(item)
        console.log(ok)
        res.send(ok)
    } catch (error) {
        res.status(400).send(error)
    }

})

app.set('view engine', 'hbs')
app.post('/get/', async (req, res) => {
    try {
        res.send(await getvideo(req.body.url))
    } catch (error) {
        res.status(400).send()
    }

})
app.get('/watch/:id', async (req, res) => {
    let html = ''
    let url = await getvideo(encodeURI('https://mycimaaa.click/watch/' + req.params.id))
    console.log(url)
    console.log(url.data)
    url.data.forEach(e => {
        let v;
        try {
            v = e.match(/\.\d+p\./ig)[0]
            html += `<p class=${v} value=${e} id="q"> ${v} </p>`
        } catch (error) {
            v = e

        }

    });
    let sub = '';
    url.sub.forEach(e => {
        sub += '<div>'
        sub += '<img src=' + e.pic + '>'
        sub += '<h1>' + e.title + '</h1>'
        sub += '<button class=goto value=' + e.url.slice(29) + '>WaTch</button>'
        sub += '</div>'
    })
    res.render('video', { h1: url.data[0], html, sub, title: url.title })
})
let port = process.env.PROT || 3000
app.listen(port)



// f

async function a(key) {
    let k = []
    console.log('https://mycimaaa.click/AjaxCenter/Searching/' + key)
    let s = await new Promise(async (resolve, reject) => {
        request.get('https://mycimaaa.click/AjaxCenter/Searching/' + encodeURI(key), { json: true }, (e, re, body) => {
            if (e) {
                return reject(e)

            }
            let doc = new jsdom.JSDOM(`<!DOCTYPE html>
<html>

<head>
    <meta charset='utf-8'>
    <meta http-equiv='X-UA-Compatible' content='IE=edge'>
    <title>Page Title</title>
    <meta name='viewport' content='width=device-width, initial-scale=1'>
    <link rel='stylesheet' type='text/css' media='screen' href='main.css'>
    <script src='main.js'></script>
</head>
<body> ${body.output} </body>

</html>`, { contentType: "text/html" })

            Array.from(doc.window.document.querySelectorAll('.GridItem a')).map((e) => {
                k.push({
                    title: e.textContent,
                    url: e.href,
                    pic: e.querySelector('span').getAttribute('data-lazy-style').split('(')[1].slice(0, -2)
                })
            })

            resolve('ok')
        })

    })
    console.log(s.pic)
    return k;
}

async function getvideo(url) {
    let data = await new Promise((resolve, reject) => {
        request.get(url, { json: true }, (e, re, body) => {
            if (e) {
                reject(e)
            }
            let k = []
            let doc = new jsdom.JSDOM(body, { contentType: "text/html" })
            Array.from(doc.window.document.querySelectorAll('.GridItem a')).map((e) => {
                k.push({
                    title: e.textContent,
                    url: e.href,
                    pic: e.querySelector('span').getAttribute('data-lazy-style').split('(')[1].slice(0, -2)
                })
            })

            resolve({
                data: body.match(/https:\/\/upbam.org\/[A-Z|0-9|a-z]+\/[A-Z|0-9|a-z|.|?|=|\-|_|\&]+/ig),
                sub: k,
                title: doc.window.document.querySelector('.Title--Content--Single-begin h1').textContent,

            })

        })
    })
    return data
}