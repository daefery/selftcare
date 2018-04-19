authorization.config(function ($routeProvider, $locationProvider) {
    $routeProvider.when(Console.rootPath + 'Authorization/Login',
    {
        templateUrl: Console.rootPath + 'Templates/Authorization/Main.html',
        controller: 'AuthorizationViewModel',
        title: 'Login',
        resolve: {
            config: function (StartingPageService) {
                return StartingPageService.StartingPageHandler();
            },
        }
    });
        $routeProvider.otherwise({ redirectTo: Console.rootPath + 'Authorization/Login' });
        $locationProvider.html5Mode(true);
});



authorization.run(function ($q, $rootScope, StartingPageService, AutoLoginService) {
   
    $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
        $rootScope.title = current.$$route.title;
        if (StartingPageService.StartingPageHandler()) {
            clearInterval(IDLE_OBSERVER);
            if (!AutoLoginService.AutoLoginHandler()) {
                ClearCommonSession();
            }
        } else {
            clearInterval(IDLE_OBSERVER);
            if (!AutoLoginService.AutoLoginHandler()) {
                ClearCommonSession();
            }
        }
        
    });

   
});