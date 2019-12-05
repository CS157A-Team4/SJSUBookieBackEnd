var express = require('express');
var router = express.Router();
var connection = require('../database');
const bcrypt = require('bcryptjs')

router.get('/', function (req, res, next) {
    res.send('Signup api is working properly');
});

router.post('/submit', async function (req, res) {
    let email = req.body.email;
    let password = await bcrypt.hash(req.body.password, 10);
    let firstname = req.body.firstname;
    let surname = req.body.surname;
    let schoolid = req.body.schoolid;
    
    /*
          1. Check if email or schoolid is already in system
    */
    
    let queryString = `SELECT email FROM user WHERE email="${email}" OR schoolid="${schoolid}";`;
    //let queryString = `SELECT email FROM user WHERE email="${email}" OR schoolid="I${schoolid}";`;
    await connection.query(queryString, (error, results, fields) => {
        console.log("About to SELECT....")
        if (error) {
            console.log(error);
            return res.status(400).json({
                error: true,
                message: "Error checking emails"
            });
            res.end();
        }
        else {
            
            console.log("Success getting emails")
            console.log(results.length)
            console.log(results[0])

            if (results.length > 0){
                console.log("returning..")
                res.status(400).end({
                    error: true,
                    message: "This email or id is already in the system"
                })
                next();
            }
        }
    })

    /*
          2. Insert new user into system
          < This function will run regardless of what happens previously! Wth? Do I not understand this stuff correctly? >
    */
    
    queryString = `INSERT INTO user (schoolid, firstname, surname, email, password) 
                   VALUES ("${schoolid}", "${firstname}", "${surname}", "${email}", "${password}");`

    await connection.query(queryString, (error, results, fields) => {
        console.log("About to INSERT....")
        if (error) {
            console.log(error);
            return res.status(400).json({
                error: true,
                message: "Error creating new users"
            });
        }else{
            console.log("Added user to DB!")
        }
    });

    
     /*
          3. Getting iduser and sending back response
    */
    queryString = `SELECT iduser FROM user WHERE email="${email}";`;
    await connection.query(queryString, (error, results, fields) => {
        if (error || results.length === 0) {
            console.log(error);
            return res.status(400).json({
                error: true,
                message: "Error getting iduser"
            });
        }else {
            return res.json({
                message: "Successfully created user!",
                email: email,
                firstname: firstname,
                iduser: results[0]["iduser"],
                error:false
            })
        }
    });
});


module.exports = router;