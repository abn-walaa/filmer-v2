let jsdom = require('jsdom');

// اتصال الداتا بيس
require('./db/conntion')
// موديل الخاص بالروابط
let Urls = require('./db/module/urls')
let Filme = require('./db/module/info')
const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot('6211775853:AAG0CBFchxUizx1kfeWsktBWGnWGyz5AR7U', { polling: true });

const request = require('request');

async function getUrlsFimles() {
    let url3 = await Urls.find({ check: false, justMain: true })
    for (let i = 1; i <= url3.length; i++) {
        try {

            let body;
            await new Promise((resolve, reject) => {
                request.get(url3[i].url, {
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
                // let document = new jsdom.JSDOM(body, { contentType: "text/html" }).window.document
                // Array.from(document.querySelectorAll('.PageContent .MovieBlock a')).forEach(async e => {
                //     await new Promise(async (resolve, reject) => {
                //         try {
                //             let urls = new Urls({
                //                 url: e.href.slice(24)
                //             })
                //             try {
                //                 await urls.save()
                //             } catch (error) {

                //             }
                //             console.log(e.href.slice(24))
                //             resolve(e.href.slice(24))
                //         } catch (error) {
                //             console.log(error)
                //             reject(error)
                //         }
                //     })
                // })
                document.querySelectorAll('.SeasonsSectionsList a').forEach(async e => {
                    try {
                        let urls = new Urls({
                            url: e.href
                        })
                        console.log(urls)
                        try {
                            await urls.save()
                        } catch (error) {

                        }
                    } catch (error) {

                    }
                })
                document.querySelectorAll('.EpisodesSectionMaster .EpisodeItem a').forEach(async e => {
                    try {
                        let urls = new Urls({
                            url: e.href,
                            justMain: false
                        })
                        console.log(urls)
                        try {
                            await urls.save()
                        } catch (error) {

                        }
                    } catch (error) {

                    }
                })

            }
            console.log(i)
        } catch (error) {

        }
    }

}


async function getINFO() {
    console.log('started')
    let URLS = await Urls.find({ check: { $ne: false } }, {}, { skip: 17000 })
    for (let i = 0; i < URLS.length; i++) {
        await new Promise(async (resolve, reject) => {
            try {
                let body = await new Promise((resolve, reject) => {
                    // console.log('https://cimaaa4u.store/' + URLS[i].url + '/')
                    request.get('https://cima4u.rocks/' + URLS[i].url + '/', {
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

                            "Referrer-Policy": "origin"
                        },
                        "body": null,
                    }, function (error, res, body2) {
                        if (error) {
                            console.log(error)
                            throw new Error(error)
                        }
                        resolve(body2)
                    })
                })


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
                    try {
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

                        flime.dataFilm.q = obj.jody
                        flime.dataFilm.section = obj.Ksem
                        flime.dataFilm.types = obj.types
                        flime.dataFilm.year = obj.year
                    } catch (error) {

                    }
                    // فريق العمل
                    let team = []

                    try {
                        document.querySelectorAll('ul.Teamwork li').forEach(async e => {
                            await new Promise(async (resolve, reject) => {
                                try {
                                    let theName = e.querySelector('span').textContent
                                    let urlPic = e.querySelector('img').src
                                    team.push({ name: theName, pic: urlPic })
                                    resolve('ok')
                                } catch (error) {
                                    console.log(error)
                                    URLS[i].error = true

                                    await URLS[i].save()
                                    reject('no')
                                }
                            }).catch(e => console.log(e))
                        })
                    } catch (error) {

                    }
                    flime.Teams = team

                    // // code imdb
                    // document.querySelector('.IMDBButton').href
                    // العرض الترويجي
                    // 

                    try {
                        let body3 = await new Promise((resolve, reject) => {
                            try {

                                request.get(document.querySelector('.SingleContentSide a:nth-child(3)').href, {
                                    "headers": {
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
                                        throw new Error(error)
                                    }

                                    resolve(body2)
                                })
                            } catch (error) {
                                throw new Error(error)
                                reject(error)
                            }
                        }).catch(async e => {
                            throw new Error(error)
                        })

                        document = new jsdom.JSDOM(body3, { contentType: "text/html", resources: "usable" }).window.document
                        // رابط التحميل من myvid
                        console.log('--------')
                        let myvid;
                        let upbom;

                        try {
                            document.querySelectorAll('.DownloadServers div').forEach(e => {
                                let theText = e.textContent.trim().toLocaleLowerCase()
                                console.log(e.querySelector('a').href)
                                if (theText === " Myvid " || theText == "myvid") {
                                    myvid = e.querySelector('a').href
                                } else if (theText === " UpBom " || theText == "upbom" || theText == "upbam") {
                                    upbom = e.querySelector('a').href
                                }
                            })
                        } catch (error) {

                        }
                        flime.myvid = myvid
                        flime.upbom = upbom
                        console.log(myvid, upbom)
                        console.log('--------')
                        console.log(flime)
                        try {

                            if (myvid || upbom) {
                                await flime.save()
                                URLS[i].check = true
                                await URLS[i].save()
                            }

                        } catch (error) {
                            URLS[i].check = true
                            URLS[i].save().catch(e => e)
                            throw new Error(error)

                            reject()
                        }
                        resolve('asd')
                    } catch (error) {
                        throw new Error(error)
                        resolve()
                    }
                }
            } catch (error) {
                console.log(error)
                reject('no2')
            }
        }).catch(e => e)
    }
}


function deleteDB() {
    Urls.deleteMany({ check: false }).then(e => console.log('done'))
}
tvinfo()
async function tvinfo() {

    let URLS = await Urls.find({ check: false, justMain: false })
    console.log(URLS.length)
    for (let i = 0; i < URLS.length; i++) {
        try {
            let body3 = await new Promise((resolve, reject) => {
                try {

                    request.get(URLS[i].url, {
                        "headers": {
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
                            throw new Error(error)
                        }

                        resolve(body2)
                    })
                } catch (error) {
                    throw new Error(error)
                    reject(error)
                }
            }).catch(async e => {
                throw new Error(error)
            })

            document = new jsdom.JSDOM(body3, { contentType: "text/html", resources: "usable" }).window.document
            // رابط التحميل من myvid
            let flime = new Filme();
            console.log('--------')
            let myvid;
            let upbom;

            try {
                document.querySelectorAll('.DownloadServers div').forEach(e => {
                    let theText = e.textContent.trim().toLocaleLowerCase()
                    console.log(e.querySelector('a').href)
                    if (theText === " Myvid " || theText == "myvid") {
                        myvid = e.querySelector('a').href
                    } else if (theText === " UpBom " || theText == "upbom" || theText == "upbam") {
                        upbom = e.querySelector('a').href
                    }
                })
            } catch (error) {

            }

            flime.myvid = myvid
            flime.upbom = upbom


            console.log(myvid, upbom)
            console.log('--------')

            try {
                flime.type = document.querySelectorAll('.Breadcrumbs li')[1].textContent
            } catch (error) {

            }
            try {
                flime.pic = document.querySelector('.SinglePoster img').src
            } catch (error) {

            }
            try {
                let t = document.querySelector('.SingleContent h1').textContent
                t = t.replace(" - ال", " ");
                t = t.replace(" رقم", "")
                flime.title = t
            } catch (error) {

            }
            try {
                console.log(flime)
                if (myvid || upbom) {
                    await flime.save()
                    URLS[i].check = true
                    await URLS[i].save()
                    await bot.sendMessage(-1001851288193, flime.title);
                }

            } catch (error) {
                URLS[i].check = true
                await URLS[i].save()
                throw new Error(error)
            }
        } catch (error) {
            console.log(error)

        }
    }

}
