SelfCareNav.controller("UsageDetailController", function ($scope, $parse, $filter, CustomerCache, CustomerInfo, CommonEnum, Notification, SelfcareSecureSection) {
    if (config.TemplateCode == 'etna') {
        //CustomerCache.getBalanceETNA({ mdn: wrapper.activeDevice.Msisdn }).then(function (data) {
        //    $scope.custBalances = data.Balance;
        //});
        CustomerCache.getBalanceCommon({ mobileNumber: wrapper.activeDevice.Msisdn }).then(function (data) {
            $scope.custBalances = data.Balance;
        })
    } else {
        //CustomerCache.getBalanceET({ customerid: wrapper.customerInfo.CustomerID }).then(function (data) {
        //    $scope.custBalances = data.LastSubscription.CreditLimit;
        //});
        CustomerCache.getBalanceCommon({ mobileNumber: wrapper.activeDevice.Msisdn }).then(function (data) {
            $scope.custBalances = data.Balance;
        })
        function formatBytes(bytes, decimals) {
            if (bytes == 0) return '0 Byte';
            var k = 1000;
            var dm = decimals + 1 || 3;
            var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
            var i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
        }

        CustomerCache.getRmPromotion({ msisdn: wrapper.activeDevice.Msisdn }).then(function (data) {
            $scope.usageExist = false;
            var usages = [];
            var currentLimitConvert;
            var totalLimitConvert;
            var LimitUsedConvert;
            angular.forEach(data.PromotionUsage, function (value, key) {
                if (value.PromotionPlanName != 'Fake Promotion') {
                    if (value.Limit != 0) {
                        currentLimitConvert = value.SubServiceType == 3001 ? value.CurrentLimit + " Minutes" : value.SubServiceType == 3002 ? value.CurrentLimit : formatBytes(value.CurrentLimit);
                        LimitUsedConvert = value.SubServiceType == 3001 ? value.Limit - value.CurrentLimit + " Minutes" : value.SubServiceType == 3002 ? value.Limit - value.CurrentLimit : formatBytes(value.Limit - value.CurrentLimit);
                        totalLimitConvert = value.SubServiceType == 3001 ? value.Limit + " Minutes" : value.SubServiceType == 3002 ? value.Limit : formatBytes(value.Limit);
                        var str = {
                            CurrentLimit: currentLimitConvert,
                            CurrentLimitPersenStyle: 'width:'+(value.CurrentLimit / value.Limit) * 100+'%',
                            EndDate: moment(value.EndDate).format(config.DateFormatMoment),
                            Limit: totalLimitConvert,
                            LimitUsed: LimitUsedConvert,
                            LimitUsedPersenStyle: 'width:' + ((value.Limit - value.CurrentLimit) / value.Limit) * 100+'%',
                            PromoName: value.PromotionPlanName
                        }
                        usages.push(str);
                    }
                    
                }
            });
            var realusage = {
                realUsages: usages
            };
            $scope.usageExist = realusage.realUsages.length > 0 ? true : false;
            $scope.usagesummary = realusage.realUsages;
        });
    }

    $scope.sort = function (keyname) {
        $scope.sortKey = keyname;   //set the sortKey to the param passed
        $scope.reverse = !$scope.reverse; //if true make it false and vice versa

    }
    $scope.usage = {};
    $scope.datausage = {};
    var oriUsage = {};

    $scope.isFormChanged = function () {
        return !angular.equals($scope.usage, oriUsage);
    };


    $scope.showData = function (data) {
        oriUsage = angular.copy(data);
        var startDate = moment(oriUsage.startDate).format('YYYY-MM-DD');
        var endDate = moment(oriUsage.endDate).format('YYYY-MM-DD');
        if (config.TemplateCode == 'etna') {
            alert('usage for etna is not ready yet!!!');
        } else {
            CustomerInfo.getusageET.get({ customerid: 0/* wrapper.customerInfo.CustomerID */, MSISDN: wrapper.activeDevice.Msisdn, StartDate: startDate, EndDate: endDate }, function (result) {

                var res = angular.copy(result.UsageDetails);
                if (res == '' || res == null) {
                    Notification.error({
                        message: '<strong>Data usage between ' + startDate + ' and ' + endDate + ' cannot be found !!!</strong>',
                        positionY: 'top',
                        positionX: 'center'
                    });
                }
                var voice_count = 0;
                var sms_count = 0;
                var apn_count = 0;
                var mms_count = 0;
                var videocall_count = 0;
                var type = '';
                var strData = '';

                angular.forEach(res, function (value, key) {
                    type = CommonEnum.convertUsageSubTypes(value.SubServiceTypeId);
                    switch (type) {
                        case "Voice": voice_count = voice_count + 1;
                            break;
                        case "SMS": sms_count = sms_count + 1;
                            break;
                        case "Data": apn_count = apn_count + 1;
                            break;
                        case "MMS": mms_count = mms_count + 1;
                            break;
                        case "VideoCall": videocall_count = videocall_count + 1;
                            break;
                    }

                });

                var sms = '';
                var voice = '';
                var apn = '';
                var mms = '';
                var videoCall = '';

                angular.forEach(res, function (value, key) {

                    type = CommonEnum.convertUsageSubTypes(value.SubServiceTypeId);
                    switch (type) {
                        case "Voice":
                            voice_count = voice_count - 1;
                            if (voice_count == 0) {
                                voice += '{"Date": "' + moment(value.StartDate).format(config.DateFormatMoment + ', h:mm:ss a') + '", "Duration":' + value.Bleg + ', "Destination": "' + value.BNumber + '", "Amount": ' + value.Amount + '}';
                            } else {
                                voice += '{"Date": "' + moment(value.StartDate).format(config.DateFormatMoment + ', h:mm:ss a') + '", "Duration":' + value.Bleg + ', "Destination": "' + value.BNumber + '", "Amount": ' + value.Amount + '},';
                            }
                            break;
                        case "SMS":
                            sms_count = sms_count - 1;
                            if (sms_count == 0) {
                                sms += '{"Date": "' + moment(value.StartDate).format(config.DateFormatMoment + ', h:mm:ss a') + '", "Destination": "' + value.BNumber + '", "Amount": ' + value.Amount + '}';
                            } else {
                                sms += '{"Date": "' + moment(value.StartDate).format(config.DateFormatMoment + ', h:mm:ss a') + '", "Destination": "' + value.BNumber + '", "Amount": ' + value.Amount + '},';
                            }
                            break;
                        case "Data":
                            apn_count = apn_count - 1;
                            if (apn_count == 0) {
                                apn += '{"Date": "' + moment(value.StartDate).format(config.DateFormatMoment + ', h:mm:ss a') + '", "Usage": "' + value.Bleg + '", "Amount": ' + value.Amount + '}';
                            } else {
                                apn += '{"Date": "' + moment(value.StartDate).format(config.DateFormatMoment + ', h:mm:ss a') + '", "Usage": "' + value.Bleg + '", "Amount": ' + value.Amount + '},';
                            }
                            break;
                        case "MMS":
                            mms_count = mms_count - 1;
                            if (mms_count == 0) {
                                mms += '{"Date": "' + moment(value.StartDate).format(config.DateFormatMoment + ', h:mm:ss a') + '", "Usage": "' + value.Bleg + '", "Destination": "' + value.BNumber + '", "Amount": ' + value.Amount + '}';
                            } else {
                                mms += '{"Date": "' + moment(value.StartDate).format(config.DateFormatMoment + ', h:mm:ss a') + '", "Usage": "' + value.Bleg + '", "Destination": "' + value.BNumber + '", "Amount": ' + value.Amount + '},';
                            }
                            break;
                        case "VideoCall":
                            videocall_count = videocall_count - 1;
                            if (videocall_count == 0) {
                                mms += '{"Date": "' + moment(value.StartDate).format(config.DateFormatMoment + ', h:mm:ss a') + '", "Usage": "' + value.Bleg + '", "Amount": ' + value.Amount + '}';
                            } else {
                                mms += '{"Date": "' + moment(value.StartDate).format(config.DateFormatMoment + ', h:mm:ss a') + '", "Usage": "' + value.Bleg + '", "Amount": ' + value.Amount + '},';
                            }
                            break;
                    }

                });
                var setdataSMS = JSON.parse('[' + sms + ']');
                var setdataVoice = JSON.parse('[' + voice + ']');
                var setdataMMS = JSON.parse('[' + mms + ']');
                var setdataAPN = JSON.parse('[' + apn + ']');
                var setdataVideoCall = JSON.parse('[' + videoCall + ']');

                $scope.datausage = {
                    "viewdetails": {
                        "sms": setdataSMS,
                        "voice": setdataVoice,
                        "apn": setdataAPN,
                        "videocall": setdataVideoCall,
                        "mms": setdataMMS
                    }
                }


            });

        }
    }

    SelfcareSecureSection.get({ ModuleId: 3 }, function (result) {
        $scope.isTopUpEnable = false;
        var objectTopUp = $filter('filter')(result, { SectionKey: 'Top_Up' })[0];
        if (objectTopUp != null) $scope.isTopUpEnable = true;
    });
});