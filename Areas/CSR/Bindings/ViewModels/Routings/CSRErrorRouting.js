CSRContent.config(function ($routeProvider, $locationProvider) {
    $routeProvider.when(Console.rootPath + 'CSR/Customer/App/NotFound',
    {
        templateUrl: Console.rootPath + 'Templates/ErrorPage/NotFound.html',
        title: 'Not Found'
    }).when(Console.rootPath + 'CSR/Customer/App/InternalServerError',
    {
        templateUrl: Console.rootPath + 'Templates/ErrorPage/InternalServerError.html',
        title: 'Internal Server Error'
    }).when(Console.rootPath + 'CSR/Customer/App/BadRequest',
    {
        templateUrl: Console.rootPath + 'Templates/ErrorPage/BadRequest.html',
        title: 'Bad Request'
    });

});

/**
 *set title app 
 */
CSRContent.run(['$rootScope', function ($rootScope) {
    $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
        $rootScope.title = current.$$route.title;
    });
}]);