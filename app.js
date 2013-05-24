var express = require('express');
var app = express();
var parser = require('noojle-parser');

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.get('/', function(req, res) {
  res.render('search', {results: {}});
});

app.get('/packages/:package', function(req, res) {
  parser(req.params.package, function(error, detail) {
    if (error) {
      res.status(500);
      return res.json(error);
    }

    res.json(detail);
  }); 
});

app.listen(process.env.PORT || 3000);
