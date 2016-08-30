/**
 * Created by DenisLutcevich on 22/08/2016.
 */

'use strict';

describe('LandingController', function () {
    var $controller, $rootScope, $scope;

    beforeEach(module('WGAngular'));
    beforeEach(inject(function (_$controller_, _$rootScope_) {
        $controller = _$controller_;
        $rootScope = _$rootScope_;
        $scope = $rootScope.$new();

        $controller('LandingController as landing', {$scope: $scope});
    }));

    describe('#enableLandingPage', function () {
        it('should be true (default value)', function () {
            expect($scope.enableLandingPage).to.be.true;
        });

        it('should be false, after ', function () {
            $rootScope.$broadcast('$routeChangeSuccess');

            expect($scope.enableLandingPage).to.be.false;
        });
    });
});