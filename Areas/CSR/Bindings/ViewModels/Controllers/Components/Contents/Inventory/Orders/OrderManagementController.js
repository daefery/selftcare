CSRContent.controller('OrderManagementController', function ($scope, $route, $http, $window, $filter, $location, CancelOrderService, UpdateOrderService, UpdateOrderStatusService, GetOrderbyOrderIdService, GetOrdersbyFilterService, DeviceManagementUtility, CSRCache, CommonEnum, CacheInventoryOrderSearch, CSRSecureSection) {

    CacheInventoryOrderSearch.getInventoryAll().then(function (result) {
        DeviceManagementUtility.AddUsername(result.ProductInventory);
    });

    $scope.sort = function (keyname) {
        $scope.sortKey = keyname;   //set the sortKey to the param passed
        $scope.reverse = !$scope.reverse; //if true make it false and vice versa
    }

    $scope.selectedRow = null;

    $scope.getOrderCode = function (index) {
        $scope.selectedRow = index;
        DeviceManagementUtility.AddEmail(index);
        GetOrderbyOrderIdService.get({ orderNumber: index }, function (result) {
            var item = angular.copy(result);
            CSRCache.put('OrderDetail', result);
            item.OrderDate = moment(item.OrderDate).format(config.DateFormatMoment);
            item.DeliveryDate = moment(item.DeliveryDate).format(config.DateFormatMoment);
            $scope.mainpageDetail = item;
            $scope.orderAddress = result.ShippingAddress;
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
        GetOrdersbyFilterService.query({ PageNumber: 1, PageSize: 300, OrderNumber: search.orderid, CustomerId: search.customerid, FromDate: search.fromdate, ToDate: search.todate, Status: search.orderstatus }, function (result) {
            data = angular.copy(result);
            //console.log(data);
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
                $scope.orderData = angular.copy(data);
            }
            else {
                nodatafound = true;
                $scope.orderData = {};
            }
        })
    }

});

CSRContent.controller('OrderSearchForm', function ($scope, $parse, GetOrdersbyFilterService, DeviceManagementUtility, CSRCache) {
    $scope.search = {};
    $scope.datas = {
        field: [
            {
                type: "phone",
                name: "orderid",
                size: 6,
                text: "Order_ID",
                model: "search.orderid",
                required: false,
                validation: [{ value: "phone" }]
            },
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