recoverPassword.config(function ($routeProvider, $locationProvider) {
    $routeProvider.when(Console.rootPath + 'Authorization/RecoverPassword',
    {
        templateUrl: Console.rootPath + 'Templates/Authorization/RecoverPassword.html',
        controller: 'RecoverPasswordController',
        title: 'Recover Password'
    });
    $routeProvider.when(Console.rootPath + 'Authorization/RecoverPassword/SecurityQuestion',
    {
        templateUrl: Console.rootPath + 'Templates/Authorization/SecurityQuestion.html',
        controller: 'SecurityQuestionController',
        title: 'Security Question'
    });
    $routeProvider.when(Console.rootPath + 'Authorization/RecoverPassword/RecoverAgreement',
    {
        templateUrl: Console.rootPath + 'Templates/Authorization/RecoverAgreement.html',
        controller: 'RecoverAgreementController',
        title: 'Recover Password Agreement'
    });
    $routeProvider.when(Console.rootPath + 'Authorization/RecoverPassword/Confirmation',
    {
        templateUrl: Console.rootPath + 'Templates/Authorization/Confirmation.html',
        controller: 'ConfirmationController',
        title: 'Confirmation'
    });
    $routeProvider.when(Console.rootPath + 'Authorization/RecoverPassword/ChangePassword',
    {
        templateUrl: Console.rootPath + 'Templates/Authorization/ChangePassword.html',
        controller: 'ChangePasswordController',
        title: 'Change Password'
    });
    $routeProvider.when(Console.rootPath + 'Authorization/RecoverPassword/ResendKey',
    {
        templateUrl: Console.rootPath + 'Templates/Authorization/RecoverResendKey.html',
        controller: 'RecoverResendKeyController',
        title: 'Resend Confirmation Key'
    });
    $routeProvider.when(Console.rootPath + 'Authorization/RecoverPassword/SetSecurityQuestion',
    {
        templateUrl: Console.rootPath + 'Templates/Authorization/SetSecurityQuestion.html',
        controller: 'SetSecurityQuestionController',
        title: 'Set Security Question'
    });
    $routeProvider.otherwise(
    {
         redirectTo: Console.rootPath + 'Authorization/Login'
    });
    $locationProvider.html5Mode(true);
});


recoverPassword.run(function ($q, $rootScope, StartingPageService) {

    $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
        $rootScope.title = current.$$route.title;
        StartingPageService.StartingPageHandler();
    });


});