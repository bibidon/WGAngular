/**
 * Created by DenisLutcevich on 08/08/2016.
 */

'use strict';

angular.module('WGAngular').factory('ModelsGetter', ['$resource', '$rootScope', 'ModelWorker', function ($resource, $rootScope, modelWorker) {
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
        });
    };

    return {
        getModel: this.getModel,
        getSelectedItems: this.getSelectedItems,
        setSelectedModel: this.setSelectedModel
    };
}]);