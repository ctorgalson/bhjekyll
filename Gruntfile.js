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
        outputStyle: 'compressed',
        relativeAssets: true,
        sassDir: '_scss',
        watch: false
      },
      dev: {
        options: {
          environment: 'production',
          outputStyle: 'compressed',
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
        'uglify',
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
    uglify: {
      options: {
        // This should exclude jquery and modernizr, but doesn't :)
        compress: false,
        mangle: false,
        sourceMap: true
      },
      site: {
        files: {
          'js/app.js': [
            'bower_components/jquery/dist/jquery.min.js',
            'bower_components/fastclick/lib/fastclick.js',
            'bower_components/jquery.cookie/jquery.cookie.js',
            'bower_components/foundation/js/foundation.min.js',
            '_submodules/jquery.ajaxreveallinks.js/scripts/jquery.ajaxreveallinks.min.js',
            '_submodules/jquery.bhwordmark.js/scripts/jquery.bhwordmark.min.js',
            '_submodules/jquery.cookiesplease.js/dist/jquery.cookiesplease.min.js',
            '_submodules/jquery.fpplaintext.js/scripts/jquery.fpplaintext.min.js'
          ]
        }
      }
    },
    watch: {
      // css: {
      //   files: [
      //     'css/*.css'
      //   ],
      //   tasks: 'uglify',
      //   options: {
      //     livereload: false
      //   }
      // },
      html: {
        files: [
          '_posts/**/*.html'
        ],
        tasks: 'uglify',
        options: {
          livereload: false
        }
      },
      js: {
        files: [
          '_submodules/*.js'
        ],
        tasks: 'uglify',
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
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  // Tasks:
  grunt.registerTask("build", ["copy:build"]);
  grunt.registerTask("dev", ["concurrent:dev"]);
}
