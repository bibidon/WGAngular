/**
 * Created by DenisLutcevich on 01/09/2016.
 */

describe('WGAngular', function () {
    beforeAll(function () {
        browser.get('index.html');

        element(by.tagName('a')).click();
    });

    describe('Redirect to easel page', function () {
        it('should be redirected to /easel', function () {
            expect(browser.getCurrentUrl()).toContain('/easel');
        });
    });

    describe('Easel page', function () {
        var selectedElements, defaultTitle, closeBtn;

        beforeAll(function () {
            selectedElements = element.all(by.css('.wg-angular-easel .wg-angular-selected-element'));
            defaultTitle = element(by.css('.wg-angular-easel h6'));
            closeBtn = selectedElements.first().element(by.tagName('button'));
        });

        it('should have 3 default selected elements', function () {
            expect(selectedElements.count()).toBe(3);
        });

        it('should have default title', function () {
            expect(defaultTitle.getText()).toBe('Now you have 3 elements:');
        });


        describe('delete selected element', function () {
            beforeAll(function () {
                closeBtn.click();
            });

            it('should have 2 selectedElements', function () {
                expect(selectedElements.count()).toBe(2);
            });

            it('should have changed title', function () {
                expect(defaultTitle.getText()).toBe('Now you have 2 elements:');
            });
        });
    });

    describe('test user actions in the modal', function () {
        var modelElements;

        beforeAll(function () {
            browser.get('index.html');

            element(by.tagName('a')).click();
            element(by.css('.wg-angular-easel-btn-container button')).click();

            modelElements = element.all(by.css('.wg-angular-modal-body-content-element'));
        });

        it('should open the modal', function () {
            expect(element(by.tagName('body')).getAttribute('class')).toMatch('modal-open');
        });

        it('should be 1001 elements', function () {
            expect(modelElements.count()).toBe(1001);
        });
    });
});