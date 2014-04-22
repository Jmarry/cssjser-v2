/**
 * Created by 月飞 on 2014/4/8.
 */
module.exports = function(grunt) { // 1
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: { // 4
            options: { // 5
                banner: '/*\n' + // 6
                    ' * ' + '<%= pkg.name %>\n' + // 7
                    ' * ' + 'v<%= pkg.version %>\n' + // 8
                    ' * ' + '<%= grunt.template.today("yyyy-mm-dd") %>\n' + // 9
                    ' **/\n'
            },
            build: {
                files: [{
                    expand: true,
                    src: '**/*.js',
                    dest: 'public/scripts',
                    cwd: 'public/js',
                    ext: '.min.js'
                }]
            }
        },
        cssmin: {
            options: { // 5
                banner: '/*\n' + // 6
                    ' * ' + '<%= pkg.name %>\n' + // 7
                    ' * ' + 'v<%= pkg.version %>\n' + // 8
                    ' * ' + '<%= grunt.template.today("yyyy-mm-dd") %>\n' + // 9
                    ' **/\n'
            },
            minify: {
                expand: true,
                cwd: 'public/css/',
                src: ['**/*.css'],
                dest: 'public/styles/',
                ext: '.min.css'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify'); // 11
    grunt.loadNpmTasks('grunt-contrib-cssmin');

    grunt.registerTask('default', ['uglify','cssmin']);
};