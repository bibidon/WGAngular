/**
 * Created by DenisLutcevich on 24/08/2016.
 */

'use strict';

describe('EaselController', function () {
    var $controller, $rootScope, $scope, $compile, modelGetter, modelWorker;

    beforeEach(module('WGAngular'));
    beforeEach(inject(function (_$controller_, _$rootScope_, _$compile_, _ModelsGetter_, _ModelWorker_) {
        $controller = _$controller_;
        $rootScope = _$rootScope_;
        $compile = _$compile_;

        $scope = $rootScope.$new();

        modelGetter = _ModelsGetter_;
        modelWorker = _ModelWorker_;

        sinon.spy(modelGetter, 'getSelectedItems');
        sinon.spy(modelWorker, 'deleteSelected');

        $controller('EaselController as easel', {
            $scope: $scope,
            modelsGetter: modelGetter,
            modelWorker: modelWorker
        });
    }));

    after(function () {
        modelGetter.getSelectedItems.restore();
        modelWorker.deleteSelected.restore();
    });

    describe('#selectedItems', function () {
        it('should call modelGetter.getSelectedItem on load', function () {
            expect(modelGetter.getSelectedItems.calledOnce).to.be.true;
        });
    });

    it('should call modelWorker.deleteSelected on "selected.deleted" event', function () {
        $scope.$emit('selected.deleted');

        expect(modelWorker.deleteSelected.calledOnce).to.be.true;
    });
});