'use strict';

(function () {
  'use strict';

  var http = require('http');
  var url = require('url');
  var path = require("path");
  var fs = require('fs');

  var mimeTypes = {
    "html": "text/html",
    "js": "text/javascript",
    "css": "text/css",
    "jpeg": "image/jpeg",
    "jpg": "image/jpeg",
    "png": "image/png",
    "gif": "image/gif",
    "svg": "image/svg+xml",
    "ico": "image/vnd.microsoft.icon"
    // more
  };

  var memoryserver = function memoryserver(dir, port, upCb, request) {

    //--------------------------------------------------------
    var wwwLoad = function wwwLoad(publicDir, cbF) {
      console.log("==== seek Dir ===");

      var publicObj = {};

      var seekDir = function seekDir(dir) {
        //  console.log(dir);
        fs.readdir(dir, function (err, dirA) {
          if (err) {
            var path0 = err.path;
            var path1 = path0.split(publicDir)[1];
            //  console.log(path1);

            fs.readFile(path0, function (err, file) {
              if (err) {
                console.log('fileLoadError!');
              } else {
                console.log("key is " + path1);
                publicObj[path1] = file;
              }
            });
          } else {
            var dummy = dirA.map(function (file) {
              seekDir(dir + "/" + file);
            });
          }
        });
      };

      console.log('seekDir(publicDir);');
      seekDir(publicDir);

      var f = function f() {
        cbF(publicObj);
      };

      setTimeout(f, 1000);

      //wait to have walked whole dir
    };
    //---------------------------------------------------------

    console.log(__dirname);
    var wwwpath = path.join(__dirname, dir);

    //start here
    wwwLoad(wwwpath, function (publicObj) {
      var request = function request(req, res) {

        var writeOut = function writeOut(contentKey) {
          res.writeHead(200, {
            'Content-Type': mimeTypes[path.extname(contentKey).split(".")[1]]
          });

          var content = publicObj[contentKey];
          res.end(content);

          return;
        };

        var uri = url.parse(req.url).pathname;
        console.log(uri);

        if (uri === '/') {
          console.log('/ root folder requested, so write index.html');
          writeOut('/index.html');
        } else if (!publicObj[uri]) {
          console.log('file does not exist, so no writeout');
          //    writeOut('/index.html');
        } else {
            console.log('file exsists and writeout');
            writeOut(uri);
          }

        return;
      };

      console.log('server starting');
      var server = http.createServer(request).listen(port, upCb);

      return server;
    });
  };

  module.exports = memoryserver;
})();
