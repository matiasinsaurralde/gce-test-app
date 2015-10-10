'use strict';

var express = require( 'express' ),
    bodyParser = require( 'body-parser' ),
    Chance = require( 'chance' ),
    chance = new Chance(),
    compression = require( 'compression' ),
    urlencodedParser = bodyParser.urlencoded({ extended: false }),
    app = express(),
    people = [ ];

app.use( express.static( './public' ) );

app.use( compression() );

app.post( '/', urlencodedParser, function( req, res ) {
  people.push( req.body );
  res.redirect( '/' );
});

app.get( '/ganador.json', function( req, res ) {
  res.json( chance.pick( people, 3 ) );
});

var server = app.listen( process.env.PORT || 8080, function () {
  console.log( ':)' );
});
