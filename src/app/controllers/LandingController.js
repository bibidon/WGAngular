/**
 * Created by DenisLutcevich on 22/08/2016.
 */

'use strict';

angular.module('WGAngular').controller('LandingController', ['$rootScope', '$scope', function ($rootScope, $scope) {
    $scope.enableLandingPage = true;

    $rootScope.$on('$routeChangeSuccess', function (event, next, current) {
        $scope.enableLandingPage = !$scope.enableLandingPage;
    });
}]);