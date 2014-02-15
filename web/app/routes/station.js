export default Ember.Route.extend({
	model: function(params) {
		return Ember.$.getJSON('/stations/' + params.station);
	}
});
