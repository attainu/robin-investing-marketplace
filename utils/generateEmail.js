const dotenv = require('dotenv')
dotenv.config();

const nodemailer = require("nodemailer");
const { GMAIL_EMAIL, GMAIL_PASSWORD } = process.env;
console.log("does this work:",process.env.GMAIL_EMAIL)

const transportOptions = {
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  debug: process.env.NODE_ENV === "development",
  auth: {
    user: GMAIL_EMAIL,
    pass: GMAIL_PASSWORD
  }
};

const mailTransport = nodemailer.createTransport(transportOptions);
const sendMail = async (mode, email, token) => {
  const domainName = process.env.DOMAIN_NAME || `http://localhost:8080`;
  let html = null
  if (mode === "confirm")
    html = `
    <h1>Welcome to InvesIn</h1>
    <p>Thanks for creating an account.This is a confirmation mail<br> 
    Click or copy and paste the below link <br>${domainName}/confirm/${token}<br> to your browser to confirm email.
    </p>
`;
  else if (mode === "reset")
    html = `<h1>Welcome to InvesIn</h1>
<p>You have recently requested for a change in password.<br> 
Click <a href=${domainName}/reset/${token}>here</a> to reset your password.<br> Or copy paste<br>
 ${domainName}/reset/${token} <br>
 to your browser.<br> 
</p>`;
  try {
    await mailTransport.sendMail({
      from: GMAIL_EMAIL,
      to: email,
      subject:
        mode === "confirm" ? "Confirm your email" : "Reset your password",
      html
    });
  } catch (err) {
    console.log(err);
    throw err;
  }
};

module.exports = sendMail;
