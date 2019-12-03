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
    //let enteredPass =  await bcrypt.hash(req.body.password, SALT_ROUNDS);
    
    /*
        1. Check if email exists
        2. If so, get password
        3. compare {hashed[entered] password}  & {hashed[stored] password}
        4. If there is a match, return data
    */
    //queryString = `SELECT schoolid, iduser, firstname, surname, email FROM user WHERE email="${email}" AND password="${password}";`;
    
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
    await connection.query(queryString, (error, results, fields) => {
        if (error) {
            console.log(error);
            return res.status(400).json({
                error: true,
                message: "Error getting password"
            });
        }
        else {
            console.log(JSON.stringify(results))
            console.log(results["password"])
            

            if (bcrypt.compare(enteredPass, results["password"])){
                res.json({
                    error: false,
                    message: "Password matches!"
                })
            }else{
                res.json({
                    error: true,
                    message: "I don't think that password matches"
                })
            }
        }
    });


    // connection.query(
    //     queryString,
    //     function(error, results, fields) {
    //       if (error){
    //           console.log(error);
    //             return res.status(400).json({
    //                 error: true,
    //                 message: "Error logging in"
    //           }); 
    //       }else{
    //             if(results.length > 0){
    //                 console.log("Success!!")  
    //                 console.log(JSON.stringify(results))
    //                 res.json({
    //                     error: false,
    //                     data: results,
    //                     message: "Successful login"})
    //             }else{
    //                 res.json({
    //                     error: true,
    //                     message: "Incorrect username or password. Please try again"
    //                 })
    //             }
    //         }
    //     }
    //   );
});


module.exports = router;