var express = require('express');
var router = express.Router();
var connection = require('../database');
const bcrypt = require('bcryptjs')


router.get('/', function(req, res, next) {
    res.send('Post api is working properly');
});


router.post('/hash', async function(req, res) {
    let password = await bcrypt.hash(req.body.password, 10);
    res.json(password)
})

router.post('/submit', async function(req,res){
      let email =  req.body.email;
      let password = await bcrypt.hash(req.body.password, 10);
    
        /*
        1. Take a username and 'password'
        2. Check if username matches, than password (or both at the same time)
        3. If 
        */
      queryString = `SELECT schoolid, iduser, firstname, surname, email FROM user WHERE email="${email}" AND password="${password}";`;
      connection.query(
        queryString,
        function(error, results, fields) {
          if (error){
              console.log(error);
                return res.status(400).json({
                    error: true,
                    message: "Error logging in"
              }); 
          }else{
                if(results.length > 0){
                    console.log("Success!!")  
                    console.log(JSON.stringify(results))
                    res.json({
                        error: false,
                        data: results,
                        message: "Successful login"})
                }else{
                    res.json({
                        error: true,
                        message: "Incorrect username or password. Please try again"
                    })
                }
            }
        }
      );
});


module.exports = router;