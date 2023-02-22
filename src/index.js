let express = require('express')
let app = express()
const path = require('path')
const request = require('request');
let jsdom = require('jsdom');
const publicDirectoryPath = path.join(__dirname, '../public')
let fs = require('fs');
let hbs = require('hbs');
const { urlencoded } = require('express');
let bodyPareser = require('body-parser')
app.use(express.static(publicDirectoryPath))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(bodyPareser.urlencoded({ extended: false }))
const viewsPath = path.join(__dirname, '../public/')
let cloudscraper = require('cloudscraper')
app.set('views', viewsPath)
hbs.registerPartials(viewsPath)

let p = require('proxifly')
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
app.get('/hello', (req, res) => {
    fetch('http://localhost:3000/file', {
        method: "post",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            sreach: 's'
        })

    }, function (er, re, body) {
        console.log(body)
    })
    res.send()
})
app.set('view engine', 'hbs')
app.post('/get/', async (req, res) => {
    try {

        res.send(await getvideo(encodeURI('https://myciiima.autos/watch/' + req.body.url)))
    } catch (error) {
        res.status(400).send()
    }
})
app.post('/file', async (req, res) => {
    console.log(req.headers)


    let data = await a(req.body.sreach)
    console.log(data)


    res.render('v', { data })
})
app.get('/watch/:id', async (req, res) => {
    let html = ''
    let url = await getvideo(encodeURI('https://myciiima.autos/watch/' + req.params.id))
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
let port = process.env.PORT || 3000
app.listen(port, () => {
    console.log('server runing on ' + port)
})

let cp = require('cloudflare-bypasser')
let got = new cp()
async function a(key) {
    let k = []



    console.log('https://myciiima.autos/AjaxCenter/Searching/' + encodeURI(key) + '/')
    let s = await new Promise(async (resolve, reject) => {

        request.get(
            'https://myciiima.autos/AjaxCenter/Searching/' + encodeURI(key) + '/', {
            headers: {
                'user-agent': got._userAgent,
                'access-control-allow-origin': '*',
                'cf-cache-status': 'DYNAMIC',
                'cf-ray': '78c2bd92fb09ac2b-XNH',
                'content-encoding': 'br',
                'content-type': 'text/html; charset=UTF-8',
                date: new Date(),
                'report-to': {
                    "endpoints": [{ "url": "https://a.nel.cloudflare.com/report/v3?s=t8oBasY7mK9Lhfkw%2FAn14OBEJXH7C1%2FCYleXbJr%2FvErqGi9BKeAlfpseI%2FDGB88tDQW2Mu%2Bt7jcG91xQ%2BZY7ltM5VuMFgi20HrfX3Dyoy9urAAcWC1ze%2B%2BxWgWSHjFpp3g%3D%3D" }]
                },

            }
        },
            function (e, re, body) {
                if (e) {
                    return reject(e)
                }
                console.log(re.statusCode)
                if (re.statusCode === 403) {
                    return reject('error//')
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
    <body> ${JSON.parse(body).output} </body >

    </html > `, { contentType: "text/html" })

                Array.from(doc.window.document.querySelectorAll('.GridItem a')).map((e) => {
                    k.push({
                        title: e.textContent,
                        url: e.href.slice(29),
                        pic: e.querySelector('span').getAttribute('data-lazy-style').split('(')[1].slice(0, -2)
                    })
                })

                resolve('ok')
            })

    })

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


async function a2() {
    let c = 0;


    while (true) {
        let data = await a('a')
        console.log(data)
        if (data.length > 0) {
            c++
        }
        console.log(c)

    }
}





async function ddos() {
    let s = 0
    while (true) {
        await new Promise((resolve, reject) => {
            request.post('https://admiring-stonebraker.3-86-102-2.plesk.page/serach', {

                body: {
                    "item": "a"
                },
                json: true,

            }, function (er, res, body) {

                if (body.length() > 1) {
                    console.log(body)
                    s++
                }
                resolve('s')
            })
        })
        console.log(s)
    }

}
const CloudflareBypasser = require('cloudflare-bypasser');
let cf = new CloudflareBypasser();
async function A3() {
    const fetch = require('node-fetch');

    // get your subscription key at https://rapidapi.com/restyler/api/scrapeninja from "Code generator",
    // copy&paste it to 'x-rapidapi-key' header below 

    let req = fetch('https://scrapeninja.p.rapidapi.com/scrape', {
        method: 'POST',
        headers:
        {
            "Content-Type": "application/json",
            "x-rapidapi-host": "scrapeninja.p.rapidapi.com",
            "x-rapidapi-key": "ef34d39b00msh28712b13607b5a4p1a1688jsnd60fb52edb3c"
        },
        body: JSON.stringify({
            "url": "https://mycimaaa.click"
        })

    });
    req.then((res) => res.json()).then(json => console.log(json))


}

a('a')