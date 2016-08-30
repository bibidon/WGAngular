/**
 * Created by DenisLutcevich on 26/08/2016.
 */

exports.config = {

    allScriptsTimeout: 11000,

    specs: [
        'tests/e2e/*.js'
    ],

    capabilities: {
        'browserName': 'chrome'
    },

    chromeOnly: true,

    baseUrl: 'http://localhost:8000/',

    framework: 'jasmine'
};