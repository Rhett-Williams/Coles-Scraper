const cheerio = require("cheerio")
const axios = require('axios');
const scraperjs = require('scraperjs');

module.exports = {
    getWooliesData: async function () {
        const data = await Promise.all(
            ITEM_URLS.map(async(item, index) => {
                return await performScraping(item)
        }))
        const fromattedData = data.flatMap((data, index) => {
            return (`
            <ul>
                <li>Product: ${data.name}</li>
                <li>Price: $${data.price}</li>
            </ul>
            `)
        })
        return fromattedData
    }
}

const ITEM_URLS = [
    "https://www.woolworths.com.au/api/v3/ui/schemaorg/product/745467"
]

async function performScraping(url) {
    const {data} = await axios.request({
        method: "GET",
        url: url,
    })

    let price = data.offers.price
    let name = data.name

    const scrapedData = {
        name,
        price
    }
    return scrapedData
}