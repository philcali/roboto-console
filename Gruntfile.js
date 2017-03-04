'use strict';

module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),

    concat: {
      dist: {
        src: [
          'lib/app.js',
          'lib/app/*.js',
          'lib/app/**/*.js',
          'js/**/*.js',
        ],
        dest: 'build/js/app.js'
      }
    },

    copy: {
      dist: {
        files: [{
          src: 'index.html',
          dest: 'build/index.html'
        }, {
          src: 'index.css',
          dest: 'build/index.css'
        }]
      }
    },

    upload: {
      dist: {
        options: {
          bucket: 'the-sweeper',
        },
        files: [{
          src: 'build/**'
        }]
      }
    },

    clean: {
      app: [ 'build/js/app.js' ],
      dist: [ 'build/', 'bin/' ]
    },

    uglify: {
      options: {
        report: 'min',
        preserveComments: 'some'
      },
      dist: {
        files: {
          'build/js/app.min.js': [
            'build/js/app.js'
          ]
        }
      }
    },

    connect: {
      keepalive: {
        options: {
          port: 8000,
          keepalive: true
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.loadTasks('tasks');
  grunt.registerTask('serve', [ 'connect' ]);
  grunt.registerTask('default', [ 'copy', 'concat', 'upload' ]);

};
