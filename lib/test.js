var Stream = require('stream');
var all = require('../all.json');
var request = require('request');

var stream = new Stream();
stream.readable = stream.writable = true
/*
stream.on('data', function(repo) {
  console.dir(repo);
  return;
  var fragment = /.*github.com[:\/](.*?)(?:\.git)?$/.exec(repo.repository.url);
  if (!fragment) return;
  var url = "http://raw.github.com/"+fragment[1]+"/master/README.md"
  request(url, function(error, response, body) {
    if (error) {
      console.dir(error);
      return;
    }
    if (/body/.test(body)) {
      console.dir(response);
      asdasd
    }
    console.dir(repo); 
    console.dir(body);
  });
});
*/

stream.on('data' function(repo) {
  var url = 'http://isaacs.iriscouch.com/registry/'+repo.na
});

var keys = Object.keys(all);
for(var i=0; i<keys.length; i++) {
  var repo = all[keys[i]];
  //if (repo.repository && repo.repository.type == 'git') {
    stream.emit('data', repo);
  //}
}

