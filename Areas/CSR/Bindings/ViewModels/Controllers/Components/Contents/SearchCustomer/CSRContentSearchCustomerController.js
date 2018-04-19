var customerId;
var recentCustomerId;
var temporarydata;
var temporarydata_CustomerId;
var temporarydata_Msisdn;
//Agung Meinastesi Caesar  
//23/09/2015
//Make box search and share data factory :Start
var selectexist = true;
var callGetSearchCustomer;


CSRContent.controller("SearchBoxCustomer", function ($scope, $rootScope, $location, CSRCache, CacheSearch, Notification, $route, ErrorHandlerUtility) {
    $scope.SearchPhoneNumber = function (data) {
        temporarydata_CustomerId = '';
        temporarydata_Msisdn = data;
        temporarydata = data;
        search = data;

        if (search.indexOf('%') !== -1) {
            if (search.length === 1) {
                Notification.error({
                    message: '<span>Unable to search if input just contain % character only</span>',
                    positionY: 'top',
                    positionX: 'center',
                    delay: 4000
                });
            }
            else {
                CSRCache.put('tempadvance', temporarydata);
                if ($location.path() === "/CSR/Customer/App/AdvanceSearch") {
                    $route.reload();
                    $location.path("CSR/Customer/App/AdvanceSearch");
                } else {
                    $location.path("CSR/Customer/App/AdvanceSearch");
                };
            };
        }
        else {

            callGetSearchCustomer = function () {

                var customerSession = sessionStorage.CustomerDataForCustomerSummary != undefined ? JSON.parse(sessionStorage.CustomerDataForCustomerSummary) : {};
                if (temporarydata) {
                    var DataCustomer = {
                        msisdn: temporarydata
                    }
                    sessionStorage.setItem('CustomerDataForCustomerSummary', JSON.stringify(DataCustomer));
                } else {
                    temporarydata = customerSession.msisdn;
                }

                CacheSearch.getCustomerIdByPhoneNumberService(temporarydata).then(function (result) {
                    temporarydata_CustomerId = null;
                    if (result.CustomerID) {
                        temporarydata_CustomerId = result.CustomerID;
                        CacheSearch.getSearchCustomer().then(function (result) {
                            if (result !== undefined) {
                                CSRCache.put('dataCust', result);
                                if ($location.path() === "/CSR/Customer/App/SearchPage") {
                                    $route.reload();
                                    $location.path("CSR/Customer/App/SearchPage");
                                } else {
                                    $location.path("CSR/Customer/App/SearchPage");
                                };
                            } else {
                                var data = CSRCache.get('dataCust');
                                if (data !== undefined) {
                                    $scope.products = data[0];
                                }
                            }

                        });
                    }

                });

            }
            callGetSearchCustomer();
        };
    };
});


CSRContent.controller("SearchCustomer", function ($scope, $location, $route, $rootScope, $http, ApiConnection, breadcrumbs, CacheSearch, CSRCache, SearchPageService, CommonEnum,
    pinnedHtmlService, $filter, DetailCustomer, TicketDetail, pagingSearchTroubleTicketByCustomerId, PagingIndication, GetOrdersbyFilterService, CacheInventoryOrderSearch, GetMultiDevicebyParentService, ErrorHandlerUtility, LocalStorageProvider) {

    $scope.isParentChild = false;
    $scope.isETAKUser = false;
    $scope.isETAKUser = LocalStorageProvider.isETAKUser();
    $scope.TemplateCode = LocalStorageProvider.getTemplateCode();
    $scope.ShowMultiSubscription = false;
    $scope.selectedOrder = {};
    $scope.selectedProduct = {};
    $scope.selectedTT = null;
    $scope.selectedPromotionList = [];

    var data = CSRCache.get('dataCust');
    var customerData;

    $scope.LinkToDetailTT = '#';
    $scope.setClickedTTRow = function (selectedTT) {
        if (selectedTT != undefined && selectedTT != null) {
            $scope.selectedTT = selectedTT;
            $scope.LinkToDetailTT = '/CSR/Customer/App/SearchPage/TroubleTicketInfo';

            TicketDetail.setDetail({
                TicketNumber: selectedTT.TicketNumber,
            });
        } else {
            $scope.LinkToDetailTT = '#';
        }
    }
    $scope.load_getTroubleTicketsByCustomerId = function () {
        //Trouble Ticket , begin
        CSRCache.put('currentMSISDNTroubleticketByCustomerId', temporarydata)

        pagingSearchTroubleTicketByCustomerId.setObject({
            pageNumber: 1,
            pageSize: 100,
        })

        CacheSearch.getTroubleTicketsByCustomerId(customerId, ExcludeClosedTicket = true).then(function (resultTT) {
            dataTT = angular.copy(resultTT);
            if (typeof dataTT.TTInfo !== 'undefined') {
                dataTT.TTInfo.TroubleTicketList.forEach(function (e) {
                    e.ReportTime = moment(e.ReportTime).format(config.DateFormatMoment);
                    e.UpdateTime = moment(e.UpdateTime).format(config.DateFormatMoment);
                });
                $scope.TroubleTicket = dataTT.TTInfo.TroubleTicketList;
            }
            recentCustomerId = angular.copy(customerId);
        });
        //Trouble Ticket , end
    }

    $scope.load_custDashboardInformation = function (data) {
        if (data != null) {
            customerId = data.Customer.CustomerID;

            $scope.MSISDN = data.MultiSubscriptionInfo.length > 0 ? (data.MultiSubscriptionInfo[0].Subscription == null ? '' : data.MultiSubscriptionInfo[0].Subscription.MSISDN) : '';
            var detailcustomer = {
                MSISDN: $scope.MSISDN,
                CustomerId: customerId,
                MVNOId: customerData.DealerId,
                MVNOName: customerData.DealerNode
            };

            DetailCustomer.setDetail(detailcustomer);

            //start : region pinned html
            $rootScope.pinnedCustId = $scope.pinHtml.Customer.CustomerID;
            $rootScope.pinnedCustName = $scope.pinHtml.Customer.CustomerData.FirstName + ' ' + $scope.pinHtml.Customer.CustomerData.LastName;
            $rootScope.pinnedMSISDN = $scope.MSISDN;

            var pinned = { pinnedId: $scope.pinnedCustId, pinnedName: $scope.pinnedCustName, pinnedPhone: $scope.pinnedMSISDN };
            pinnedHtmlService.setPinned(pinned);
            //end : region pinned html

            //CustomerInformation BEGIN
            customerSession = sessionStorage.CustomerDataForCustomerSummary != undefined ? JSON.parse(sessionStorage.CustomerDataForCustomerSummary) : {};
            customerSession.customerid = customerId;
            customerSession.pinned = pinned;
            customerSession.detailcustomer = detailcustomer;
            sessionStorage.setItem('CustomerDataForCustomerSummary', JSON.stringify(customerSession));

            var temp = (data.Customer.CustomerData.BirthDay);
            if ((temp === null) || (temp === undefined)) {
                $scope.birthday = "";
            } else {
                $scope.birthday = moment(temp).format('DD MMMM YYYY');;
            }

            $scope.country = CommonEnum.convertCountryList(data.Customer.CustomerData.Nationality).name;
            $scope.idType = CommonEnum.convertDocumentType(data.Customer.CustomerData.DocumentType).name;
            $scope.customerStatus = CommonEnum.convertCustomerStatus(data.Customer.CustomerStatus).name;

            var custHouseExt = data.Customer.CustomerData.CustomerAddress.HouseExtension;
            var delHouseExt = data.Customer.CustomerData.DeliveryAddress.HouseExtension;

            var custHouseNo = data.Customer.CustomerData.CustomerAddress.HouseNo;
            var delHouseNo = data.Customer.CustomerData.DeliveryAddress.HouseNo;

            var custAddress = data.Customer.CustomerData.CustomerAddress.Addresses;
            var delAddress = data.Customer.CustomerData.DeliveryAddress.Addresses;

            var custCity = data.Customer.CustomerData.CustomerAddress.City;
            var delCity = data.Customer.CustomerData.DeliveryAddress.City;

            var custState = data.Customer.CustomerData.CustomerAddress.State;
            var delState = data.Customer.CustomerData.DeliveryAddress.State;

            var custCountry = CommonEnum.convertCountryList(data.Customer.CustomerData.CustomerAddress.CountryId).name;
            var delCountry = CommonEnum.convertCountryList(data.Customer.CustomerData.DeliveryAddress.CountryId).name;

            if ($scope.TemplateCode == 'lowi') {
                if ((custHouseExt === null) || (custHouseExt === "") || (custHouseExt === undefined)) {
                    $scope.customerAddress = custAddress + ' ' + custHouseNo + ', ' + custCity + ', ' + custState + ', ' + custCountry + ' ' + data.Customer.CustomerData.CustomerAddress.ZipCode;
                    $scope.deliveryAddress = delAddress + ' ' + delHouseNo + ', ' + delCity + ', ' + delState + ', ' + delCountry + ' ' + data.Customer.CustomerData.DeliveryAddress.ZipCode;
                } else {
                    $scope.customerAddress = custAddress + ' ' + custHouseNo + ', ext. ' + custHouseExt + ', ' + custCity + ', ' + custState + ', ' + custCountry + ' ' + data.Customer.CustomerData.CustomerAddress.ZipCode;
                    $scope.deliveryAddress = delAddress + ' ' + delHouseNo + ', ext. ' + delHouseExt + ', ' + delCity + ', ' + delState + ', ' + delCountry + ' ' + data.Customer.CustomerData.DeliveryAddress.ZipCode;
                }
            } else {    //no houseno and ext
                $scope.customerAddress = custAddress + ', ' + custCity + ', ' + custState + ', ' + custCountry + ' ' + data.Customer.CustomerData.CustomerAddress.ZipCode;
                $scope.deliveryAddress = delAddress + ', ' + delCity + ', ' + delState + ', ' + delCountry + ' ' + data.Customer.CustomerData.DeliveryAddress.ZipCode;
            }
            //CustomerInformation END

            //MultiDevice BEGIN
            selectexist = false;

            if ($scope.TemplateCode.toString().toLowerCase() == "lowi") {   //subject for adjustment
                GetMultiDevicebyParentService.get({ customerId: customerId }, function (result) {
                    if (ErrorHandlerUtility.IsResultTypeOK(result)) {
                        var data = angular.copy(result);
                        if (result.SubscriptionType == 0) {
                            $scope.isParentChild = false;
                        }
                        else {
                            $scope.isParentChild = true;
                            console.log(result);
                            var final = {}
                            if (data.ParentChildInfo.length > 0) {
                                for (var index = 0; index < data.ParentChildInfo.length; index++) {
                                    var item = data.ParentChildInfo[index];
                                    item.SubscriptionStatus = CommonEnum.convertCustomerStatus(item.SubscriptionStatus).name;
                                    item.SimCardStatus = CommonEnum.convertSimStatus(item.SimCardStatus);
                                };
                                CSRCache.put('resultviewmultidev', data);
                                $scope.viewmultidevices = angular.copy(data.ParentChildInfo);
                            }
                        };

                        console.log($scope.isParentChild);
                    }
                });
            }
            //MultiDevice END

            //ORDERS BEGIN
            //CSRGetCustomerBalanceService.get({ msisdn: data.CustomerData.MobileNumberlocalStorage.MSISDN }, function (result) {
            //    $scope.Balance = result;
            //})
            $scope.ShowOrdersArea = false;
            if ($scope.TemplateCode.toString().toLowerCase() == "etna") {   //subject for adjustment
                $scope.ShowOrdersArea = true;
                var OrderParam = { PageNumber: 1, PageSize: 10, OrderNumber: null, CustomerId: customerId, FromDate: null, ToDate: null, Status: null };
                CacheInventoryOrderSearch.getOrdersbyFilter(OrderParam).then(function (result) {
                    var data = angular.copy(result);
                    if (data.CustomerOrders !== null) {
                        if (data.CustomerOrders.length > 0) {
                            for (var index = 0; index < data.CustomerOrders.length; index++) {
                                var item = data.CustomerOrders[index];
                                item.Status = CommonEnum.convertOrderStatus(item.Status).name;
                                item.OrderDate = moment(item.OrderDate).format(config.DateFormatMoment);
                            };
                            $scope.dashboardorderlist = angular.copy(data);
                        }
                    }
                });
            }
            //ORDERS END

            //Trouble Ticket BEGIN
            $scope.load_getTroubleTicketsByCustomerId();
            //Trouble Ticket END

            //MULTISUBSCRIPTION BEGIN
            $scope.ShowMultiSubscription = false;
            if ($scope.TemplateCode.toString().toLowerCase() == "etna") {   //subject for adjustment
                var ListMultiSubscriptionInfo = data.MultiSubscriptionInfo;
                ListMultiSubscriptionInfo.forEach(function (e) {
                    e.Subscription.subscriptionStatus = CommonEnum.convertSubscriptionStatus(e.Subscription.SubscriptionStatus);
                    if (e.SimCard !== null) {
                        e.SimCard.simStatus = CommonEnum.convertSimStatus(e.SimCard.Status);
                    }
                    e.Subscription.createdDate = moment(e.Subscription.CreateDate).format(config.DateFormatMoment);
                    e.Subscription.subscriptionType = CommonEnum.convertMultiSubscriptionType(data.Customer.CustomerData.PaymentType).name;

                })

                $scope.ListMultiSubscriptionInfo = ListMultiSubscriptionInfo;
                if (ListMultiSubscriptionInfo.length >= 2) {
                    $scope.ShowMultiSubscription = true;   //show when isMultiSubscription
                }
            }
            //MULTISUBSCRIPTION END

            //PRODUCTS BEGIN
            if (data.Products !== null) {
                if (data.Products.length > 0) {
                    $scope.selectedProduct = data.Products[0];
                }
            }
            //PRODUCTS END

            //Subscription BEGIN
            if (data.MultiSubscriptionInfo.length >= 1) {
                $scope.selectMultiSubscriptionInfo(data.MultiSubscriptionInfo[0]);
                $scope.load_selectedSubscription(data.MultiSubscriptionInfo[0], data.Customer);
            } else {
                $scope.load_selectedSubscription(null, data.Customer);
            }
            //Subscription END


            //BILLING INFO BEGIN
            switch (data.Customer.CustomerData.PaymentType) {
                case 1:
                    $scope.isPostPaid = true;
                    $scope.isPrePaid = false;
                    $scope.isHybrid = false;
                    break;
                case 2:
                    $scope.isPostPaid = false;
                    $scope.isPrePaid = true;
                    $scope.isHybrid = false;
                    break;
                default:
                    $scope.isPostPaid = false;
                    $scope.isPrePaid = false;
                    $scope.isHybrid = true;
                    break;
            }
            //BILLING INFO END

        }
    }

    //MULTISUBSCRIPTION BEGIN
    $scope.selectedMultiSubscription;
    $scope.selectMultiSubscriptionInfo = function (MultiSubscriptionInfoItem) {
        $scope.selectedMultiSubscription = MultiSubscriptionInfoItem;
    }
    $scope.changeSubscriptionInfo = function () {
        if ($scope.selectedMultiSubscription != null && $scope.selectedMultiSubscription != undefined) {
            $scope.load_selectedSubscription($scope.selectedMultiSubscription, $scope.products.Customer);
        }
    }
    //MULTISUBSCRIPTION END

    //SUBSCRIPTION BEGIN
    $scope.SelectedSubscription = {};
    $scope.load_selectedSubscription = function (SubscriptionOrMultiSubscription, Customer) {

        var Subscription = SubscriptionOrMultiSubscription;
        var SimCard = null;
        var CustomerPromotions = null;

        //::SubscriptionOrMultiSubscription is MultiSubscription
        if (SubscriptionOrMultiSubscription != null) {
            if (SubscriptionOrMultiSubscription.Subscription !== undefined) {
                Subscription = SubscriptionOrMultiSubscription.Subscription;
            }
            if (SubscriptionOrMultiSubscription.SimCard !== undefined) {
                SimCard = SubscriptionOrMultiSubscription.SimCard;
            }
            if (SubscriptionOrMultiSubscription.PromotionsList !== undefined && SubscriptionOrMultiSubscription.PromotionsList !== null) {
                CustomerPromotions = SubscriptionOrMultiSubscription.PromotionsList;
            }
        }

        if (CustomerPromotions !== null && CustomerPromotions !== undefined) {
            CustomerPromotions.forEach(function (e) {
                e.startDate = e.StartDate != null ? moment(e.StartDate).format(config.DateFormatMoment) : '';
                e.endDate = e.EndDate != null ? moment(e.EndDate).format(config.DateFormatMoment) : '';
            });
            $scope.selectedPromotionList = CustomerPromotions;
        }

        $scope.SelectedSubscription = {
            SubscriptionID: null,
            MSISDN: null,
            ICCID: null,
            IMSI: null,
            SubscriptionType: null,
            subscriptionType: null,
            SubscriptionCategory: null,
            subscriptionCategory: null,
            SubscriptionStatus: null,
            subscriptionStatus: null,
            SimStatus: null,
            simStatus: null,
            CreatedDate: null,
            createdDate: null,
            FirstUsed: null,
            Balance: null,
        }

        if (Subscription != null) {
            $scope.SelectedSubscription = {
                SubscriptionID: Subscription.SubscriptionID,
                MSISDN: Subscription.MSISDN,
                ICCID: null,
                IMSI: Subscription.IMSI,
                SubscriptionType: Customer.CustomerData.PaymentType,
                subscriptionType: CommonEnum.convertMultiSubscriptionType(Customer.CustomerData.PaymentType).name,
                SubscriptionCategory: Subscription.SubscriptionCategory,
                subscriptionCategory: CommonEnum.convertCustomerBusinessType(Subscription.SubscriptionCategory).name,
                SubscriptionStatus: Subscription.SubscriptionStatus,
                subscriptionStatus: CommonEnum.convertSubscriptionStatus(Subscription.SubscriptionStatus),
                SimStatus: null,
                simStatus: null,
                CreatedDate: Subscription.CreateDate,
                createdDate: moment(Subscription.CreateDate).format(config.DateFormatMoment),
                FirstUsed: Subscription.FirstUsed != null && Subscription.FirstUsed != undefined ?
                    moment(Subscription.FirstUsed).format(config.DateFormatMoment) : null,
                Balance: Subscription.Balance,
            }

            if (SimCard !== null) {
                $scope.SelectedSubscription.ICCID = SimCard.ICCID;
                $scope.SelectedSubscription.SimStatus = SimCard.Status;
                $scope.SelectedSubscription.simStatus = CommonEnum.convertSimStatus(SimCard.Status);
            }

            $scope.MSISDN = $scope.SelectedSubscription == null ? '' : $scope.SelectedSubscription.MSISDN;

            //Action-Freeze/UnFreeze/Delete
            var setSubscriptionFiscalAddress,
                setSubscriptionDeliveryAddress,
                setSubscriptionCustomerAddress,
                setSubscriptionAddressCollection = [];

            setSubscriptionFiscalAddress = Customer.CustomerData.FiscalAddress.ZipCode;
            setSubscriptionDeliveryAddress = Customer.CustomerData.DeliveryAddress.ZipCode;
            setSubscriptionCustomerAddress = Customer.CustomerData.CustomerAddress.ZipCode;

            var setSubscriptionInformationObject = {
                msisdn: $scope.SelectedSubscription.MSISDN,
                iccidOrESN: (SimCard !== null) ? SimCard.ICCID : null,
                subscriptionStatus: $scope.SelectedSubscription.subscriptionStatus,
                simStatus: $scope.SelectedSubscription.simStatus,
                customerStatus: CommonEnum.convertCustomerStatus(Customer.CustomerStatus).name,
                zipCodeCollection: setSubscriptionAddressCollection
            };
            DetailCustomer.setSubscriptionInformation(setSubscriptionInformationObject);
            $rootScope.$broadcast('setSubscriptionInformationObject');
        }

    }
    //SUBSCRIPTION END

    if (data === null || data === undefined) {
        var customerSession = sessionStorage.CustomerDataForCustomerSummary != undefined ? JSON.parse(sessionStorage.CustomerDataForCustomerSummary) : {};

        if (!temporarydata_CustomerId) {
            temporarydata_CustomerId = customerSession.customerid;
        }

        if (temporarydata) {
            var DataCustomer = {
                msisdn: temporarydata
            }
            sessionStorage.setItem('CustomerDataForCustomerSummary', JSON.stringify(DataCustomer));
        } else {
            temporarydata = customerSession.msisdn;
        }

        CacheSearch.getSearchCustomer().then(function (result) {
            $scope.products = result[0];
            $scope.pinHtml = result[0];
            customerData = result[0].Customer;
            $scope.load_custDashboardInformation($scope.products);
        });
    } else {
        $scope.products = data[0];
        $scope.pinHtml = data[0];
        customerData = data[0].Customer;
        $scope.load_custDashboardInformation($scope.products);
    }
    //callGetSearchCustomer();

    $scope.OpenCreateTTModal = function () {
        angular.element('#CreateTT').modal('show');
        $rootScope.$broadcast('startquery-creatett');
    };

    $scope.showadjustmentform = false;
    $scope.showcouponform = false;
    $scope.showccform = false;

    $scope.showform = function (adjtype) {
        if (adjtype == 1) {
            $scope.showadjustmentform = true;
            $scope.showcouponform = false;
            $scope.showccform = false;
        }
        else if (adjtype == 2) {
            $scope.showadjustmentform = false;
            $scope.showcouponform = true;
            $scope.showccform = false;
        }
        else if (adjtype == 3) {
            $scope.showadjustmentform = false;
            $scope.showcouponform = false;
            $scope.showccform = true;
        }

    }

    $scope.OpenAdjustBalance = function () {
        angular.element('#AdjustBalance').modal('show');
        //$rootScope.$broadcast('startquery-creatett');
    };

    $scope.OpenSwitchDevice = function () {
        angular.element('#SwitchDevice').modal('show');
    };

    $scope.selecteddev = null;
    $scope.setSelectedDev = function (index) {
        $scope.selecteddev = index;
        selectexist = true;
    };

    $scope.switchDevice_childsumdashboard = function () {
        CSRCache.put('tempadvance', $scope.selecteddev);
        temporarydata = $scope.selecteddev;
        customerId = angular.copy(temporarydata);
        callGetSearchCustomer();
        $scope.viewmultidevices = CacheSearch.getMultiDevices(customerId);
        //$scope.load_getTroubleTicketsByCustomerId();
        //$scope.viewmultidevices = CSRCache.get('resultviewmultidev');
        $scope.selecteddev = null;
    };

    $scope.isMDevSelected = function () {
        return !(selectexist);
    };

    $scope.$on('refreshtableviewtt', function (event, args) {
        var cacheKey = 'searchTroubleTicketByCustomerId=' + customerDetail.CustomerId
        CSRCache.remove(cacheKey);
        $scope.load_getTroubleTicketsByCustomerId();
    });

    $scope.$on('refresh-customerdashboard', function (event, args) {
        var cacheKey = 'Search'
        CSRCache.remove(cacheKey);
        callGetSearchCustomer();
    });

    breadcrumbs.generateBreadcrumbs();
    $scope.breadcrumbs = breadcrumbs;

});

CSRContent.controller("togglePinned", function ($scope, $location) {
    var searchCustomer = window.location.pathname.split('/');
    if ((searchCustomer[4] !== "SearchPage")) {
        $scope.hidePinned = true;
    } else {
        $scope.hidePinned = false;
        $scope.showIconOnly = true;
    }
    $scope.toggleShowIconOnly = function () {
        $scope.showIconOnly = $scope.showIconOnly === false ? true : false;
    };
});
//Agung: End
