var OsmPosterMaker = require('../src/OsmPosterMaker.js');

var workingFolder = "./img"
var outputFile = workingFolder + "/out.png";

// NYC
var box = {
  n: 40.8234,
  s: 40.6793,
  e: -73.9287,
  w: -74.0340
}

var zoom = 11;

var mapBoxStyle = {
  username: "jonathanlurie",
  mapStyleID: "cj4g48asn0z5e2rn1alrdx14h",
  token: "pk.eyJ1Ijoiam9uYXRoYW5sdXJpZSIsImEiOiJjajRuandpdnAwMHpzMnd0Y3FwYXBlNTZ0In0.yZ21xWxBlESJVQib1wJDoA",
  tileSize: 1024
}

var pm = new OsmPosterMaker(
  box,
  zoom,
  workingFolder,
  outputFile,
  mapBoxStyle
)

// defining some events

pm.on( "tileDownloaded", function(index, total){
  console.log("DL tile: " + index + "/" + total);
})

pm.on( "downloadDone", function(){
  console.log("All tiles are downloaded");
})

pm.on( "stripWriten", function(index, total){
  console.log("Strip written: " + index + "/" + total);
})

pm.on( "successMerge", function( path ){
  console.log("Final image ready at: " + path);
})




pm.launch();
