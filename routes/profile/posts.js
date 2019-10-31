var express = require('express');
var router = express.Router();
var connection = require('../database');
router.get('/', function(req, res, next) {
    res.send('Post api is working properly');
});

router.post('/save', async function(req, res) {
    userId = req.body.userId
    postType = req.body.postType
    postId = req.body.postId;
    imageId = req.body.imageId;
    //checkString = `SELECT * FROM SavedPost WHERE \`userId\`="${userId}" AND \`ID_POST\="${postId};`
    queryString = `INSERT INTO SavedPost(\`userID\`, \`postType\`, \`ID_Post\`,\`imageID\`) \
    VALUES(${userId},"favorite", ${postId},"${imageId}");`;
    console.log(queryString);
    connection.query(
        queryString,
        function(error, results, fields) {
          if (error){
              console.log(error);
            return res.status(400).json({
                error: true,
                message: "Error inserting into Saved Posts"
              }); 
          }
          else{
            return res.status(200).json({
                error: false,
                message: "Successfully Added Post"
              }); 
            }
        }
      );
    });
    router.post('/unsave', async function(req, res) {
        userId = req.body.userId
        postId = req.body.postId;
        queryString = `DELETE FROM SavedPost WHERE \`userID\`="${userId}" AND \`postType\` ="favorite" AND \`ID_Post\`="${postId}";`;
        console.log(queryString);
        connection.query(
            queryString,
            function(error, results, fields) {
              if (error){
                  console.log(error);
                return res.status(400).json({
                    error: true,
                    message: "Error Deleting the Saved Posts"
                  }); 
              }
              else{
                return res.status(200).json({
                    error: false,
                    message: "Successfully Deleted Post"
                  }); 
                }
            }
          );
        });

module.exports = router;