SelfCareContent.service("PaymentFunction", function ($q, ApiConnection, ShoppingFunction, ErrorHandlerUtility, Notification, getSureTaxAmountService, PaymentService, RegistrationCache) {
    return {
        getPaymentMeansCatalog: function (param) {
            var deferred = $q.defer();
            var paymentmean = {};
            PaymentService.GetPaymentMaeanByMVNO.get({ mvnoid: param /*900000*/ }, function (result) {
                paymentMean = angular.copy(result.PaymentMeanCatalogs);
                deferred.resolve(paymentmean);
            });
            return deferred.promise;
        },
        getCustomerPaymentMean: function (param) {
            var deferred = $q.defer();
            var customerpaymentmean = {};
            PaymentService.QueryCustomerPaymentMean.get({ customerid: /*1759000762*/ param }, function (result) {
                customerpaymentmean = angular.copy(result.PaymentProfiles);
                deferred.resolve(customerpaymentmean);
            });
            return deferred.promise;
        },
        selfPayment: function (param, tax, paymentType, paymentMean, customerpaymentmean, data) {
            //alert('test');
            var paymentProfile = {};
            var customerData = {};
            var items = [];
            var tempOrderNumber = "";

            var deferred = $q.defer();

            /*ShoppingFunction.checkout().then(function (result) {
                deferred.resolve(result);
            });*/
            var totalAmount = 0;
            for (var i = 0; i < param[0].device.length; i++) {
                totalAmount += parseFloat(param[0].device[i].amount);
            }

            RegistrationCache.getCustomerInfo({ customerid: param[0].customerid }).then(function (result) {
                customerData = angular.copy(result.CustomerData);
                if (ErrorHandlerUtility.IsResultTypeOK(result)) {
                    ShoppingFunction.createorder(param).then(function (result) {
                        if (ErrorHandlerUtility.IsResultTypeOK(result)) {
                            tempOrderNumber = result.OrderNumber
                            ShoppingFunction.getOrder({ OrderNumber: result.OrderNumber }).then(function (result) {
                                if (ErrorHandlerUtility.IsResultTypeOK(result)) {
                                    for (var i = 0; i < result.OrderedItems.length; i++) {
                                        for (var j = 0; j < result.OrderedItems[i].length; j++) {
                                            var item = {
                                                "ProductOfferingId": result.OrderedItems[i][j].ProductOfferingId,
                                                "Description": result.OrderedItems[i][j].Description,
                                                "Quantity": result.OrderedItems[i][j].Quantity,
                                                "UnitPrice": result.OrderedItems[i][j].UnitPrice,
                                                "SubOrderIdentificator": result.OrderedItems[i][j].SubOrderIdentificator
                                            }
                                            items.push(item);
                                        }
                                    }

                                    var reqPaymentRequest = {
                                        "Amount": totalAmount,//param[0].device[0].amount,
                                        "Date": moment().format(config.DateFormatMoment),
                                        "CustomerId": param[0].customerid,
                                        "OriginOrderId": "6287789962386669617", //tempOrderNumber, //  , // The order that has generated the payment request.
                                        "Channel": null, // Like ETAK Sales channel (store on order). Not Mandatory
                                        "AccountId": null, // If given, will assign the Account to the PaymentRequest, if not given will get one from the customer. Not Mandatory
                                        "Currency": 840 // TO DO : set currency to config
                                    }

                                    PaymentService.PaymentRequest.save(reqPaymentRequest, function (respPaymentRequest) {
                                        console.log(respPaymentRequest);
                                        if (ErrorHandlerUtility.IsResultTypeOK(respPaymentRequest)) {
                                            var okURL = "";
                                            var nokURL = "";

                                            // Get PaymentMeanCatalogId
                                            var paymentMeanCatalogId;
                                            for (var i = 0; i < paymentMean.length; i++) {
                                                if (paymentMean[i].profiletype == paymentType) {
                                                    paymentMeanCatalogId = paymentMean[i].CatalogId;
                                                    break;
                                                }
                                            }

                                            // Credit Card Profile 
                                            if (paymentType == 3) {
                                                // Get CustomerPaymentMeanId
                                                var customerPaymentMeanId;
                                                var sDate;
                                                var eDate;
                                                for (count = 0; count < customerpaymentmean.length; count++) {
                                                    if (customerpaymentmean[count].Type == paymentType) {
                                                        customerPaymentMeanId = customerpaymentmean[count].PaymentProfile.CustomerPaymentMeanId;
                                                        sDate = customerpaymentmean[count].PaymentProfile.StartDate;
                                                        eDate = customerpaymentmean[count].PaymentProfile.EndDate;
                                                        break;
                                                    }
                                                }

                                                paymentProfile = {
                                                    "CustomerPaymentMeanId": customerPaymentMeanId,
                                                    "CardNumber": data.cardnumber,
                                                    "ExpirationDate": data.cardyear + "-" + data.cardmonth + "-01T00:00:00.000",
                                                    "StartDate": sDate, //"2016-05-17T00:00:00.000", // http://confluence.etns:8090/display/ETNA/ValidatePayment#ValidatePayment-PPDTO 
                                                    "EndDate": eDate, //"2018-04-01T00:00:00.000", // http://confluence.etns:8090/display/ETNA/ValidatePayment#ValidatePayment-PPDTO 
                                                    "NameOnCard": data.cardname,
                                                    "CCV": data.cardcvv,
                                                    "CreditCardType": data.cardtype,
                                                    "profiletype": paymentType,
                                                }
                                            }

                                                // Bank Account Profile 
                                            else if (paymentType == 1) {
                                                // Get CustomerPaymentMeanId
                                                var customerPaymentMeanId;
                                                for (count = 0; count < customerpaymentmean.length; count++) {
                                                    if (customerpaymentmean[count].Type == paymentType) {
                                                        customerPaymentMeanId = customerpaymentmean[count].PaymentProfile.CustomerPaymentMeanId;
                                                        break;
                                                    }
                                                }

                                                paymentProfile = {
                                                    "CustomerPaymentMeanId": customerPaymentMeanId,
                                                    "BankInformation": {
                                                        "BankNumber": data.bankname,
                                                        "Owner": data.accountnumber
                                                    },
                                                    "profiletype": paymentType
                                                }
                                            }

                                                // Payment Provider Profile
                                            else if (paymentType == 4) {
                                                // Get CustomerPaymentMeanId
                                                var customerPaymentMeanId;
                                                for (count = 0; count < customerpaymentmean.length; count++) {
                                                    if (customerpaymentmean[count].Type == paymentType) {
                                                        customerPaymentMeanId = customerpaymentmean[count].PaymentProfile.CustomerPaymentMeanId;
                                                        break;
                                                    }
                                                }

                                                paymentProfile = {
                                                    "CustomerPaymentMeanId": customerPaymentMeanId,
                                                    "CustomerProfileId": "123-1234-1231",
                                                    "CreditCardProfileId": "2016-05-17T16:39:19.2122023+07:00",
                                                    "PaymentProviderType": "2016-05-17T16:39:19.2122023+07:00",
                                                    "StartDate": "2016-05-17T16:39:19.2122023+07:00",
                                                    "EndDate": "123-1234-1231",
                                                    "profiletype": 4,
                                                }
                                                okURL = ApiConnection + "/api/payment/executechargeaccount?LandingPage=LP2";
                                                nokURL = ApiConnection + "/api/payment/executechargeaccount?LandingPage=LP2";
                                            }

                                                // Customer Balance Profile
                                            else if (paymentType == 2) {
                                                // Get CustomerPaymentMeanId
                                                var customerPaymentMeanId;
                                                for (count = 0; count < customerpaymentmean.length; count++) {
                                                    if (customerpaymentmean[count].Type == paymentType) {
                                                        customerPaymentMeanId = customerpaymentmean[count].PaymentProfile.CustomerPaymentMeanId;
                                                        break;
                                                    }
                                                }

                                                paymentProfile = {
                                                    "CustomerPaymentMeanId": customerPaymentMeanId,
                                                    "SubscriptionId": items[0].SubOrderIdentificator,
                                                    "profiletype": paymentType,
                                                }
                                            }

                                            var reqRegisterPayment = {
                                                "CustomerId": param[0].customerid,
                                                "PaymentRequestIds": [
                                                  respPaymentRequest.CreatedPaymentRequest.Id
                                                ],
                                                "PaymentMeanCatalogId": 1020000001, //paymentMeanCatalogId,
                                                "Amount": totalAmount, //param[0].device[0].amount,
                                                "ShippingCost": 0,
                                                "TaxAmount": tax.TotalTax,
                                                "Currency": 840, // TO DO : set currency to config,
                                                "Items": items,
                                                "PaymentProfile": paymentProfile,
                                                "CustomerData": customerData,
                                                "CustomerAddress": {},
                                                "OkUrl": okURL,
                                                "NokUrl": nokURL
                                            }

                                            PaymentService.RegisterPayment.save(reqRegisterPayment, function (result) {
                                                if (ErrorHandlerUtility.IsResultTypeOK(result)) {
                                                    ShoppingFunction.checkout().then(function (result) {
                                                        if (ErrorHandlerUtility.IsResultTypeOK(result)) {
                                                            deferred.resolve(result);
                                                        } else {
                                                            deferred.resolve(result);
                                                        }
                                                    });
                                                } else {
                                                    deferred.resolve(result);
                                                }
                                            });
                                        } else {
                                            deferred.resolve(respPaymentRequest);
                                        }
                                    });
                                } else {
                                    deferred.resolve(result);
                                }
                            });
                        } else {
                            deferred.resolve(result);
                        }
                    });
                } else {
                    deferred.resolve(result);
                }
            });
            return deferred.promise;
        },
        calculatetax: function (param) {
            generateCalculateTaxRequest = function (itemPrice) {
                var itemList = [];
                var item = {
                    "LineNumber": 1,
                    "InvoiceNumber": "ETAK" + moment().format('DDMMYYYYhhmmss'),
                    "CustomerNumber": "8585260000",
                    "OrigNumber": "8585260000",
                    "TermNumber": "8585260000",
                    "BillToNumber": "8585260000",
                    "Zipcode": JSON.parse(localStorage.self_scope).customerInfo.Address.split(",")[4].replace(/\s+/g, ''), // TODO Get ZIP Code : "Address": "100 park avenue No.  ext: , NY, New York, US, 10017",
                    "Plus4": "",
                    "P2PZipcode": "",
                    "P2PPlus4": "",
                    "TransDate": moment().format(config.DateFormatMoment),
                    "Revenue": itemPrice, //todo : suretax cannot handle revenue with 0 price
                    "Units": 1,
                    "UnitType": "00",
                    "Seconds": "1",
                    "TaxIncludedCode": "0",
                    "TaxSitusRule": "01",
                    "taxSitusOverrideCode": "13",
                    "TransTypeCode": "010101",
                    "SalesTypeCode": "R",
                    "RegulatoryCode": "05"
                };
                itemList[itemList.length] = item;

                var reqData = {
                    "ClientNumber": "000000454",
                    "BusinessUnit": "000000454",
                    "ValidationKey": "7fb34e3a-0d5a-4cd3-ba5d-b747a895dfe3",
                    "Datayear": moment().format('YYYY'),
                    "DataMonth": moment().format('MM'),
                    "TotalRevenue": itemPrice,
                    "ReturnFileCode": 0,
                    "ClientTracking": "000000454",
                    "IndustryExemption": "",
                    "ResponseGroup": "03",
                    "ResponseType": "D2",
                    "ItemList": itemList
                }

                return reqData;
            }

            // Calculate Tax
            var taxRequest = generateCalculateTaxRequest(param);
            var deferred = $q.defer();
            getSureTaxAmountService.save(taxRequest, function (taxResponse) {
                deferred.resolve(taxResponse);
            });
            return deferred.promise;
        }
    }
});