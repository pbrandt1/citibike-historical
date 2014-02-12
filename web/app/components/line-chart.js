/**
 * D3 line chart
 * Thanks to heyjin! http://heyjinjs.us/post/57158250642/reusable-d3-charts-with-ember-js-components
 *
 * Usage:
 * {{line-chart width=300 height=160 data=content}}
 */

export default Ember.Component.extend({
	tagName: 'div',
//	attributeBindings: 'width height'.w(),
//	margin: {top: 20, right: 20, bottom: 30, left: 40},
//
//	w: function(){
//		return this.get('width') - this.get('margin.left') - this.get('margin.right');
//	}.property('width'),
//
//	h: function(){
//		return this.get('height') - this.get('margin.top') - this.get('margin.bottom');
//	}.property('height'),
//
//	transformG: function(){
//		return "translate(" + this.get('margin.left') + "," + this.get('margin.top') + ")";
//	}.property(),
//
//	transformX: function(){
//		return "translate(0,"+ this.get('h') +")";
//	}.property('h'),
//
//	xRange: function() {
//		return d3.time.scale().range([0, this.get('w')]);
//	}.property('w'),
//
//	yRange: function() {
//		return d3.scale.linear().range([this.get('h'), 0]);
//	}.property('h'),
//	area: function() {
//		var _ = this;
//		return d3.svg.area()
//			.x(function(d) { return x(d[_.get('x')]); })
//			.y0(_.get('h'))
//			.y1(function(d) { return y(d[_.get('y')]); });
//	}.property('h', 'x', 'y'),

	draw: function(){
		var _ = this;

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

		var series = [];

		_.get('y').split(',').forEach(function(yProperty){
			series.push({
				color: palette.color(),
				name: unCamelCase(yProperty),
				data: _.get('data').sortBy('date').map(function(o) {
					return {
						// convert x to epoch seconds
						x: new Date(o[_.get('x')])/1000,

						// 'boys will be boys'.replace(/oy/g, '')
						y: o[yProperty]
					};
				})
			});
		});

		var graph = new Rickshaw.Graph({
			element: document.getElementById(this.get('elementId')),
			width: this.get('width'),
			height: this.get('height'),
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
				return new Date(x*1000).toString();
			}
		});

		var xAxis = new Rickshaw.Graph.Axis.Time({
			graph: graph,
			timeFixture: new Rickshaw.Fixtures.Time.Local()
		});

		xAxis.render();

		var yAxis = new Rickshaw.Graph.Axis.Y({
			graph: graph,
			ticksFormat: Rickshaw.Fixtures.Number.formatKMBT
		});

		yAxis.render();

//
//		var formatPercent = d3.format(".0%");
//		var data = this.get('data');
//		var parseDate = d3.time.format("%Y-%m-%d %H:%M:%S").parse;
//		var svg = d3.select('#'+this.get('elementId'));
//		var xAxis = d3.svg.axis().scale(this.get('xRange')).orient("bottom").tickFormat(d3.time.format("%H"));
//		var yAxis = d3.svg.axis().scale(this.get('yRange')).orient("left").ticks(5);
//
//		this.get('xRange').domain(d3.extent(data, function(d) { return parseDate(d[_.get('x')]); }));
//		this.get('yRange').domain([0, d3.max(data, function(d) { return d[_.get('y')]; })]);
//
//		svg.select(".axis.x").call(xAxis);
//		svg.select(".axis.y").call(yAxis);
//
//		var line = d3.svg.line()
//			.x(function(d) { return x(d[_.get('x')])})
//			.y(function(d) { return y(d[_.get('y')])});


//		svg.select(".rects").selectAll("rect")
//			.data(data)
//			.enter().append("rect")
//			.attr("class", "bar")
//			.attr("x", function(d) { return x(d.letter); })
//			.attr("width", x.rangeBand())
//			.attr("y", function(d) { return y(d.frequency); })
//			.attr("height", function(d) { return height - y(d.frequency); });
	},

	didInsertElement: function(){
		this.draw();
	}
});
