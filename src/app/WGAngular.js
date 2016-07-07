/**
 * Created by DenisLutcevich on 01/07/2016.
 */
var app = angular.module('WGAngular', []),
    data = {
        info: 'test',
        selectedElements: [{
            id: 1,
            name: 'test'
        }, {
            id: 2,
            name: 'test1'
        }, {
            id: 3,
            name: 'test2'
        }]
    };

app.controller('EaselController', function () {
    this.initModel = function () {
        this.model = data;

        this.updateModelInfo();
    };

    this.updateModelInfo = function () {
        var quantity = this.model.selectedElements.length;

        this.model.info = quantity > 0 ? quantity + ' elements' : quantity + ' element';
    };


    this.deletedSelected = function (id) {
        var index = _.findIndex(this.model.selectedElements, {'id': id});

        this.model.selectedElements.splice(index, 1);

        this.updateModelInfo();
    };

    this.initModel();
});