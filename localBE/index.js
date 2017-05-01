var express = require('express');
var bodyParser = require('body-parser')
var app = express();

app.use(bodyParser.json())
console.log('logging start')

app.post('/signup', function(req, res) {
    console.log(req.body)
    let account = req.body.account
    let idnum = req.body.idnum
    let password = req.body.password
    console.log({account, idnum, password})
    let data = {
        isValid: ((account === '123') && (password === '123') && (idnum === '123')) ? true : false,
        isStudent: true
    }
    res.send(JSON.stringify(data))
});

app.get('/', function (req, res) {
    res.send('test')
})

app.listen(3000);