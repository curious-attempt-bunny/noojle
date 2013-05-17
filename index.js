var request = require('request');

/*
 * GET home page.
 */

exports.index = function(req, res){
  var package = req.params.package;
  var url = 'http://isaacs.iriscouch.com/registry/'+package;
  request(url, function(error, response, body) {
    var doc = JSON.parse(body);
    if (doc.error) {
      res.json(500, {fail: 'Usage: /:package'});
      return;
    }
     var versions = Object.keys(doc.versions);
    var latest = doc.versions[versions[versions.length-1]];
    res.json(latest);
  });
};
