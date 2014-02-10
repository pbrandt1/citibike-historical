'use strict';

module.exports = function (grunt) {

	// Project configuration.
	grunt.initConfig({
		mochacli: {
			options: {
				require: ['should'],
				reporter: 'nyan',
				bail: true
			},
			all: ['test/*.js']
		},
		jshint: {
			options: {
				jshintrc: '.jshintrc'
			},
			all: [
				'./test/*.js',
				'*.js',
				'./collectionService/*.js'
			]
		},
		watch: {
			all: {
				files: '<%= jshint.all %>',
				tasks: ['jshint', 'mochacli']
			}
		}
	});

	// These plugins provide necessary tasks.
	grunt.loadNpmTasks('grunt-mocha-cli');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');

	// Default task.
	grunt.registerTask('default', ['jshint', 'mochacli']);

};
