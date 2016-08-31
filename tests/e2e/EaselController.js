/**
 * Created by DenisLutcevich on 26/08/2016.
 */
describe('EaselController', function () {
    beforeEach(function () {
        browser.get('index.html');
    });

    describe('#onChangeBtnClick', function () {
        var selectedElements;

        beforeEach(function () {
            element(by.tagName('a')).click();
            selectedElements = element.all(by.repeater('element in selectedItems.elements')).count();
        });

        it('should has 3 element after bootstrapping application', function () {
            expect(selectedElements).toEqual(3)
        });

    });
});