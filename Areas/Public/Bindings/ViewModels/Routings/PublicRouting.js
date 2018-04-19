publicContent.config(function ($routeProvider, $locationProvider) {
    $routeProvider.when(Console.rootPath + 'public/customer/app/activation/order',
    {
        templateUrl: Console.rootPath + 'Templates/Public/PublicContent.html',
        title: "Activation",
        controller: "ActivationController",
        content: 'Activation/SelfActivation_Main',
    }).when(Console.rootPath + 'public/customer/app/activation/order/information',
    {
        templateUrl: Console.rootPath + 'Templates/Public/PublicContent.html',
        title: "Customer Information",
        controller: "CustomerInformationController",
        content: 'Activation/SelfActivation_CustomerInfo',
    }).when(Console.rootPath + 'public/customer/app/activation/order/numberverify',
    {
        templateUrl: Console.rootPath + 'Templates/Public/PublicContent.html',
        title: "Number Verify",
        controller: "ActivationESNController",
        content: 'Activation/SelfActivation_ActivateNumber',
    }).when(Console.rootPath + 'public/customer/app/activation/order/activated',
    {
        templateUrl: Console.rootPath + 'Templates/Public/PublicContent.html',
        title: "Activated",
        controller: "FinishSelfActivationController",
        content: 'Activation/SelfActivation_Success',
    }).when(Console.rootPath + 'public/customer/app/shoppingcart',
    {
        templateUrl: Console.rootPath + 'Templates/Public/PublicContent.html',
        controller: 'CustomerRegistrationPageController',
        content: 'ShoppingCart/Index',
        title: 'Shopping Cart',
        resolve: {
            config: function (StartingPageService) {
                return StartingPageService.StartingPageHandler();
            }
        }
    }).when(Console.rootPath + 'public/customer/app/shoppingcart/confirmation',
    {
        templateUrl: Console.rootPath + 'Templates/Public/PublicContent.html',
        controller: 'CustomerRegistrationPageController',
        content: 'ShoppingCart/Index',
        title: 'Shopping Cart'
    }).when(Console.rootPath + 'public/customer/app/shoppingcart/failed',
    {
        templateUrl: Console.rootPath + 'Templates/Public/PublicContent.html',
        controller: 'CustomerRegistrationPageController',
        content: 'ShoppingCart/Index',
        title: 'Shopping Cart'
    }).when(Console.rootPath + 'public/customer/app/shoppingcart/cancelled', {
        templateUrl: Console.rootPath + 'Templates/Public/PublicContent.html',
        controller: 'CustomerRegistrationPageController',
        content: 'ShoppingCart/Index',
        title: 'Shopping Cart'
    }).when(Console.rootPath + 'public/customer/app', {
        templateUrl: Console.rootPath + 'Templates/Public/PublicContent.html',
        content: 'Home/Index',
        title: 'Home'
    });

    $routeProvider.otherwise(
    {
        redirectTo: Console.rootPath + 'public/customer/app'
    });
    $locationProvider.html5Mode(true);
});



/**
 *set title app 
 */
publicContent.run(function ($q, $rootScope, StartingPageService) {


    $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
        $rootScope.title = current.$$route.title;
        $rootScope.content = current.$$route.content;
        StartingPageService.StartingPageHandler();

    });
});