"use strict";
const usersModel = require("../models").users;
const nodemailer = require("nodemailer");
const axios = require("axios");

module.exports = {
  sendOtp: async (req, res) => {
    const email = req.body.requestObject.email;
    const otp = req.body.requestObject.otp;
    const phone_no = req.body.requestObject.phone_no;

    console.log("Phone number received:", phone_no);

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: 'arnabjyoti.skaplink@gmail.com',
        pass: 'puxcdoabsfhnmnno'
      }
    });

    const mailOptions = {
  from: '"UD Housing" <support@housing.udarunachal.gov.in>',
  to: email,
  subject: "One Time Password Verification",
  text: "UD Housing",
  html: `
  <div style="font-family: Arial, sans-serif; background-color: #f4f7ff; padding: 40px 0;">
    <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 10px; padding: 40px; text-align: center; box-shadow: 0px 4px 15px rgba(0,0,0,0.08);">
      
      <h2 style="color: #4b57d4; margin-bottom: 10px;">UD Housing</h2>
      <h3 style="color: #4b57d4; font-size: 22px; margin-top: 0;">One Time Password</h3>

      <p style="font-size: 14px; color: #555;">
        Here is your verification code:
      </p>

      <div style="font-size: 32px; font-weight: bold; background: #e8e9ff; color: #4b57d4; padding: 15px 0; width: 200px; margin: 15px auto; border-radius: 8px;">
        ${otp}
      </div>

      <p style="font-size: 14px; color: #555; margin-top: 10px;">
        Please make sure you never share this code with anyone.
      </p>

      <p style="font-size: 13px; color: #777; margin-top: 25px;">
        <b>Note:</b> The code will expire in 5 minutes.
      </p>
    </div>

    <p style="text-align: center; font-size: 12px; color: #9a9a9a; margin-top: 20px;">
      © ${new Date().getFullYear()} UD Housing. All rights reserved.
    </p>
  </div>
  `,
};


    transporter.sendMail(mailOptions, function (err, info) {
      if (err) {
        console.log('Mail not sent');
      } else {
        console.log('Mail sent');
      }
    });

    // Send SMS if phone number exists (comment below for stop sms sending)
    if (phone_no) {
      await sendDLTSMS(otp, phone_no);
    }

    return res.status(200).send({ message: "success" });
  }
};

// SMS sending function using Fast2SMS DLT route
const sendDLTSMS = async (otp, mobileNumbers) => {
  const apiKey = "wivJ12GI8qBkMZE9CVlH4fQodaxnhAg7TSXr65OpYzymDeRPcNxAw45EmdUjBgXuntYWRTo8aHr9F0Nf"; // Replace with your Fast2SMS API key
  const senderId = "APHsng"; // DLT approved Sender ID
  const templateId = "200812"; // DLT Template ID (from your Fast2SMS dashboard)

  try {
    const response = await axios.get("https://www.fast2sms.com/dev/bulkV2", {
      params: {
        authorization: apiKey,
        route: "dlt",
        sender_id: senderId,
        message: templateId, // DLT numeric template ID
        variables_values: otp, // Replace {#var#} with the OTP
        numbers: mobileNumbers, // Comma-separated string of numbers
      },
    });

    console.log("✅ SMS Sent Successfully:");
    console.log(response.data);
  } catch (error) {
    console.error("❌ Error sending SMS:");
    console.error(error.response ? error.response.data : error.message);
  }
};
