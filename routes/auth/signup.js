var express = require('express');
var router = express.Router();

router.post('/', (req, res) => {
    const {title, body} = req.body;
    const INSERT_MESSAGE_QUERY = `INSERT INTO posts (id, title, body) VALUES ('${title}', '${body}');`
    connection.query(INSERT_MESSAGE_QUERY, (err, results) => {
        if(err) throw err
        else{
            res.send('successfully added post')
        }
    })
})

module.exports = router;