//var gm = require('gm').subClass({imageMagick: true});
var im = require('simple-imagemagick');

class TileMerger {
  constructor(zoom, tileRange , tileFolder, outputFilename  ){
    this._zoom = zoom;
    this._tileRange = tileRange;
    this._tileFolder = tileFolder;
    this._outputFilename = outputFilename;
  }


  build(){



    //console.log( this._tileRange );

    var nbTileWidth = this._tileRange.x.max - this._tileRange.x.min + 1;
    var nbTileHeight = this._tileRange.y.max - this._tileRange.y.min + 1;

    var montageArgs = []

    var stripCounter = 0;

    for(var y=this._tileRange.y.min; y<=this._tileRange.y.max; y++){
      var strip = [];

      for(var x=this._tileRange.x.min; x<=this._tileRange.x.max; x++){
        var toBeMerged = this._tileFolder +
                         "/" +
                         x +
                         "_" +
                         y +
                         "_" +
                         this._zoom +
                         ".png";



        strip.push( toBeMerged )
      }

      var stripName = this._tileFolder + "/strip_" + stripCounter + ".png";

      strip.push("-tile");
      strip.push(nbTileWidth + "x1" );
      strip.push("-geometry");
      strip.push("+0+0");
      strip.push( stripName );

      im.montage( strip,
        function(err, stdout){
          if (err)
            console.log(err);
          console.log(stdout);
        }
      );


      montageArgs.push( stripName )

      stripCounter ++;
    }

    montageArgs.push("-tile");
    montageArgs.push("1x" + nbTileHeight);
    montageArgs.push("-geometry");
    montageArgs.push("+0+0");
    montageArgs.push(this._outputFilename);

    setTimeout(function() {
      im.montage( montageArgs,
        function(err, stdout){
          if (err)
            console.log(err);
          console.log(stdout);
        }
      );
    }, 10000);



  } // end build

}

module.exports = TileMerger;
