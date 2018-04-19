//agung meinastesi caesar
//routing for CSRContent  module
//created 22.09.2015


CSRContent.config(function ($routeProvider, $locationProvider) {
    $routeProvider
        .when(Console.rootPath + 'CSR/Customer/App', {
            templateUrl: Console.rootPath + 'Templates/CSR/Content/CSRContents.html',
            controller: 'HomeController',
            content: 'CSR/Dashboard/Main',
            label: 'Home',
            title: 'DASHBOARD'
        })
        .when(Console.rootPath + 'CSR/Customer/App/SearchPage', {
            templateUrl: Console.rootPath + 'Templates/CSR/Content/CSRContents.html',
            controller: 'SearchCustomer',
            content: 'CSR/Search/SearchResults',
            label: 'Dashboard Customer',
            title: 'Dashboard Customer',
            resolve: {
                permission: function (CheckAuthorizedPageService) {
                    return CheckAuthorizedPageService.CheckAuthorizedPageHandler(true);
                }
            }
        })
        .when(Console.rootPath + 'CSR/Customer/App/SearchPage/CustomerDetailDashboard', {
            templateUrl: Console.rootPath + 'Templates/CSR/Content/CSRContents.html',
            controller: 'CustomerDetailInformation',
            content: 'CSR/Customer/CustomerDetails',
            label: 'Detail Customer',
            title: 'Detail Customer',
            resolve: {
                permission: function (CheckAuthorizedPageService) {
                    return CheckAuthorizedPageService.CheckAuthorizedPageHandler(true);
                }
            }
        })
        .when(Console.rootPath + 'CSR/Customer/App/SearchPage/SubscriptionDashboard', {
            templateUrl: Console.rootPath + 'Templates/CSR/Content/CSRContents.html',
            controller: 'SubscriptionDashboardController',
            content: 'CSR/Customer/Subscription/SubscriptionDashboard',
            label: 'Subscription Dashboard',
            title: 'Subscription Dashboard',
            resolve: {
                permission: function (CheckAuthorizedPageService) {
                    return CheckAuthorizedPageService.CheckAuthorizedPageHandler(true);
                }
            }
        })

        .when(Console.rootPath + 'CSR/Customer/App/SearchPage/TroubleTickets', {
            templateUrl: Console.rootPath + 'Templates/CSR/Content/CSRContents.html',
            content: 'CSR/Customer/TroubleTicket/Index',
            label: 'TROUBLE_TICKETS',
            title: 'TROUBLE_TICKETS',
            resolve: {
                permission: function (CheckAuthorizedPageService) {
                    return CheckAuthorizedPageService.CheckAuthorizedPageHandler(true);
                },
            }
        })
        .when(Console.rootPath + 'CSR/Customer/App/SearchPage/TroubleTicketInfo', {
            templateUrl: Console.rootPath + 'Templates/CSR/Content/CSRContents.html',
            content: 'CSR/Customer/TroubleTicket/Content/DetailTT',
            label: 'TT_Details',
            title: 'TT_Details',
            resolve: {
                permission: function (CheckAuthorizedPageService) {
                    return CheckAuthorizedPageService.CheckAuthorizedPageHandler(true);
                },
            }
        })

        //TroubleTickets, begin
        .when(Console.rootPath + 'CSR/Customer/App/TroubleTickets', {
            templateUrl: Console.rootPath + 'Templates/CSR/Content/CSRContents.html',
            controller: 'BrowseTTFormController',
            content: 'CSR/Customer/TroubleTicket/Content/DashboardTT',
            label: 'Browse Trouble Tickets',
            title: 'Browse Trouble Tickets',
            resolve: {
                permission: function (CheckAuthorizedPageService) {
                    return CheckAuthorizedPageService.CheckAuthorizedPageHandler(true);
                }
            }
            
        })
        .when(Console.rootPath + 'CSR/Customer/App/TroubleTickets/Dashboard', {
            templateUrl: Console.rootPath + 'Templates/CSR/Content/CSRContents.html',
            controller: 'BrowseTTFormController',
            content: 'CSR/Customer/TroubleTicket/Content/DashboardTT',
            label: 'Browse Trouble Tickets',
            title: 'Browse Trouble Tickets',
            resolve: {
                permission: function (CheckAuthorizedPageService) {
                        return CheckAuthorizedPageService.CheckAuthorizedPageHandler(true);
                }
            }
        })
        .when(Console.rootPath + 'CSR/Customer/App/TroubleTickets/SupportRequest', {
            templateUrl: Console.rootPath + 'Templates/CSR/Content/CSRContents.html',
            controller: 'SupportRequestTTFormController',
            content: 'CSR/Customer/TroubleTicket/Content/SupportRequestTT',
            label: 'Support Request',
            title: 'Support Request',
            resolve: {
                permission: function (CheckAuthorizedPageService) {
                    return CheckAuthorizedPageService.CheckAuthorizedPageHandler(true);
                }
            }
        })
        .when(Console.rootPath + 'CSR/Customer/App/TroubleTickets/Statistics', {
            templateUrl: Console.rootPath + 'Templates/CSR/Content/CSRContents.html',
            controller: 'TTStatisticsController',
            content: 'CSR/Customer/TroubleTicket/Content/Statistics',
            label: 'Statistics',
            title: 'Statistics',
            resolve: {
                permission: function (CheckAuthorizedPageService) {
                    return CheckAuthorizedPageService.CheckAuthorizedPageHandler(true);
                }
            }
        })
        .when(Console.rootPath + 'CSR/Customer/App/TroubleTickets/SupportRequestDetail', {
            templateUrl: Console.rootPath + 'Templates/CSR/Content/CSRContents.html',
            controller: 'SupportRequestTTDetailController',
            content: 'CSR/Customer/TroubleTicket/Content/SupportRequestTTDetail',
            label: 'Support Request Detail',
            title: 'Support Request Detail',
            resolve: {
                permission: function (CheckAuthorizedPageService) {
                    return CheckAuthorizedPageService.CheckAuthorizedPageHandler(true);
                },
            }
        })
        //TroubleTickets, end


        //not used yet, prepare for like query
        .when(Console.rootPath + 'CSR/Customer/App/MultipleResult', {
            templateUrl: Console.rootPath + 'Templates/CSR/Content/CSRContents.html',
            content: 'CSR/Search/MultipleResultPage',
            controller: '',
            label: 'Multiple Result',
            title: 'Multiple Result'
        })
        .when(Console.rootPath + 'CSR/Customer/App/AdvanceSearch', {
            templateUrl: Console.rootPath + 'Templates/CSR/Content/CSRContents.html',
            content: 'CSR/Search/AdvanceSearch',
            label: 'ADVANCED_SEARCH',
            title: 'ADVANCED_SEARCH'
        })
        .when(Console.rootPath + 'CSR/Customer/App/CustomerRegistration', {
            controller: 'CustomerRegistrationPageController',
            templateUrl: Console.rootPath + 'Templates/CSR/Content/CSRContents.html',
            content: 'Public/ShoppingCart/Index',
            title: 'Customer Registration',
            resolve: {
                config: function (StartingPageService) {
                    return StartingPageService.StartingPageHandler();
                },
                permission: function (CheckAuthorizedPageService) {
                    return CheckAuthorizedPageService.CheckAuthorizedPageHandler(true);
                }
            }
           
        
        })

        
        .when(Console.rootPath + 'CSR/Customer/App/CustomerRegistration/Confirmation', {
            templateUrl: Console.rootPath + 'Templates/CSR/Content/CSRContents.html',
            controller: 'CustomerRegistrationPageController',
            content: 'Public/ShoppingCart/Index',
            label: 'Customer Registration',
            title: 'Customer Registration',
            resolve: {
                permission: function (CheckAuthorizedPageService) {
                    return CheckAuthorizedPageService.CheckAuthorizedPageHandler(true);
                }
            }

        })
        .when(Console.rootPath + 'CSR/Customer/App/CustomerRegistration/Failed', {
            templateUrl: Console.rootPath + 'Templates/CSR/Content/CSRContents.html',
            controller: 'CustomerRegistrationPageController',
            content: 'Public/ShoppingCart/Index',
            label: 'Customer Registration',
            title: 'Customer Registration',
            resolve: {
                permission: function (CheckAuthorizedPageService) {
                    return CheckAuthorizedPageService.CheckAuthorizedPageHandler(true);
                }
            }
        })
    .when(Console.rootPath + 'CSR/Customer/App/CustomerRegistration/Cancelled', {
        templateUrl: Console.rootPath + 'Templates/CSR/Content/CSRContents.html',
        controller: 'CustomerRegistrationPageController',
        content: 'Public/ShoppingCart/Index',
        label: 'Customer Registration',
        title: 'Customer Registration',
        resolve: {
            permission: function (CheckAuthorizedPageService) {
                return CheckAuthorizedPageService.CheckAuthorizedPageHandler(true);
            }
        }
    });
        //TODO (2) Create routing for user management and role management
    //routing placement inventory menu    
    $routeProvider.when(
        Console.rootPath + 'CSR/Customer/App/Inventory', {
            templateUrl: Console.rootPath + 'Templates/CSR/Content/CSRContents.html',
            controller: '',
            content: 'CSR/Inventory/DeviceManagement/Index',
            label: 'Inventory',
            title: 'Device Management',
            resolve: {
                permission: function (CheckAuthorizedPageService) {
                    return CheckAuthorizedPageService.CheckAuthorizedPageHandler(true);
                },
            }
        });
    $routeProvider.when(
        Console.rootPath + 'CSR/Customer/App/Inventory/InventoryManagement', {
            templateUrl: Console.rootPath + 'Templates/CSR/Content/CSRContents.html',
            controller: 'InventoryManagementController',
            content: 'CSR/Inventory/InventoryManagement/Inventory',
            label: 'Inventory Management',
            title: 'Inventory Management',
            resolve: {
                permission: function (CheckAuthorizedPageService) {
                    return CheckAuthorizedPageService.CheckAuthorizedPageHandler(true);
                }
            }
        });
    $routeProvider.when(
        Console.rootPath + 'CSR/Customer/App/Inventory/Orders', {
            templateUrl: Console.rootPath + 'Templates/CSR/Content/CSRContents.html',
            controller: 'OrderManagementController',
            content: 'CSR/Inventory/Orders/Index',
            label: 'Orders Management',
            title: 'Orders Management',
            resolve: {
                permission: function (CheckAuthorizedPageService) {
                    return CheckAuthorizedPageService.CheckAuthorizedPageHandler(true);
                }
            }
        });
    $routeProvider.when(
       Console.rootPath + 'CSR/Customer/App/Inventory/Orders/OrderDetail', {
           templateUrl: Console.rootPath + 'Templates/CSR/Content/CSRContents.html',
           controller: 'OrderDetailController',
           content: 'CSR/Inventory/Orders/Content/Details/OrderDetail',
           label: 'Order Details',
           title: 'Order Details',
           resolve: {
               permission: function (CheckAuthorizedPageService) {
                   return CheckAuthorizedPageService.CheckAuthorizedPageHandler(true);
               }
           }
       });
    $routeProvider.when(
       Console.rootPath + 'CSR/Customer/App/Inventory/Testing', {
           templateUrl: Console.rootPath + 'Templates/CSR/Content/CSRContents.html',
           controller: 'TestingController',
           content: 'CSR/Inventory/Orders/Testing',
           label: 'Testing Inventory',
           title: 'Testing Inventory'
           
       });
    //end routing placement inventory menu
    $routeProvider.when(
        Console.rootPath + 'CSR/Customer/App/Admin', {
            templateUrl: Console.rootPath + 'Templates/CSR/Content/CSRContents.html',
            controller: '',
            content: 'CSR/Administrator/AdminContent',
            label: 'Admin Features',
            title: 'Admin Features',
            resolve: {
                permission: function (CheckAuthorizedPageService) {
                    return CheckAuthorizedPageService.CheckAuthorizedPageHandler(true);
                }
            }
    });
    $routeProvider.when(
        Console.rootPath + 'CSR/Customer/App/Admin/RoleManagement', {
            templateUrl: Console.rootPath + 'Templates/CSR/Content/CSRContents.html',
            controller: 'viewRoleCtrl',
            content: 'CSR/Administrator/RoleManagement/Index',
            label: 'Role Management',
            title: 'Role Management',
            resolve: {
                permission: function (CheckAuthorizedPageService) {
                    return CheckAuthorizedPageService.CheckAuthorizedPageHandler(true);
                }
            }
        });
    $routeProvider.when(
        Console.rootPath + 'CSR/Customer/App/Admin/ModuleManagement', {
            templateUrl: Console.rootPath + 'Templates/CSR/Content/CSRContents.html',
            controller: 'ModuleManagementController',
            content: 'CSR/Administrator/ModuleManagement/Index',
            label: 'Module Management',
            title: 'Module Management',
            resolve: {
                permission: function (CheckAuthorizedPageService) {
                    return CheckAuthorizedPageService.CheckAuthorizedPageHandler(true);
                }
            }
        });
    $routeProvider.when(Console.rootPath + 'CSR/Customer/App/Admin/UserManagement', {
        templateUrl: Console.rootPath + 'Templates/CSR/Content/CSRContents.html',
        controller: 'ViewUserController',
        content: 'CSR/Administrator/UserManagement/Index',
        label: 'User Management',
        title: 'User Management',
        resolve: {
            permission: function (CheckAuthorizedPageService) {
                return CheckAuthorizedPageService.CheckAuthorizedPageHandler(true);
            }
        }
    });

    $routeProvider.when(Console.rootPath + 'CSR/Customer/App/Admin/MaintenanceManagement', {
        templateUrl: Console.rootPath + 'Templates/CSR/Content/CSRContents.html',
        controller: 'MaintenancePlanController',
        content: 'CSR/Administrator/MaintenanceManagement/MaintenancePlan',
        label: 'Maintenance Management',
        title: 'Maintenance Management'
    });

    $routeProvider.when(Console.rootPath + 'CSR/Customer/App/Admin/UpdateHistory', {
        templateUrl: Console.rootPath + 'Templates/CSR/Content/CSRContents.html',
        controller: 'UpdateHistoryController',
        content: 'CSR/Administrator/MaintenanceManagement/UpdateHistory',
        label: 'Update History',
        title: 'Update History'
    });

    $routeProvider.when(Console.rootPath + 'CSR/Customer/App/Admin/Testing', {
        templateUrl: Console.rootPath + 'Templates/CSR/Content/CSRContents.html',
        controller: 'TestingController',
        content: 'CSR/Administrator/UserManagement/Testing',
        label: 'Testing Admin',
        title: 'Testing Admin',
        resolve: {
            permission: function (CheckAuthorizedPageService) {
                return CheckAuthorizedPageService.CheckAuthorizedPageHandler(true);
            }
        }
    });

    $routeProvider.when(Console.rootPath + 'CSR/Customer/App/Admin/CustomerAccountManagement', {
        templateUrl: Console.rootPath + 'Templates/CSR/Content/CSRContents.html',
        controller: 'AdminSearchCustomerController',
        content: 'CSR/Administrator/CustomerAccountManagement/Index',
        label: 'Customer Account Management',
        title: 'Customer Account Management',
        resolve: {
            permission: function (CheckAuthorizedPageService) {
                return CheckAuthorizedPageService.CheckAuthorizedPageHandler(true);
            }
        }
    });
    $routeProvider.when(Console.rootPath + 'CSR/Customer/App/Admin/UserManagement/AddUser', {
        templateUrl: Console.rootPath + 'Templates/CSR/Content/CSRContents.html',
        controller: 'AddUserController',
        content: 'CSR/Administrator/UserManagement/AddUser/tempAddUserContent',
        label: 'Add User',
        title: 'Add User',
        resolve: {
            permission: function (CheckAuthorizedPageService) {
                return CheckAuthorizedPageService.CheckAuthorizedPageHandler(true);
            }
        }
    });
    $routeProvider.when(Console.rootPath + 'CSR/Customer/App/Admin/UserManagement/UserDetail', {
        templateUrl: Console.rootPath + 'Templates/CSR/Content/CSRContents.html',
        controller: 'ViewUserDetailController',
        content: 'CSR/Administrator/UserManagement/UserDetail/tempUserDetailContent',
        label: 'User Detail',
        title: 'User Detail',
        resolve: {
            permission: function (CheckAuthorizedPageService) {
                return CheckAuthorizedPageService.CheckAuthorizedPageHandler(true);
            }
        }
    });
    //'Administrator/UserManagement/UserDetail/UserDetail'

    $routeProvider.when(Console.rootPath + 'CSR/Customer/App/Admin/WorkFlowConfiguration', {
        templateUrl: Console.rootPath + 'Templates/CSR/Content/CSRContents.html',
        controller: 'WorkFlowConfigurationTTController',
        content: 'CSR/Administrator/TroubleTicketConfiguration/WorkFlowConfigurationTT',
        label: 'WorkFlow Configuration',
        title: 'WorkFlow Configuration',
        resolve: {
            permission: function (CheckAuthorizedPageService) {
                return CheckAuthorizedPageService.CheckAuthorizedPageHandler(true);
            }
        }
    })
    $routeProvider.when(Console.rootPath + 'CSR/Customer/App/Admin/DepartmentConfiguration', {
        templateUrl: Console.rootPath + 'Templates/CSR/Content/CSRContents.html',
        controller: 'ManageTTDepartmentController',
        content: 'CSR/Administrator/TroubleTicketConfiguration/Department/ManageTTDepartment',
        label: 'Department Configuration',
        title: 'Department Configuration',
        resolve: {
            permission: function (CheckAuthorizedPageService) {
                return CheckAuthorizedPageService.CheckAuthorizedPageHandler(true);
            }
        }
    })
    $routeProvider.when(Console.rootPath + 'CSR/Customer/App/Admin/StatusConfiguration', {
        templateUrl: Console.rootPath + 'Templates/CSR/Content/CSRContents.html',
        controller: 'ManageTTStatusController',
        content: 'CSR/Administrator/TroubleTicketConfiguration/Status/ManageTTStatus',
        label: 'Status Configuration',
        title: 'Status Configuration',
        resolve: {
            permission: function (CheckAuthorizedPageService) {
                return CheckAuthorizedPageService.CheckAuthorizedPageHandler(true);
            }
        }
    })
    $routeProvider.when(Console.rootPath + 'CSR/Customer/App/Admin/FlowTypeConfiguration', {
        templateUrl: Console.rootPath + 'Templates/CSR/Content/CSRContents.html',
        controller: 'ManageTTFlowTypeController',
        content: 'CSR/Administrator/TroubleTicketConfiguration/FlowType/ManageTTFlowType',
        label: 'FlowType Configuration',
        title: 'FlowType Configuration',
        resolve: {
            permission: function (CheckAuthorizedPageService) {
                return CheckAuthorizedPageService.CheckAuthorizedPageHandler(true);
            }
        }
    })
    $routeProvider.when(Console.rootPath + 'CSR/Customer/App/Admin/TypeConfiguration', {
        templateUrl: Console.rootPath + 'Templates/CSR/Content/CSRContents.html',
        controller: 'ManageTTTypeController',
        content: 'CSR/Administrator/TroubleTicketConfiguration/Type/ManageTTType',
        label: 'Type Configuration',
        title: 'Type Configuration',
        resolve: {
            permission: function (CheckAuthorizedPageService) {
                return CheckAuthorizedPageService.CheckAuthorizedPageHandler(true);
            }
        }
    })
    $routeProvider.when(Console.rootPath + 'CSR/Customer/App/Admin/PriorityConfiguration', {
        templateUrl: Console.rootPath + 'Templates/CSR/Content/CSRContents.html',
        controller: 'ManageTTPriorityController',
        content: 'CSR/Administrator/TroubleTicketConfiguration/Priority/ManageTTPriority',
        label: 'Priority Configuration',
        title: 'Priority Configuration',
        resolve: {
            permission: function (CheckAuthorizedPageService) {
                return CheckAuthorizedPageService.CheckAuthorizedPageHandler(true);
            }
        }
    })
    $routeProvider.when(Console.rootPath + 'CSR/Customer/App/Admin/ClassConfiguration', {
        templateUrl: Console.rootPath + 'Templates/CSR/Content/CSRContents.html',
        controller: 'ManageTTClassController',
        content: 'CSR/Administrator/TroubleTicketConfiguration/Class/ManageTTClass',
        label: 'Class Configuration',
        title: 'Class Configuration',
        resolve: {
            permission: function (CheckAuthorizedPageService) {
                return CheckAuthorizedPageService.CheckAuthorizedPageHandler(true);
            }
        }
    })
    $routeProvider.when(Console.rootPath + 'CSR/Customer/App/Admin/OperationTypeConfiguration', {
        templateUrl: Console.rootPath + 'Templates/CSR/Content/CSRContents.html',
        controller: 'ManageTTOperationTypeController',
        content: 'CSR/Administrator/TroubleTicketConfiguration/OperationType/ManageTTOperationType',
        label: 'OperationType Configuration',
        title: 'OperationType Configuration',
        resolve: {
            permission: function (CheckAuthorizedPageService) {
                return CheckAuthorizedPageService.CheckAuthorizedPageHandler(true);
            }
        }
    })
    $routeProvider.when(Console.rootPath + 'CSR/Customer/App/Admin/SubTypeConfiguration', {
        templateUrl: Console.rootPath + 'Templates/CSR/Content/CSRContents.html',
        controller: 'ManageTTSubTypeController',
        content: 'CSR/Administrator/TroubleTicketConfiguration/SubType/ManageTTSubType',
        label: 'SubType Configuration',
        title: 'SubType Configuration',
        resolve: {
            permission: function (CheckAuthorizedPageService) {
                return CheckAuthorizedPageService.CheckAuthorizedPageHandler(true);
            }
        }
    })
    $routeProvider.when(Console.rootPath + 'CSR/Customer/App/Admin/QuestionCodeConfiguration', {
        templateUrl: Console.rootPath + 'Templates/CSR/Content/CSRContents.html',
        controller: 'ManageTTQuestionCodeController',
        content: 'CSR/Administrator/TroubleTicketConfiguration/QuestionCode/ManageTTQuestionCode',
        label: 'QuestionCode Configuration',
        title: 'QuestionCode Configuration',
        resolve: {
            permission: function (CheckAuthorizedPageService) {
                return CheckAuthorizedPageService.CheckAuthorizedPageHandler(true);
            }
        }
    })
    $routeProvider.when(Console.rootPath + 'CSR/Customer/App/Admin/QuestionConfiguration', {
        templateUrl: Console.rootPath + 'Templates/CSR/Content/CSRContents.html',
        controller: 'ManageTTQuestionController',
        content: 'CSR/Administrator/TroubleTicketConfiguration/Question/ManageTTQuestion',
        label: 'Question Configuration',
        title: 'Question Configuration',
        resolve: {
            permission: function (CheckAuthorizedPageService) {
                return CheckAuthorizedPageService.CheckAuthorizedPageHandler(true);
            }
        }
    })
    $routeProvider.when(Console.rootPath + 'CSR/Customer/App/Admin/KPIConfiguration', {
        templateUrl: Console.rootPath + 'Templates/CSR/Content/CSRContents.html',
        controller: 'ManageTTKPIController',
        content: 'CSR/Administrator/TroubleTicketConfiguration/KPI/ManageTTKPI',
        label: 'KPI Configuration',
        title: 'KPI Configuration',
        resolve: {
            permission: function (CheckAuthorizedPageService) {
                return CheckAuthorizedPageService.CheckAuthorizedPageHandler(true);
            }
        }
    })
    $routeProvider.when(Console.rootPath + 'CSR/Customer/App/Admin/FlowRuleConfiguration', {
        templateUrl: Console.rootPath + 'Templates/CSR/Content/CSRContents.html',
        controller: 'ManageTTFlowRuleController',
        content: 'CSR/Administrator/TroubleTicketConfiguration/FlowRule/ManageTTFlowRule',
        label: 'FlowRule Configuration',
        title: 'FlowRule Configuration',
        resolve: {
            permission: function (CheckAuthorizedPageService) {
                return CheckAuthorizedPageService.CheckAuthorizedPageHandler(true);
            }
        }
    })

    //End (2)
		$routeProvider.otherwise({ redirectTo: Console.rootPath + 'CSR/Customer/App/NotFound' });
    //My Account//
    //by Mahdi Badari//
    $routeProvider.when(
        Console.rootPath + 'CSR/Customer/App/MyAccount', {
        templateUrl: Console.rootPath + 'Templates/CSR/Content/CSRContents.html',
        controller: 'OverviewController',
        label: 'My Account',
        content: 'CSR/MyAccount/Overview/Overview',
        title: 'My Account',
        resolve: {
            permission: function (CheckAuthorizedPageService) {
                return CheckAuthorizedPageService.CheckAuthorizedPageHandler(true);
            }
        }
    });
    $routeProvider.when(
        Console.rootPath + 'CSR/Customer/App/MyAccount/Testing', {
            templateUrl: Console.rootPath + 'Templates/CSR/Content/CSRContents.html',
            controller: 'TestingController',
            label: 'Testing My Account',
            content: 'CSR/MyAccount/Testing',
            title: 'Testing My Account',
            resolve: {
                permission: function (CheckAuthorizedPageService) {
                    return CheckAuthorizedPageService.CheckAuthorizedPageHandler(true);
                }
            }
        });
    $routeProvider.when(Console.rootPath + 'CSR/Customer/App/MyAccount/Credential', {
        templateUrl: Console.rootPath + 'Templates/CSR/Content/CSRContents.html',
        controller: 'CredentialController',
        label: 'Credential',
        content: 'CSR/MyAccount/Credential/Credential',
        title: 'Credential',
        resolve: {
            permission: function (CheckAuthorizedPageService) {
                return CheckAuthorizedPageService.CheckAuthorizedPageHandler(true);
            }
        }
    });
    ///CSR/Customer/App/MyAccount/RolePermission
    $routeProvider.when(Console.rootPath + 'CSR/Customer/App/MyAccount/RolePermission', {
        templateUrl: Console.rootPath + 'Templates/CSR/Content/CSRContents.html',
        //controller: 'RolePermissionController',
        label: 'Role Permission',
        content: 'CSR/MyAccount/RolePermission/NotImplemented',
        title: 'Role Permission',
        resolve: {
            permission: function (CheckAuthorizedPageService) {
                return CheckAuthorizedPageService.CheckAuthorizedPageHandler(true);
            }
        }
    });
    //CSR/Customer/App/MyAccount/PersonalSetting
    $routeProvider.when(Console.rootPath + 'CSR/Customer/App/MyAccount/PersonalSetting', {
        templateUrl: Console.rootPath + 'Templates/CSR/Content/CSRContents.html',
        //controller: 'PersonalSettingController',
        label: 'Personal Setting',
        content: 'CSR/MyAccount/PersonalSetting/NotImplemented',
        title: 'Personal Setting',
        resolve: {
            permission: function (CheckAuthorizedPageService) {
                return CheckAuthorizedPageService.CheckAuthorizedPageHandler(true);
            }
        }
    });
    //My Account//



    $routeProvider.when(Console.rootPath + 'CSR/Customer/App/ProductCatalog', {
        templateUrl: Console.rootPath + 'Templates/CSR/Content/CSRContents.html',
        content: 'CSR/NotImplementedYet/ProductCatalog/ProductCatalog',
        label: 'Product Catalog',
        title: 'Product Catalog',
        resolve: {
            permission: function (CheckAuthorizedPageService) {
                return CheckAuthorizedPageService.CheckAuthorizedPageHandler(true);
            }
        }
    });
    $routeProvider.when(Console.rootPath + 'CSR/Customer/App/NPM', {
        templateUrl: Console.rootPath + 'Templates/CSR/Content/CSRContents.html',
        content: 'CSR/NotImplementedYet/NPM/NPM',
        label: 'NPM',
        title: 'NPM',
        resolve: {
            permission: function (CheckAuthorizedPageService) {
                return CheckAuthorizedPageService.CheckAuthorizedPageHandler(true);
            }
        }
    });
    $routeProvider.when(Console.rootPath + 'CSR/Customer/App/MNP', {
        templateUrl: Console.rootPath + 'Templates/CSR/Content/CSRContents.html',
        content: 'CSR/NotImplementedYet/MNP/MNP',
        label: 'MNP',
        title: 'MNP',
        resolve: {
            permission: function (CheckAuthorizedPageService) {
                return CheckAuthorizedPageService.CheckAuthorizedPageHandler(true);
            }
        }
    });
    $routeProvider.when(Console.rootPath + 'CSR/Customer/App/SIMCard', {
        templateUrl: Console.rootPath + 'Templates/CSR/Content/CSRContents.html',
        content: 'CSR/NotImplementedYet/SIMCard/SIMCard',
        label: 'SIM Cards',
        title: 'SIM Cards',
        resolve: {
            permission: function (CheckAuthorizedPageService) {
                return CheckAuthorizedPageService.CheckAuthorizedPageHandler(true);
            }
        }
    });
    $routeProvider.when(Console.rootPath + 'CSR/Customer/App/Voucher', {
        templateUrl: Console.rootPath + 'Templates/CSR/Content/CSRContents.html',
        content: 'CSR/NotImplementedYet/Voucher/Voucher',
        label: 'Vouchers',
        title: 'Vouchers',
        resolve: {
            permission: function (CheckAuthorizedPageService) {
                return CheckAuthorizedPageService.CheckAuthorizedPageHandler(true);
            }
        }
    });
    $routeProvider.when(Console.rootPath + 'CSR/Customer/App/SearchPage/OrderAndProduct', {
        templateUrl: Console.rootPath + 'Templates/CSR/Content/CSRContents.html',
        content: 'CSR/NotImplementedYet/OrderAndProduct/OrderAndProduct',
        label: 'Order & Products',
        title: 'Order & Products',
        resolve: {
            permission: function (CheckAuthorizedPageService) {
                return CheckAuthorizedPageService.CheckAuthorizedPageHandler(true);
            }
        }
    })
    $routeProvider.when(Console.rootPath + 'CSR/Customer/App/SearchPage/BillingInvoice', {
        templateUrl: Console.rootPath + 'Templates/CSR/Content/CSRContents.html',
        content: 'CSR/NotImplementedYet/BillingInvoice/BillingInvoice',
        label: 'Billing Info & Invoices',
        title: 'Billing Info & Invoices',
        resolve: {
            permission: function (CheckAuthorizedPageService) {
                return CheckAuthorizedPageService.CheckAuthorizedPageHandler(true);
            }
        }
    })
    $routeProvider.when(Console.rootPath + 'CSR/Customer/App/SearchPage/BalanceAdjustment', {
        templateUrl: Console.rootPath + 'Templates/CSR/Content/CSRContents.html',
        content: 'CSR/NotImplementedYet/BalanceAdjustment/BalanceAdjustment',
        label: 'Balance & Adjustment',
        title: 'Balance & Adjustment',
        resolve: {
            permission: function (CheckAuthorizedPageService) {
                return CheckAuthorizedPageService.CheckAuthorizedPageHandler(true);
            }
        }
    })
    $routeProvider.when(Console.rootPath + 'CSR/Customer/App/SearchPage/Subcription/ResourceInfo', {
        templateUrl: Console.rootPath + 'Templates/CSR/Content/CSRContents.html',
        content: 'CSR/NotImplementedYet/ResourceInfo/ResourceInfo',
        label: 'Resource Info',
        title: 'Resource Info',
        resolve: {
            permission: function (CheckAuthorizedPageService) {
                return CheckAuthorizedPageService.CheckAuthorizedPageHandler(true);
            }
        }
    })
    $routeProvider.when(Console.rootPath + 'CSR/Customer/App/SearchPage/Subcription/Service/CallBarring', {
        templateUrl: Console.rootPath + 'Templates/CSR/Content/CSRContents.html',
        content: 'CSR/NotImplementedYet/CallBarring/CallBarring',
        label: 'Call Barring',
        title: 'Call Barring',
        resolve: {
            permission: function (CheckAuthorizedPageService) {
                return CheckAuthorizedPageService.CheckAuthorizedPageHandler(true);
            }
        }
    })
    $routeProvider.when(Console.rootPath + 'CSR/Customer/App/SearchPage/Subcription/Service/CallForward', {
        templateUrl: Console.rootPath + 'Templates/CSR/Content/CSRContents.html',
        content: 'CSR/NotImplementedYet/CallForward/CallForward',
        label: 'Call Forward',
        title: 'Call Forward',
        resolve: {
            permission: function (CheckAuthorizedPageService) {
                return CheckAuthorizedPageService.CheckAuthorizedPageHandler(true);
            }
        }
    })
    $routeProvider.when(Console.rootPath + 'CSR/Customer/App/SearchPage/Subcription/Service/DRL', {
        templateUrl: Console.rootPath + 'Templates/CSR/Content/CSRContents.html',
        content: 'CSR/NotImplementedYet/DRL/DRL',
        label: 'DRL',
        title: 'DRL',
        resolve: {
            permission: function (CheckAuthorizedPageService) {
                return CheckAuthorizedPageService.CheckAuthorizedPageHandler(true);
            }
        }
    })


    //Revani comment this otherwise route, because we already have route provider for otherwise. before my account route.
    //$routeProvider.otherwise({ redirectTo: Console.rootPath + 'CSR/Customer/App' });
        $locationProvider.html5Mode(true);
});

CSRContent.run(function ($rootScope, IdleHandler, ErrorHandlerUtility, $location, CSRCache, CacheSearch, prevLocationService, StartingPageService, $templateCache,
    CheckAuthorizedPageService, ApiConnection) {
    
    IdleHandler.StartIdleObserver();
    $rootScope.$on('$routeChangeSuccess', function (event, current, previous, showSideBar) {
        StartingPageService.StartingPageHandler();
        CheckingLoginStateGlobal();
        $rootScope.title = current.$$route.title;
        $rootScope.content = current.$$route.content;
    });
   
    $rootScope.$on('$locationChangeStart', function (event) {
        prevLocationService.setPrevLocation(window.location.pathname);
        var prevLocation = window.location.pathname;
        CSRCache.put('prevLocation', prevLocation);
        
    });

    //disabled cache
    $rootScope.$on("$routeChangeStart", function (event, toState, current) {
        if (typeof (current) !== 'undefined') {
            $templateCache.remove(current.templateUrl);
        }
    })
});

