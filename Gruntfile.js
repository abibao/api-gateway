"use strict";

module.exports = function(grunt) {
	var banner = '/*n<%= pkg.name %> <%= pkg.version %>';
	banner += '- <%= pkg.description %>n<%= pkg.repository.url %>n';
	banner += 'Built on <%= grunt.template.today("yyyy-mm-dd") %>n*/n';

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		env: {
			tests_suite: {
				IP: 'localhost',
      	PORT: 3000
    	},
		},
		jshint: {
			files: ['src/**/*.js'],
			options: {
			  node: true,
			  strict: true,
				undef: true,
				unused: true,
				eqeqeq: true
			}
		},
		simplemocha: {
			options: {
				timeout: 3000,
				ignoreLeaks: false,
				ui: 'bdd',
				reporter: 'spec'
			},
			all: { src: ['test/*.js'] }
		},
		'dependency-check': {
      files: ['src/**/*.js'],       // required grunt attribute, same as --entry 
      options: {
        missing: true,              // same as --missing 
        unused: true,               // same as --unused 
        excludeUnusedDev: true,     // same as --no-dev 
        noDefaultEntries: true,     // same as --no-default-entries 
        ignoreUnused: [],           // same as --ignore-module 
        package: '.'                // package.json file or module folder path 
      }
    }
	});
	
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-simple-mocha');
	grunt.loadNpmTasks('dependency-check');
	
	grunt.registerTask('test', [
		'jshint',
		'simplemocha',
		'dependency-check'
	]);
	
};