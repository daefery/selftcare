angular.module('modalPopUp',[]).controller('ModalCtrl', function ($scope, $modal) {
    $scope.animationsEnabled = true;

    $scope.open = function (size, template) {

        var modalInstance = $modal.open({
            animation: $scope.animationsEnabled,
            templateUrl: template,
            controller: 'ModalInstanceCtrl',
            //put your size 'sm'/'lg', if you just want the medium ones, you can left the size empty
            size: size
        });

        $scope.toggleAnimation = function () {
            $scope.animationsEnabled = !$scope.animationsEnabled;
        };
    }
})
.controller('ModalInstanceCtrl', function ($scope, $modalInstance) {

    $scope.close = function () {
        $modalInstance.close();
    };
});