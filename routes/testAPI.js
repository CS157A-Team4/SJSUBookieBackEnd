var express = require('express');
var router = express.Router();
var connection = require('./database');


router.get('/', function (req, res, next) {
  res.send('API is working properly');
});

router.get('/tables',function(req, res, next) {
    console.log("hi");
    connection.query(
      "SELECT * FROM user;", 
      function(error, results, fields) {
        if (error) throw error;
        res.json(results);
      }
    );
  });
  router.get('/courses',function(req,res){
    let courseString = "SELECT * FROM Courses;";
    connection.query(
      courseString,
      function(error, results, fields) {
        if (error) {
          res.json({error:true, message:error});
        }
        else{
        res.json({error:false, message:results});
        }
      }
    );
  })

router.get('/search', function (req, res) {
  console.log("hi");
  let course = req.query.course;
  let name = req.query.bname;
  console.log("course:" + typeof (course));
  console.log("name: " + typeof (name));
  if (course !== '' && name !== '') {
    conditions = 'WHERE tb1.course = \'' + course + '\' AND tb1.title LIKE \'%' + name + '%\'';
  }
  else if (course !== '' && name === '') {
    conditions = 'WHERE tb1.course = \'' + course + '\'';
  }
  else if (course === '' && name !== '') {
    conditions = 'WHERE tb1.title LIKE \'%' + name + '%\'';
  }
  console.log(conditions);
  connection.query(
    `SELECT tb1.*, tb2.firstname, tb2.surname, tb3.image, COALESCE(tb4.hold,0) AS 'hold' 
    FROM Post tb1 JOIN user tb2 ON tb1.seller = tb2.iduser JOIN PostImage tb3 ON tb3.imageID = tb1.imageId 
    LEFT JOIN (SELECT Holds.postID, Holds.hold FROM Holds WHERE Holds.timer >= CURDATE()) tb4 ON tb4.postID =tb1.postID 
    ${conditions};`,
    function(error, results, fields) {
      if (error) throw error;
      res.json(results);
    }
  );
});
module.exports = router;