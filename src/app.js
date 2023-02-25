let jsdom = require('jsdom');

// اتصال الداتا بيس
require('./db/conntion')
// موديل الخاص بالروابط
let Urls = require('./db/module/urls')
let Filme = require('./db/module/info')


const request = require('request');
async function getUrlsFimles() {
    console.log('hello')
    for (let i = 1; i < 460; i++) {
        try {
            let body;
            await new Promise((resolve, reject) => {
                request.get('https://cimaaa4u.click/category/%d8%a7%d9%81%d9%84%d8%a7%d9%85-%d8%a7%d8%ac%d9%86%d8%a8%d9%8a-movies7-english/page/' + i + '/', {
                    json: true, "headers": {
                        "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                        "accept-language": "en-US,en;q=0.9",
                        "cache-control": "no-cache",
                        "pragma": "no-cache",
                        "sec-ch-ua": "\"Chromium\";v=\"108\", \"Opera GX\";v=\"94\", \"Not)A;Brand\";v=\"99\"",
                        "sec-ch-ua-mobile": "?0",
                        "sec-ch-ua-platform": "\"Windows\"",
                        "sec-fetch-dest": "document",
                        "sec-fetch-mode": "navigate",
                        "sec-fetch-site": "same-origin",
                        "sec-fetch-user": "?1",
                        "upgrade-insecure-requests": "1",
                        "cookie": "_gid=GA1.2.1577721506.1675807477; _gat_gtag_UA_62776787_1=1; _ga_VX23CCW6PL=GS1.1.1675807476.1.1.1675810433.0.0.0; _ga=GA1.2.1227969633.1675807476",
                        "Referer": "https://cimaaa4u.click/category/%d8%a7%d9%81%d9%84%d8%a7%d9%85-%d8%a7%d8%ac%d9%86%d8%a8%d9%8a-movies7-english/",
                        "Referrer-Policy": "strict-origin-when-cross-origin"
                    },
                    "body": null,
                }, function (error, res, body2) {
                    if (error) {
                        console.log(error)
                        reject(error)
                    }
                    body = body2
                    resolve(body2)
                })
            })
            if (body) {
                let document = new jsdom.JSDOM(body, { contentType: "text/html" }).window.document
                Array.from(document.querySelectorAll('.PageContent .MovieBlock a')).forEach(async e => {
                    await new Promise(async (resolve, reject) => {
                        try {
                            let urls = new Urls({
                                url: e.href.slice(21)
                            })
                            try {
                                await urls.save()
                            } catch (error) {

                            }
                            console.log(e.href.slice(21))
                            resolve(e.href.slice(21))
                        } catch (error) {
                            console.log(error)
                            reject(error)
                        }
                    })
                })

            }
        } catch (error) {

        }
    }

}


async function getINFO() {
    console.log('started')
    let URLS = await Urls.find({ check: { $ne: true }, error: { $ne: true } })
    for (let i = 0; i < URLS.length; i++) {

        await new Promise(async (resolve, reject) => {
            try {
                let body;
                await new Promise((resolve, reject) => {
                    console.log('https://cimaaa4u.store/' + URLS[i].url + '/')
                    request.get('https://cimaaa4u.store/' + URLS[i].url + '/', {
                        json: true, "headers": {
                            "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                            "accept-language": "en-US,en;q=0.9",
                            "cache-control": "no-cache",
                            "pragma": "no-cache",
                            "sec-ch-ua": "\"Chromium\";v=\"108\", \"Opera GX\";v=\"94\", \"Not)A;Brand\";v=\"99\"",
                            "sec-ch-ua-mobile": "?0",
                            "sec-ch-ua-platform": "\"Windows\"",
                            "sec-fetch-dest": "document",
                            "sec-fetch-mode": "navigate",
                            "sec-fetch-site": "cross-site",
                            "sec-fetch-user": "?1",
                            "upgrade-insecure-requests": "1",
                            "cookie": "_gid=GA1.2.714075807.1675780019; _ga_VX23CCW6PL=GS1.1.1675851733.6.1.1675853386.0.0.0; _ga=GA1.2.965091012.1675780019; _gat_gtag_UA_62776787_1=1",
                            "Referer": "https://www.google.com/",
                            "Referrer-Policy": "origin"
                        },
                        "body": null,
                    }, function (error, res, body2) {
                        if (error) {
                            console.log(error)
                            reject(error)
                        }
                        body = body2
                        resolve(body2)
                    })
                }).catch(e => console.log(e))
                if (body) {
                    let flime = new Filme()
                    let document = new jsdom.JSDOM(body, { contentType: "text/html" }).window.document
                    // نوع الفلم

                    try {
                        flime.type = document.querySelectorAll('.Breadcrumbs li')[1].textContent
                    } catch (error) {

                    }
                    // صورة الفلم

                    try {
                        flime.pic = document.querySelector('.SinglePoster img').src
                    } catch (error) {

                    }
                    // العنوان
                    try {
                        flime.title = document.querySelector('.SingleContent h1').textContent
                    } catch (error) {

                    }
                    // القصه
                    try {
                        flime.story = document.querySelector('.Story p').textContent
                    } catch (error) {

                    }
                    //  التصنيفات
                    let obj = {};
                    document.querySelectorAll(' .InformationList li').forEach(e => {
                        let theText = e.querySelector('span').textContent
                        let text = e.querySelector('a').textContent
                        if (theText === "الجودة :") {
                            obj.jody = text
                        } else if (theText === "القسم :") {
                            obj.Ksem = text
                        } else if (theText === "السنة :") {
                            obj.year = text
                        } else if (theText === "النوع :") {
                            obj.types = []
                            e.querySelectorAll('a').forEach(e => {
                                obj.types.push({ name: e.textContent })
                            })
                        } else if (theText === "السنة :") {
                            obj.year = text
                        }
                    })
                    console.log(obj.types)
                    flime.dataFilm.q = obj.jody
                    flime.dataFilm.section = obj.Ksem
                    flime.dataFilm.types = obj.types
                    flime.dataFilm.year = obj.year
                    // فريق العمل
                    let team = []

                    document.querySelectorAll('ul.Teamwork li').forEach(async e => {
                        await new Promise(async (resolve, reject) => {
                            try {
                                let theName = e.querySelector('span').textContent
                                let urlPic = e.querySelector('img').src
                                team.push({ name: theName, pic: urlPic })
                                resolve('ok')
                            } catch (error) {
                                URLS[i].error = true

                                await URLS[i].save()
                                reject('no')
                            }
                        }).catch(e => console.log(e))
                    })
                    flime.Teams = team

                    // // code imdb
                    // document.querySelector('.IMDBButton').href
                    // العرض الترويجي
                    // 

                    try {
                        await new Promise((resolve, reject) => {
                            try {
                                request.get(document.querySelector('.SingleContentSide a:nth-child(3)').href, {
                                    json: true, "headers": {
                                        "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                                        "accept-language": "en-US,en;q=0.9",
                                        "cache-control": "no-cache",
                                        "pragma": "no-cache",
                                        "sec-ch-ua": "\"Chromium\";v=\"108\", \"Opera GX\";v=\"94\", \"Not)A;Brand\";v=\"99\"",
                                        "sec-ch-ua-mobile": "?0",
                                        "sec-ch-ua-platform": "\"Windows\"",
                                        "sec-fetch-dest": "document",
                                        "sec-fetch-mode": "navigate",
                                        "sec-fetch-site": "same-origin",
                                        "sec-fetch-user": "?1",
                                        "upgrade-insecure-requests": "1",
                                        "cookie": "_gid=GA1.2.1577721506.1675807477; _gat_gtag_UA_62776787_1=1; _ga_VX23CCW6PL=GS1.1.1675807476.1.1.1675810433.0.0.0; _ga=GA1.2.1227969633.1675807476",
                                        "Referer": "https://cimaaa4u.click/category/%d8%a7%d9%81%d9%84%d8%a7%d9%85-%d8%a7%d8%ac%d9%86%d8%a8%d9%8a-movies7-english/",
                                        "Referrer-Policy": "strict-origin-when-cross-origin"
                                    },
                                    "body": null,
                                }, function (error, res, body2) {
                                    if (error) {
                                        URLS[i].error = true
                                        reject(error)
                                    }
                                    body = body2
                                    resolve(body2)
                                })
                            } catch (error) {
                                URLS[i].error = true
                                URLS[i].save()
                                reject(error)
                            }
                        }).catch(async e => {
                            URLS[i].error = true
                        })
                        let document2 = new jsdom.JSDOM(body, { contentType: "text/html" }).window.document
                        // رابط التحميل من myvid
                        console.log('--------')
                        let myvid;
                        let upbom;
                        document2.querySelectorAll('.DownloadServers div').forEach(e => {
                            let theText = e.textContent
                            if (theText === " Myvid ") {
                                myvid = e.querySelector('a').href
                            } else if (theText === " UpBom ") {
                                upbom = e.querySelector('a').href
                            }
                        })
                        flime.myvid = myvid
                        flime.upbom = upbom
                        try {
                            URLS[i].check = true
                            URLS[i].save()
                            if (myvid || upbom) {
                                await flime.save()
                            }
                        } catch (error) {
                            URLS[i].check = true
                            URLS[i].save()
                            console.log('1')
                        }
                        resolve('asd')
                    } catch (error) {
                        console.log(error)
                        URLS[i].error = true
                        URLS[i].save()
                        resolve()
                    }
                }
            } catch (error) {
                URLS[i].error = true
                URLS[i].save()
                console.log(error)
                reject('no')
            }
        })
    }
}
function getINfo() {
    let theURLS = Urls.find({})

    theURLS.forEach(async e => {

        try {
            let body;
            await new Promise((resolve, reject) => {
                request.get('https://cimaaa4u.click' + e.url + i + '/', {
                    json: true, "headers": {
                        "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                        "accept-language": "en-US,en;q=0.9",
                        "cache-control": "no-cache",
                        "pragma": "no-cache",
                        "sec-ch-ua": "\"Chromium\";v=\"108\", \"Opera GX\";v=\"94\", \"Not)A;Brand\";v=\"99\"",
                        "sec-ch-ua-mobile": "?0",
                        "sec-ch-ua-platform": "\"Windows\"",
                        "sec-fetch-dest": "document",
                        "sec-fetch-mode": "navigate",
                        "sec-fetch-site": "same-origin",
                        "sec-fetch-user": "?1",
                        "upgrade-insecure-requests": "1",
                        "cookie": "_gid=GA1.2.1577721506.1675807477; _gat_gtag_UA_62776787_1=1; _ga_VX23CCW6PL=GS1.1.1675807476.1.1.1675810433.0.0.0; _ga=GA1.2.1227969633.1675807476",
                        "Referer": "https://cimaaa4u.click/category/%d8%a7%d9%81%d9%84%d8%a7%d9%85-%d8%a7%d8%ac%d9%86%d8%a8%d9%8a-movies7-english/",
                        "Referrer-Policy": "strict-origin-when-cross-origin"
                    },
                    "body": null,
                }, function (error, res, body2) {
                    if (error) {
                        console.log(error)
                        reject(error)
                    }
                    body = body2
                    resolve(body2)
                })
            })
            if (body) {
                let document = new jsdom.JSDOM(body, { contentType: "text/html" }).window.document
                await new Promise((resolve, reject) => {
                    Array.from(document.querySelectorAll('.PageContent .MovieBlock a')).forEach(async e => {
                        console.log('asdasd')
                        try {
                            await new Urls({
                                url: e.href.slice(21)
                            }).save()
                            console.log(e.href.slice(21))
                            resolve(e.href.slice(21))
                        } catch (error) {
                            console.log(error)
                            reject(error)
                        }
                    })
                })

            }
        } catch (error) {

        }
        e.check = true
    })
}
deleteDB()
function deleteDB() {
    Urls.deleteMany({ check: false }).then(e => console.log('done'))
}