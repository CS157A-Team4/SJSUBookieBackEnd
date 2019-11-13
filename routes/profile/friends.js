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
router.get('/list/:id', async(req, res) =>{
    let id =  req.params.id;
    console.log(id);
//    let queryString = `select f1.* from FriendsListAndRequest f1 inner join FriendsListAndRequest f2 on f1.user1 = f2.user2 and f1.user1 = f2.user2;`
    let queryString = `SELECT DISTINCT f1.user1,f1.user2, tb.firstname, tb.surname FROM cs157a.FriendsListAndRequest f1 
JOIN user tb ON f1.user1 = tb.iduser WHERE f1.user2 = ${id} 
AND f1.user1 NOT IN(SELECT f1.user2 FROM FriendsListAndRequest f1 
INNER JOIN FriendsListAndRequest f2 
ON f1.user1 = f2.user2 AND f1.user2 = f2.user1 AND f1.user1=${id})`;
    connection.query(queryString,
        function(error, results, fields) {
          if (error){
              console.log("ERROR", error);
          }
          else{
              // send a json response with json support
              res.json(results)
             // res.render('The friends list: ');
              console.log(results[0]);
          };
        }
      );
});

// handle the request; friends request
router.get('/request/:id', async(req, res) =>{
    let id =  req.params.id;
    let queryString = `SELECT DISTINCT f1.user1,f1.user2, tb.firstname, tb.surname FROM cs157a.FriendsListAndRequest f1 WHERE f1.user2 = ${id} AND f1.user1
NOT IN(SELECT f1.user2 FROM FriendsListAndRequest f1 INNER JOIN FriendsListAndRequest f2 
ON f1.user1 = f2.user2 AND f1.user2 = f2.user1 AND f1.user1=${id}) JOIN user tb ON f1.user1 = tb.iduser;`;
    connection.query(queryString,
        function(error, results, fields) {
            if (error){
                console.log("ERROR", error);
            }
            else{
                res.json(results)
                //res.render('The friends request list');
                console.log(results[0]);
            };

        }
    );
});
router.post('/request/create', async(req, res) =>{
    let id =  req.body.user1;
    let id2 = req.body.user2;
    let queryString = `INSERT INTO FriendsListAndRequest(user1, user2) VALUES(${id}, ${id2})`;
    connection.query(queryString,
        function(error, results, fields) {
            if (error){
                console.log("ERROR", error);
                return res.status(400).json({
                    error: true,
                    message: "cannot send friend request"
                });
            }
            else{
                res.json(results);
                return res.status(200).json({
                    error: false,
                    message: "message sends to the user"
                });
            };

        }
    );
});
// router.delete('/delete/:id', async(req, res) =>{
//     let id = req.params.id;
//     let queryString = `DELETE FROM FriendsListAndRequest
//                        WHERE relationshipId= ${id} ;`
//     console.log(queryString);
//     connection.query(queryString,
//         function(error,results,fields){
//             if(error){
//                 console.log("ERROR", error);
//                 return res.status(400).json({
//                     error: true,
//                     message: "cannot delete the friend request"
//                 });
//             }
//             else{
//                 console.log(results);
//                 return res.status(200).json({
//                     error:false,
//                     message:"Deleted the friend request."
//                 });
//             }
//         });
//  });

module.exports = router;