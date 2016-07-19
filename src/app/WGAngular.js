/**
 * Created by DenisLutcevich on 01/07/2016.
 */
'use strict';

var app = angular.module('WGAngular', ['ngResource']);

app.controller('WGController', ['$scope', 'modelGetter', 'selectedItemsModelGetter', 'modelUpdater', function ($scope, dataGetter, selectedItemsModelGetter, modelUpdater) {
    dataGetter.query().$promise.then(function (model) {
        $scope.model = model;
        $scope.selectedItemsModel = $scope.selectedItemsModel || selectedItemsModelGetter.query($scope.model);

        modelUpdater.update($scope.selectedItemsModel);
    });
}]);

app.factory('modelGetter', ['$resource', function ($resource) {
    return $resource('../../public/data/:id.json', {}, {
        query: {
            method: 'GET',
            params: {id: 'testData'},
            isArray: true
        }
    });
}]);

app.service('selectedItemsModelGetter', [function () {
    this.query = function (model) {
        var _model = [], i, ln;

        for (i = 0, ln = 3; i < ln; i++) {
            _model.push(model[i]);
        }

        return _model;
    }
}]);

app.service('modelUpdater', [function () {
    var selectedInfo = {};

    selectedInfo.text = '';

    this.getSelectedInfo = function () {
      return selectedInfo;
    };

    this.update = function (model) {
        var quantity = model.length;

        selectedInfo.text = quantity > 0 ? quantity + ' elements' : quantity + ' element';
    };

    return {
        getSelectedInfo: this.getSelectedInfo,
        update: this.update
    };
}]);

app.controller('EaselController', ['$scope', 'modelUpdater', function ($scope, modelUpdater) {
    var self = this;

    self.selectedInfo.text = modelUpdater.getSelectedInfo();

    $scope.$watch('selectedInfo', function (newValue, oldValue) {
        debugger;
        if (newValue !== oldValue) {
            self.selectedInfo = modelUpdater.getSelectedInfo();
        }
    });

    this.deletedSelected = function (id) {
        var index = _.findIndex($scope.model.selectedElements, {'id': id});

        $scope.model.selectedElements.splice(index, 1);

        this.updateModelInfo();
    };

    this.changeSelection = function () {
    };
}]);

app.controller('ModalController', ['$scope', 'modelGetter', function ($scope, dataGetter) {
}]);

app.directive('selectedElement', [function () {
    function link(scope, element, attr) {
    }

    return {
        restrict: 'E',
        templateUrl: '../../public/templates/selectedElement.html',
        link: link
    };
}]);