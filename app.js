var express = require('express');
var app = express();
var parser = require('noojle-parser');


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
