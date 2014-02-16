export default Ember.Route.extend({
  model: function() {
		return Ember.$.getJSON('/stations');
  },
	actions: {
		clickStation: function(station) {
			console.log('click route handler');
			this.transitionTo('station', station.stationid);
		}
	}
});
