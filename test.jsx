(() => {
  'use strict';
  var port = 28888;
  var directory = './test-www';

  var memoryserver = require('./memoryserver.js');

  var server = memoryserver(directory, port);
  server.up = () => {
    console.log('server is up ' + port);
  };

  var io = require('socket.io')(server);
  io.on('connection', (socket) => {
    console.log('socket.io client connected!');
  });

})();
