myAccount.config(function ($routeProvider, $locationProvider) {
    $routeProvider.when(Console.rootPath + 'CSR/Customer/App/MyAccount', { templateUrl: Console.rootPath + 'Templates/CSR/MyAccount/Main.html', controller: 'MyAccountViewModel' });
    $locationProvider.html5Mode(true);
});


myAccount.run(function ($rootScope, IdleHandler) {
    CheckingLoginStateGlobal();
    IdleHandler.StartIdleObserver();
});