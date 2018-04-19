CSRContent.controller('CSRUpdateHistoryController', function ($scope, GetUpdateHistory) {

    GetUpdateHistory.query({}, function (result) {
        $scope.UpdateHistory = result;
    });

});