CSRContent.directive('loadcontent', function () {
    
    return {
        restrict: 'E',
        link: function (scope, element, attrs) {
            scope.getContentUrl = function () {
                return 'Templates/CSR/' + attrs["source"] + '.html';
            }
        },
        template: '<div class="dashboard-entry" ng-include="getContentUrl()"></div>'
    }
});
