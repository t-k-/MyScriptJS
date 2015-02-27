'use strict';
/* jshint camelcase:false */
module.exports = function (grunt) {

    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);

    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),
        license: grunt.file.read('LICENSE'),
        bowerrc: grunt.file.readJSON('.bowerrc'),
        fileList: grunt.file.readJSON('build.json'),

        // Project settings
        project: {
            // variables
            src: 'src',
            tmp: '.tmp',
            test: 'test',
            unit: 'unit',
            func: 'func',
            dist: 'dist',
            docs: 'docs',
            samples: 'samples',
            test_results: 'test_results'
        },

        karma: {
            options: {
                configFile: '<%= project.test %>/karma.conf.js',
                singleRun: true,
                background: false
            },
            unit: {
                options: {
                    coverageReporter: {
                        type: 'html',
                        dir: '<%= project.test_results %>/<%= project.unit %>/coverage/'
                    },
                    files: [
                        '<%= bowerrc.directory %>/cryptojslib/components/core-min.js',
                        '<%= bowerrc.directory %>/cryptojslib/components/x64-core-min.js',
                        '<%= bowerrc.directory %>/cryptojslib/components/sha512-min.js',
                        '<%= bowerrc.directory %>/cryptojslib/components/hmac-min.js',
                        '<%= bowerrc.directory %>/q/q.js',
                        '<%= fileList %>',
                        '<%= project.test %>/<%= project.unit %>/**/*.js'
                    ]
                }
            },
            func: {
                options: {
                    coverageReporter: {
                        type: 'html',
                        dir: '<%= project.test_results %>/<%= project.func %>/coverage/'
                    },
                    files: [
                        '<%= bowerrc.directory %>/cryptojslib/components/core-min.js',
                        '<%= bowerrc.directory %>/cryptojslib/components/x64-core-min.js',
                        '<%= bowerrc.directory %>/cryptojslib/components/sha512-min.js',
                        '<%= bowerrc.directory %>/cryptojslib/components/hmac-min.js',
                        '<%= bowerrc.directory %>/q/q.js',
                        '<%= project.dist %>/<%= pkg.name %>.min.js',
                        '<%= project.test %>/<%= project.func %>/**/*.js'
                    ]
                }
            }
        },
        jshint: {
            options: {
                reporter: require('jshint-stylish-ex')
            },
            src: {
                options: {
                    jshintrc: '.jshintrc'
                },
                src: [
                    '<%= project.src %>/**/*.js'
                ]
            },
            test: {
                options: {
                    jshintrc: '<%= project.test %>/.mocha.jshintrc'
                },
                src: [
                    '<%= project.test %>/<%= project.unit %>/**/*.js',
                    '<%= project.test %>/<%= project.func %>/**/*.js'
                ]
            }
        },
        concat: {
            default: {
                options: {
                    sourceMap: true
                },
                src: '<%= fileList %>',
                dest: '<%= project.tmp %>/<%= pkg.name %>.js'
            },
            raw: {
                src: '<%= fileList %>',
                dest: '<%= project.dist %>/<%= pkg.name %>.js'
            }
        },
        uglify: {
            options: {
                preserveComments: false,
                mangle: false,
                nonull: true,
                sourceMap: true,
                sourceMapIn: '<%= project.tmp %>/<%= pkg.name %>.js.map',
                banner: '/*\n <%= pkg.name %> - <%= pkg.description %>\n Version: <%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n License: <%= pkg.license %>\n */'
            },
            default: {
                files: [{
                    expand: true,
                    flatten: true,
                    cwd: '<%= project.tmp %>',
                    src: '<%= pkg.name %>.js',
                    dest: '<%= project.dist %>',
                    ext: '.min.js'
                }]
            }
        },
        clean: {
            default: {
                files: [{
                    dot: true,
                    src: [
                        '<%= project.tmp %>',
                        '<%= project.dist %>',
                        '<%= project.test_results %>'
                    ]
                }]

            },
            tmp: {
                files: [{
                    dot: true,
                    src: [
                        '<%= project.tmp %>'
                    ]
                }]
            },
            dist: {
                files: [{
                    dot: true,
                    src: [
                        '<%= project.dist %>'
                    ]
                }]
            },
            test_unit_results: {
                files: [{
                    dot: true,
                    src: [
                        '<%= project.test_results %>/<%= project.unit %>'
                    ]
                }]
            },
            test_func_results: {
                files: [{
                    dot: true,
                    src: [
                        '<%= project.test_results %>/<%= project.func %>'
                    ]
                }]
            }
        },
        copy: {
            template: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= bowerrc.directory %>/yuidoc-bootstrap3-theme/dist',
                    dest: '<%= project.tmp %>',
                    src: ['**']
                }]
            },
            styles: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= project.docs %>/styles',
                    dest: '<%= project.tmp %>/assets',
                    src: ['**']
                }]
            },
            conf: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= project.docs %>',
                    dest: '<%= project.tmp %>',
                    src: ['theme.json']
                }]
            },
            samples: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= project.samples %>',
                    dest: '<%= project.dist %>/<%= project.samples %>',
                    src: ['**']
                }, {
                    expand: true,
                    dot: true,
                    flatten: true,
                    cwd: '<%= bowerrc.directory %>',
                    dest: '<%= project.dist %>/<%= project.samples %>/lib',
                    src: [
                        'cryptojslib/components/core-min.js',
                        'cryptojslib/components/x64-core-min.js',
                        'cryptojslib/components/sha512-min.js',
                        'cryptojslib/components/hmac-min.js',
                        'q/q.js'
                    ]
                }]
            },
            readme: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '',
                    dest: '<%= project.dist %>',
                    src: ['README.md']
                }]
            }
        },
        yuidoc: {
            compile: {
                name: '<%= pkg.name %>',
                description: '<%= pkg.description %>',
                version: '<%= pkg.version %>',
                url: '<%= pkg.homepage %>',
                options: {
                    exclude: 'third_party',
                    extension: '.js,.html',
                    paths: '<%= project.src %>',
                    outdir: '<%= project.dist %>/<%= project.docs %>',
                    linkNatives: 'true',
                    tabtospace: 2,
                    themedir: '<%= project.tmp %>',
                    helpers: ['<%= project.docs %>/helpers.js']
                }
            }
        },
        // Run some tasks in parallel to speed up the build process
        concurrent: {
            default: [
                'build',
                'docs'
            ]
        }
    });

    grunt.registerTask('default', [
        'clean',
        'jshint',
        'test-unit',
        'concurrent',
        'copy:readme'
    ]);

    grunt.registerTask('test', [
        'test-unit',
        'test-func'
    ]);

    grunt.registerTask('test-unit', [
        'clean:test_unit_results',
        'jshint:test',
        'karma:unit'
    ]);

    grunt.registerTask('test-func', [
        'clean:test_func_results',
        'jshint:test',
        'karma:func'
    ]);

    grunt.registerTask('build', [
        'clean:tmp',
        'concat',
        'uglify',
        'concat:raw',
        'clean:tmp'
    ]);

    grunt.registerTask('docs', [
        'clean:tmp',
        'copy:template',
        'copy:styles',
        'copy:conf',
        'yuidoc',
        'copy:samples',
        'clean:tmp'
    ]);

};