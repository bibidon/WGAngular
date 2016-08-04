/**
 * Created by DenisLutcevich on 01/07/2016.
 */
'use strict';

var app = angular.module('WGAngular', ['ngResource']);

app.factory('modelsGetter', ['$resource', '$rootScope', function ($resource, $rootScope) {
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
        },
        prepareModel = function (model) {
            var i, ln;

            for (i = 0, ln = model.elements.length; i < ln; i++) {
                model.elements[i].isChecked = i < 3;
                model.elements[i].isDisabled = i >= 3;
            }
        };

    _model.elements = [];

    _selectedItemsModel.headLine = '';
    _selectedItemsModel.elements = [];

    getModel.query().$promise.then(function (model) {
        _model.elements = model;

        prepareModel(_model);

        _selectedItemsModel.elements = getSelectedItemsModel(_model.elements);

        self.update(_selectedItemsModel.elements);

        $rootScope.$emit('context.ready');
    });

    this.getModel = function () {
        return _model;
    };

    this.getSelectedItems = function () {
        return _selectedItemsModel;
    };

    this.deleteSelectedElement = function (id) {
        var index = _.findIndex(_selectedItemsModel.elements, {'id': id});

        _selectedItemsModel.elements.splice(index, 1);

        this.update(_selectedItemsModel.elements);
    };

    this.addElementToSelected = function (id) {
        var element = _.find(_model.elements, {'id': id});

        _selectedItemsModel.elements.push(element);

        this.update(_selectedItemsModel.elements);
    };

    this.update = function (model) {
        var quantity = model.length;

        _selectedItemsModel.headLine = quantity > 0 ? quantity + ' elements' : quantity + ' element';
        _selectedItemsModel.elements = model;
    };

    return {
        getModel: this.getModel,
        getSelectedItems: this.getSelectedItems,
        deleteSelectedElement: this.deleteSelectedElement,
        addElementToSelected: this.addElementToSelected,
        update: this.update
    };
}]);

app.controller('EaselController', ['$scope', 'modelsGetter', function ($scope, modelsGetter) {
    $scope.selectedItems = modelsGetter.getSelectedItems();
}]);

app.controller('ModalController', ['$rootScope', '$scope', 'modelsGetter', function ($rootScope, $scope, modelsGetter) {
    var needDisable = function () {
            return $scope.selectedItems.elements.length === 3;
        },
        changeDisabledStatus = function (status) {
            var i, ln, element;

            for (i = 0, ln = $scope.model.elements.length; i < ln; i++) {
                element = _.find($scope.selectedItems.elements, {'id': i});

                if (!element) {
                    $scope.model.elements[i].isDisabled = status;
                }
            }
        };

    $scope.model = modelsGetter.getModel();
    $scope.selectedItems = modelsGetter.getSelectedItems();

    $rootScope.$on('context.ready', function () {
        $scope.selectedItems = _.cloneDeep(modelsGetter.getSelectedItems());
    });

    $rootScope.$on('selected.deleted', function (event, id) {
        var index = _.findIndex($scope.selectedItems.elements, {'id': id});

        $scope.selectedItems.elements.splice(index, 1);

        var quantity = $scope.selectedItems.elements.length;

        $scope.selectedItems.headLine = quantity > 0 ? quantity + ' elements' : quantity + ' element';

        $scope.checkStatus();
        $scope.changeCheckedStatus(id, false);
    });

    $scope.checkStatus = function () {
        if (needDisable()) {
            changeDisabledStatus(true);
        } else {
            changeDisabledStatus(false);
        }
    };

    $scope.changed = function (id, isCheck) {
        if (isCheck) {
            modelsGetter.addElementToSelected(id);
        } else {
            modelsGetter.deleteSelectedElement(id);
        }

        $scope.checkStatus();
    };

    $scope.changeCheckedStatus = function (id, status) {
        var element = _.find($scope.model.elements, {'id': id});

        element.isChecked = status;
    };
}]);

app.directive('selectedElement', ['modelsGetter', '$rootScope', function (modelsGetter, $rootScope) {
    function link($scope, $element, $attr) {
    }

    function controller($scope, $element, $attrs, $transclude) {
        $scope.deleteSelected = function (id) {
            $rootScope.$emit('selected.deleted', id);
        };
    }

    return {
        restrict: 'E',
        templateUrl: '../../public/templates/selectedElement.html',
        link: link,
        controller: controller
    };
}]);