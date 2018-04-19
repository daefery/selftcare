publicMain.directive('loadcontent', function () {
    return {
        restrict: 'E',
        link: function (scope, element, attrs) {
            scope.getContentUrl = function () {
                return 'Templates/Public/'+attrs["source"] + '.html';
            }
        },
        template: '<div ng-include="getContentUrl()"></div>'
    }
});