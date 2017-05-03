var express = require('express');
var bodyParser = require('body-parser')
var app = express();

app.use(bodyParser.json())
console.log('logging start')
const merge = ( ...sources) => Object.assign({}, ...sources)

app.post('/signup', function(req, res) {
    let account = req.body.account
    let idnum = req.body.idnum
    let password = req.body.password
    let data = {
        isValid: ((account === '123') && (password === '123') && (idnum === '123')) ? true : false,
        isStudent: true
    }
    res.send(JSON.stringify(data))
});

app.post('/Message', function(req, res) {
    const data = [].concat([{
        class: '3',
        course: 'c',
        allocationcode: '002'
    }], [{
        class: '2',
        course: 'b',
        allocationcode: '001'
    }])
    console.log(data)
    res.send(JSON.stringify(data))
});

app.post('/signin', function (req, res) {
    let account = req.body.account
    let password = req.body.password
    let data = {
        isValid: ((account === '123') && (password === '123')) ? true : false,
        isStudent: true
    }
    res.send(JSON.stringify(data))
})

app.get('/', function (req, res) {
    res.send('test')
})

app.listen(3000);