module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-execute');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    coffee: {
      compile: {
        files: {
          'app.js': 'app.coffee',
          'routes.js': 'routes.coffee',
          'game/game.core.js': 'game/game.core.coffee',
          'game/game.js': 'game/game.coffee',
          'public/javascripts/pong.js': ['public/javascripts/*.coffee', 'game/game.coffee']
        }
      }
    },

    execute: {
      target: {
       src: ['app.js']
      }
    }
  });
};
