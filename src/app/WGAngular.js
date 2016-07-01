/**
 * Created by DenisLutcevich on 01/07/2016.
 */
var app = angular.module('WGAngular', []),
    easelModel = {
        info: '1 element',
        selectedElements: [{
            id: 1,
            name: 'test'
        }, {
            id: 2,
            name: 'test1'
        }, {
            id: 3,
            name: 'test2'
        }]
    };

app.controller('EaselController', function () {
    this.model = easelModel;
});