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


CSRContent.controller("SearchBoxCustomer", function ($scope, $rootScope, $location, CSRCache, CacheSearch, Notification, $route, ErrorHandlerUtility,
    CacheEnumService, LocalStorageProvider) {


    $scope.SearchPhoneNumber = function (data) {
        temporarydata_CustomerId = '';
        temporarydata_Msisdn = data;
        temporarydata = data;
        search = data;

        if (search == undefined) {
            Notification.error({
                message: '<span>Search should be contain the MSISDN number</span>',
                positionY: 'top',
                positionX: 'center',
                delay: 4000
            });
        } else if (search.indexOf('%') !== -1) {
            if (search.length === 1) {
                Notification.error({
                    message: '<span>Unable to search if input just contain % character only</span>',
                    positionY: 'top',
                    positionX: 'center',
                    delay: 4000
                });
            }
            else {

                CacheEnumService.getTTMVNO().then(function (result) {

                    result.forEach(function (e) {
                        e.value = e.dealerid;
                        e.name = e.mvnoname;
                    })

                    result.forEach(function (e) {
                        // selected index
                        if (LocalStorageProvider.getMvnoid() == e.orgid) {
                            CSRCache.put('tempadvance', temporarydata);
                            CSRCache.put('basicsearch_defaultmvno', e.value);
                            if ($location.path() === "/CSR/Customer/App/AdvanceSearch") {
                                $route.reload();
                                $location.path("CSR/Customer/App/AdvanceSearch");
                            } else {
                                $location.path("CSR/Customer/App/AdvanceSearch");
                            };
                        }
                    })
                });

            };
        } else if (search.trim().length == 0) {
            Notification.error({
                message: '<span>Search should be contain the MSISDN Number</span>',
                positionY: 'top',
                positionX: 'center',
                delay: 4000
            });
        } else {

            callGetSearchCustomer = function () {

                CacheSearch.getCustomerIdByPhoneNumberService(temporarydata).then(function (result) {
                    temporarydata_CustomerId = null;
                    if (result.CustomerID) {

                        var customerSession = sessionStorage.CustomerDataForCustomerSummary != undefined ? JSON.parse(sessionStorage.CustomerDataForCustomerSummary) : {};
                        if (temporarydata) {
                            var DataCustomer = customerSession;
                            DataCustomer.msisdn = temporarydata;
                            sessionStorage.setItem('CustomerDataForCustomerSummary', JSON.stringify(DataCustomer));
                        } else {
                            temporarydata = customerSession.msisdn;
                        }

                        temporarydata_CustomerId = result.CustomerID;
                        customerId = temporarydata_CustomerId;
                        CacheSearch.getSearchDetailCustomer().then(function (result) {
                            if (result !== undefined) {
                                if ($location.path() === "/CSR/Customer/App/SearchPage") {
                                    $route.reload();
                                    $location.path("CSR/Customer/App/SearchPage");
                                } else {
                                    $location.path("CSR/Customer/App/SearchPage");
                                };
                            } else {
                                var data = CSRCache.get('searchDetail');
                                if (data !== undefined) {
                                    $scope.products = { Customer: data };
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


CSRContent.controller("SearchCustomer", function ($scope, $location, $route, $rootScope, $http, $filter, ApiConnection, breadcrumbs, CacheSearch, CSRCache, SearchPageService, CommonEnum,
    pinnedHtmlService, DetailCustomer, TicketDetail, pagingSearchTroubleTicketByCustomerId, PagingIndication, GetOrdersbyFilterService, CacheInventoryOrderSearch, GetMultiDevicebyParentService, ErrorHandlerUtility, LocalStorageProvider,
    MultiSubscriptionsCacheService, MultiSubscriptionsCache) {

    $scope.isParentChild = false;
    $scope.isETAKUser = false;
    $scope.isETAKUser = LocalStorageProvider.isETAKUser();
    $scope.TemplateCode = LocalStorageProvider.getTemplateCode();
    $scope.ShowMultiSubscription = false;
    $scope.selectedOrder = {};
    $scope.selectedProduct = {};
    $scope.selectedTT = null;
    $scope.selectedPromotionList = [];

    var data = CSRCache.get('searchDetail');
    var customerData;

    $scope.LinkToDetailTT = '#';
    $scope.setClickedTTRow = function (selectedTT) {
        if (selectedTT != undefined && selectedTT != null) {
            $scope.selectedTT = selectedTT;
            $scope.LinkToDetailTT = '/CSR/Customer/App/SearchPage/TroubleTicketInfo';
            if ($scope.selectedTT.SubType.Id.toString() == "1020000011") {  //Support
                CSRCache.put('TTDetailSearch', selectedTT.TicketNumber);
                $scope.LinkToDetailTT = '/CSR/Customer/App/TroubleTickets/SupportRequestDetail?searchpage';
            }

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

    $scope.$on('changeScopeMSISDN', function (event, args) {
        if (args.MSISDN != undefined && args.Customer != undefined) {
            $scope.changeScopeMSISDN(args.MSISDN, args.Customer);
        }
    });

    $scope.changeScopeMSISDN = function (MSISDN, Customer) {

        if (MSISDN == 'N/A' || MSISDN == null) {
            MSISDN = '';
        }

        var detailcustomer = {
            MSISDN: MSISDN,
            CustomerId: Customer.CustomerID,
            MVNOId: Customer.DealerId,
            MVNOName: Customer.DealerNode
        };

        DetailCustomer.setDetail(detailcustomer);

        //start : region pinned html
        $rootScope.pinnedCustId = Customer.CustomerID;
        $rootScope.pinnedCustName = Customer.CustomerData.FirstName + ' ' + Customer.CustomerData.LastName;
        $rootScope.pinnedMSISDN = MSISDN;

        var pinned = { pinnedId: $rootScope.pinnedCustId, pinnedName: $rootScope.pinnedCustName, pinnedPhone: MSISDN };
        pinnedHtmlService.setPinned(pinned);
        //end : region pinned html

        customerSession = sessionStorage.CustomerDataForCustomerSummary != undefined ? JSON.parse(sessionStorage.CustomerDataForCustomerSummary) : {};
        customerSession.customerid = Customer.CustomerID;
        customerSession.pinned = pinned;
        customerSession.detailcustomer = detailcustomer;
        if ($scope.selectedMultiSubscription != null && $scope.selectedMultiSubscription.Subscription != undefined) {
            customerSession.subscriptionId = $scope.selectedMultiSubscription.Subscription.SubscriptionId;
        }
        if (MSISDN != '') {//change if not empty
            customerSession.msisdn = MSISDN;
        }
        sessionStorage.setItem('CustomerDataForCustomerSummary', JSON.stringify(customerSession));
    }

    $scope.load_custDashboardInformation = function (data) {
        if (data != null) {
            customerId = data.Customer.CustomerID;

            $rootScope.$broadcast('changeScopeMSISDN', { MSISDN: '', Customer: data.Customer });

            //CustomerInformation BEGIN
            var temp = (data.Customer.CustomerData.BirthDay);
            if ((temp === null) || (temp === undefined)) {
                $scope.birthday = "";
            } else {
                $scope.birthday = moment(temp).format(config.DateFormatMoment);;
            }

            $scope.nationality = CommonEnum.convertCountryList(data.Customer.CustomerData.Nationality).name;
            $scope.idType = CommonEnum.convertDocumentType(data.Customer.CustomerData.DocumentType).name;
            $scope.customerStatus = data.Customer.CustomerStatus == undefined ?
                CommonEnum.convertCustomerStatus(data.Customer.Status).name :
                CommonEnum.convertCustomerStatus(data.Customer.CustomerStatus).name;

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

            //Trouble Ticket BEGIN
            $scope.load_getTroubleTicketsByCustomerId();
            //Trouble Ticket END

            //MULTISUBSCRIPTION BEGIN
            $scope.ShowMultiSubscription = false;
            if ($scope.TemplateCode.toString().toLowerCase() == "etna") {   //subject for adjustment
                $scope.load_getMultiSubscriptionInfoByCustomerId(data.Customer.CustomerID, data.Customer, false);
            } else {
                $scope.load_selectedSubscription(null, data.Customer);
                $scope.load_selectedProducts(null);
            }
            //MULTISUBSCRIPTION END

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

    $scope.load_OrdersList = function (selectedMultiSubscription, customerId) {
        //ORDERS BEGIN
        $scope.ShowOrdersArea = false;
        if (selectedMultiSubscription == null) {
            $scope.dashboardorderlist = {
                CustomerOrders: []
            };
        } else {
            if ($scope.TemplateCode.toString().toLowerCase() == "etna") {   //subject for adjustment
                $scope.ShowOrdersArea = true;
                var OrderInfo = selectedMultiSubscription.OrderInfo;
                var orderNumber = OrderInfo == null ? 0 : OrderInfo.OrderNumber;
                var OrderParam = { PageNumber: 1, PageSize: 100, CustomerId: customerId, FromDate: null, ToDate: null, Status: null };
                CacheInventoryOrderSearch.getOrdersbyFilter(OrderParam).then(function (result) {
                    var data = angular.copy(result);
                    if (data.CustomerOrders !== null) {
                        if (data.CustomerOrders.length > 0) {
                            for (var index = 0; index < data.CustomerOrders.length; index++) {
                                var item = data.CustomerOrders[index];
                                item.Status = CommonEnum.convertOrderStatus(item.Status).name;
                                item.OrderDate = moment(item.OrderDate).format(config.DateFormatMoment);

                                if (item.OrderId == orderNumber) {
                                    item.Products = OrderInfo.Products;
                                }
                            };
                            $scope.dashboardorderlist = angular.copy(data);
                            $scope.dashboardorderlist.CustomerOrders = [];
                            for (var index = 0; index < data.CustomerOrders.length; index++) {
                                var item = data.CustomerOrders[index];
                                if (item.OrderId == orderNumber) {
                                    $scope.dashboardorderlist.CustomerOrders.push(angular.copy(item));
                                }
                            }
                        }
                    }
                });
            }
        }
    }
    //ORDERS END

    //MULTISUBSCRIPTION BEGIN
    $scope.selectedMultiSubscription;
    $scope.selectMultiSubscriptionInfo = function (MultiSubscriptionInfoItem) {
        $scope.selectedMultiSubscription = MultiSubscriptionInfoItem;
    }
    $scope.changeSubscriptionInfo = function (withoutOpenConfirmDialog) {
        if ($scope.selectedMultiSubscription != null && $scope.selectedMultiSubscription != undefined) {
            if (withoutOpenConfirmDialog == true) {
                angular.element('#SwitchSubscriptionConfirmationModal').modal('show');
            } else {
                angular.element('#SwitchSubscriptionConfirmationModal').modal('hide');
                var Subscription_MSISDN = $scope.selectedMultiSubscription.Subscription.MSISDN;
                if (Subscription_MSISDN != 'N/A' && Subscription_MSISDN != null && Subscription_MSISDN != undefined && Subscription_MSISDN != '') {
                    $scope.load_selectedSubscription($scope.selectedMultiSubscription, $scope.products.Customer);

                    CacheSearch.getCustomerProducts(Subscription_MSISDN, false).then(function (response) {
                        var CustomerProducts = angular.copy(response);
                        $scope.load_selectedProducts(CustomerProducts);
                    })

                } else {
                    var singleMultiSubscriptionInfo = angular.copy($scope.selectedMultiSubscription);
                    $scope.load_selectedSubscription($scope.selectedMultiSubscription, $scope.products.Customer);
                    $scope.load_selectedProducts(null);
                }
                $scope.load_OrdersList($scope.selectedMultiSubscription, $scope.products.Customer.CustomerID);
            }
        }
    }


    $scope.MultiSubscriptionInfo_currentPage = 1;
    $scope.MultiSubscriptionInfo_PageSize = 10;
    $scope.MultiSubscriptionInfo_SortKey = ['-(Subscription.SubscriptionStatus==1)', 'Subscription.subscriptionStatus', 'Date.Parse(Subscription.createdDate)', 'Subscription.SubscriptionId'];
    $scope.MultiSubscriptionInfo_Reverse = false;
    $scope.MultiSubscriptionInfo_Sort = function (key) {
        $scope.MultiSubscriptionInfo_Reverse = ($scope.MultiSubscriptionInfo_SortKey === key) ? !$scope.MultiSubscriptionInfo_Reverse : false;
        $scope.MultiSubscriptionInfo_SortKey = key;
    };
    $scope.load_getMultiSubscriptionInfoByCustomerId = function (customerId, Customer, clearCache) {

        $scope.load_selectedSubscription(null, Customer);
        $scope.load_selectedProducts(null);
        MultiSubscriptionsCacheService.getSubscriptionsList(customerId, clearCache).then(function (response) {
            var data = angular.copy(response);
            if (ErrorHandlerUtility.IsResultTypeOK(response)) {
                var ListMultiSubscriptionInfo = data.Subscriptions;

                var InitCount = $filter('filter')(ListMultiSubscriptionInfo, {
                    Subscription: {
                        SubscriptionStatus: 8
                    }
                });
                if (ListMultiSubscriptionInfo.length - InitCount.length >= 2) {
                    $scope.ShowMultiSubscription = true;   //show when isMultiSubscription
                }
                for (var i = 0; i < ListMultiSubscriptionInfo.length; i++) {
                    var object = ListMultiSubscriptionInfo[i];

                    if (object.Subscription.SubscriptionStatus == 8) {
                        $scope.ShowMultiSubscription = true;   //show when isMultiSubscription
                    }
                }

                $scope.ListMultiSubscriptionInfo = ListMultiSubscriptionInfo;

                //Subscription BEGIN
                if (ListMultiSubscriptionInfo.length == 1) {
                    $scope.selectMultiSubscriptionInfo(ListMultiSubscriptionInfo[0]);
                    $scope.changeSubscriptionInfo(false);
                } else if (ListMultiSubscriptionInfo.length >= 2) {
                    var selectedMultiSubscriptionInfo = ListMultiSubscriptionInfo[0];
                    var customerSession = sessionStorage.CustomerDataForCustomerSummary != undefined ? JSON.parse(sessionStorage.CustomerDataForCustomerSummary) : {};
                    var filterMultiSubscriptionInfo = ListMultiSubscriptionInfo.filter(function (data) {
                        if (customerSession.msisdn == undefined || customerSession.msisdn == null) {
                            return false;
                        }
                        if (data.Subscription.MSISDN != null) {
                            return data.Subscription.MSISDN.toString() == customerSession.msisdn.toString();
                        } else {
                            return false;
                        }
                    })[0];
                    if (filterMultiSubscriptionInfo != null && filterMultiSubscriptionInfo != undefined) {
                        selectedMultiSubscriptionInfo = filterMultiSubscriptionInfo;
                    }
                    $scope.selectMultiSubscriptionInfo(selectedMultiSubscriptionInfo);
                    $scope.changeSubscriptionInfo(false);
                } else {
                    $scope.load_selectedSubscription(null, Customer);
                    $scope.load_selectedProducts(null);
                }
                //Subscription END
            }
        });
    }
    //MULTISUBSCRIPTION END

    //SUBSCRIPTION BEGIN
    $scope.SelectedSubscription = {};
    $scope.load_selectedSubscription = function (SubscriptionOrMultiSubscription, Customer) {

        var Subscription = SubscriptionOrMultiSubscription;

        $scope.SelectedSubscription = {};

        if (Subscription != null) {
            $scope.SelectedSubscription = SubscriptionOrMultiSubscription;

            var MSISDN = $scope.SelectedSubscription.Subscription.MSISDN == null ? '' : Subscription.Subscription.MSISDN;

            $rootScope.$broadcast('changeScopeMSISDN', { MSISDN: MSISDN, Customer: Customer });


            //Action-Freeze/UnFreeze/Delete
            var setSubscriptionInformationObject = {
                msisdn: $scope.SelectedSubscription.Subscription.MSISDN,
                iccidOrESN: ($scope.SelectedSubscription.SimCard !== null) ? $scope.SelectedSubscription.SimCard.ICCID : null,
                subscriptionStatus: $scope.SelectedSubscription.Subscription.subscriptionStatus,
                simStatus: ($scope.SelectedSubscription.SimCard !== null) ? $scope.SelectedSubscription.SimCard.simStatus : null,
                customerStatus: CommonEnum.convertCustomerStatus(Customer.CustomerStatus).name,
                OrderNumber: ($scope.SelectedSubscription.OrderInfo !== null) ? $scope.SelectedSubscription.OrderInfo.OrderNumber : null,
                SubscriptionIdentifier: $scope.SelectedSubscription.Subscription.SubscriptionId,
            };
            DetailCustomer.setSubscriptionInformation(setSubscriptionInformationObject);
            $rootScope.$broadcast('setSubscriptionInformationObject');
        } else {
            //Action-Freeze/UnFreeze/Delete
            var setSubscriptionInformationObject = {
                msisdn: null,
                iccidOrESN: null,
                subscriptionStatus: null,
                simStatus: null,
                customerStatus: CommonEnum.convertCustomerStatus(Customer.CustomerStatus).name,
                OrderNumber: null,
                SubscriptionIdentifier: null,
            };
            DetailCustomer.setSubscriptionInformation(setSubscriptionInformationObject);
            $rootScope.$broadcast('setSubscriptionInformationObject');
        }

    }

    $scope.load_selectedProducts = function (GetCustomerProducts) {

        var PlanProducts = null;
        var DeviceProducts = null;
        var FeaturesAndPromotions = null;
        var BucketsList = null;

        if (GetCustomerProducts != null) {

            if (GetCustomerProducts.Plan !== undefined && GetCustomerProducts.Plan !== null) {
                PlanProducts = GetCustomerProducts.Plan;

                PlanProducts.startDate = PlanProducts.StartDate != null ? moment(PlanProducts.StartDate).format(config.DateFormatMoment) : '';
                PlanProducts.endDate = PlanProducts.EndDate != null ? moment(PlanProducts.EndDate).format(config.DateFormatMoment) : '';
            }
            if (GetCustomerProducts.Device !== undefined && GetCustomerProducts.Device !== null) {
                DeviceProducts = GetCustomerProducts.Device;

                DeviceProducts.startDate = DeviceProducts.StartDate != null ? moment(DeviceProducts.StartDate).format(config.DateFormatMoment) : '';
                DeviceProducts.endDate = DeviceProducts.EndDate != null ? moment(DeviceProducts.EndDate).format(config.DateFormatMoment) : '';
            }
            if (GetCustomerProducts.FeaturesAndPromotions !== undefined && GetCustomerProducts.FeaturesAndPromotions !== null) {
                FeaturesAndPromotions = GetCustomerProducts.FeaturesAndPromotions;

                FeaturesAndPromotions.forEach(function (e) {
                    e.startDate = e.StartDate != null ? moment(e.StartDate).format(config.DateFormatMoment) : '';
                    e.endDate = e.EndDate != null ? moment(e.EndDate).format(config.DateFormatMoment) : '';
                });
            }

            if (GetCustomerProducts.BucketInfo !== undefined && GetCustomerProducts.BucketInfo !== null) {
                BucketsList = GetCustomerProducts.BucketInfo.BucketsList;
            }
        }

        $scope.selectedPromotionList = FeaturesAndPromotions
        $scope.selectedProduct = PlanProducts;
        $scope.selectedDeviceInfo = DeviceProducts;
        $scope.selectedBucketsList = BucketsList;

    }
    //SUBSCRIPTION END

    if (data === null || data === undefined) {
        var customerSession = sessionStorage.CustomerDataForCustomerSummary != undefined ? JSON.parse(sessionStorage.CustomerDataForCustomerSummary) : {};

        if (!temporarydata_CustomerId) {
            temporarydata_CustomerId = customerSession.customerid;
        }

        if (temporarydata) {
            var DataCustomer = customerSession;
            DataCustomer.msisdn = temporarydata;
            sessionStorage.setItem('CustomerDataForCustomerSummary', JSON.stringify(DataCustomer));
        } else {
            temporarydata = customerSession.msisdn;
        }

        if (!customerId) {
            var customerSession = sessionStorage.CustomerDataForCustomerSummary != undefined ? JSON.parse(sessionStorage.CustomerDataForCustomerSummary) : {};
            customerId = customerSession.customerid;
        }
        CacheSearch.getSearchDetailCustomer().then(function (result) {
            $scope.products = { Customer: result };
            $scope.pinHtml = { Customer: result };
            customerData = result;
            $scope.load_custDashboardInformation($scope.products);
        });
    } else {
        $scope.products = { Customer: data };
        $scope.pinHtml = { Customer: data };
        customerData = data;
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

    $scope.OpenAutoPay = function () {
        angular.element('#ManageAutoPay').modal('show');
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
        CSRCache.remove('searchDetail');
        MultiSubscriptionsCache.remove('SubscriptionsListByCustomerId');
        MultiSubscriptionsCache.remove('OrderBySubscriptionIdentifier');

        CacheSearch.getSearchDetailCustomer().then(function (result) {
            $scope.products = { Customer: result };
            $scope.pinHtml = { Customer: result };
            customerData = result;
            $scope.load_custDashboardInformation($scope.products);
        });

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
