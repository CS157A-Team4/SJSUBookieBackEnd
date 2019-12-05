var express = require('express');
var router = express.Router();
var connection = require('../database');
const bcrypt = require('bcryptjs')

router.get('/', function (req, res, next) {
    res.send('Signup api is working properly');
});

  
/*
    1. Check if email or schoolid is already in system
*/
router.post('/checkkeys', async function (req, res) {
    let email = req.body.email;
    let schoolid = req.body.schoolid;
    
    let queryString = `SELECT email FROM user WHERE email="${email}" OR schoolid="${schoolid}";`;
    //let queryString = `SELECT email FROM user WHERE email="${email}" OR schoolid="I${schoolid}";`;
    let data =  await connection.query(queryString, (error, results, fields) => {
        console.log("About to SELECT....")
        if (error) {
            console.log(error);
            return res.status(400).json({
                error: true,
                message: "Error checking emails"
            });
        }
        else {
            
            console.log("Success getting emails")
            console.log(results.length)
            console.log(results[0])

            if (results.length > 0){
                
                res.json({
                    error: true,
                    message: "This email or id is already in the system"
                })
                console.log("returning error...")
                return;
            }else{
                res.json({
                    error: false,
                    message: "Both the email and id are unique."
                })
                console.log("returning success...")
                return;
            }
        }
    })
});

/*
    2. Insert new user into system
*/
router.post('/insert', async function (req, res) {
    let email = req.body.email;
    let password = await bcrypt.hash(req.body.password, 10);
    let firstname = req.body.firstname;
    let surname = req.body.surname;
    let schoolid = req.body.schoolid;    
    
    queryString = `INSERT INTO user (schoolid, firstname, surname, email, password) 
                   VALUES ("${schoolid}", "${firstname}", "${surname}", "${email}", "${password}");`

    console.log("Outside of await INSERT after returning...")
    await connection.query(queryString, (error, results, fields) => {
        console.log("About to INSERT....")
        if (error) {
            console.log("dammit");
            return res.status(400).json({
                error: true,
                message: "Error creating new users"
            });
        }else{
            res.json({
                error: false,
                message: "User has been added to the DB."
            })
            return
        }
    });
});
    
/*
    3. Getting iduser and sending back response
*/
router.post('/getiduser', async function (req, res) {
    let email = req.body.email;
    let firstname = req.body.firstname;
    
    queryString = `SELECT iduser FROM user WHERE email="${email}";`;
    await connection.query(queryString, (error, results, fields) => {
        if (error || results.length === 0) {
            console.log(error);
            return res.status(400).json({
                error: true,
                message: "Error getting iduser"
            });
        }else {
            res.json({
                message: "Successfully retrieved iduser",
                email: email,
                firstname: firstname,
                iduser: results[0]["iduser"],
                error:false
            })
            return
        }
    });
});


module.exports = router;