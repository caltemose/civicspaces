module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    coffee: {
      compile: {
        options: {
          join:true
        },
        files: {
          'public/assets/js/cs.js': ['public/assets/coffee/cs.coffee', 'public/assets/coffee/classes/*.coffee'],
          'public/assets/js/pages/space.map.js': 'public/assets/coffee/pages/space.map.coffee',
          'public/assets/js/pages/space.edit.js': 'public/assets/coffee/pages/space.edit.coffee'
        }
      }
    },

    // uglify: {
    //   build: {
    //     src: 'js/cs.js',
    //     dest: 'js/cs.min.js'
    //   }
    // },

    sass: {
      dist: {
        // options: {
        //   style: 'compressed'
        // },
        files: {
          'public/assets/css/main.css': 'public/assets/sass/main.sass'
        }
      }
    },

    watch: {
      scripts: {
        files: ['public/assets/coffee/*.coffee', 'public/assets/coffee/classes/*.coffee', 'public/assets/coffee/pages/*.coffee'],
        tasks: ['coffee'],
        options: {
            spawn: false,
        },
      },
      css: {
        files: ['public/assets/sass/*.sass'],
        tasks: ['sass'],
        options: {
            spawn: false,
        }
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-coffee');
  // grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');

  //grunt.registerTask('default', ['coffee', 'uglify', 'sass']);
  grunt.registerTask('default', ['coffee', 'sass', 'watch']);

};