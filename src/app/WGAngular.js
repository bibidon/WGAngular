/**
 * Created by DenisLutcevich on 01/07/2016.
 */
'use strict';

var app = angular.module('WGAngular', ['ngResource']);

app.controller('EaselController', ['$scope', function ($scope) {
    $scope.model = {
        info: 'test',
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

    this.initModel = function () {
        this.updateModelInfo();
    };

    this.updateModelInfo = function () {
        var quantity = $scope.model.selectedElements.length;

        $scope.model.info = quantity > 0 ? quantity + ' elements' : quantity + ' element';
    };


    this.deletedSelected = function (id) {
        var index = _.findIndex($scope.model.selectedElements, {'id': id});

        $scope.selectedElements.splice(index, 1);

        this.updateModelInfo();
    };

    this.changeSelection = function () {
    };

    this.initModel();
}]);

app.factory('dataGetter', ['$resource', function ($resource) {
    return $resource('../../public/data/:id.json', {}, {
        query: {
            method: 'GET',
            params: {id: 'testData'},
            isArray: true
        }
    });
}]);

app.controller('ModalController', ['$scope', 'dataGetter', function ($scope, dataGetter) {
    this.model = dataGetter.query();
}]);