CSRContent.controller('AdvanceSearchController', function ($scope, $http, LocalStorageProvider, Notification, $parse, $route, $location,
    CommonEnum, CSRCache, CacheSearch, advancesearchelementService, $timeout, CacheEnumService, ErrorHandlerUtility) {
    var template = "/templates/csr/search/multipleresultpage.html"
    $scope.includeMultiplePageResultHtml = "<div ng-include=\"'" + template + "'\"></div>"
    var pagenumber = 1,
        rowsperpage = 10,
        orderby = 'CustomerId',
        sortby = '',
        partialSearchValue = CSRCache.get('tempadvance'),
        nodatafound = false;
    $scope.pagingServerSide = 0;
    //var getConfig = JSON.parse(sessionStorage.webConfig);
    //var dealerId = getConfig.DealerId;

    $scope.isETAKUser = false;
    $scope.isETAKUser = LocalStorageProvider.isETAKUser();

    $scope.isdataexist = function () {
        return nodatafound;
    };

    $scope.selectedCustomerId = "";
    $scope.selectedSubscriptionId = "";
    $scope.selectedMSISDN = "";

    $scope.ResetResultAdvanceSearch = function () {
        CSRCache.remove('advsearchresult');
        $scope.advanceSearchResult = [];
        $scope.pagingServerSide = 0;

        $scope.ResetSelection();
    }

    $scope.ResetSelection = function () {
        CSRCache.remove('advsearchselected');
        $scope.selectedCustomerId = '';
        $scope.selectedSubscriptionId = '';
        $scope.selectedMSISDN = '';
    }

    $scope.TTMVNO = [];
    CacheEnumService.getTTMVNO().then(function (result) {

        result.forEach(function (e) {
            e.value = e.dealerid;
            e.name = e.mvnoname;
        })

        $scope.TTMVNO = result;

        //$scope.keySearch.keyMVNO = $scope.TTMVNO[0].value; // selected first index
        result.forEach(function (e) {
            // selected index
            if (LocalStorageProvider.getMvnoid() == e.orgid) {
                $scope.FiscalUnitId = e.value;
                $scope.defFiscalUnitId = e.value;
            }
        })
    });


    var callService = function (object) {
        CSRCache.put('advsearchresult', object);
        advancesearchelementService.setElement(object);

        CacheSearch.getAdvanceSearchCustomer().then(function (result) {
            data = angular.copy(result);
            for (var index = 0; index < data.Customers.length; index++) {
                var item = data.Customers[index];
                item.CustomerStatus = CommonEnum.convertPendingStatus(item.CustomerStatus);
                item.SubscriptionStatus = CommonEnum.convertSubscriptionStatus(item.SubscriptionStatus);
            };

            $scope.advanceSearchResult = data.Customers;
            if ($scope.advanceSearchResult.length < 1) {
                nodatafound = true;
            }
            else {
                nodatafound = false;
            };

            var totalCount = parseInt(data.TotalCount);
            var mathVal = totalCount / rowsperpage;
            var checkValue = mathVal.toString();
            if (checkValue.indexOf(".") > -1) {
                totalPage = parseInt(checkValue.substring(0, checkValue.indexOf('.'))) + 1;
            }
            else {
                totalPage = mathVal;
            };
            $scope.pagingServerSide = totalPage
        });
    };

    var isLoading = function () {
        return $http.pendingRequests.length > 0;
    }

    var loadLastQuery = function () {
        var query = CSRCache.get('advsearchquery');
        var result = CSRCache.get('advsearchresult');
        var selected = CSRCache.get('advsearchselected');
        var page;
        if( result != null) page = result.PageNumber;

        //map query to form
        if (query != null) {
            $scope.FiscalUnitId = query.FiscalUnitId;
            $scope.CustomerId = query.CustomerId;
            $scope.SubscriptionId = query.SubscriptionId;
            $scope.IMSI = query.IMSI;
            $scope.CustomerName = query.CustomerName;
            $scope.MSISDN = query.MSISDN;
            $scope.ICCID = query.ICCID;
            $scope.IMEI = query.IMEI;
            $scope.IdNumber = query.IdNumber;
            $scope.Email = query.Email;

            //get result resource
            if (result != null) {
                callService(result);

                //get last opened page
                $scope.$watch($scope.isLoading, function (loading) {
                    if (!loading) {
                        $timeout(function () {
                            angular.element('.pagination').scope().pagingActivePointer(page);
                        }, 100);
                    }
                });

                //Get last selected
                if (selected != null) {
                    $scope.SelectCustomer(selected.selectedMSISDN, selected.selectedCustomerId, selected.selectedSubscriptionId);
                }
            }
        }
    }

    var vNotificationError = function (message) {
        Notification.error({
            message: '<span>' + message + ' must be numeric digit(s).</span>',
            positionY: 'top',
            positionX: 'center',
            delay: 4000
        });
    }
    var fnotificationError = function () {
        Notification.error({
            message: '<span>Unable to search if input just contain % character only</span>',
            positionY: 'top',
            positionX: 'center',
            delay: 4000
        });
    }

    $scope.searchBy = function (CustomerId, SubscriptionId, IMSI, CustomerName, MSISDN, ICCID, IMEI, IdNumber, Email, FiscalUnitId) {
        var vCustomerId, vSubscriptionId, vIMSI, vMSISDN, vICCID, vIMEI, vrCustomerId, vrSubscriptionId, vrIMSI, vrMSISDN, vrICCID,
         vError = 0;
        //FiscalUnitId = $scope.FiscalUnitId;

        var advsearchquery = {
            "CustomerId": CustomerId, "SubscriptionId": SubscriptionId, "IMSI": IMSI, "CustomerName": CustomerName,
            "MSISDN": MSISDN, "ICCID": ICCID, "IMEI": IMEI, "IdNumber": IdNumber, "Email": Email, "FiscalUnitId": FiscalUnitId
        }
        CSRCache.put('advsearchquery', advsearchquery);

        $scope.ResetResultAdvanceSearch();

        if (CustomerId === '%' ||
            SubscriptionId ==='%' ||
            IMSI === '%' ||
            CustomerName === '%' ||
            MSISDN === '%' ||
            ICCID === '%' ||
            IMEI === '%' ||
            IdNumber === '%' ||
            Email === '%' ||
            FiscalUnitId === '%') {
            fnotificationError();
        }
        else {
            if (typeof CustomerId !== 'undefined' && CustomerId.length > 0) {
                vrCustomerId = angular.copy(CustomerId.replace(/%/g, ''));
                vCustomerId = angular.copy(/^[0-9]+$/.test(vrCustomerId));
                if (vCustomerId == false && CustomerId !== '%%') {
                    vNotificationError('CustomerId');
                    vError += 1;
                };
            };
            if (typeof SubscriptionId !== 'undefined' && SubscriptionId.length > 0) {
                vrSubscriptionId = angular.copy(SubscriptionId.replace(/%/g, ''));
                vSubscriptionId = angular.copy(/^[0-9]+$/.test(vrSubscriptionId));
                if (vSubscriptionId == false && SubscriptionId !== '%%') {
                    vNotificationError('SubscriptionId');
                    vError += 1;
                };
            };
            if (typeof IMSI !== 'undefined' && IMSI.length > 0) {
                vrIMSI = angular.copy(IMSI.replace(/%/g, ''));
                vIMSI = angular.copy(/^[0-9]+$/.test(vrIMSI));
                if (vIMSI == false && IMSI !== '%%') {
                    vNotificationError('IMSI');
                    vError += 1;
                };
            };
            if (typeof MSISDN !== 'undefined' && MSISDN.length > 0) {
                vrMSISDN = angular.copy(MSISDN.replace(/%/g, ''));
                vMSISDN = angular.copy(/^[0-9]+$/.test(vrMSISDN));
                if (vMSISDN == false && MSISDN !== '%%') {
                    vNotificationError('MSISDN');
                    vError += 1;
                };
            };
            if (typeof ICCID !== 'undefined' && ICCID.length > 0) {
                vrICCID = angular.copy(ICCID.replace(/%/g, ''));
                vICCID = angular.copy(/^[0-9]+$/.test(vrICCID));
                if (vICCID == false && ICCID !== '%%') {
                    vNotificationError('ICCID');
                    vError += 1;
                };
            };
            if (typeof IMEI !== 'undefined' && IMEI.length > 0) {
                vrIMEI = angular.copy(IMEI.replace(/%/g, ''));
                vIMEI = angular.copy(/^[0-9]+$/.test(vrIMEI));
                if (vIMEI == false && IMEI !== '%%') {
                    vNotificationError('IMEI');
                    vError += 1;
                };
            };

            if (vError === 0) {
                var object = {
                    PageNumber: pagenumber,
                    RowsPerPage: rowsperpage,
                    OrderBy: orderby,
                    SortBy: sortby,
                    CustomerId: CustomerId,
                    SubscriptionId: SubscriptionId,
                    IMSI: IMSI,
                    CustomerName: CustomerName,
                    MSISDN: MSISDN,
                    ICCID: ICCID,
                    IMEI: IMEI,
                    IdNumber: IdNumber,
                    Email: Email,
                    FiscalUnitId: $scope.FiscalUnitId
                };
                callService(object);
                $scope.includeMultiplePageResultHtml = "Loading..."
                $timeout(function () {
                    $scope.includeMultiplePageResultHtml = "<div ng-include=\"'" + template + "'\"></div>"
                }, 50);
            };
        };
    };

    var gotoSearchPage = function () {
        if ($location.path() === "/CSR/Customer/App/SearchPage") {
            $route.reload();
            $location.path("CSR/Customer/App/SearchPage");
        } else {
            $location.path("CSR/Customer/App/SearchPage");
        };
    };

    $scope.gotoDashboard = function () {
        if (!$scope.selectedCustomerId) {
            Notification.error({
                message: '<span>Please select the customer.</span>',
                positionY: 'top',
                positionX: 'center',
                delay: 4000
            });
        } else {

            var customerSession = sessionStorage.CustomerDataForCustomerSummary != undefined ? JSON.parse(sessionStorage.CustomerDataForCustomerSummary) : {};
            if (temporarydata) {
                var DataCustomer = customerSession;
                DataCustomer.msisdn = temporarydata;
                sessionStorage.setItem('CustomerDataForCustomerSummary', JSON.stringify(DataCustomer));
            } else {
                temporarydata = customerSession.msisdn;
            }

            if (temporarydata_Msisdn !== null) { //when Msisdn not null, find "main" CustomerId
                CacheSearch.getCustomerIdByPhoneNumberService(temporarydata_Msisdn).then(function (result) {
                    temporarydata_CustomerId = null;
                    if (result.CustomerID) {
                        temporarydata_CustomerId = result.CustomerID;
                        customerId = temporarydata_CustomerId;
                        CacheSearch.getSearchDetailCustomer().then(function (result) {
                            if (ErrorHandlerUtility.IsResultTypeOK(result)) {
                                gotoSearchPage();
                            }
                        });
                    }
                });

            } else {    //when Msisdn null, use the temporarydata_CustomerId
                customerId = temporarydata_CustomerId;
                CacheSearch.getSearchDetailCustomer().then(function (result) {
                    if (ErrorHandlerUtility.IsResultTypeOK(result)) {
                        gotoSearchPage();
                    }
                });
            }
        }
    };

    $scope.SelectCustomer = function (selectedMSISDN, selectedCustomerId, selectedSubscriptionId) {
        CSRCache.put('advsearchselected', {
            'selectedMSISDN': selectedMSISDN,
            'selectedCustomerId': selectedCustomerId,
            'selectedSubscriptionId': selectedSubscriptionId
        });

        temporarydata_Msisdn = selectedMSISDN;
        temporarydata_CustomerId = selectedCustomerId;
        temporarydata = selectedMSISDN;
        $scope.selectedCustomerId = selectedCustomerId;
        $scope.selectedSubscriptionId = selectedSubscriptionId;
        $scope.selectedMSISDN = selectedMSISDN;
    };


    $scope.orderBy = function (key) {
        var Object = advancesearchelementService.getElement();
        if (typeof Object !== 'undefined') {
            ($scope.sortKey != key) ? $scope.reverse = false : $scope.reverse = !$scope.reverse;
            $scope.sortKey = key;
            Object.OrderBy = key;
            (!$scope.reverse) ? Object.SortBy = '' : Object.SortBy = 'descending';
            callService(Object);
        }
    };

    $scope.getSearchByPageNumber = function (pageNumber) {
        var Object = advancesearchelementService.getElement();
        if (typeof Object !== 'undefined') {
            Object.PageNumber = pageNumber;
            callService(Object);
        }
    };

    $scope.resetVal = "";
    $scope.ResetFieldAdvanceSearch = function () {
        $scope.CustomerId = angular.copy($scope.resetVal);
        $scope.SubscriptionId = angular.copy($scope.resetVal);
        $scope.IMSI = angular.copy($scope.resetVal);
        $scope.CustomerName = angular.copy($scope.resetVal);
        $scope.MSISDN = angular.copy($scope.resetVal);
        $scope.ICCID = angular.copy($scope.resetVal);
        $scope.IMEI = angular.copy($scope.resetVal);
        $scope.IdNumber = angular.copy($scope.resetVal);
        $scope.Email = angular.copy($scope.resetVal);
        //$scope.FiscalUnitId = angular.copy($scope.resetVal);
        $scope.FiscalUnitId = $scope.defFiscalUnitId;
        $scope.AdvanceSearchFilter.$setPristine();
        CSRCache.remove('advsearchquery');

        $scope.ResetResultAdvanceSearch();
    }


    //For Partial Search Feature
    if (typeof partialSearchValue !== 'undefined') {
        $scope.products = {};
        $scope.products.Subscription = {};
        $scope.products.Subscription.MSISDN = partialSearchValue;

        $scope.FiscalUnitId = CSRCache.get('basicsearch_defaultmvno');
        
        //$scope.searchBy = function (CustomerId, SubscriptionId, IMSI, CustomerName, MSISDN, ICCID, IMEI, IdNumber, Email, FiscalUnitId) {
        $scope.searchBy('', '', '', '', partialSearchValue, '', '', '', '', '');
        CSRCache.remove('tempadvance');

        //map query to form
        var query = CSRCache.get('advsearchquery');
        if (query) {
            $scope.FiscalUnitId = query.FiscalUnitId;
            $scope.CustomerId = query.CustomerId;
            $scope.SubscriptionId = query.SubscriptionId;
            $scope.IMSI = query.IMSI;
            $scope.CustomerName = query.CustomerName;
            $scope.MSISDN = query.MSISDN;
            $scope.ICCID = query.ICCID;
            $scope.IMEI = query.IMEI;
            $scope.IdNumber = query.IdNumber;
            $scope.Email = query.Email;
        }
    }
    //End Partial Search Feature
    else{
        loadLastQuery();
    }
})