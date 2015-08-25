(() => {
  'use strict';
  var port = 28888;
  var directory = './test-www';

  var memoryserver = require('./memoryserver.js');

  var server = memoryserver(directory, port);

  /*
    var url = require('url');
    var path = require("path");
    var fs = require('fs');

  //custom requiest
    server
      .request = (req, res) => {
      var writeOut = (contentKey) => {
        res.writeHead(200, {
          'Content-Type': server.mimeTypes[path.extname(contentKey).split(".")[1]]
        });

        var content = server.publicObj[contentKey];
        res.end(content);

        return;
      };

      var uri = url.parse(req.url).pathname;
      console.log(uri);

      if (uri === '/') {
        console.log('/ root folder requestd!!!!!!!!');
        writeOut('/index.html');
      } else if (!server.publicObj[uri]) {
        console.log('file does not exist, so no writeout!!!!');
      //    writeOut('/index.html');
      } else {
        console.log('file exsists and writeout!!!!!');
        writeOut(uri);
      }

    };
  */

  server.on('request', server.request)
    .listen(port, () => {
      console.log('server is up!!!!! ' + port);
    }) ;


  var io = require('socket.io')(server);
  io
    .on('connection', (socket) => {
      console.log('socket.io client connected!');
    });


})();
