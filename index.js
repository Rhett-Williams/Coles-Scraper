const express = require('express')
const cheerio = require("cheerio")
const axios = require('axios');

if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
  }

const PORT = 3000;
console.log("asdasdasd", )
const app = express()

const ITEM_URLS = [
    "https://www.coles.com.au/product/coca-cola-classic-soft-drink-multipack-cans-30-x-375ml-30-pack-8464796",
    "https://www.coles.com.au/product/bundaberg-ginger-beer-10x375ml-10-pack-9826123",
    "https://www.coles.com.au/product/coca-cola-classic-soft-drink-multipack-cans-10-x-375ml-10-pack-1849307",
    "https://www.coles.com.au/product/coca-cola-classic-soft-drink-multipack-cans-24-x-375ml-24-pack-7365777"


]

const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);



const getAllData = async () => {
    const data = await Promise.all(
        ITEM_URLS.map(async(item, index) => {
            return await performScraping(item)
    }))
    const specials = data.filter(item => item !== undefined)
    
    client.messages
    .create({
     body: `Daily Specials \n ${specials}`,
     from: '+12765008482',
     to: process.env.MOBILE
   })
  .then(message => console.log(message.sid));

    return specials
}

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
        price,
        name,
        isOnSpecial
    }

    if (scrapedData.isOnSpecial){
        const returnData = {
            price: scrapedData.price,
            name: scrapedData.name
        }
        const scrapedDataJSON = JSON.stringify(returnData, null, 2)
        return scrapedDataJSON
    }

}


app.get('/api', async (req, res) => {
   const data = await getAllData()
   if(data) {
       res.send(data);
   }else {
      res.json({msg : " Response data not recieved.."})
   }
});

app.listen(PORT, () => console.log(`server is 1now listening to port ${PORT}`))