var express = require('express');
var router = express.Router();
var connection = require('../database');
var nodemailer = require('nodemailer');


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

    // CODE GEN
    let code = (Math.floor(Math.random()*90000) + 10000).toString(10);
    console.log("code: " + code)

    // SENDING EMAIL
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL,
          pass: process.env.EMAIL_PASS
        }
      });
      
      var mailOptions = {
        from: process.env.EMAIL,
        to: 'colemckinnon.school@gmail.com',
        subject: 'Bookie Password Reset',
        text: `You recently requested to change the password on your SJSU Bookie account. Enter 5 digit code below to begin the reset process.\n\nCode: ${code}`
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });


    /*
      1. Write code to DB
      2. Write email to DB
      3. Give Expiration date/time
      4. Say whether token has been used
            Token is used when 
    */

    // Code will expire in 7 days
    var date = new Date();
    date.setDate(date.getDate() + 7);

    let formattedDate = date.toISOString()

    // Adding to DB
    queryString = `INSERT INTO PasswordReset (resetToken, email, expirationTime, usedToken)
                   VALUES ("${code}","${email}","${formattedDate}","0");`

    await connection.query(queryString, (error, results, fields) => {
    if (error) {
        console.log(error);
        return res.status(400).json({
            error: true,
            message: "Error adding to PasswordReset"
        });
    }else{
        console.log("Added PasswordReset to DB!")
    }
    
});

    // The email exists, so email a code to reset password
    res.json({
        error: false,
        message: "Temporary message. This email address is valid."
    })
})

module.exports = router;