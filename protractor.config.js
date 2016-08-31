/**
 * Created by DenisLutcevich on 26/08/2016.
 */

exports.config = {
    allScriptsTimeout: 11000,
    chromeOnly: true,
    baseUrl: 'http://localhost:8000/',
    framework: 'jasmine',
    specs: [
        'tests/e2e/*.js'
    ],
    capabilities: {
        'browserName': 'chrome'
    },
    jasmineNodeOpts: {
        showColors: true,
        isVerbose : true,
        includeStackTrace : true
    }
};