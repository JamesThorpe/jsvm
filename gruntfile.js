module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            debug: {
                src: [
                    'src/fragments/pre.js',
                    'src/js/vm/machine.js',
                    'src/js/util.js',
                    'src/js/vm/instructions/*.js',
                    'src/fragments/post.js'
                ],
                dest: 'build/lib/jsvm.js'

            }
        },
        jshint: {
            debug: ['src/js/**/*.js']

        },
        markdown: {
            all: {
                files: [
                    {
                        expand: true,
                        flatten: true,
                        src: 'docs/*.md',
                        dest: 'build/docs/',
                        ext: '.html'
                    }
                ],
                options: {
                    template: 'docs/template.html'
                }
            }
        },
        jasmine: {
            all: {
                src: 'build/lib/jsvm.js',
                options: {
                    specs: 'spec/**/*.js',
                    vendor: [
                        'build/lib/knockout.js'
                    ]
                }
            }
        },
        copy: {
            all: {
                expand: true,
                src: 'src/index.html',
                dest: 'build/',
                flatten:true
            }
        },
        watch: {
            all: {
                files: ['src/**/*.*', 'spec/**/*.*'],
                tasks: ['default']
            }
        }

    });
    
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-markdown');
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['concat:debug', 'jshint:debug', 'jasmine', 'markdown', 'copy']);
    grunt.registerTask('w', ['default','watch']);
};