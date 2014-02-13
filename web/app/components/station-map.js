/*

expects data with { station_id, name, longitude, latitude, *bikes_available, *docks_available }

 */

export default Ember.Component.extend({
	tagName: 'div',
	classNames: ['map'],

	draw: function() {
		var _ = this;

		if (!!_.get('data')) {
			noSeriouslyReallyDraw();
		} else if (!!_.get('dataUrl')) {
			Ember.$.getJSON(_.get('dataUrl'))
				.then(function(data) {
					_.set('data', data);
					noSeriouslyReallyDraw();
				});
		}

		function noSeriouslyReallyDraw() {
			var map = new OpenLayers.Map(_.get('elementId'));
			var osm = new OpenLayers.Layer.OSM('Simple OSM Map', null, {
				eventListeners: {
//					tileloaded: function(evt) {
//						var ctx = evt.tile.getCanvasContext();
//						if (ctx) {
//							var imgd = ctx.getImageData(0, 0, evt.tile.size.w, evt.tile.size.h);
//							var pix = imgd.data;
//							for (var i = 0, n = pix.length; i < n; i += 4) {
//								pix[i] = pix[i + 1] = pix[i + 2] = (3 * pix[i] + 4 * pix[i + 1] + pix[i + 2]) / 8;
//							}
//							ctx.putImageData(imgd, 0, 0);
//							evt.tile.imgDiv.removeAttribute("crossorigin");
//							evt.tile.imgDiv.src = ctx.canvas.toDataURL();
//						}
					}
				}
			});

			var fromProjection = new OpenLayers.Projection("EPSG:4326");
			var toProjection = new OpenLayers.Projection("EPSG:900913");
			var startingPosition = new OpenLayers.LonLat(-73.99027013, 40.7153077).transform(fromProjection, toProjection);
			var pointStyle = {
				strokeColor: "#3366ff"
			};

			map.addLayer(osm);
			map.setCenter(startingPosition, 15);
//
//			var pois = new OpenLayers.Layer.Text( "My Points",
//				{ location:"./textfile.txt",
//					projection: map.displayProjection
//				});
//			map.addLayer(pois);
//			// create layer switcher widget in top right corner of map.
//			var layer_switcher= new OpenLayers.Control.LayerSwitcher({});
//			map.addControl(layer_switcher);
//			//Set start centrepoint and zoom
//			var lonLat = new OpenLayers.LonLat( 9.5788, 48.9773 )
//				.transform(
//					new OpenLayers.Projection("EPSG:4326"), // transform from WGS 1984
//					map.getProjectionObject() // to Spherical Mercator Projection
//				);
//			var zoom=11;
//			map.setCenter (lonLat, zoom);
		}
	},

	didInsertElement: function() {
		this.draw();
	}

});