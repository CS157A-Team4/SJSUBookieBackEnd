var express = require('express');
var router = express.Router();
var connection = require('../database');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'SJSUBookie Endpoints' });
});
router.get('/selling/:id', function(req, res, next) {
    let id =  req.params.id;
    let queryString = `SELECT * FROM Holds WHERE seller=${id} AND timer >= CURDATE();`
    connection.query(
        queryString,
        function(error, results, fields) {
          if (error) {
              res.json({
                    error:true, message:error
                });
          }
          else{
              res.json({
                    error:false, message:results
              })
          }
        }
      );
  });
router.get('/buying/:id', function(req, res, next) {
    let id =  req.params.id;
    let queryString = `SELECT * FROM Holds WHERE buyer=${id} AND timer >= CURDATE();`
    connection.query(
        queryString,
        function(error, results, fields) {
          if (error) {
              res.json({
                    error:true, message:error
                });
          }
          else{
              res.json({
                    error:false, message:results
              })
          }
        }
      );
  });
router.post('/create', async function(req, res) {
    buyer = req.body.buyer;
    seller = req.body.seller;
    id = req.body.postID;
    date = req.body.date;
    let queryString = `INSERT INTO Holds (\`buyer\`, \`timer\`, \`seller\`,\`postID\`) 
    SELECT ${buyer}, DATE("${date}"),${seller},${id}
        WHERE NOT EXISTS
            (SELECT * FROM Holds WHERE buyer = ${buyer} AND seller = 19 AND postID=2  AND timer >= DATE("${date}"));`;
    let requestMaker = `INSERT INTO FriendsListAndRequest(user1, user2) SELECT '${buyer}', '${seller}'
    WHERE NOT EXISTS
        (SELECT * FROM FriendsListAndRequest WHERE user1 = ${buyer} AND user2 =${seller});`;
    connection.query(
        queryString,requestMaker,
        function(error, results, fields) {
            if (error) {
                res.json({
                      error:true, message:error
                  });
            }
            else{
                res.json({
                      error:false, message:"Passed"
                })
            }
    })
});
router.delete('/delete/:id', async function(req, res) {
    let id =  req.params.id;
    let deleteStatement = `DELETE FROM Holds WHERE reservationID=${id};`;
    connection.query(deleteStatement,
      function(error,results,fields){
        if(error){
          return res.status(400).json({
            error: true,
            message: "Error deleting the hold"
          }); 
        }
        else{
          console.log(results);
            return res.status(200).json({
              error:false,
              message:"Deleted the hold."
            });
        }
      });
})
module.exports = router;
