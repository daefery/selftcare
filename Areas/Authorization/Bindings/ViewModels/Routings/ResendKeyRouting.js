resendKey.config(function ($routeProvider, $locationProvider) {
    $routeProvider.when(Console.rootPath + 'Authorization/ResendKey',
    {
        templateUrl: Console.rootPath + 'Templates/Authorization/ResendKey.html',
        controller: 'ResendKeyProcessController',
        title: 'Verify CSR Registration'
    });
    $routeProvider.otherwise(
    {
        redirectTo: Console.rootPath + 'Authorization/Login'
    });
    $locationProvider.html5Mode(true);
});

resendKey.run(function ($q, $rootScope, StartingPageService) {
    $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
        $rootScope.title = current.$$route.title;
        StartingPageService.StartingPageHandler();
    });
});