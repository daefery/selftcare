'use strict';
SelfCareHeader.config(function ($routeProvider, $locationProvider) {
    /**
     * Routing for header SelfCare
     */
     $routeProvider.when(Console.rootPath + 'SelfCare/Customer/App/YourProfile',
    {
        templateUrl: Console.rootPath + 'Templates/SelfCare/SelfContents.html',
        title: 'Your Profile',
        controller: 'YourProfileController',
        content: 'SelfCare/YourProfile/Main',
        resolve: {
            wrapper: function (CustomerWrapperService) {
                return CustomerWrapperService.HeaderWrapper();
            }
        },
        label: 'Your Profile'
    }).when(Console.rootPath + 'SelfCare/Customer/App/Cart',
    {
        templateUrl: Console.rootPath + 'Templates/SelfCare/SelfContents.html',
        title: 'Shopping Cart',
        controller: 'SelfShoppingCartController',
        content: 'SelfCare/ShoppingCart/Cart',
        label: 'Cart',
        resolve: {
            wrapper: function (CustomerWrapperService) {
                return CustomerWrapperService.HeaderWrapper();
            }
        },
    });
    $locationProvider.html5Mode(true);
});