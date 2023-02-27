const nodemailer = require('nodemailer');

const { getColesData } = require('./coles');

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
     console.log("the data", colesData)
    return colesData
}

getAllData()