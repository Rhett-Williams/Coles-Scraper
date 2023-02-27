const cheerio = require("cheerio")
const axios = require('axios');

module.exports = {
    getColesData: async function () {
        const data = await Promise.all(
            ITEM_URLS.map(async(item, index) => {
                return await performScraping(item)
        }))
        const fromattedData = data.flatMap((data, index) => {
            return (`
            <ul>
                <li>Product: ${data.name}</li>
                <li>Price: ${data.price}</li>
                <li>On Special: ${data.isOnSpecial}</li>
            </ul>
            `)
        })
        return fromattedData
    }
}

const ITEM_URLS = [
    "https://www.coles.com.au/product/coles-green-asparagus-1-each-4838737",
    "https://www.coles.com.au/product/coles-baby-broccoli-1-each-5982477",
    "https://www.coles.com.au/product/coles-wombok-chinese-cabbage-whole-1-each-4879042",
    "https://www.coles.com.au/product/coles-celery-1-bunch-4845732",
    "https://www.coles.com.au/product/coles-celery-sticks-prepacked-300g-1069160",
    "https://www.coles.com.au/product/coles-trimmed-celery-prepacked-1-each-2386281",
    "https://www.coles.com.au/product/coles-fennel-1-bunch-4910980",
    "https://www.coles.com.au/product/coles-green-kale-1-each-8696598"
]

async function performScraping(url) {
    const axiosResponse = await axios.request({
        method: "GET",
        url: url,
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36"
        }
    })

    const $ = cheerio.load(axiosResponse.data)

    let price = ""
    let name = ""
    let isOnSpecial = false

    $(".price")
        .find(".price__value")
        .each((index, element) => {
            const priceData = $(element).html()
            price = priceData
        })

    $(".sc-81b0d258-0")
        .find("h1")
        .each((index, element) => {
            const nameData = $(element).html()
            name = nameData
        })

    $(".price")
        .find(".badge-label")
        .each((index, element) => {
            const isOnSpecialData = $(element).html()
            if (isOnSpecialData){
                isOnSpecial = true
            }
        })

    $("script")
        .each((index, element) => {
            if (index === 12){
                const isOnSpecialData = $(element).html()
                if (isOnSpecialData.includes('"promotionType":"DROPPEDLOCKED"')){
                    isOnSpecial = true
                }
            }
        })

    const scrapedData = {
        name,
        price,
        isOnSpecial
    }
    return scrapedData
}