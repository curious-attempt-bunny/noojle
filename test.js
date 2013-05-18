var zlib = require('zlib');
var tar = require('tar');
var filename = process.argv[2];
var fs = require("fs");
var path = require('path');
var tgz = {};


fs.createReadStream(filename)
  .pipe(zlib.createGunzip())
  .pipe(tar.Parse())
  .on("entry", function (e) {
    console.error("entry", e.props.path)
    var content = "";
    e.on("data", function (c) {
      content += c.toString();
    })
    e.on("end", function () {
      tgz[e.props.path] = content;
    })
  })
  .on("end", function() {
    console.dir(Object.keys(tgz));

    var package = JSON.parse(tgz['package/package.json']);
    console.dir(package);
    //var main = tgz[path. 
  });
