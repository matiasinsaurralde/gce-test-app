'use strict';

var express = require( 'express' ),
    app = express();


app.get( '/', function( req, res ) {
  res.status(200).send( 'test' );
});

var server = app.listen( process.env.PORT || 8080, function () {
  var host = server.address().address,
      port = server.address().port;

  console.log('=> http://%s:%s', host, port);
});
