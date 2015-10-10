'use strict';

var express = require( 'express' ),
    bodyParser = require( 'body-parser' ),
    Chance = require( 'chance' ),
    chance = new Chance(),
    urlencodedParser = bodyParser.urlencoded({ extended: false }),
    app = express(),
    people = [];

app.use( express.static( './public' ) );

app.post( '/', urlencodedParser, function( req, res ) {
  people.push( req.body );
  res.redirect( '/' );
});

app.get( '/supersorteo', function( req, res ) {
  res.send( chance.pick( people ) );
});

var server = app.listen( process.env.PORT || 8080, function () {
  console.log( ':)' );
});
