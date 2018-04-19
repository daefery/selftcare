SelfCareContent.config(function ($routeProvider, $locationProvider) {
    $routeProvider.when(Console.rootPath + 'SelfCare/Customer/App/NotFound',
    {
        templateUrl: Console.rootPath + 'Templates/ErrorPage/NotFound.html',
        title: 'Not Found'
    }).when(Console.rootPath + 'SelfCare/Customer/App/InternalServerError',
    {
        templateUrl: Console.rootPath + 'Templates/ErrorPage/InternalServerError.html',
        title: 'Internal Server Error'
    }).when(Console.rootPath + 'SelfCare/Customer/App/BadRequest',
    {
        templateUrl: Console.rootPath + 'Templates/ErrorPage/BadRequest.html',
        title: 'Bad Request'
    });

});

/**
 *set title app 
 */
SelfCareContent.run(['$rootScope', function ($rootScope) {
    $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
        $rootScope.title = current.$$route.title;
    });
}]);