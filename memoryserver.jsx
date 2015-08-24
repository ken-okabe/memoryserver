(() => {
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

  var memoryserver = (PublicDir, port) => {

    console.log("==== seek Dir ===");

    var publicObj = {};

    var seekDir = (dir) => {
      //  console.log(dir);
      fs.readdir(dir, (err, dirA) => {
        if (err) {
          var path0 = err.path;
          var path1 = path0.split(PublicDir)[1];
          //      console.log(path1);

          fs.readFile(path0, (err, file) => {
            if (err) {
              console.log('fileLoadError!');
            } else {
              console.log("key is " + path1);
              publicObj[path1] = file;
            }
          });
        } else {
          var dummy = dirA.map((file) => {
            seekDir(dir + "/" + file);
          });
        }
      });
    };

    var request = (req, res) => {
      var writeOut = (contentKey) => {
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

    console.log('seekDir(PublicDir);');
    seekDir(PublicDir);

    console.log('server starting');
    var server = http.createServer(request);

    server.up = () => {
    };

    var f = () => {
      server.listen(port, () => {
        server.up();
      });
    };
    setTimeout(f, 1000);


    return server;
  };
  //---------------------------------------------------------

  module.exports = memoryserver;

})();
