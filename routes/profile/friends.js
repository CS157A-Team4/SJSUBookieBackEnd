/* Node.js web application framework with a set of features of the Friends request page */
var express = require('express');
var router = express.Router();
var connection = require('../database');

// respond "Friends API is working properly" when the GET request is made to the Friends page
router.get('/', function(req, res, next) {
    res.send('Friends API is working properly');
});

// handle the list friends request
// req: get the request
// res: send the response
router.get('/list/:id', async (req, res) =>{
    let id =  req.params.id;
//    let queryString = `select f1.* from FriendsListAndRequest f1 inner join FriendsListAndRequest f2 on f1.user1 = f2.user2 and f1.user1 = f2.user2;`
    let queryString = `select f1.*, tb.firstname, tb.surname from FriendsListAndRequest f1 inner join 
FriendsListAndRequest f2 on f1.user1 = f2.user2 and f1.user2 = f2.user1 and f1.user1=${id}
JOIN user tb ON f1.user2 = tb.iduser`;
    connection.query(queryString,
        function(error, results, fields) {
          if (error){
              console.log(error);
          }
          else{
              // send a json response with json support
              res.json(results)
              res.render('The friends list: ');
              console.log(results[0]);
          };
        }
      );
});

// handle the request friends request
router.get('/request/:id', async (req, res) =>{
    let id =  req.params.id;
    let queryString = `SELECT f1.* from FriendsListAndRequest f1 WHERE f1.user1 != 23 and f1.user1 
NOT IN(select f1.user2 from FriendsListAndRequest f1 INNER JOIN FriendsListAndRequest f2 on f1.user1 = f2.user2 and 
f1.user2 = f2.user1 and f1.user1=${id});`;
    connection.query(queryString,
        function(error, results, fields) {
            if (error){
                console.log(error);
            }
            else{
                res.json(results)
                res.render('The friends request list');
                console.log(results[0]);
            };

        }
    );
});

module.exports = router;