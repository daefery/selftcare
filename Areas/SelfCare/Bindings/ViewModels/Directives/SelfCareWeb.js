SelfCareContent.directive('loadcontent', function () {
    return {
        restrict: 'E',
        link: function (scope, element, attrs) {
            scope.getContentUrl = function () {
                return 'Templates/' + attrs["source"] + '.html';
                //return 'Templates/SelfCare/'+attrs["source"] + '.html';
            }
        },
        template: '<div ng-include="getContentUrl()"></div>'
    }
});