require('dotenv').config
const nodemailer = require("nodemailer");
let sendSimpleEmail = async (dataSend) => {

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        // TODO: replace `user` and `pass` values from <https://forwardemail.net>
        user: process.env.EMAIL_APP,
        pass: process.env.EMAIL_APP_PASSWORD,
      },
    });
      const info = await transporter.sendMail({
        from: 'From me 👻', // sender address
        to: dataSend.receiverEmail, // list of receivers
        subject: "Thông tin đặt lịch khám bệnh", // Subject line
        text: "Hello world?", // plain text body
        html: getBodyHTMLEmail(dataSend)
      });
}
let getBodyHTMLEmail = (dataSend) => {
    let result = ''
    if (dataSend.language === 'vi') {
        result = 
        `<h3>Xin chào ${dataSend.patientName}</h3>
        <p>Thông tin đặt lệnh khám bệnh</p>
        <div><b>Thời gian : ${dataSend.time}</b></div>
        <div><b>Bác sĩ : ${dataSend.doctorName}</b></div>
        <p>Nếu thông tin chính xác, vui lòng click vào đường link bên dưới</p>
        <div><a href=${dataSend.redirectLink} target="_blank">Click here</a></div>
        <div>Xin chân thành cảm ơn</div>
    `
    } else if (dataSend.language === 'en'){
        result = 
        `<h3>Dear ${dataSend.patientName}</h3>
        <p>Information to schedule an appointment</p>
        <div><b>Time : ${dataSend.time}</b></div>
        <div><b>Doctor : ${dataSend.doctorName}</b></div>
        <p>If the above information is true,please click on the link below to confirm</p>
        <div><a href=${dataSend.redirectLink} target="_blank">Click here</a></div>
        <div>Sincerely thanks</div>
    `
    }
    return result
}
let getBodyHTMLEmailRemedy = (dataSend) => {
  let result = (
    `<h3>Xin chào </h3>
    <h1> Thông tin hóa đơn đính kèm</h1>
    <div>Xin chân thành cảm ơn</div>
    `
  )
  return result
}
let sendAttachment = async (dataSend)=>{
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      // TODO: replace `user` and `pass` values from <https://forwardemail.net>
      user: process.env.EMAIL_APP,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  });
    const info = await transporter.sendMail({
      from: 'From me 👻', // sender address
      to: dataSend.email, // list of receivers
      subject: "Thông tin hóa đơn khám bệnh", // Subject line
      text: "Hello world?", // plain text bodsy
      html: getBodyHTMLEmailRemedy(dataSend),
      attachments:[
        {
          filename:'remedy.png',
          content:dataSend.imgBase64.split("base64")[1],
          encoding:'base64'
        }
      ]
    });
    console.log('info',info)
}
module.exports={
    sendSimpleEmail,
    sendAttachment
}