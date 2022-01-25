module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        // define a string to put between each file in the concatenated output
        separator: '\n'
      },
      dist: {
        // the files to concatenate
        src: ['src/**/*.js'],
        // the location of the resulting JS file
        dest: 'dist/<%= pkg.name %>.js'
      }
    },
    uglify: {
      options: {
        // the banner is inserted at the top of the output
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n',
        compress: {
          drop_console: true
        }
        
      },
      dist: {
        files: {
          'dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
        }
      }
    },
    jshint: {
      files: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js'],
      options: {
        globals: {
          jQuery: true
        },
        '-W032': true
      }
    },
    watch: {
      files: ['<%= jshint.files %>'],
      tasks: ['concat', 'uglify', 'jshint']
    },
    qunit: {
      files: ['test/**/*.html']
    },
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-qunit');

  grunt.registerTask('default', ['concat', 'uglify', 'jshint']);
};