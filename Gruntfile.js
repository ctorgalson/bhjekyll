module.exports = function(grunt) {
  grunt.initConfig({
    copy: {
      js: {
        files: [
          {
            expand: true,
            cwd: 'bower_components/foundation/js/vendor/',
            src: '**',
            dest: 'js/',
            flatten: true,
            filter: 'isFile'
          }
        ]
      }
    }
  })
  grunt.loadNpmTasks("grunt-contrib-copy");
  grunt.registerTask("default", ["copy"]);
}
