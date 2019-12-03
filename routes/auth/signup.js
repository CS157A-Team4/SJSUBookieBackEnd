var express = require('express');
var router = express.Router();
var connection = require('../database');

router.get('/', function(req, res, next) {
    res.send('Signup api is working properly');
});

router.post('/submit', async function(req,res){
    let email =  req.body.email;
    let password =  req.body.password;
    let firstname = req.body.firstname;
    let surname = req.body.surname;
    let schoolid = req.body.schoolid;

      /*
      1. Check if email is already in system
      */
     let queryString = `SELECT email FROM user WHERE email="${email}";`;
     connection.query(
        queryString,
        function(error, results, fields) {
          if (error){
              console.log(error);
                return res.status(400).json({
                    error: true,
                    message: "Error checking emails"
              }); 
          }
          else{
                console.log("Success getting emails")  
                res.json(results);
            }
        }
      );
});


module.exports = router;