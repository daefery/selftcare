SelfCareRegister.config(function ($routeProvider, $locationProvider) {
        /**
        * out of angular scope -> Registration
        */
        $routeProvider.when(Console.rootPath + 'SelfCare/Customer/Registration',
        {
            templateUrl: Console.rootPath + 'Templates/SelfCare/CustomerRegistration/Main.html',
            title: "Registration",
            controller: "RegisterController",
        });
        $routeProvider.otherwise({ redirectTo: Console.rootPath + 'SelfCare/Customer/App/NotFound' });
        $locationProvider.html5Mode(true);
    });

SelfCareRegister.run(function ($q, $rootScope, StartingPageService) {
    $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
        $rootScope.title = current.$$route.title;
        StartingPageService.StartingPageHandler();
    });
});