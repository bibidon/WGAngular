module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: ['compiled/**/*.*'],
        jslint: {
            client: {
                src: [
                    'src/app/**/*.js',
                    './Gruntfile.js'
                ],
                directives: {
                    browser: true,
                    sloppy: true,
                    plusplus: true,
                    todo: true,
                    devel: true,
                    debug: true,
                    nomen: true,
                    unparam: true,
                    regexp: true,
                    bitwise: true,
                    node: true,
                    continue: true,
                    predef: [
                        'jQuery',
                        '$',
                        'module',
                        '_',
                        'angular'
                    ]
                }
            }
        },
        watch: {
            thirdParty: {
                files: ['public/thirdParty/**/*.*'],
                tasks: ['uglify:thirdParty', 'cssmin:thirdParty']
            },
            dev: {
                files: ['src/app/**/*.*'],
                tasks: ['uglify:dev', 'sass:compile', 'cssmin:dev']
            }
        },
        // jsttojs: {
        //     name: "q;window.AdHoc=window.AdHoc||{};window.AdHoc.templates=window.AdHoc.templates||{};window.AdHoc.templates",
        //     root: 'public/templates/',
        //     output: 'compiled/templates/Templates.js',
        //     ext: 'html',
        //     removebreak: true,
        //     amd: false
        // },
        copy: {
            thirdParty: {
                files: [{
                    src: ['node_modules/jquery/dist/jquery.min.js'],
                    dest: 'public/thirdParty/jquery/',
                    flatten: true,
                    expand: true,
                    filter: 'isFile'
                }, {
                    src: ['node_modules/angular/angular.min.js'],
                    dest: 'public/thirdParty/angular/',
                    flatten: true,
                    expand: true,
                    filter: 'isFile'
                }, {
                    src: ['node_modules/lodash/lodash.min.js'],
                    dest: 'public/thirdParty/lodash/',
                    flatten: true,
                    expand: true,
                    filter: 'isFile'
                }, {
                    cwd: 'node_modules/bootstrap/dist/',
                    src: ['**'],
                    dest: 'public/thirdParty/bootstrap/',
                    expand: true
                }]
            }
        },
        uglify: {
            thirdParty: {
                options: {
                    compress: false,
                    beautify: true,
                    mangle: false,
                    banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %> */'
                },
                files: {
                    'compiled/js/thirdParty.js': [
                        'public/thirdParty/jquery/jquery.min.js',
                        'public/thirdParty/angular/angular.min.js',
                        'public/thirdParty/lodash/lodash.min.js',
                        'public/thirdParty/bootstrap/js/bootstrap.min.js'
                    ]
                }
            },
            dev: {
                options: {
                    compress: false,
                    beautify: true,
                    mangle: false,
                    banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %> */'
                },
                files: {
                    'compiled/js/WGAngular.js': [
                        'src/app/WGAngular.js'
                    ]
                }
            }
            //prod: {
            //    options: {
            //        compress: {},
            //        beautify: false,
            //        mangle: true,
            //        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %> */'
            //    },
            //    files: grunt.file.readJSON('_uglify/uglify.prod.json')
            //}
        },
        sass: {
            check: {
                options: {
                    check: true
                }
            },
            compile: {
                options: {
                    sourcemap: 'none',
                    style: 'expanded'
                },
                files: [{
                    expand: true,
                    cwd: 'src/scss',
                    src: ['**/*.scss'],
                    dest: 'compiled/scss',
                    ext: '.css'
                }]
            }
        },
        cssmin: {
            thirdParty: {
                options: {
                    shorthandCompacting: false,
                    roundingPrecision: -1
                },
                files: {
                    'compiled/css/thirdParty.css': [
                        'public/thirdParty/bootstrap/css/bootstrap.min.css'
                    ]
                }
            },
            dev: {
                options: {
                    shorthandCompacting: false,
                    roundingPrecision: -1
                },
                files: {
                    'compiled/css/easel.css': [
                        'compiled/scss/easel.css'
                    ]
                }
            }
        },
        concurrent: {
            watch: {
                tasks: ['watch:thirdParty', 'watch:dev'],
                options: {
                    limit: 7,
                    logConcurrentOutput: true
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    // grunt.loadNpmTasks('grunt-jsttojs');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-jslint');

    grunt.registerTask('copy-resources', ['copy:thirdParty']);
    //grunt.registerTask('saas-compile', ['sass:check', 'sass:compile']);

    //grunt.registerTask('development', ['clean', 'copy-resources', 'jsttojs', 'jslint:client', 'saas-compile', 'uglify:thirdParty', 'uglify:dev', 'cssmin:thirdParty', 'cssmin:dev', 'express:dev', 'concurrent:watch']);
    //grunt.registerTask('emulate_prod', ['clean', 'copy-resources', 'jsttojs', 'jslint:client', 'saas-compile', 'uglify:thirdParty', 'uglify:prod', 'cssmin:thirdParty', 'cssmin:prod', 'express:dev', 'keepalive']);
    grunt.registerTask('development', ['clean', 'copy-resources', 'jslint:client', 'sass:compile', 'uglify:thirdParty', 'uglify:dev', 'cssmin:thirdParty', 'cssmin:dev', 'concurrent:watch']);
};
