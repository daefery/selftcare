CSRContent.directive('buttonPage', function () {
    return {
        restrict: 'E',
        templateUrl: 'Templates/CSR/Dashboard/ETButtons.html',
        controller: 'redirectPage',
        controllerAs: 'redirect'
    };

});