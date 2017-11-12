var express = require('express'),
    cors = require('cors');

var app = express();
app.use(cors({credentials: true, origin: 'http://localhost:63342'}));

var loggedIn = false;
var noLogin = true;

app.get('/login_mode', function (req, res) {
    if (noLogin) res.send("false");
    else if (!loggedIn) res.status(403).end();
});

app.get('/identifier', function (req, res) {
    if (noLogin || loggedIn) res.send('"Casa Zausa"');
    else res.status(403).end();
});

app.get('/temp', function (req, res) {
    if (noLogin || loggedIn) res.send('"23.00°"');
    else res.status(403).end();
});

app.listen(8080);
