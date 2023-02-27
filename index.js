const express = require('express')
const cheerio = require("cheerio")
const axios = require('axios');
const nodemailer = require('nodemailer');
const { getColesData } = require('./coles');

if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
  }

const PORT = 3000;
const app = express()

const transporter = nodemailer.createTransport({
    port: 465,               // true for 465, false for other ports
    host: "smtp.gmail.com",
       auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD,
         },
    secure: true,
    });

const getAllData = async () => {
    const colesData = await getColesData()

    const mailData = {
        from: process.env.EMAIL,  // sender address
          to: process.env.SENDER_EMAILS.split(' '),   // list of receivers
          subject: 'Prices',
          text: 'The prices yo',
          html: `<div>${colesData}</div>`,
        };

    transporter.sendMail(mailData, function (err, info) {
        if(err)
          console.log(err)
        else
          console.log(info);
     });

    return colesData
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