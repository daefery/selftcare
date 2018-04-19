'use strict';
SelfCareNav.config(function ($routeProvider, $locationProvider) {
    /**
     * Routing for Navigation SelfCare
     */
    $routeProvider.when(Console.rootPath + 'SelfCare/Customer/App',
    {
        templateUrl: Console.rootPath + 'Templates/SelfCare/SelfContents.html',
        title: 'Dashboard',
        controller: 'DashboardController',
        content: 'SelfCare/Dashboard/Main',
        resolve: {
            config: function (StartingPageService) {
                return StartingPageService.StartingPageHandler();
            },
            wrapper: function (CustomerWrapperService) {
                return CustomerWrapperService.HeaderWrapper();
            }
        },
        label: 'Home'
    }).when(Console.rootPath + 'SelfCare/Customer/App/BillingUsage',
    {
        templateUrl: Console.rootPath + 'Templates/SelfCare/SelfContents.html',
        title: 'Billing & Ussage',
        content: 'SelfCare/BillingAndUsage/Main',
        label: 'Billing & Ussage'
    }).when(Console.rootPath + 'SelfCare/Customer/App/Devices',
    {
        templateUrl: Console.rootPath + 'Templates/SelfCare/SelfContents.html',
        title: 'Devices',
        content: 'SelfCare/Devices/Main',
        controller: 'ManageDeviceController',
        resolve: {
            wrapper: function (CustomerWrapperService) {
                return CustomerWrapperService.HeaderWrapper();
            }
        },
        label: 'Devices'
    }).when(Console.rootPath + 'SelfCare/Customer/App/PlanServices',
    {
        templateUrl: Console.rootPath + 'Templates/SelfCare/SelfContents.html',
        title: 'Manage Service',
        controller:'ManageServiceController',
        content: 'SelfCare/ManageServices/Main',
        label: 'Manage Service',
        resolve: {
            wrapper: function (CustomerWrapperService) {
                return CustomerWrapperService.HeaderWrapper();
            }
        },
    }).when(Console.rootPath + 'SelfCare/Customer/App/ViewTroubleTicket',
    {
        templateUrl: Console.rootPath + 'Templates/SelfCare/SelfContents.html',
        title: 'View Support Request',
        controller: 'ViewTroubleTicketController',
        content: 'SelfCare/Support/Main',
        resolve: {
            wrapper: function (CustomerWrapperService) {
                return CustomerWrapperService.HeaderWrapper();
            }
        },
        label: 'View Support Request'
    }).when(Console.rootPath + 'SelfCare/Customer/App/CreateTroubleTicket',
    {
        templateUrl: Console.rootPath + 'Templates/SelfCare/SelfContents.html',
        title: 'Create Support Request',
        controller: 'CreateTroubleTicketController',
        content: 'SelfCare/Support/CreateTroubleTicket',
        resolve: {
            config: function (StartingPageService, CustomerWrapperService) {
                return StartingPageService.StartingPageHandler();
            },
            wrapper: function (CustomerWrapperService) {
                return CustomerWrapperService.HeaderWrapper();
            },
            permission: function (CheckAuthorizedPageService) {
                return CheckAuthorizedPageService.CheckAuthorizedPageHandler(false);
            }
        },
        label: 'Create Support Request'
    });
    $locationProvider.html5Mode(true);
});
