SelfCareContent.config(function ($routeProvider, $locationProvider) {
    $routeProvider.when(Console.rootPath + 'SelfCare/Customer/App/UpdateProfile',
    {
        templateUrl: Console.rootPath + 'Templates/SelfCare/SelfContents.html',
        title: 'Update Profile',
        controller: 'UpdateDetailCustomerController',
        content: 'SelfCare/UpdateProfile/GeneralUpdate',
        resolve: {
            wrapper: function (CustomerWrapperService) {
                return CustomerWrapperService.HeaderWrapper();
            }
        },
        label: 'Update Profile'
    }).when(Console.rootPath + 'SelfCare/Customer/App/ChangePassword',
    {
        templateUrl: Console.rootPath + 'Templates/SelfCare/SelfContents.html',
        title: 'Change Password',
        controller: 'ChangePasswordCustomerController',
        content: 'SelfCare/Security/ChangePassword',
        resolve: {
            wrapper: function (CustomerWrapperService) {
                return CustomerWrapperService.HeaderWrapper();
            }
        },
        label: 'Change Password'
    }).when(Console.rootPath + 'SelfCare/Customer/App/UsageDetail',
    {
        templateUrl: Console.rootPath + 'Templates/SelfCare/SelfContents.html',
        title: 'Usage Detail',
        controller: 'UsageDetailController',
        content: 'SelfCare/UsageDetail/Main',
        resolve: {
            wrapper: function (CustomerWrapperService) {
                return CustomerWrapperService.HeaderWrapper();
            }
        },
        label: 'Usage Detail'
    }).when(Console.rootPath + 'SelfCare/Customer/App/BuyService',
    {
        templateUrl: Console.rootPath + 'Templates/SelfCare/SelfContents.html',
        title: 'Buy Service',
        controller: 'BuyServiceController',
        content: 'SelfCare/BuyMore/Services',
        resolve: {
            wrapper: function (CustomerWrapperService) {
                return CustomerWrapperService.HeaderWrapper();
            },
            permission: function (CheckAuthorizedPageService) {
                return CheckAuthorizedPageService.CheckAuthorizedPageHandler(false);
            }
        },
        label: 'Buy Service'
    }).when(Console.rootPath + 'SelfCare/Customer/App/TopUp',
    {
        templateUrl: Console.rootPath + 'Templates/SelfCare/SelfContents.html',
        title: 'TopUp',
        controller: 'TopUpController',
        content: 'SelfCare/BuyMore/TopUp',
        resolve: {
            config: function (StartingPageService) {
                return StartingPageService.StartingPageHandler();
            },
            wrapper: function (CustomerWrapperService) {
                return CustomerWrapperService.HeaderWrapper();
            },
            permission: function (CheckAuthorizedPageService) {
                    return CheckAuthorizedPageService.CheckAuthorizedPageHandler(false);
            }
            
        },
        label: 'TopUp'
    }).when(Console.rootPath + 'SelfCare/Customer/App/TopUpSuccess',
    {
        templateUrl: Console.rootPath + 'Templates/SelfCare/SelfContents.html',
        title: 'TopUp Successfully',
        controller: 'TopUpSuccessController',
        content: 'SelfCare/Payment/PaymentResult',
        label: 'TopUp Successfully'
    }).when(Console.rootPath + 'SelfCare/Customer/App/TopUpFailed',
    {
        templateUrl: Console.rootPath + 'Templates/SelfCare/SelfContents.html',
        title: 'TopUp Failed',
        controller: 'TopUpFailedController',
        content: 'SelfCare/Payment/PaymentResult',
        label: 'TopUp Failed'
    }).when(Console.rootPath + 'SelfCare/Customer/App/TopUpCancelled',
    {
        templateUrl: Console.rootPath + 'Templates/SelfCare/SelfContents.html',
        title: 'TopUp Cancelled',
        controller: 'TopUpCancelledController',
        content: 'SelfCare/Payment/PaymentResult',
        label: 'TopUp Cancelled'
    }).when(Console.rootPath + 'SelfCare/Customer/App/BuyMoreServiceSuccess',
    {
        templateUrl: Console.rootPath + 'Templates/SelfCare/SelfContents.html',
        title: 'BuyMore Service Successfully',
        controller: 'BuyMoreServiceSuccessController',
        content: 'SelfCare/Payment/PaymentResult',
        label: 'BuyMore Service Successfully'
    }).when(Console.rootPath + 'SelfCare/Customer/App/BuyMoreServiceTopUpFailed',
    {
        templateUrl: Console.rootPath + 'Templates/SelfCare/SelfContents.html',
        title: 'BuyMore Service Failed',
        controller: 'BuyMoreServiceFailedController',
        content: 'SelfCare/Payment/PaymentResult',
        label: 'BuyMore Service Failed'
    }).when(Console.rootPath + 'SelfCare/Customer/App/BuyMoreServiceCancelled',
    {
        templateUrl: Console.rootPath + 'Templates/SelfCare/SelfContents.html',
        title: 'BuyMore Service Cancelled',
        controller: 'BuyMoreServiceCancelledController',
        content: 'SelfCare/Payment/PaymentResult',
        label: 'BuyMore Service Cancelled'
    }).when(Console.rootPath + 'SelfCare/Customer/App/Payment',
    {
        templateUrl: Console.rootPath + 'Templates/SelfCare/SelfContents.html',
        title: 'Payment',
        controller: 'PaymentController',
        content: 'SelfCare/Payment/Main',
        resolve: {
            wrapper: function (CustomerWrapperService) {
                return CustomerWrapperService.HeaderWrapper();
            }
        },
        label: 'Payment'
    }).when(Console.rootPath + 'SelfCare/Customer/App/Activate',
    {
        templateUrl: Console.rootPath + 'Templates/SelfCare/SelfContents.html',
        title: "Activation",
        controller: "ActivationESNController",
        content: 'SelfCare/Activation/SelfActivation_ActivateNumber',
        resolve: {
            wrapper: function (CustomerWrapperService) {
                return CustomerWrapperService.HeaderWrapper();
            }
        },
        label: 'Activation'
    }).when(Console.rootPath + 'SelfCare/Customer/App/Activated',
    {
        templateUrl: Console.rootPath + 'Templates/SelfCare/SelfContents.html',
        title: "Activation Success",
        content: 'SelfCare/Activation/SelfActivation_Success',
        resolve: {
            wrapper: function (CustomerWrapperService) {
                return CustomerWrapperService.HeaderWrapper();
            }
        },
        label: 'Activation Success'
    }).when(Console.rootPath + 'SelfCare/Customer/App/ManageAutoPay',
    {
        templateUrl: Console.rootPath + 'Templates/SelfCare/SelfContents.html',
        title: "Manage Auto Pay",
        content: 'SelfCare/ManageAutoPay/View',
        controller:'ManageAutoPayController',
        resolve: {
            wrapper: function (CustomerWrapperService) {
                return CustomerWrapperService.HeaderWrapper();
            },
            permission: function (CheckAuthorizedPageService) {
                return CheckAuthorizedPageService.CheckAuthorizedPageHandler(false);
            }
        },
        label: 'Manage Auto Pay'
    }).when(Console.rootPath + 'SelfCare/Customer/App/ManageAutoPay/AddCreditCard',
    {
        templateUrl: Console.rootPath + 'Templates/SelfCare/SelfContents.html',
        title: "Add Credit Card",
        content: 'SelfCare/ManageAutoPay/addcreditcard',
        controller: 'AddCreditCardController',
        resolve: {
            wrapper: function (CustomerWrapperService) {
                return CustomerWrapperService.HeaderWrapper();
            },
        },
        label: 'Add Credit Card'
    }).when(Console.rootPath + 'SelfCare/Customer/App/ETBOSSForm',
    {
        templateUrl: Console.rootPath + 'Templates/SelfCare/SelfContents.html',
        title: "Examples | ETBOSSFORM",
        content: 'SelfCare/Examples/ETBOSSForm',
        controller: 'SelfExamplesController',
        resolve: {
            wrapper: function (CustomerWrapperService) {
                return CustomerWrapperService.HeaderWrapper();
            }
        },
        label: 'Examples | ETBOSSFORM'
    }).when(Console.rootPath + 'SelfCare/Customer/App/ViewTroubleTicket/Details',
    {
        templateUrl: Console.rootPath + 'Templates/SelfCare/SelfContents.html',
        title: "Support Request Details",
        content: 'SelfCare/support/detailtroubleticket',
        controller: 'DetailsTroubleTicketController',
        resolve: {
            wrapper: function (CustomerWrapperService) {
                return CustomerWrapperService.HeaderWrapper();
            }
        },
        label: 'Support Request Details'
    }).when(Console.rootPath + 'SelfCare/Customer/App/Start',
    {
        templateUrl: Console.rootPath + 'Templates/SelfCare/SelfContents.html',
        //templateUrl: Console.rootPath + 'Templates/SelfCare/Starting/Devices.html',
        content: 'SelfCare/Starting/Devices',
        title: "Select Device",
        controller: 'StartingDevicesController',
        resolve: {
            wrapper: function (CustomerWrapperService) {
                return CustomerWrapperService.HeaderWrapper();
            }
        }
    }).when(Console.rootPath + 'SelfCare/Customer/App/BuyMore/Device', {
        controller: 'CustomerRegistrationPageController',
        templateUrl: Console.rootPath + 'Templates/SelfCare/SelfContents.html',
        content: 'Public/ShoppingCart/Index',
        title: 'Buy More Device',
        label: 'Buy More Device',
        resolve: {
            wrapper: function (CustomerWrapperService) {
                return CustomerWrapperService.HeaderWrapper();
            }
        }
    }).when(Console.rootPath + 'SelfCare/Customer/App/BuyMoreDevice/Confirmation', {
        templateUrl: Console.rootPath + 'Templates/SelfCare/SelfContents.html',
        controller: 'CustomerRegistrationPageController',
        content: 'Public/ShoppingCart/Index',
        title: 'Buy More Device',
        label: 'Buy More Device',
        resolve: {
            wrapper: function (CustomerWrapperService) {
                return CustomerWrapperService.HeaderWrapper();
            }
        }

    }).when(Console.rootPath + 'SelfCare/Customer/App/BuyMoreDevice/Failed', {
        templateUrl: Console.rootPath + 'Templates/SelfCare/SelfContents.html',
        controller: 'CustomerRegistrationPageController',
        content: 'Public/ShoppingCart/Index',
        title: 'Buy More Device',
        label: 'Buy More Device',
        resolve: {
            wrapper: function (CustomerWrapperService) {
                return CustomerWrapperService.HeaderWrapper();
            }
        }
    }).when(Console.rootPath + 'SelfCare/Customer/App/BuyMoreDevice/Cancelled', {
        templateUrl: Console.rootPath + 'Templates/SelfCare/SelfContents.html',
        controller: 'CustomerRegistrationPageController',
        content: 'Public/ShoppingCart/Index',
        title: 'Buy More Device',
        label: 'Buy More Device',
        resolve: {
            wrapper: function (CustomerWrapperService) {
                return CustomerWrapperService.HeaderWrapper();
            }
        }
    }).when(Console.rootPath + 'SelfCare/Customer/App/Cart/Summary',
    {
        templateUrl: Console.rootPath + 'Templates/SelfCare/SelfContents.html',
        title: 'Shopping Cart Summary',
        controller: 'SelfShoppingCartSummaryController',
        content: 'SelfCare/ShoppingCart/Summary',
        label: 'Shopping Cart Summary',
        resolve: {
            wrapper: function (CustomerWrapperService) {
                return CustomerWrapperService.HeaderWrapper();
            }
        },
    });
    
    /**
     * Otherways
     */
    $routeProvider.otherwise({ redirectTo: Console.rootPath + 'SelfCare/Customer/App/NotFound' });
    $locationProvider.html5Mode(true);
});




/**
 *set title app 
 */
SelfCareContent.run(function ($rootScope, $location, IdleHandler, ErrorHandlerUtility, StartingPageService, ApiConnection, CheckAuthorizedPageService, SelfCareCommonService) {
    IdleHandler.StartIdleObserver();
    //CustomerWrapperService.HeaderWrapper().then(function (result) {
    //    if (result != false) {
    //        $rootScope.wrapper = angular.copy(result);
    //        console.log("Init : " + $rootScope.wrapper);
    //    }
    //});
    
    $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
        CheckingLoginStateGlobal();
        var redirectToStart = true;
        if (config.isMultisubscription && !JSON.parse(localStorage.self_scope).activeDevice.Msisdn && JSON.parse(localStorage.self_scope).totalSubscriptionActive >= 0 && SelfCareCommonService.SecureSectionRoute()) {
            window.location.href = "/SelfCare/Customer/App/Start";
            redirectToStart = false;
        };
        if (previous && previous != null) {
            if (previous.originalPath === "/SelfCare/Customer/App/Start" && current.content !== 'SelfCare/Dashboard/Main') {
                sessionStorage.setItem('HideHeaderAndBC', true);
            } else {
                sessionStorage.setItem('HideHeaderAndBC', false);
            }
        };
        
        if (redirectToStart == true && sessionStorage.HideHeaderAndBC && sessionStorage.HideHeaderAndBC === 'true' && !JSON.parse(localStorage.self_scope).activeDevice.Msisdn && SelfCareCommonService.SecureSectionRoute()){
            console.log(true)
            window.location.href = "/SelfCare/Customer/App/Start";
        }

        $rootScope.title = current.$$route.title;
        $rootScope.content = current.$$route.content;
        StartingPageService.StartingPageHandler();
        $rootScope.breakpoints = [
        {
            breakpoint: 1024,
            settings: {
                slidesToShow: 3,
                slidesToScroll: 1,
                infinite: false,
                dots: false
            }
        },
        {
            breakpoint: 768,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
                infinite: false,
                arrows: false,
                dots: false,
                draggable: true,
            }
        },
        {
            breakpoint: 600,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
                infinite: false,
                arrows: false,
                dots: false,
                draggable: true,
            }
        },
        {
            breakpoint: 480,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
                infinite: false,
                arrows: false,
                dots: false,
                draggable: true,

            }
        }
        ];
    });


    
});
