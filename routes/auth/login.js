var express = require('express');
var router = express.Router();
var connection = require('../database');


router.get('/', function(req, res, next) {
    res.send('Post api is working properly');
});


router.post('/submit', async function(req,res){
      email =  req.body.email;
      password =  req.body.password;
    
    
      /*
    1. Take a username and 'password'
    2. Check if username matches, than password (or both at the same time)
    3. If 
    */

      queryString = `SELECT schoolid, firstname, surname, email FROM user WHERE email="${email}" AND password="${password}";`;
      connection.query(
        queryString,
        function(error, results, fields) {
          if (error){
              console.log(error);
                return res.status(400).json({
                    error: true,
                    message: "Error getting the posts"
              }); 
          }
          else{
            console.log("Success!!")  
            res.json(results);
            }
        }
      );
});


module.exports = router;