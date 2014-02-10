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
			gruntfile: {
				files: '<%= jshint.gruntfile.src %>',
				tasks: ['jshint:gruntfile']
			},
			lib: {
				files: '<%= jshint.lib.src %>',
				tasks: ['jshint:lib', 'nodeunit']
			},
			test: {
				files: '<%= jshint.test.src %>',
				tasks: ['jshint:test', 'nodeunit']
			}
		},
	});

	// These plugins provide necessary tasks.
	grunt.loadNpmTasks('grunt-mocha-cli');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');

	// Default task.
	grunt.registerTask('default', ['jshint', 'mochacli']);

};
