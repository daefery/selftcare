commonModule.factory("SelfcareMultiSubscriptionCheckerService", function ($resource, ApiConnection) {
    return {
        getuserproperty: $resource(ApiConnection + '/api/accounts/userproperty/:username', {}, {}),
    }
});

commonModule.service('MultiSubsModelBuilder', function (MultiSubscriptionsCache) {
    var convert = function (multisubsDataResource, userPropertiesResource) {
        var multiSubsData = multisubsDataResource.Subscriptions;
        var userProperties = userPropertiesResource.UserProperty;
        var cActive = [],
            cNotActive = [],
            totalActiveDevice = 0,
            totalNotActiveDevice = 0;
        var selectedDevice = {};
        var subscriptions = [];
        MultiSubscriptionsCache.removeAll();



        for (var i = 0; i < multiSubsData.length; i++) {
            if (multiSubsData[i].Subscription.SubscriptionStatus === 1) {
                cActive.push(multiSubsData[i])
                cActive[totalActiveDevice].IsActive = 1;
                cActive[totalActiveDevice].MSISDN = cActive[totalActiveDevice].Subscription.MSISDN;
                cActive[totalActiveDevice].Msisdn = cActive[totalActiveDevice].Subscription.MSISDN;
                cActive[totalActiveDevice].SubscriptionStatus = cActive[totalActiveDevice].Subscription.SubscriptionStatus;
                cActive[totalActiveDevice].SubscriptionIdentifierStatus = cActive[totalActiveDevice].Subscription.subscriptionStatus;
                totalActiveDevice += 1;
            } else if (multiSubsData[i].Subscription.SubscriptionStatus === 8) {
                cNotActive.push(multiSubsData[i]);
                cNotActive[totalNotActiveDevice].IsActive = 0;
                cNotActive[totalNotActiveDevice].OrderNumber = multiSubsData[i].OrderInfo.OrderNumber;
                cNotActive[totalNotActiveDevice].SubscriptionIdentifier = multiSubsData[i].Subscription.SubscriptionId;
                cNotActive[totalNotActiveDevice].SubscriptionStatus = cNotActive[totalNotActiveDevice].Subscription.SubscriptionStatus;
                cNotActive[totalNotActiveDevice].SubscriptionIdentifierStatus = "Not Active";
                cNotActive[totalNotActiveDevice].Subscription.MSISDN = "N/A";
                cNotActive[totalNotActiveDevice].Product = {};
                cNotActive[totalNotActiveDevice].Product.Device = ""
                cNotActive[totalNotActiveDevice].Product.Plan = ""
                cNotActive[totalNotActiveDevice].Product.AllowanceOrFeature = ""
                for (var j = 0; j < multiSubsData[i].OrderInfo.Products.length; j++) {
                    var product = multiSubsData[i].OrderInfo.Products[j];
                    var productType = product.ProductType;
                    var productName = product.Description;
                    //ProductType Enum
                    //Unassigned:0,
                    //Plan:1,
                    //Feature:2,
                    //Handset3G:3,
                    //Handset4G:4,
                    //MoneteryCashCard: 5,
                    //AllowanceCashCard: 6,
                    //Allowance: 7,
                    //SimCard: 8
                    if (productType === 3 || productType === 4) {
                        cNotActive[totalNotActiveDevice].Product.Device = productName;
                    } else if (productType === 1) {
                        cNotActive[totalNotActiveDevice].Product.Plan = productName;
                    } else {
                        cNotActive[totalNotActiveDevice].Product.AllowanceOrFeature = productName;
                    };
                }
                totalNotActiveDevice += 1;
            } else {
                multiSubsData.splice(i, 1);
                i--;
            }
        }

        //if (localStorage.self_scope) {
        //    selectedDevice = JSON.parse(localStorage.self_scope).activeDevice != {} ? JSON.parse(localStorage.self_scope).activeDevice : {};
        //};

        if (selectedDevice = {}) {
            if (localStorage.successBuyMoreDevice) {
                selectedDevice = JSON.parse(localStorage.successBuyMoreDevice) != {} ? JSON.parse(localStorage.successBuyMoreDevice) : {};
                localStorage.removeItem('successBuyMoreDevice')
            };
        };

        if (multiSubsData && multiSubsData !== null) {
            if (totalActiveDevice === 1) {
                selectedDevice = cActive[0];
            };
        };
        if (cActive.length !== 0) {
            for (i = 0; i < cActive.length; i++) {
                subscriptions.push(cActive[i]);
            }
        };
        if (cNotActive.length !== 0) {
            for (i = 0; i < cNotActive.length; i++) {
                subscriptions.push(cNotActive[i]);
            }
        };

        localStorage.self_scope = JSON.stringify(
            {
                customerInfo: userProperties,
                multiDevice: subscriptions,
                activeDevice: selectedDevice,
                totalSubscriptionNotActive: totalNotActiveDevice,
                totalSubscriptionActive: totalActiveDevice
            }
        );
    }
    return {
        getConverterResult: convert,
    };
});