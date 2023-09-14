module.exports = (grunt) ->

  copyTargets = [
    { expand: true, cwd: 'src', src: ['**', '!**/*.coffee'], dest: 'build' }
    { expand: true, cwd: 'src/tests/views/', src: ['**'], dest: 'build/tests/views/' }
  ]

  grunt.initConfig
    pkg: grunt.file.readJSON 'package.json'
    copy:
      build:
        files: copyTargets
    clean:
      build:
        [ 'build' ]
      tests:
        [ 'build/tests/views/**/*.js']
    coffee:
      lib:
        files: [
          expand: true
          cwd: 'src'
          src: ['**/*.coffee']
          dest: 'build'
          ext: '.js'
        ]
    watch:
      all:
        files: [
          'gruntfile.coffee'
          'src/**/*'
          'package.json'
        ]
        tasks: ["test"]
        options:
          spawn: true
    notify:
      complete:
        options:
          title: 'Project Compiled',  # optional
          message: 'Project has been compiled', #required
    simplemocha:
      options:
        globals: ['expect']
        timeout: 3000
        ignoreLeaks: false
        ui: 'bdd'
        reporter: 'tap'
      all:
        src: ['build/tests/**/*-test.js']

  grunt.loadNpmTasks 'grunt-contrib-copy'
  grunt.loadNpmTasks 'grunt-contrib-clean'
  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.loadNpmTasks 'grunt-notify'
  grunt.loadNpmTasks 'grunt-simple-mocha'
  grunt.registerTask 'test', '', [ 'build', 'simplemocha' ]
  grunt.registerTask 'default', 'Compiles all of the assets and copies the files to the build directory.', ['build' ]
  grunt.registerTask 'build', 'Builds the application', [
    'clean:build',
    'coffee',
    'copy',
    'clean:tests'
    'notify:complete'
  ]
# grunt build && node-debug node_modules\mocha\bin\_mocha build\tests\element-test.js
