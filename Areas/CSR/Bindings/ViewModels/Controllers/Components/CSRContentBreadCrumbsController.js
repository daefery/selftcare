//Sofyan
//Created: Breadcrumb link
CSRContent.controller('HomeController', function ($scope, breadcrumbs) {
    //$scope.breadcrumbs = breadcrumbs;
    //generateHTMLBreadcrumbs($scope.breadcrumbs.get(), "breadcrumbLink");

    var authData = JSON.parse(localStorage.AuthData);
    $scope.firstName = authData.firstName;
}
)
CSRContent.controller('BreadcrumbsController', function ($scope, breadcrumbs) {
    var authData = JSON.parse(localStorage.AuthData);
    $scope.firstName = authData.firstName;

    breadcrumbs.generateBreadcrumbs();
    $scope.breadcrumbs = breadcrumbs;
})