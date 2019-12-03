var express = require('express');
var router = express.Router();
var connection = require('../database');

router.get('/', function (req, res, next) {
    res.send('Signup api is working properly');
});

router.post('/submit', async function (req, res) {
    let email = req.body.email;
    let password = req.body.password;
    let firstname = req.body.firstname;
    let surname = req.body.surname;
    let schoolid = req.body.schoolid;
    
    // will be the eventual response returned
    let resObject = {
        message: ""
    }
    /*
          1. Check if email is already in system
    */
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
            console.log(typeof results)
            console.log("Success getting emails")
            console.log(results)

            if (results.length > 0) {
                
                resObject = {
                    message: "This email is already in the system!"
                }
                
            } else {
                resObject = {
                    message: "This email does not yet exist. Good job!"
                }
                
            }

        }
    });

    queryString = `SELECT * FROM user WHERE email=CB@sjsu.edu;`
    await connection.query(queryString, (error, results, fields) => {
        if (error) {
            console.log(error);
            return res.status(400).json({
                error: true,
                message: "Error checking emails"
            });
        }
        else {
            console.log("Success doing second query!")
            console.log(results)
        }
    });

    res.json(resObject)
});


module.exports = router;