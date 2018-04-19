SelfCareContent.controller("ActivationESNController", function ($scope, SelfCareActivationService, SelfCareCache, ErrorHandlerUtility, Notification, $location, CommonEnum,
    sendSMSFunction) {
    var config = sessionStorage.webConfig != undefined ? JSON.parse(sessionStorage.webConfig) : {};
    var activateDeviceDetails = JSON.parse(localStorage.self_scope).customerInfo != undefined ? JSON.parse(localStorage.self_scope).customerInfo : {};
    var selectedDevice = JSON.parse(localStorage.self_scope).selectedNotActiveDevice != undefined ? JSON.parse(localStorage.self_scope).selectedNotActiveDevice : {};
    var mobileNumber;
    var PINNumber;

    $scope.hideiccid = true

    $scope.checktypeesnimei = function (data) {
        if (data.length > 12) {
            $scope.hideiccid = false
        } else {
            $scope.hideiccid = true
        }
    }

    $scope.activate = function (data) {
        mobileNumber = '';
        PINNumber = '';

        if (!activateDeviceDetails) {
            NotificationError('Data is not found');
        } else if (!selectedDevice) {
            NotificationError('There is no selected device');
        } else if (data.zipcode.length !== 5) {
            NotificationError('Zipcode must be 5 numeric digits');
        } else if (data.esnNumberOrImei.length > 12) {
            if (!data.iccid) {
                NotificationError('ICCID is mandatory');
            } else {
                if (data.checkboxUseExistingMobileNumber_1 == true) {
                    if (data.mobileNumber !== null && data.mobileNumber && data.mobileNumber !== 'undefined' &&
                        data.pinNumber !== null && data.pinNumber && data.pinNumber !== 'undefined') {
                        mobileNumber = data.mobileNumber;
                        PINNumber = data.pinNumber;
                        activateFunction(data);
                    } else {
                        NotificationError('Mobile Number and PIN Number is mandatory');
                    };
                } else {
                    activateFunction(data);
                }
            }
        } else if (data.checkboxUseExistingMobileNumber_1 == true) {
            if (data.mobileNumber !== null && data.mobileNumber && data.mobileNumber !== 'undefined' &&
                data.pinNumber !== null && data.pinNumber && data.pinNumber !== 'undefined') {
                mobileNumber = data.mobileNumber;
                PINNumber = data.pinNumber;
                activateFunction(data);
            } else {
                NotificationError('Mobile Number and PIN Number is mandatory');
            };
        }
        else {
            activateFunction(data);
        };
    }

    var activateFunction = function (data) {
        var ESN = '';
        var IMEI = '';

        if (data.esnNumberOrImei.length > 12) {
            IMEI = data.esnNumberOrImei;
        } else {
            ESN = data.esnNumberOrImei;
        };

        var param = {
            "OrderNumber": selectedDevice.OrderNumber.toString(),
            "UniqueIdentifier": selectedDevice.SubscriptionIdentifier.toString(),
            "MarketInfo": "WebSite",
            "ZipCode": data.zipcode,
            "Esn": ESN,
            "Sim": IMEI,
            "IccId": data.iccid,
            "FirstName": activateDeviceDetails.FirstName,
            "LastName": activateDeviceDetails.LastName,
            "StreetName": activateDeviceDetails.Address,
            "BillingCity": activateDeviceDetails.Address,
            "AccountNumber": activateDeviceDetails.CustomerID.toString(),
            "BillingState": activateDeviceDetails.Address,
            "PasswordPin": PINNumber,
            "PortInMobileNumber": mobileNumber
        };
        SelfCareActivationService.save(param, function (result) {
            if (ErrorHandlerUtility.IsResultTypeOK(result)) {
                SelfCareCache.put("ActivationSuccessWithMDN", result.mdn);
                var tmplt = CommonEnum.getSMSTemplates();
                var smsBody = tmplt.selfcareActivation.replace("#MVNO#", config.TemplateCode);;
                var smsData = {
                    msisdn: result.mdn,
                    body: smsBody
                }

                var promise = sendSMSFunction.send(smsData);
                promise.then(function (promiseResult) {});
                $location.path(Console.rootPath + 'SelfCare/Customer/App/Activated');
            } else {
                NotificationError(result.Messages[0])
            }
        });
    }

    function NotificationError(data) {
        var errorMessage = data;
        return Notification.error({
            message: '<span>' + errorMessage + '</span>',
            positionY: 'top',
            positionX: 'center',
            delay: 10000
        });
    };
});


SelfCareContent.controller("ActivationSuccessController", function ($scope, SelfCareCache) {
    $scope.activeSuccesWithMDN = angular.copy(SelfCareCache.get("ActivationSuccessWithMDN"))
});