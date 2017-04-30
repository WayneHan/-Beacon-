var express = require('express');
var app = express();

app.get('/signin', function(req, res) {
    let account = req.body.signInAccount;
    let password = req.body.signInPassword;
    let data = {
        isValid: ((account === '2013211300') && (password === '123')) ? true : false,
        isStudent: true
    }
    res.send(data);

    next();
});

app.listen(3000);