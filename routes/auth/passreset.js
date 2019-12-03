var express = require('express');
var router = express.Router();
var connection = require('../database');
var nodemailer = require('nodemailer');

/*
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS
  }
});

var mailOptions = {
  from: process.env.EMAIL,
  to: 'myfriend@yahoo.com',
  subject: 'Sending Email using Node.js',
  text: 'That was easy!'
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});


*/

// Password Reset - Unfinished
router.post('/', async function(req, res){
    let email = req.body.email

    // CHECKING EMAIL
    let queryString = `SELECT email FROM user WHERE email="${email}";`;
    await connection.query(queryString, (error, results, fields) => {
        if (error) {
            console.log(error);
            return res.status(400).json({
                error: true,
                message: "Error checking emails"
            });
        }
        else {
            if (results.length == 0){
                res.json({
                    error: true,
                    message: "This email does not exist in DB"
                })
            }
        }
    });


    // The email exists, so email a code to reset password
    res.json({
        error: false,
        message: "Temporary message. This email address is valid."
    })
})

module.exports = router;