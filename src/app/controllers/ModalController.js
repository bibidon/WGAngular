/**
 * Created by DenisLutcevich on 08/08/2016.
 */

'use strict';

angular.module('WGAngular').controller('ModalController', ['$rootScope', '$scope', 'ModelsGetter', 'ModelWorker', function ($rootScope, $scope, modelsGetter, modelWorker) {
    var needDisable = function () {
            return $scope.selectedItems.elements.length === 3;
        },
        self = this;

    $scope.selectedItems = modelsGetter.getSelectedItems();
    this.model = modelsGetter.getModel();

    this.filterById = [
        {
            value: '*.*',
            name: 'All numbers'
        }, {
            value: 10,
            name: 'numbers > 10'
        }, {
            value: 100,
            name: 'numbers > 100'
        }, {
            value: 200,
            name: 'numbers > 200'
        }, {
            value: 300,
            name: 'numbers > 300'
        }
    ];

    this.customFilter = function (value) {
        return self.currentFilter.value === '*.*' || self.currentFilter.value < value.id;
    };

    this.checkStatus = function () {
        modelWorker.changeDisabledStatus(needDisable(), this.model, $scope.selectedItems);
    };

    this.changed = function (id, isCheck) {
        if (isCheck) {
            modelWorker.addSelected(id, self.model, $scope.selectedItems);
        } else {
            modelWorker.deleteSelected(id, $scope.selectedItems);
        }

        self.checkStatus();
    };

    this.onSaveBtnClicked = function () {
        modelsGetter.setSelectedModel($scope.selectedItems);
    };

    $rootScope.$on('context.ready', function () {
        $scope.selectedItems = _.cloneDeep(modelsGetter.getSelectedItems());
    });

    $scope.$on('selected.deleted', function (event, id) {
        modelWorker.deleteSelected(id, $scope.selectedItems);

        self.checkStatus();

        modelWorker.changeCheckedStatus(id, false, self.model);
    });

    $rootScope.$on('change.btn.clicked', function () {
        $scope.selectedItems = _.cloneDeep(modelsGetter.getSelectedItems());

        modelWorker.synchronizeModels(self.model, $scope.selectedItems);

        self.checkStatus();
    });
}]);