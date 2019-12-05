var express = require('express');
var router = express.Router();
var connection = require('../database');
var nodemailer = require('nodemailer');

// Forgot password
router.post('/', async function(req, res){
    let email = req.body.email
    
    // CHECKING EMAIL
    let queryString = `SELECT email FROM user WHERE email="${email}";`;
    await connection.query(queryString, (error, results, fields) => {
        console.log(" +++++ SELECTING +++++")
        if (error) {
            console.log(error);
            return res.status(400).json({
                error: true,
                message: "Error checking emails"
            });
        }
        else {
            if (results.length === 0){
                return res.json({
                    error: true,
                    message: "This email does not exist in our system"
                })
            }
        }
    

        /* ----- TODO ------

        If a reset code assiciated with the email already exists,
            set the token to USED

        ------------------*/

        // CODE GEN
        let code = (Math.floor(Math.random()*90000) + 10000).toString(10);

    /* ----------  SENDING EMAIL --------- */
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
    // ----------------------------------------

        /*    STEPS
        1. Write code to DB
        2. Write email to DB
        3. Give Expiration date/time
        4. Say whether token has been used
        */


        // Code will expire in 7 days
        var pad = function(num) { return ('00'+num).slice(-2) };
        var date = new Date();
        date.setDate(date.getDate() + 7);
        
        // Format date for SQL
        date = date.getUTCFullYear()     + '-' +
            pad(date.getUTCMonth() + 1)  + '-' +
            pad(date.getUTCDate())       + ' ' +
            pad(date.getUTCHours())      + ':' +
            pad(date.getUTCMinutes())    + ':' +
            pad(date.getUTCSeconds());     
    
        queryString = `INSERT INTO PasswordReset (resetToken, email, expirationTime, usedToken)
                VALUES ("${code}","${email}","${date}","0");`
    });
    
    // Adding to DB
    await connection.query(queryString, (error, results, fields) => {
        console.log(" +++++ INSERTING +++++")
        if (error) {
            console.log(error);
            return res.status(400).json({
                error: true,
                message: "Error adding to PasswordReset"
            });
        }

         // The email exists, so email a code to reset password
        return res.json({
            error: false,
            message: "Reset Data has been added to the DB"
        })
    });
})

module.exports = router;