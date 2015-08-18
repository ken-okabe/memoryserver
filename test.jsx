(() => {
  'use strict';
  var port = 28888;
  var directory = 'test-www';

  var server = require('./memoryserver.js');

  var cb = () => {
    console.log('server is up');
  };

  var myServer = server(directory, port, cb);

})();
