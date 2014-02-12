export default Ember.View.extend({
//	didInsertElement: function() {
//		Ember.run.scheduleOnce('afterRender', function() {
//			debugger;
//			/*
//			 The map basically has three layers
//			 1) The path of the selected route you ran (which really is the best estimate for the route based on all the times
//			 that you've run that route)
//			 2) The path which you just ran (which is the best estimate for the path you took given the gps data and points for
//			 the route you ran)
//			 3) The actual logged GPS points (but don't show the error)
//			 */
//			var init = function() {
//				map = new OpenLayers.Map('map');
//				var osm = new OpenLayers.Layer.OSM('Simple OSM Map', null, {
//					eventListeners: {
//						tileloaded: function(evt) {
//							var ctx = evt.tile.getCanvasContext();
//							if (ctx) {
//								var imgd = ctx.getImageData(0, 0, evt.tile.size.w, evt.tile.size.h);
//								var pix = imgd.data;
//								for (var i = 0, n = pix.length; i < n; i += 4) {
//									pix[i] = pix[i + 1] = pix[i + 2] = (3 * pix[i] + 4 * pix[i + 1] + pix[i + 2]) / 8;
//								}
//								ctx.putImageData(imgd, 0, 0);
//								evt.tile.imgDiv.removeAttribute("crossorigin");
//								evt.tile.imgDiv.src = ctx.canvas.toDataURL();
//							}
//						}
//					}
//				});
//				var fromProjection = new OpenLayers.Projection("EPSG:4326");
//				var toProjection = new OpenLayers.Projection("EPSG:900913");
//				var startingPosition = new OpenLayers.LonLat(-73.99027013, 40.7153077).transform(fromProjection, toProjection);
//
//
//				var pointStyle = {
//					strokeColor: "#3366ff"
//				};
//
////				gps = new OpenLayers.Layer.Vector("GPS Data", pointStyle);
////				path = new OpenLayers.Layer.Vector("Estimated Path");
////				route = new OpenLayers.Layer.Vector("Fitted Route");
//
//				var style = {
//					strokeColor: '#fdaa44',
//					strokeOpacity: 0.5,
//					strokeWidth: 5
//				};
//
////					var run = Runs.findOne({});
////					var activeRunLine = new OpenLayers.Geometry.LineString(_.map(run.data, function(point) {
////						return new OpenLayers.Geometry.Point(point.x, point.y).transform(fromProjection, toProjection);
////					}));
////					var activeRunFeature = new OpenLayers.Feature.Vector(activeRunLine, null, style);
////					path.addFeatures([activeRunFeature]);
////
////
////					gps.addFeatures(_.map(run.data, function(point) {
////						return new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(point.x, point.y).transform(fromProjection, toProjection));
////					}));
//
//				map.addLayer(osm);
////					map.addLayer(path);
////					map.addLayer(gps);
//				map.setCenter(startingPosition, 15);
//
//			};
//
//			if (typeof(map) == 'undefined') {
//				if (typeof(OpenLayers) == 'undefined') {
//					$.getScript('/assets/OpenLayers.js', init);
//				} else {
//					init();
//				}
//			}
//		});
//	}
});
