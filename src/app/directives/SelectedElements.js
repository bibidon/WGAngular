/**
 * Created by DenisLutcevich on 08/08/2016.
 */

'use strict';

angular.module('WGAngular').directive('selectedElement', [function () {
    return {
        restrict: 'E',
        templateUrl: '../../public/templates/selectedElement.html',
        controller: ['$scope', '$element', '$attrs', '$transclude', function ($scope, $element, $attrs, $transclude) {
            $scope.deleteSelected = function (id) {
                $scope.$broadcast('selected.deleted', id);
            };
        }]
    };
}]);