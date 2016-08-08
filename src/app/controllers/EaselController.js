/**
 * Created by DenisLutcevich on 08/08/2016.
 */

'use strict';

angular.module('WGAngular').controller('EaselController', ['$rootScope', '$scope', 'ModelsGetter', 'ModelWorker', function ($rootScope, $scope, modelsGetter, modelWorker) {
    $scope.selectedItems = modelsGetter.getSelectedItems();

    this.onChangeBtnClick = function () {
        $rootScope.$emit('change.btn.clicked');
    };

    $scope.$on('selected.deleted', function (event, id) {
        modelWorker.deleteSelected(id, $scope.selectedItems);
    });
}]);