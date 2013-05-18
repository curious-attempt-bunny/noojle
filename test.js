var zlib = require('zlib');
var tar = require('tar');
var filename = process.argv[2];
var fs = require("fs");
var path = require('path');
var esprima = require('esprima');
var request = require('request');
var Stream = require('stream');
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
      //console.error("entry", e.props.path)
      var content = "";
      e.on("data", function (c) {
        content += c.toString();
      });
      e.on("end", function () {
        tgz[e.props.path] = content;
      });
    })
    .on("end", function() {
      //console.dir(Object.keys(tgz));

      var packageJson = JSON.parse(tgz['package/package.json']);
      //console.dir(packageJson);
      var mainJs = path.join('package', packageJson.main || 'index.js')
      if (!/\.js$/.test(mainJs)) {
        mainJs += ".js"
      }

      var minimal = "";

      var main = tgz[mainJs];
      //console.log(main);
      var mainAst = esprima.parse(main, {range: true});
      //console.log(JSON.stringify(mainAst, null, 2));
      var statements = mainAst.body;
      for(var i=0; i<statements.length; i++) {
        var statement = statements[i];
        if ((statement.type == 'ExpressionStatement' && statement.expression.type == 'AssignmentExpression') || statement.type == 'FunctionDeclaration') {
          //expressionStream.emit('data', statement.expression);
          //console.log(JSON.stringify(statement, null, 2));
          minimal += main.substring(statement.range[0], statement.range[1])+";\n";
        }
      }

      expression = "eval = null; require = function() { return null; }; "+minimal+"[typeof(module.exports), Object.keys(module.exports), module.exports.toString()]"
      //console.log(expression);
      var results = eval(expression);
      var type = results[0];
      var keys = results[1];
      var code = results[2];
      //console.log(type, keys, code);
      var isValid = type == 'function' && (keys.length == 0|| keys.length == 1 && keys[0] == package);
      //console.log("isValid", isValid);
      if (isValid) {
        var functionAst = esprima.parse(code);
        var args = functionAst.body[0].params.map(function(param) { return param.name });
        console.log(package+"("+args.join(", ")+")");
      }
    });
});

