var express = require('express');
var router = express.Router();
var connection = require('../database');

router.get('/', async function(req, res) {
    email = req.body.email;
    password = req.body.password;
    queryString = `SELECT * FROM user WHERE email="${email}" and password="${password}";`;
    console.log(queryString);
    connection.query(
        queryString,
        function(error, results, fields) {
            if(error){
                console.log(error);
                return res.status(400).json({
                    error: true,
                    message: "Error getting user"
                });
            }else{  
                return res.status(200).json({
                    error: false,
                    message: `User Found:\n email:  ${email}\n pasword: ${password}`
                }); 
            }
        }
    )
})


module.exports = router;