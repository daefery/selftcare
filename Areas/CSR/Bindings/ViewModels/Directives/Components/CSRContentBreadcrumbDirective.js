CSRContent.directive('breadCrumbs', function () {
    return {
        restrict: 'E',
        templateUrl: 'Templates/Common/ActiveRelativePath.html',
        controller: 'BreadcrumbsController'
    };

});