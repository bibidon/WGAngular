/**
 * Created by DenisLutcevich on 01/07/2016.
 */
'use strict';

var app = angular.module('WGAngular', ['ngResource']);

app.service('modelWorker', [function () {
    var self = this,
        getById = function (id, model) {
            return _.find(model.elements, {'id': id});
        },
        getIndexById = function (id, model) {
            return _.findIndex(model.elements, {'id': id});
        };

    this.update = function (selectedItemsModel) {
        var quantity = selectedItemsModel.elements.length;

        selectedItemsModel.headLine = quantity > 0 ? quantity + ' elements' : quantity + ' element';

        return selectedItemsModel;
    };

    this.deleteSelectedElement = function (id, selectedItemsModel) {
        selectedItemsModel.elements.splice(getIndexById(id, selectedItemsModel), 1);

        self.update(selectedItemsModel);

        return selectedItemsModel;
    };

    this.addElementToSelected = function (id, model, selectedItemsModel) {
        selectedItemsModel.elements.push(getById(id, model));

        self.update(selectedItemsModel);

        return selectedItemsModel;
    };

    this.changeCheckedStatus = function (id, status, model) {
        getById(id, model).isChecked = status;

        return model;
    };

    this.changeDisabledStatus = function (status, model, selectedItemsModel) {
        _.forEach(model.elements, function (element, index) {
            if (status) {
                element.isDisabled = !getById(index, selectedItemsModel) ? status : false;
            } else {
                element.isDisabled = false;
            }
        });

        return model;
    };

    this.synchronizeModels = function (model, selectedItemsModel) {
        _.forEach(model.elements, function (element, index) {
            element.isChecked = !!getById(index, selectedItemsModel);
        });

        return model;
    };

    return {
        updateSelectedModel: this.update,
        deleteSelected: this.deleteSelectedElement,
        addSelected: this.addElementToSelected,
        changeCheckedStatus: this.changeCheckedStatus,
        changeDisabledStatus: this.changeDisabledStatus,
        synchronizeModels: this.synchronizeModels
    }
}]);

app.factory('modelsGetter', ['$resource', '$rootScope', 'modelWorker', function ($resource, $rootScope, modelWorker) {
    var _model = {},
        _selectedItemsModel = {},
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

        modelWorker.updateSelectedModel(_selectedItemsModel);

        $rootScope.$emit('context.ready');
    });

    this.getModel = function () {
        return _model;
    };

    this.getSelectedItems = function () {
        return _selectedItemsModel;
    };

    this.setSelectedModel = function (model) {
        _selectedItemsModel.headLine = model.headLine;

        _selectedItemsModel.elements.splice(0, _selectedItemsModel.elements.length);

        _.forEach(model.elements, function (element) {
            _selectedItemsModel.elements.push(element);
        })
    };

    return {
        getModel: this.getModel,
        getSelectedItems: this.getSelectedItems,
        setSelectedModel: this.setSelectedModel
    };
}]);

app.controller('EaselController', ['$rootScope', '$scope', 'modelsGetter', 'modelWorker', function ($rootScope, $scope, modelsGetter, modelWorker) {
    $scope.selectedItems = modelsGetter.getSelectedItems();

    $scope.onChangeBtnClick = function () {
        $rootScope.$emit('change.btn.clicked');
    };

    $scope.$on('selected.deleted', function (event, id) {
        modelWorker.deleteSelected(id, $scope.selectedItems);
    });
}]);

app.controller('ModalController', ['$rootScope', '$scope', 'modelsGetter', 'modelWorker', function ($rootScope, $scope, modelsGetter, modelWorker) {
    var needDisable = function () {
        return $scope.selectedItems.elements.length === 3;
    };

    $scope.model = modelsGetter.getModel();
    $scope.selectedItems = modelsGetter.getSelectedItems();

    $scope.checkStatus = function () {
        modelWorker.changeDisabledStatus(needDisable(), $scope.model, $scope.selectedItems);
    };

    $scope.changed = function (id, isCheck) {
        if (isCheck) {
            modelWorker.addSelected(id, $scope.model, $scope.selectedItems);
        } else {
            modelWorker.deleteSelected(id, $scope.selectedItems);
        }

        $scope.checkStatus();
    };

    $scope.onSaveBtnClicked = function () {
        modelsGetter.setSelectedModel($scope.selectedItems);
    };

    $rootScope.$on('context.ready', function () {
        $scope.selectedItems = _.cloneDeep(modelsGetter.getSelectedItems());
    });

    $scope.$on('selected.deleted', function (event, id) {
        modelWorker.deleteSelected(id, $scope.selectedItems);

        $scope.checkStatus();

        modelWorker.changeCheckedStatus(id, false, $scope.model);
    });

    $rootScope.$on('change.btn.clicked', function () {
        $scope.selectedItems = _.cloneDeep(modelsGetter.getSelectedItems());

        modelWorker.synchronizeModels($scope.model, $scope.selectedItems);

        $scope.checkStatus();
    });
}]);

app.directive('selectedElement', [function () {
    function link($scope, $element, $attr) {
    }

    function controller($scope, $element, $attrs, $transclude) {
        $scope.deleteSelected = function (id) {
            $scope.$broadcast('selected.deleted', id);
        };
    }

    return {
        restrict: 'E',
        templateUrl: '../../public/templates/selectedElement.html',
        link: link,
        controller: controller
    };
}]);