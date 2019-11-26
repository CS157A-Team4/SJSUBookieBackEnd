/* Node.js web application framework with a set of features of the Friends request page */
var express = require('express');
var router = express.Router();
var connection = require('../database');

router.post('/send', function(req, res) {
    sender = req.body.sender;
    receiver = req.body.receiver;
    content = req.body.content;
    date = req.body.date;
    queryString = `INSERT INTO   Message (\`receiver\`, \`sender\`, \`content\`, \`date\`) VALUES(${sender},${receiver},"${content}","${date}");`;
    connection.query(
        queryString,
        function(error, results, fields) {
          if (error){
              console.log(error);
            return res.status(400).json({
                error: true,
                message: "Error sending the messsage"
              }); 
          }
          else{
            return res.status(200).json({
                error: false,
                message: "Successfully sent message"
              }); 
            }
        }
    );
});

router.post('/getMessages', function (req,res){
    u1 = req.body.sender;
    u2 = req.body.receiver;
    queryString = `SELECT * FROM Message WHERE (receiver=${u1} AND sender=${u2}) OR (receiver=${u2} AND sender=${u1}) ORDER BY date;`
    connection.query(queryString,
        function(error, results, fields) {
            if (error){
                console.log(error);
              return res.status(400).json({
                  error: true,
                  message: "Error retrieving messages"
                }); 
            }
            else{
                return res.status(200).json({
                    error: false,
                    message: results
                }); 
              }
        }
      );
});

module.exports = router;