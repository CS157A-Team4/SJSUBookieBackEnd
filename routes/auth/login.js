var express = require('express');
var router = express.Router();
var connection = require('../database');


router.get('/', function(req, res, next) {
    res.send('Post api is working properly');
});

router.get('/:id', function(req,res,next){
      let id =  req.params.id;
      queryString = `SELECT * FROM user WEHRE iduser=${id};`;
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
            return res.status(200).json({
                error:false,
                message: "Successfully returned post",
                data: results
              }); 
            }
        }
      );
});


module.exports = router;