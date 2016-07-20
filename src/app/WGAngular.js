/**
 * Created by DenisLutcevich on 01/07/2016.
 */
'use strict';

var app = angular.module('WGAngular', ['ngResource']);

app.controller('WGController', ['$scope', 'modelGetter', 'selectedItemsModelGetter', 'selectedItemsModelUpdater', function ($scope, modelGetter, selectedItemsModelGetter, selectedItemsModelUpdater) {
    modelGetter.query().$promise.then(function (model) {
        $scope.model = model;
        $scope.selectedItemsModel = $scope.selectedItemsModel || selectedItemsModelGetter.query($scope.model);

        selectedItemsModelUpdater.update($scope.selectedItemsModel);
    });
}]);

app.factory('modelGetter', ['$resource', function ($resource) {
    return $resource('../../public/data/:id.json', {}, {
        query: {
            method: 'GET',
            params: {id: 'testData'},
            isArray: true
        }
    });
}]);

app.service('selectedItemsModelGetter', [function () {
    this.query = function (model) {
        var _model = [], i, ln;

        for (i = 0, ln = 3; i < ln; i++) {
            _model.push(model[i]);
        }

        return _model;
    };
}]);

app.service('selectedItemsModelUpdater', [function () {
    var selectedItems = {};

    selectedItems.headLine = '';
    selectedItems.elements = [];

    this.getSelectedItems = function () {
        return selectedItems;
    };

    this.update = function (model) {
        var quantity = model.length;

        selectedItems.headLine = quantity > 0 ? quantity + ' elements' : quantity + ' element';
        selectedItems.elements = model;
    };

    return {
        getSelectedItems: this.getSelectedItems,
        update: this.update
    };
}]);

app.controller('EaselController', ['$scope', 'selectedItemsModelUpdater', function ($scope, selectedItemsModelUpdater) {
    $scope.selectedItems = selectedItemsModelUpdater.getSelectedItems();

    this.changeSelection = function () {
    };
}]);

app.controller('ModalController', ['$scope', 'selectedItemsModelUpdater', 'modelGetter', function ($scope, selectedItemsModelUpdater, modelGetter) {
    $scope.selectedItems = selectedItemsModelUpdater.getSelectedItems();

    modelGetter.query().$promise.then(function (model) {
        $scope.model = model;
    });
}]);

app.directive('selectedElement', ['selectedItemsModelUpdater', function (selectedItemsModelUpdater) {
    function link($scope, $element, $attr) {
    }

    function controller($scope, $element, $attrs, $transclude) {
        $scope.deletedSelected = function (id) {
            var index = _.findIndex($scope.selectedItems.elements, {'id': id});

            $scope.selectedItems.elements.splice(index, 1);

            selectedItemsModelUpdater.update($scope.selectedItems.elements);
        };
    }

    return {
        restrict: 'E',
        templateUrl: '../../public/templates/selectedElement.html',
        link: link,
        controller: controller
    };
}]);