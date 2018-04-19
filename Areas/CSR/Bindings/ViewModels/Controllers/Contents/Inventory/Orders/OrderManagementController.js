CSRContent.controller('OrderManagementController', function ($scope, $route, $http, $window, $filter, $location, CancelOrderService, UpdateOrderService, UpdateOrderStatusService, GetOrderbyOrderIdService, GetOrdersbyFilterService, DeviceManagementUtility, CSRCache, CommonEnum, CacheInventoryOrderSearch, CSRSecureSection, LocalStorageProvider, CacheAdmin, $timeout) {

    var template = "/templates/csr/inventory/orders/content/ordertable.html"
    $scope.includeMultiplePageResultHtml = "<div ng-include=\"'" + template + "'\"></div>"

    $scope.isETAKUser = false;
    $scope.isETAKUser = LocalStorageProvider.isETAKUser();

    var pagenumber = 1,
        rowperpage = 10,
        nodatafound = false,
        totalPage = 1;
    $scope.pagingServerSide = 0;
    $scope.searchpagenumber = 1;

    $scope.searchparam = {};

    $scope.SearchByPageNumber = function (pageNumber) {
        $scope.searchpagenumber = pageNumber;
        $scope.searchorderspaging($scope.searchparam);
        //num = parseInt(pageNumber, 10);
        //paginationService.setCurrentPage(paginationId, num);
    };

    $scope.search = {};

    DeviceManagementUtility.AddBool(false);

    CacheAdmin.getallMvno().then(function (result) {
        //console.log(result);
        
        //$scope.mvnolist = result;
        //result.forEach(function (e) {
        //    if (LocalStorageProvider.getMvnoid() == 999999) {
        //        $scope.search.mvno = e.orgid;
        //    }
        //})
        $scope.search.mvno = 0;
        var etnaonly = [
            {
                mvnoname: 'ETNA',
                orgid: 999999,
                dealerid: 900000
            }];
        if (LocalStorageProvider.getMvnoid() == 999999 || LocalStorageProvider.getMvnoid() == 970815) {
            $scope.mvnolist = angular.copy(etnaonly);
        }
        else {
            $scope.mvnolist = [];
        }
        etnaonly.forEach(function (e) {
            if (LocalStorageProvider.getMvnoid() == 999999 || LocalStorageProvider.getMvnoid() == 970815) {
                $scope.search.mvno = e.orgid;
            }
        })
    });

    CacheInventoryOrderSearch.getInventoryAll().then(function (result) {
        DeviceManagementUtility.AddUsername(result.ProductInventory);
    });

    $scope.sort = function (keyname) {
        $scope.sortKey = keyname;   //set the sortKey to the param passed
        $scope.reverse = !$scope.reverse; //if true make it false and vice versa
    }

    $scope.selectedRow = null;

    $scope.isDetailShow = function () {
        return !(DeviceManagementUtility.GetBool());
    };

    $scope.okcancel = function () {
        $location.path('/CSR/Customer/App/Inventory/Orders/OrderDetail');
    };

    $scope.getOrderCode = function (index) {
        $scope.selectedRow = index;
        DeviceManagementUtility.AddEmail(index);
        DeviceManagementUtility.AddBool(true);
        GetOrderbyOrderIdService.get({ orderNumber: index }, function (result) {
            var item = angular.copy(result);
            CSRCache.put('OrderDetail', result);
            item.OrderDate = moment(item.OrderDate).format(config.DateFormatMoment);
            item.DeliveryDate = moment(item.DeliveryDate).format(config.DateFormatMoment);
            $scope.mainpageDetail = item;
            $scope.orderAddress = result.ShippingAddress;
            $scope.oldorderAddress = angular.copy(result.ShippingAddress);
        })
    }
    var nodatafound = false;
    $scope.isdataexist = function () {
        return nodatafound;
    };

    $scope.getOrderStatus = function (index) {
        DeviceManagementUtility.AddOrderStatus(index);
    }

    CacheInventoryOrderSearch.getOrderResult().then(function (result) {
        $scope.orderData = angular.copy(result);
    });

    $scope.searchorders = function (search) {
        $scope.searchparam = angular.copy(search);
        $scope.searchpagenumber = 1;
        GetOrdersbyFilterService.query({ PageNumber: $scope.searchpagenumber, PageSize: 10, CustomerId: search.customerid, FromDate: search.fromdate, ToDate: search.todate, Status: search.orderstatus, MvnoId: $scope.search.mvno }, function (result) {
            data = angular.copy(result);
            DeviceManagementUtility.AddMvno($scope.search.mvno);
            if (data.CustomerOrders != null && data.CustomerOrders.length > 0)
            {
                nodatafound = false;
                for (var index = 0; index < data.CustomerOrders.length; index++) {
                    var item = data.CustomerOrders[index];
                    item.Status = CommonEnum.convertOrderStatus(item.Status).name;
                    item.OrderDate = moment(item.OrderDate).format(config.DateFormatMoment);
                    item.CompletionDate = moment(item.CompletionDate).format(config.DateFormatMoment);
                };
                CSRCache.put('SearchOrderResult', data);
                var totalCount = parseInt(result.OrderCount);
                var mathVal = totalCount / rowperpage;
                var checkValue = mathVal.toString();
                if (checkValue.indexOf(".") > -1) {
                    totalPage = parseInt(checkValue.substring(0, checkValue.indexOf('.'))) + 1;
                }
                else {
                    totalPage = mathVal;
                };
                $scope.pagingServerSide = totalPage;
                $scope.orderData = angular.copy(data);
            }
            else {
                nodatafound = true;
                $scope.orderData = {};
            }
            $scope.includeMultiplePageResultHtml = "Loading..."
            //$scope.includeMultiplePageResultHtml = "<div ng-include=\"'" + template + "'\"></div>"
            $timeout(function () {
                $scope.includeMultiplePageResultHtml = "<div ng-include=\"'" + template + "'\"></div>"
            }, 500);
        })
    }

    $scope.searchorderspaging = function (search) {
        $scope.searchparam = angular.copy(search);
        GetOrdersbyFilterService.query({ PageNumber: $scope.searchpagenumber, PageSize: 10, CustomerId: search.customerid, FromDate: search.fromdate, ToDate: search.todate, Status: search.orderstatus, MvnoId: $scope.search.mvno }, function (result) {
            data = angular.copy(result);
            DeviceManagementUtility.AddMvno($scope.search.mvno);
            if (data.CustomerOrders != null && data.CustomerOrders.length > 0) {
                nodatafound = false;
                for (var index = 0; index < data.CustomerOrders.length; index++) {
                    var item = data.CustomerOrders[index];
                    item.Status = CommonEnum.convertOrderStatus(item.Status).name;
                    item.OrderDate = moment(item.OrderDate).format(config.DateFormatMoment);
                    item.CompletionDate = moment(item.CompletionDate).format(config.DateFormatMoment);
                };
                CSRCache.put('SearchOrderResult', data);
                var totalCount = parseInt(result.OrderCount);
                var mathVal = totalCount / rowperpage;
                var checkValue = mathVal.toString();
                if (checkValue.indexOf(".") > -1) {
                    totalPage = parseInt(checkValue.substring(0, checkValue.indexOf('.'))) + 1;
                }
                else {
                    totalPage = mathVal;
                };
                $scope.pagingServerSide = totalPage;
                $scope.orderData = angular.copy(data);
            }
            else {
                nodatafound = true;
                $scope.orderData = {};
            }
            $scope.includeMultiplePageResultHtml = "<div ng-include=\"'" + template + "'\"></div>"
        })
    }

});

CSRContent.controller('OrderSearchForm', function ($scope, $parse, GetOrdersbyFilterService, DeviceManagementUtility, CSRCache) {
    $scope.search = {};
    $scope.datas = {
        field: [
            //{
            //    type: "phone",
            //    name: "orderid",
            //    size: 6,
            //    text: "Order_ID",
            //    model: "search.orderid",
            //    required: false,
            //    validation: [{ value: "phone" }]
            //},
            {
                type: "phone",
                name: "customerid",
                size: 6,
                text: "Customer_ID",
                model: "search.customerid",
                required: false,
                maxlength: 50,
                validation: [{ value: "phone" }]
            },
            {
                type: "date",
                name: "fromdate",
                size: 6,
                text: "OrderDate_From",
                model: "search.fromdate",
                required: false,
                validation: [{ value: "date" }]
            },
            {
                type: "date",
                name: "todate",
                size: 6,
                text: "OrderDate_To",
                model: "search.todate",
                required: false,
                validation: [{ value: "date" }]
            },
            {
                type: "radio",
                name: "orderstatus",
                size: 6,
                text: "Order_Status",
                model: "search.orderstatus",
                required: false,
                style: "horizontal",
                content: [{ text: "Pending", value: "0" }, { text: "Processed", value: "1" }, { text: "Canceled", value: "2" }],
                validation: [{ value: "radio" }]
            }
        ],
        button: [
            {
                name: "Submit",
                type: "submit",
                text: "Submit",
                click: "searchorders(search)"
            },
            {
                name: "Reset",
                type: "reset",
                text: "Reset_Form",
                model: "search"
            }
        ]
    };
});

CSRContent.controller('OrderSearchFormController', function ($scope, GetOrdersbyFilterService, DeviceManagementUtility, CSRCache) {
    $scope.searchorders = function (search) {
        $scope.pagenumber = 1;
        $scope.pagesize = 50;
        GetOrdersbyFilterService.query({ PageNumber: 1, PageSize: 50, OrderNumber: search.orderid, CustomerId: search.customerid, FromDate: search.fromdate, ToDate: search.todate, Status: search.orderstatus }, function (result) {
            $scope.orderData = angular.copy(result);
            CSRCache.put("orderList", result);
            DeviceManagementUtility.AddUsername(result);
        })
    }
});

CSRContent.controller('vieworderpaginationController', function ($scope, ApiConnection, DeviceManagementUtility) {
    $scope.sort = function (keyname) {
        $scope.sortKey = keyname;   //set the sortKey to the param passed
        $scope.reverse = !$scope.reverse; //if true make it false and vice versa
    }

    var temp = DeviceManagementUtility.GetUsername();
    $scope.orderData = temp;

    $scope.selectedRow = null;

    $scope.getOrderCode = function (index) {
        $scope.selectedRow = index;
        DeviceManagementUtility.AddEmail(index);
    }
});