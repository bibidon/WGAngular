/**
 * Created by DenisLutcevich on 01/07/2016.
 */
'use strict';

var app = angular.module('WGAngular', ['ngResource']);

app.factory('modelsGetter', ['$resource', function ($resource) {
    var _model = {},
        _selectedItemsModel = {},
        self = this,
        getModel = (function () {
            return $resource('../../public/data/:id.json', {}, {
                query: {
                    method: 'GET',
                    params: {id: 'testData'},
                    isArray: true
                }
            });
        }()),
        getSelectedItemsModel = function (model) {
            var items = [], i, ln;

            for (i = 0, ln = 3; i < ln; i++) {
                items.push(model[i]);
            }

            return items;
        };

    _model.elements = [];

    _selectedItemsModel.headLine = '';
    _selectedItemsModel.elements = [];

    getModel.query().$promise.then(function (model) {
        _model.elements = model;

        _selectedItemsModel.elements = getSelectedItemsModel(_model.elements);

        self.update(_selectedItemsModel.elements);
    });

    this.getModel = function () {
        return _model;
    };

    this.getSelectedItems = function () {
        return _selectedItemsModel;
    };

    this.update = function (model) {
        var quantity = model.length;

        _selectedItemsModel.headLine = quantity > 0 ? quantity + ' elements' : quantity + ' element';
        _selectedItemsModel.elements = model;
    };

    return {
        getModel: this.getModel,
        getSelectedItems: this.getSelectedItems,
        update: this.update
    };
}]);

app.controller('EaselController', ['$scope', 'modelsGetter', function ($scope, modelsGetter) {
    $scope.selectedItems = modelsGetter.getSelectedItems();
}]);

app.controller('ModalController', ['$scope', 'modelsGetter', function ($scope, modelsGetter) {
    $scope.model = modelsGetter.getModel();
    $scope.selectedItems = modelsGetter.getSelectedItems();
}]);

app.directive('selectedElement', ['modelsGetter', function (modelsGetter) {
    function link($scope, $element, $attr) {
    }

    function controller($scope, $element, $attrs, $transclude) {
        $scope.deletedSelected = function (id) {
            var index = _.findIndex($scope.selectedItems.elements, {'id': id});

            $scope.selectedItems.elements.splice(index, 1);

            modelsGetter.update($scope.selectedItems.elements);
        };
    }

    return {
        restrict: 'E',
        templateUrl: '../../public/templates/selectedElement.html',
        link: link,
        controller: controller
    };
}]);