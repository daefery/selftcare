CSRContent.directive('searchPage', function (ApiConnection) {

    //var phoneNumber = document.getElementById("txtSearch").value;
    //var RESTURL = 'http://localhost:25131/api/CustomerServices/Search?PhoneNumber=34611470062&Password=123456&User=1644000204&Vmno=970100'
    var RESTURL = ApiConnection + '/api/CustomerServices/Search?PhoneNumber=' + phoneNumber + '&Password=123456&User=1644000204&Vmno=970100'

    return {
        restrict: 'E',
        controller: function ($scope, $http) {
            $http.get(RESTURL).
            success(function (data, status, headers, config) {
                //$scope.products = data[0];              

                if (data[0].Messages == null || data[0].Messages == "") {
                    $scope.products = data[0];
                }
                else
                    alert(data[0].Messages);
            }).
            error(function (data, status, headers, config) {
                alert("Error Searching For Customer");
            })
        },
        scope: true,
        templateUrl: 'Templates/CSR/Search/SearchResults.html'
    };

});

CSRContent.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if (event.which === 13) {
                scope.$apply(function () {
                    scope.$eval(attrs.ngEnter, { 'event': event });
                });

                event.preventDefault();
            }
        });
    };
});

CSRContent.directive('ngEnterAdv', function () {
    return function (scope, element, attrs) {
        element.bind("keypress", function (event) {
            if (event.which === 13) {
                scope.$eval(attrs.ngEnterAdv, { 'event': event });
                event.preventDefault();
            }
        });
    };
});