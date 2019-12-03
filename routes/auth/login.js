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

router.post('/submit', async function(req,res){
    let email =  req.body.email;
    let enteredPass = req.body.password;
    
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
            if (results.length == 0){
                res.json({
                    error: true,
                    message: "This email does not exist in DB"
                })
            }
        }
    });

    // CHECKING PASSWORD
    queryString = `SELECT password FROM user WHERE email="${email}";`;
    await connection.query(queryString, async function(error, results, fields){
        if (error) {
            console.log(error);
            return res.status(400).json({
                error: true,
                message: "Error getting password"
            });
        }
        else {
            let passwordMatch = await bcrypt.compare(enteredPass, results[0]["password"])

            if (!passwordMatch){
                res.json({
                    error: true,
                    message: "I don't think that password matches"
                })
            }
        }
    });

    // FINALLY GETTING INFO
    queryString = `SELECT schoolid, iduser, firstname, surname, email FROM user WHERE email="${email}";`;
    await connection.query(queryString, async function(error, results, fields){
        if (error) {
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
    });
});



module.exports = router;