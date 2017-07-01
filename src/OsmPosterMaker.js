var TileLister = require('./TileLister.js');
var TileDownloader = require('./TileDownloader.js');
var TileMerger = require('./TileMerger.js');
var MapboxUrlBuilder = require('./MapboxUrlBuilder.js');

class OsmPosterMaker {

  constructor( wgs84Box, zoom, workingFolder, outputFile, mapStyleData ){
    this._wgs84Box = wgs84Box;
    this._zoom = zoom;
    this._workingFolder = workingFolder;
    this._outputFile = outputFile;

    this._tileLister = new TileLister();
    this._tileLister.setWGS84Box( wgs84Box );
    this._tileLister.setZoomLevel( zoom );
    this.osmUrlPattern = null;

    // getting the OSM url pattern
    if("osmPattern" in mapStyleData && typeof mapStyleData.osmPattern == "string" ){
      this.osmUrlPattern = mapStyleData.osmPattern;
    }else if( MapboxUrlBuilder.checkObjectIntegrity( mapStyleData ) ){
      var tileSize = "tileSize" in mapStyleData ? mapStyleData.tileSize : 512;
      this.osmUrlPattern = MapboxUrlBuilder.build(
        mapStyleData.username,
        mapStyleData.mapStyleID,
        mapStyleData.token,
        tileSize
      )
    }
  }


  launch(){
    var that = this;
    var tileFileList = this._tileLister.buildFileListFromOsmPattern( this.osmUrlPattern )
    var tileRange = this._tileLister.getTileRange();

    var td = new TileDownloader( tileFileList );
    td.setDestinationFolder( this._workingFolder );

    td.onDownloadDone( function( localTileFileList ){
      var tm = new TileMerger(that._zoom, tileRange , that._workingFolder, that._outputFile )
      tm.build();
    })

    td.downloadSync();
  }

} /* END of class OsmPosterMaker */

module.exports = OsmPosterMaker;
