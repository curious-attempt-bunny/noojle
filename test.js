var zlib = require('zlib');
var tar = require('tar');
var filename = process.argv[2];
var fs = require("fs");
var path = require('path');
var esprima = require('esprima');
var request = require('request');
var tgz = {};

var package = process.argv[2];
var url = 'http://isaacs.iriscouch.com/registry/'+package;
request(url, function(error, response, body) {
  var doc = JSON.parse(body);
  var versions = Object.keys(doc.versions);
  var latest = doc.versions[versions[versions.length-1]];
  var tarballUrl = latest.dist.tarball;
  request(tarballUrl)
    .pipe(zlib.createGunzip())
    .pipe(tar.Parse())
    .on("entry", function (e) {
      console.error("entry", e.props.path)
      var content = "";
      e.on("data", function (c) {
        content += c.toString();
      });
      e.on("end", function () {
        tgz[e.props.path] = content;
      });
    })
    .on("end", function() {
      console.dir(Object.keys(tgz));

      var package = JSON.parse(tgz['package/package.json']);
      console.dir(package);
      var mainJs = path.join('package', package.main || 'index.js')
      if (!/\.js$/.test(mainJs)) {
        mainJs += ".js"
      }
      var main = tgz[mainJs];
      console.log(main);
      var mainAst = esprima.parse(main);
      console.log(JSON.stringify(mainAst, null, 2));
    });
});

