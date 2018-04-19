CSRContent.controller('MenuSettCtrl', function ($scope, $modal, $http) {

    $scope.openMenuSettModal = function () {
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'Templates/Common/DynamicNavigation/NavigationSort.html',
            controller: 'MenuSettModalCtrl',
            scope: $scope,
            size: 'lg'
        });
    };
});


CSRContent.controller('MenuSettModalCtrl', function ($scope, $modalInstance) {

    $scope.close = function () {
        $modalInstance.close();
    };

});
