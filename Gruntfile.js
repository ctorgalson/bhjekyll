module.exports = function(grunt) {
  grunt.initConfig({
    compass: {
      options: {
        cssDir: 'css',
        environment: 'development',
        fontsDir: 'fonts',
        httpPath: '/',
        imagesDir: 'img',
        importPath: 'bower_components/foundation/scss',
        javascriptsDir: 'js',
        noLineComments: true,
        outputStyle: 'nested',
        relativeAssets: true,
        sassDir: '_scss',
        watch: false
      },
      dev: {
        options: {
          outputStyle: 'nested',
          watch: true
        }
      }
    },
    concurrent: {
      options: {
        limit: 5,
        logConcurrentOutput: true
      },
      dev: [
        'compass:dev',
        'exec:serve',
        'watch'
      ]
    },
    copy: {
      build: {
        files: [
          {
            // Foundation scss:
            expand: true,
            cwd: 'bower_components/foundation/scss/foundation/',
            src: '_settings.scss',
            dest: '_scss/'
          },
          {
            // Foundation icon scss:
            expand: true,
            cwd: 'bower_components/foundation-icon-fonts/',
            src: '_foundation-icons.scss',
            dest: '_scss/'
          },
          {
            // Foundation icons:
            expand: true,
            cwd: 'bower_components/foundation-icon-fonts/',
            src: ['foundation-icons.eot', 'foundation-icons.svg', 'foundation-icons.ttf', 'foundation-icons.woff'],
            dest: 'fonts/'
          },
          {
            // Foundation js:
            expand: true,
            cwd: 'bower_components/foundation/js/',
            src: ['foundation.min.js'],
            dest: 'js/'
          },
          {
            // Foundation vendor js:
            expand: true,
            cwd: 'bower_components/foundation/js/vendor/',
            src: '**',
            dest: 'js/',
            filter: 'isFile'
          }
        ]
      }
    },
    exec: {
      build: {
        cmd: 'jekyll build'
      },
      serve: {
        cmd: 'jekyll serve --watch'
      }
    },
    watch: {
      css: {
        files: [
          '_site/assets/css/*.css'
        ],
        options: {
          livereload: false
        }
      },
      html: {
        files: [
          '_site/**/*.html'
        ],
        options: {
          livereload: false
        }
      },
      js: {
        files: [
          '_site/assets/js/*.js'
        ],
        options: {
          livereload: false
        }
      }
    }
  });
  //
  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks("grunt-contrib-copy");
  grunt.loadNpmTasks('grunt-exec');
  grunt.loadNpmTasks('grunt-contrib-watch');
  // Tasks:
  grunt.registerTask("build", ["copy:build"]);
  grunt.registerTask("dev", ["concurrent:dev"]);
}
