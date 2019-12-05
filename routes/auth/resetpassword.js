var express = require('express');
var router = express.Router();
var connection = require('../database');
const bcrypt = require('bcryptjs')

// Password Reset - Unfinished
router.post('/enterResetCode', async function(req, res){
    let email = req.body.email
    let providedToken = req.body.resetToken

    // CHECKING EMAIL
    let queryString = `SELECT email FROM PasswordReset WHERE email="${email}";`;
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
                return res.json({
                    error: true,
                    message: "This email does not exist in DB"
                })
            }
        }
    });

    // CHECKING FOR TOKEN
    queryString = `SELECT resetToken, usedToken FROM PasswordReset WHERE email="${email}" AND resetToken="${providedToken}" AND usedToken=0;`;
    await connection.query(queryString, (error, results, fields) => {
        if (error) {
            console.log(error);
            return res.status(400).json({
                error: true,
                message: "Problem getting token from DB"
            });
        }
        else {
            console.log("results.length: " + results.length)
            if (results.length > 0){
                return res.json({
                    error: true,
                    message: "Token is invalid. Try again."
                })
            }else{
                // At this point, a valid token has been inputted by the user    
                updateString = `UPDATE PasswordReset SET usedToken=1 WHERE email="${email}" AND resetToken="${providedToken}" AND usedToken=0;`;
                connection.query(queryString, (error, results, fields) => {
                if (error) {
                    console.log(error);
                    return res.status(400).json({
                        error: true,
                        message: "Problem getting token from DB"
                    });
                }
                else{
                return res.json({
                    error: false,
                    message: "User has entered valid reset code. Password reset process should be initiated.",
                    
                })}
            })
            }
        }
    });
});


// Process to overwrite old password with new one
router.post('/reset', async function(req, res){
    let email = req.body.email
    let newPassword = await bcrypt.hash(req.body.newPassword, 10)

    // CONFIRMING EMAIL
    let queryString = `SELECT email FROM user WHERE email="${email}";`
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

    // UPDATING PASSWORD
    queryString = `UPDATE user SET password="${newPassword}" WHERE email="${email}";`;
    await connection.query(queryString, (error, results, fields) => {
        if (error) {
            console.log(error);
            return res.status(400).json({
                error: true,
                message: "Error updating password in SQL."
            });
        }
        else {
            console.log("Password should have been changed. Check Workbench.")
            res.json({
                error: false,
                message: "Password has been changed in DB."
            })
        }
    });
});

module.exports = router;