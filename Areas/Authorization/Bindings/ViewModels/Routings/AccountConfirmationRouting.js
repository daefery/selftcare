accountConfirm.config(function ($routeProvider, $locationProvider) {
    $routeProvider.when(Console.rootPath + 'Authorization/AccountConfirmation',
    {
        templateUrl: Console.rootPath + 'Templates/Authorization/AccountConfirmation.html',
        title: "Account Confirmation",
        controller: "AccountConfirmationController",
    });
    $routeProvider.otherwise(
    {
        redirectTo: Console.rootPath + 'Authorization/Login'
    });
    $locationProvider.html5Mode(true);
});

accountConfirm.run(function ($q, $rootScope, StartingPageService) {
    $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
        $rootScope.title = current.$$route.title;
        StartingPageService.StartingPageHandler();
    });
});