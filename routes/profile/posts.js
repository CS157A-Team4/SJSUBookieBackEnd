var express = require('express');
var router = express.Router();
var connection = require('../database');
router.get('/', function(req, res, next) {
    res.send('Post api is working properly');
});

router.get('/getAll/:id', function(req,res,next){
    let id =  req.params.id;
    queryPosts = `SELECT Post.*, COALESCE(tb4.hold,0), user.firstname, user.surname, PostImage.image, COALESCE(tb4.hold,0) AS 'hold' FROM Post JOIN PostImage ON PostImage.imageID = Post.imageId JOIN user ON user.iduser = Post.seller LEFT JOIN (SELECT Holds.postID, Holds.hold FROM Holds WHERE Holds.timer >= CURDATE()) tb4 ON tb4.postID =Post.postID WHERE seller=${id};`;
    queryHolds= `SELECT Post.*, user.firstname, user.surname, PostImage.image, COALESCE(tb4.hold,0) AS 'hold'FROM Holds JOIN Post ON Holds.postID = Post.postID JOIN PostImage ON PostImage.imageID = Post.imageId JOIN user ON user.iduser = Post.seller LEFT JOIN (SELECT Holds.postID, Holds.hold FROM Holds WHERE Holds.timer >= CURDATE()) tb4 ON tb4.postID =Post.postID WHERE buyer=${id} AND timer >= CURDATE();`;
    querySavedPosts = `SELECT Post.*, user.firstname,user.surname, PostImage.image, COALESCE(tb4.hold,0) AS 'hold' FROM SavedPost JOIN Post ON Post.postID = SavedPost.postid JOIN user ON user.iduser = Post.seller JOIN PostImage on Post.imageId = PostImage.imageID LEFT JOIN (SELECT Holds.postID, Holds.hold FROM Holds WHERE Holds.timer >= CURDATE()) tb4 ON tb4.postID =Post.postID WHERE SavedPost.userID=${id};`;

    connection.query( queryPosts + queryHolds + querySavedPosts,
        function(error, results, fields) {
            if (error){
                console.log(error);
                res.status(400).json({
                    error: true,
                    message: "Error getting the posts"
                });
            }
            else{
                res.status(200).json({
                    error:false,
                    message: "Successfully returned the posts",
                    posts: results[0],
                    holds: results[1],
                    saved: results[2]

                });
            }
        }
    );
});

router.post('/save', async function(req, res) {
    userId = req.body.userId
    postType = req.body.postType
    postId = req.body.postId;

    //checkString = `SELECT * FROM SavedPost WHERE \`userId\`="${userId}" AND \`ID_POST\="${postId};`
    queryString = `INSERT INTO SavedPost(\`userID\`, \`postType\`, \`postid\`) \
    VALUES(${userId},"favorite", ${postId});`;
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
        queryString = `DELETE FROM SavedPost WHERE \`userID\`="${userId}" AND \`postType\` ="favorite" AND \`postid\`="${postId}";`;
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