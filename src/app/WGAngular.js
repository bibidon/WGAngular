/**
 * Created by DenisLutcevich on 01/07/2016.
 */

'use strict';

var app = angular.module('WGAngular', ['ngResource', 'ngRoute']);

app.config(function ($routeProvider, $locationProvider) {
    $routeProvider
        .when('/easel', {
            templateUrl: 'src/views/easel.html'
        });

    $locationProvider.html5Mode(true);
});