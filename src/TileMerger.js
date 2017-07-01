var gm = require('gm').subClass({imageMagick: true});
var im = require('simple-imagemagick');

class TileMerger {
  constructor(zoom, tileRange , tileFolder, outputFilename  ){
    this._zoom = zoom;
    this._tileRange = tileRange;
    this._tileFolder = tileFolder;
    this._outputFilename = outputFilename;
    this._stripNames = [];
    this._nbStripsSuccesfullyWritten = 0;
  }


  build(){
    var that = this;


    //console.log( this._tileRange );

    var nbTileWidth = this._tileRange.x.max - this._tileRange.x.min + 1;
    var nbTileHeight = this._tileRange.y.max - this._tileRange.y.min + 1;

    // reinint the stripname list
    this._stripNames.length = 0;
    this._nbStripsSuccesfullyWritten = 0;


    for(var y=this._tileRange.y.min; y<=this._tileRange.y.max; y++){

      var currentStripGm = gm();

      for(var x=this._tileRange.x.min; x<=this._tileRange.x.max; x++){
        var toBeMerged = this._tileFolder +
                         "/" +
                         x +
                         "_" +
                         y +
                         "_" +
                         this._zoom +
                         ".png";

        currentStripGm.append( toBeMerged , true)
      }

      var currentStripName = this._tileFolder + "/strip_" + this._stripNames.length + ".png";
      this._stripNames.push( currentStripName )

      currentStripGm.write(
        currentStripName,
        function (err) {
          if( err ){
            console.error( err );
          }else{
            console.log("success strip: " + that._nbStripsSuccesfullyWritten);
            that._nbStripsSuccesfullyWritten++;

            if( nbTileHeight == that._nbStripsSuccesfullyWritten){
              console.log( "wrote all stripes!" );
              that._mergeStrips();
            }

          }
        }
      );

    }

  } // end build


  _mergeStrips(){
    var that = this;
    var allStrips = gm();

    //for(var i=0; i<this._stripNames.length; i++){
      allStrips.append(this._stripNames, false)
    //}

    allStrips.write(
      this._outputFilename,
      function (err) {
        if( err ){
          console.error( err );
        }else{
          console.log("final image at: " + that._outputFilename);
        }
      }
    );

  }

}

module.exports = TileMerger;
