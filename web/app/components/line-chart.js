/**
 * D3 line chart
 * Thanks to heyjin! http://heyjinjs.us/post/57158250642/reusable-d3-charts-with-ember-js-components
 *
 * Usage:
 * {{line-chart width=300 height=160 data=content}}
 */

export default Ember.Component.extend({
	tagName: 'div',

	draw: function(){
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

			var palette = new Rickshaw.Color.Palette({ scheme: 'classic9' });

			/**
			 * http://stackoverflow.com/a/6229124
			 * @param s
			 * @returns {*}
			 */
			function unCamelCase (s){
				return s
					// insert a space between lower & upper
					.replace(/([a-z])([A-Z])/g, '$1 $2')
					// space before last upper in a sequence followed by lower
					.replace(/\b([A-Z]+)([A-Z])([a-z])/, '$1 $2$3')
					// uppercase the first character
					.replace(/^./, function(str){ return str.toUpperCase(); })
			}

			function unUnderscore (s){
				return s
					// insert a space instead of an underscore
					.replace(/_/g, ' ')
					// uppercase the first character
					.replace(/^./, function(str){ return str.toUpperCase(); })
			}


			var series = [];

			_.get('y').split(',').forEach(function(yProperty){
				series.push({
					color: palette.color(),
					name: unUnderscore(yProperty),
					data: _.get('data').sortBy('date').map(function(o) {
						return {
							// convert x to epoch seconds
							x: new Date(o[_.get('x')])/1000,

							// 'boys will be boys'.replace(/oy/g, '')
							y: parseInt(o[yProperty])
						};
					})
				});
			});

			var graph = new Rickshaw.Graph({
				element: document.getElementById(_.get('elementId')),
				width: _.get('width'),
				height: _.get('height'),
				renderer: 'area',
				stroke: true,
				preserve: true,
				series: series
			});

			graph.render();

			var hoverDetail = new Rickshaw.Graph.HoverDetail({
				graph: graph,
				xFormatter: function(x) {
					// turn epoch seconds into epoch milliseconds
					return moment(x*1000).format('ddd h:MM a');
				}
			});

			var xAxis = new Rickshaw.Graph.Axis.Time({
				graph: graph,
				timeFixture: new Rickshaw.Fixtures.Time.Local(),
				ticksTreatment: 'glow'
			});

			xAxis.render();

			var yAxis = new Rickshaw.Graph.Axis.Y({
				graph: graph,
				ticksFormat: Rickshaw.Fixtures.Number.formatKMBT,
				ticksTreatment: 'glow'
			});

			yAxis.render();
		}
	},

	didInsertElement: function(){
		this.draw();
	}
});
