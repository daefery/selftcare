
var newauthorization = angular.module('newauthorization', ['common'])
    .config(function ($routeProvider, $locationProvider) {
        $routeProvider.when(Console.rootPath + 'Authorization/Login', { templateUrl: Console.rootPath + 'Templates/Authorization/Main.html', controller: 'AuthorizationViewModel' });
        $routeProvider.when(Console.rootPath + 'Authorization/Login/ForgotPassword', { templateUrl: Console.rootPath + 'Templates/Authorization/ForgotPassword.html', controller: 'ForgotPassword' });
        $routeProvider.otherwise({ redirectTo: Console.rootPath + 'Authorization/Login' });
        $locationProvider.html5Mode(true);
    });


//authorization.controller("AuthorizationViewModel", function ($scope, $http, $window, viewModelHelper, $location) {
//    $scope.viewModelHelper = viewModelHelper;
//    $scope.$on('$viewContentLoaded', function () {
//        $location.replace(); //clear last history route
//    });
//    //var temp = 'http://localhost:25131/api/Customer/Dashboard?CustomerId=1673000105&Password=123456&User=1644000204&Vmno=970100'
//    //$http.get(temp).
//    //  success(function (data, status, headers, config) {
//    //      $scope.products = data;
//    //  }).
//    //  error(function (data, status, headers, config) {
//    //      alert("Error Loading Customer Products");
//    //  });
//});


////Agung 12/08/2015 added validate input controller. If user input blank then angular will diplay warning sign
////revani edit

newauthorization.controller("LoginCtrl", function ($scope) {
    $scope.isFalse = false;
    $scope.infosomething = 'something';
    $scope.isSet = function (data) {
        if (data.username === 'selfcareDEMO' && data.password === '$3lfCare123') {
            $scope.isFalse = false;
            window.location.href = "/SelfCare/Customer/App";
        }
        else if (data.username === 'csrDEMO' && data.password === '$Csr123456') {
            $scope.isFalse = false;
            window.location.href = "/CSR/Customer/App";
        }
        else {
            $scope.isFalse = true;
            return $scope.warningLogin = 'wrong username or password. Please input the right user and password';
        };

    };
});

////Start : Rico - add forgot password controller
//authorization.controller("ForgotPassword", function($scope,$http) {
    
//});
////End : Rico - add forgot password controller

newauthorization.controller("loginFormController", function ($scope) {
    $scope.datas = {
        field: [
            {
                type: "logo",
                item: '<img class="center" src="images/et-logo.png">'
            },
            {
                type: "message",
                show: "isFalse",
                item: "warningLogin"
            },
            {
                type: "text",
                name: "username",
                size: 6,
                text: "Username",
                model: "data.username",
                required: true,
                validation: [{ value: "mandatory" }]
            },
            {
                type: "password",
                name: "password",
                size: 6,
                text: "Password",
                model: "data.password",
                required: true,
                validation: [{ value: "mandatory" }, { value: "password" }]
            }
        ],
        button: [
            {
                type: "submit",
                text: "Login",
                click: "isSet(data)"
            },
            {
                type: "link",
                item: '<a href="Authorization/Login/ForgotPassword" class="link">Forgotten your password?</a> or '+
                '<a href="SelfCare/Registration" class="link" target="_self">Self Care Registration</a>'
            }
        ]
    };
});