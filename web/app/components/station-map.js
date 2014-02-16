/*

expects data with { station_id, name, longitude, latitude, *bikes_available, *docks_available }

 */

export default Ember.Component.extend({
	tagName: 'div',
	classNames: ['map'],

	draw: function() {
		var _ = this;
		var map;
		var zoomlevel = 16;

		if (!!_.get('data')) {
			noSeriouslyReallyDraw();
		} else if (!!_.get('dataUrl')) {
			Ember.$.getJSON(_.get('dataUrl'))
				.then(function(data) {
					_.set('data', data);
					noSeriouslyReallyDraw();
				});
		}

		function pixelate(ctx) {

			var img = new Image();
			img.src = ctx.canvas.toDataURL("image/png");
			var pixelation = 5;
			var fw = img.width/pixelation|0;
			var fh = img.width/pixelation|0;
			/// turn off image smoothing (prefixed in some browsers)
			ctx.imageSmoothingEnabled =
				ctx.mozImageSmoothingEnabled =
					ctx.msImageSmoothingEnabled =
						ctx.webkitImageSmoothingEnabled = false;
			/// draw mini-version of image
			ctx.drawImage(img, 0, 0, fw, fh);

			/// draw the mini-version back up, voila, pixelated
//			ctx.drawImage(ctx.canvas, 0, 0, fw, fh, 0, 0, img.width, img.height);
		}

		/**
		 * Pixelation
		 * @type {number}
		 */
		var pixelation = 4;
		var pixelateData = function(imgd, sourceWidth, sourceHeight) {
			var data = imgd.data;
			for(var y = 0; y < sourceHeight; y += pixelation) {
				for(var x = 0; x < sourceWidth; x += pixelation) {
					var red = data[((sourceWidth * y) + x) * 4];
					var green = data[((sourceWidth * y) + x) * 4 + 1];
					var blue = data[((sourceWidth * y) + x) * 4 + 2];

					for(var n = 0; n < pixelation; n++) {
						for(var m = 0; m < pixelation; m++) {
							if(x + m < sourceWidth) {
								data[((sourceWidth * (y + n)) + (x + m)) * 4] = red;
								data[((sourceWidth * (y + n)) + (x + m)) * 4 + 1] = green;
								data[((sourceWidth * (y + n)) + (x + m)) * 4 + 2] = blue;
							}
						}
					}
				}
			}
		};

		/**
		 * Color transform (greyscale etc)
		 */
		var colorTransform = function(imgd) {
			var pix = imgd.data;
			for (var i = 0, n = pix.length; i < n; i += 4) {
				var brightness = 30.0;
				var noiseWeight = 10.5;

				pix[i] += brightness + Math.random()*noiseWeight;
				pix[i+1] += brightness + Math.random()*noiseWeight;
				pix[i+2] += brightness + Math.random()*noiseWeight;

				// greyscale
//				pix[i] = pix[i + 1] = pix[i + 2] = (3 * pix[i] + 4 * pix[i + 1] + pix[i + 2]) / 8;
			}
		};


		function noSeriouslyReallyDraw() {
			map = new OpenLayers.Map(_.get('elementId'));
			var osm = new OpenLayers.Layer.OSM('Simple OSM Map', null, {
				eventListeners: {
					tileloaded: function(evt) {
						var ctx = evt.tile.getCanvasContext();
						if (ctx) {
							var imgd = ctx.getImageData(0, 0, evt.tile.size.w, evt.tile.size.h);
//							colorTransform(imgd);
//							pixelateData(imgd, evt.tile.size.w, evt.tile.size.h);
							ctx.putImageData(imgd, 0, 0);
							evt.tile.imgDiv.removeAttribute("crossorigin");
							evt.tile.imgDiv.src = ctx.canvas.toDataURL();
						}
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
			map.setCenter(startingPosition, zoomlevel);

			var stations = new OpenLayers.Layer.Markers('Stations');
			map.addLayer(stations);

			var size = new OpenLayers.Size(40, 23);
			var offset = new OpenLayers.Pixel(-(size.w/2), -size.h/2);
			var icon = new OpenLayers.Icon('/assets/marker-pixely.png', size, offset);
//			debugger;
			_.get('data').forEach(function(station) {
				var marker = new OpenLayers.Marker(new OpenLayers.LonLat(station.longitude, station.latitude).transform(fromProjection, toProjection), icon.clone());
				marker.events.register('click', marker, function() {
					console.log('clicked marker ' + station.stationid);
					_.sendAction('action', station);
				});
				stations.addMarker(marker);
			});

			var myPositionMarker;
			var mapManipulationInfo = {
				lastTimestamp: 0
			};

			map.events.register('moveend', map, function() {
				mapManipulationInfo.lastTimestamp = +new Date();
			});

			map.events.register('zoomend', map, function() {
				mapManipulationInfo.lastTimestamp = +new Date();
				zoomlevel = map.zoom;
			});

			var recenterMap = function(info) {
				var timeSinceManipulated = 1000*30; // only recenter the map if the user hasn't manipulated the map in 30 seconds.
				var now = +new Date();
				return info.lastTimestamp < (now - timeSinceManipulated);
			};

			var drawMyPosition = function(position) {
				var size = new OpenLayers.Size(23, 32);
				var offset = new OpenLayers.Pixel(-(size.w/2), -size.h/2);
				var icon = new OpenLayers.Icon('/assets/man.png', size, offset);
				if (myPositionMarker) {
					stations.removeMarker(myPositionMarker);
				}
				myPositionMarker = new OpenLayers.Marker(new OpenLayers.LonLat(position.coords.longitude, position.coords.latitude).transform(fromProjection, toProjection), icon.clone());
				myPositionMarker.events.register('click', myPositionMarker, function() {
					console.log('clicked myself ');
				});
				stations.addMarker(myPositionMarker);
				var myPosition = new OpenLayers.LonLat(position.coords.longitude, position.coords.latitude).transform(fromProjection, toProjection);
				if (recenterMap(mapManipulationInfo)) {
					map.setCenter(myPosition, zoomlevel);
				}
			};

			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(drawMyPosition);
				navigator.geolocation.watchPosition(drawMyPosition);
			}

//			stations.addMarker(new OpenLayers.Marker(new OpenLayers.LonLat(-73.99027013, 40.7153077).transform(fromProjection, toProjection), icon));

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
