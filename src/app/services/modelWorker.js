/**
 * Created by DenisLutcevich on 08/08/2016.
 */

'use strict';

angular.module('WGAngular').service('ModelWorker', [function () {
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
    };
}]);