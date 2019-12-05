var express = require('express');
var router = express.Router();
var connection = require('../database');
const bcrypt = require('bcryptjs')

const SALT_ROUNDS = 10

router.get('/', function(req, res, next) {
    res.send('Post api is working properly');
});

router.post('/hash', async function(req, res) {
    let password = await bcrypt.hash(req.body.password, SALT_ROUNDS);
    res.json(password)
})

router.post('/checkemail', async function(req,res){
    let email =  req.body.email;  
    let enteredPass = req.body.password;
    if(enteredPass.length === 0 || email.length === 0){
        return res.status(400).json({
            error: true,
            message: "There is an empty input"
        });
    }
    /*
        1. Check if email exists
        2. If so, get password
        3. compare {hashed[entered] password}  & {hashed[stored] password}
        4. If there is a match, return data
    */
    
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
            console.log("THE EMAIL" + results.length);
            if (results.length === 0){
                res.json({
                    error: true,
                    message: "This email does not exist in DB"
                })
            }else{
                res.json({
                    error: false,
                    message: "This email is valid."
                })
                return
            }
        }
    });
});

// CHECKING PASSWORD
router.post('/checkpassword', async function(req,res){
    let email =  req.body.email;  
    let enteredPass = req.body.password;
    queryString = `SELECT password FROM user WHERE email="${email}";`;
    await connection.query(queryString, async function(error, results, fields){
        if (error || results.length === 0) {
            console.log(error);
            return res.status(400).json({
                error: true,
                message: "Error getting password"
            });
        }
        else {
            let passwordMatch = await bcrypt.compare(enteredPass, results[0]["password"])
            console.log(passwordMatch);
            if (!passwordMatch){
                res.json({
                    error: true,
                    message: "I don't think that password matches"
                })
                return
            }else{
                res.json({
                    error: false,
                    message: "This password is valid."
                })
                return
            }
        }
    });
});

// FINALLY GETTING INFO
router.post('/getinfo', async function(req,res){
    let email =  req.body.email;  
    queryString = `SELECT schoolid, iduser, firstname, surname, email FROM user WHERE email="${email}";`;
    await connection.query(queryString, async function(error, results, fields){
        if (error || results.length === 0) {
            console.log(error);
            return res.status(400).json({
                error: true,
                message: "Error getting user information"
            });
        }
        
        // The information returned
        res.json({
            error: false,
            data: results,
            message: "Logged in!"
        })
        return
    });
});


module.exports = router;