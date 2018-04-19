'use strict';

SelfCareContent.service('SelfCareCommonService', function ($q, Notification, ErrorHandlerUtility, SelfCareCache) {
    return {
        SubscriptionListMenu: function (data) {
            var i, j;
            var activeDevice = JSON.parse(localStorage.self_scope).activeDevice.Msisdn && JSON.parse(localStorage.self_scope).activeDevice.Msisdn != undefined && JSON.parse(localStorage.self_scope).activeDevice.Msisdn != null ? true : false;
            var listModule = activeDevice == true ? data.NavigationMenu : null;
            if (listModule === null) {
                var menu = listMenu()
                listModule = [];
                for (i = 0; i < data.NavigationMenu.length; i++) {
                    for (j = 0; j < menu.length; j++) {
                        if (data.NavigationMenu[i].Id === menu[j]) {
                            listModule.push(data.NavigationMenu[i])
                        }
                    }
                };
            };
            SelfCareCache.put('listModuleSubscription', listModule);
            return listModule;
        },
        SubscriptionListHeaderIcon: function () {
            var activeDevice = JSON.parse(localStorage.self_scope).activeDevice.Msisdn && JSON.parse(localStorage.self_scope).activeDevice.Msisdn != undefined && JSON.parse(localStorage.self_scope).activeDevice.Msisdn != null ? true : false;
            var listHeader = listHeaderIcon(activeDevice);
            return listHeader;
        },
        SecureSectionRoute: function (data) {
            var secureRoute = false; 
            if (
                    window.location.pathname !== "/SelfCare/Customer/App/Start"
                    && window.location.pathname !== "/SelfCare/Customer/App/ViewTroubleTicket"
                    && window.location.pathname !== "/SelfCare/Customer/App/ViewTroubleTicket/Details"
                    && window.location.pathname !== "/SelfCare/Customer/App/UpdateProfile"
                    && window.location.pathname !== "/SelfCare/Customer/App/Activated"
                    && window.location.pathname !== "/SelfCare/Customer/App/Activate"
                    && window.location.pathname !== "/SelfCare/Customer/App/YourProfile"
                    && window.location.pathname !== "/SelfCare/Customer/App/CreateTroubleTicket"
                    && window.location.pathname !== "/SelfCare/Customer/App/ChangePassword"
                    && window.location.pathname !== "/SelfCare/Customer/App/Activate"
                    && window.location.pathname !== "/SelfCare/Customer/App/BuyMore/Device"
                    && window.location.pathname !== "/SelfCare/Customer/App/BuyMoreDevice/Confirmation"
                    && window.location.pathname !== "/SelfCare/Customer/App/BuyMoreDevice/Failed"
                    && window.location.pathname !== "/SelfCare/Customer/App/BuyMoreDevice/Cancelled"
                ) {
                var secureRoute = true;
            }
            return secureRoute;
        },
        ShowNotification: function (message, result) {
            notification(message, result);
        },
        ShowNotificationError: function (message) {
            notificationError(message);
        },
        ShowNotificationSuccess: function (message) {
            notificationSuccess(message);
        },
    }

    function listMenu() {
        var listMenuId = [
                75
        ];
        return listMenuId;
    }
    function listHeaderIcon(activeDevice) {
        var ShoppingChart = true;
        if (window.location.pathname === '/SelfCare/Customer/App/BuyMore/Device') {
            ShoppingChart = false
        }
        var listHeader = {
            ShowShoppingChart: ShoppingChart,
            ShowProfile: true,
            ShowNavigationSort: true,
            ShowManageDevice: true,
            ShowLogout: true,
            ShowBreadCrumb: true
        }
        if (activeDevice == false) {
            listHeader = {
                ShowShoppingChart: ShoppingChart,
                ShowProfile: true,
                ShowNavigationSort: false,
                ShowManageDevice: false,
                ShowLogout: true,
                ShowBreadCrumb: false
            }
        }        
        return listHeader
    }

    function notification(message, result) {
        if (ErrorHandlerUtility.IsResultTypeOK(result)) {
            notificationSuccess(message)
        }
        else {
            notificationError(result.Messages)
        };
    }

    function notificationSuccess(notificationMessage) {
        Notification.success({
            message: '<span><b>Success!</b> ' + notificationMessage + '</span>',
            positionY: 'top',
            positionX: 'center',
            delay: 7500
        });
    }

    function notificationError(errorMessage) {
        return Notification.error({
            message: '<span><b>Error!</b> ' + errorMessage + '</span>',
            positionY: 'top',
            positionX: 'center',
            delay: 7500
        });
    }
});