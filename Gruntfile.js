'use strict';

module.exports = function (grunt) {
    grunt.initConfig({
        bower: {
            install: {
                options: {
                    targetDir: './lib',
                    layout: 'byComponent',
                    install: true,
                    verbose: false,
                    cleanTargetDir: true,
                    cleanBowerDir: false
                }
            }
        },
        sass: {
            dist: {
                files: {
                    'css/chat.css': 'sass/chat.scss'
                }
            }
        },
        watch: {
            bower: {
                files: 'bower.json',
                tasks: ['bower']
            },
            sass: {
                files: 'sass/**/*.*',
                tasks: ['sass'],
            }
        }
    });
    grunt.loadNpmTasks('grunt-bower-task');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['sass']);
};
