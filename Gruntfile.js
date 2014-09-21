module.exports = function(grunt) {
  grunt.initConfig({
    copy: {
      build: {
        files: [
          {
            // Foundation scss:
            expand: true,
            cwd: 'bower_components/foundation/scss/foundation/',
            src: '_settings.scss',
            dest: '_scss/',
            filter: 'isFile'
          },
          {
            // Foundation js:
            expand: true,
            cwd: 'bower_components/foundation/js/vendor/',
            src: '**',
            dest: 'js/',
            filter: 'isFile'
          }
        ]
      }
    }
  })
  grunt.loadNpmTasks("grunt-contrib-copy");
  grunt.registerTask("build", ["copy:build"]);
}
