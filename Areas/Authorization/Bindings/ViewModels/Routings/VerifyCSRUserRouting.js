CSRVerification.config(function ($routeProvider, $locationProvider) {
    $routeProvider.when(Console.rootPath + 'Authorization/Verify/VerifyCode',
    {
        templateUrl: Console.rootPath + 'Templates/Authorization/CSRConfirmation.html',
        controller: 'CSRVerifyUserFormController',
        title: 'Verify CSR Registration'
    });
    $routeProvider.when(Console.rootPath + 'Authorization/Verify/SetPassword',
    {
        templateUrl: Console.rootPath + 'Templates/Authorization/CSRSetPassword.html',
        controller: 'CSRVerifyUserChangePasswordFormController',
        title: 'Set Password'
    });
    $routeProvider.otherwise(
    {
        redirectTo: Console.rootPath + 'Authorization/Login'
    });
    $locationProvider.html5Mode(true);
});

CSRVerification.run(function ($q, $rootScope, StartingPageService) {
    $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
        $rootScope.title = current.$$route.title;
        StartingPageService.StartingPageHandler();
    });
});