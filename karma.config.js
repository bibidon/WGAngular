/**
 * Created by DenisLutcevich on 22/08/2016.
 */

module.exports = function (config) {
    config.set({
        basePath: './',
        files: [
            'compiled/js/thirdParty.js',
            'src/app/**/*.js',
            'tests/**/*.js'
        ],
        autoWatch: true,
        frameworks: ['mocha', 'chai', 'sinon-chai'],
        browsers: ['PhantomJS'],
        interface: 'bdd',
        singleRun: true,
        port: 9876,
        reporters: ['mocha', 'coverage'],
        preprocessors: {
            'src/app/**/*.js': ['coverage']
        },
        coverageReporter: {
            type: 'html',
            dir: 'coverage/'
        }
    });
};