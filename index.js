const nodemailer = require('nodemailer');

const { getColesData } = require('./coles');
const { getWooliesData } = require('./woolies');

if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
  }

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
    const wooliesData = await getWooliesData()
    console.log("woolies", wooliesData)
    const mailData = {
        from: process.env.EMAIL,  // sender address
          to: process.env.SENDER_EMAILS.split(' '),   // list of receivers
          subject: 'Prices',
          text: 'The prices yo',
          html: `
                <h1>Coles:</h1>
            <div>${colesData}</div>
                </br>
                <h1>Woolies:</h1>
            <div>${wooliesData}</div>
            `,
        };

    transporter.sendMail(mailData, function (err, info) {
        if(err)
          console.log(err)
        else
          console.log(info);
     });
    return colesData
}

getAllData()