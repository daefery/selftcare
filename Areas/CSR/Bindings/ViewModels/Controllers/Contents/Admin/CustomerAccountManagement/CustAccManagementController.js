var listnotclicked  = false;

CSRContent.controller('AdminSearchCustomerController', function ($scope, CacheAdmin, UserDetailUtility, CustListbyFilterService, ChangeAccountStatusService, Notification, LocalStorageProvider, $timeout) {

    var template = "/templates/csr/administrator/customeraccountmanagement/content/customertable.html"
    $scope.includeMultiplePageResultHtml = "<div ng-include=\"'" + template + "'\"></div>"

    $scope.isETAKUser = false;
    $scope.isETAKUser = LocalStorageProvider.isETAKUser();

    $scope.sortcategory = null;
    $scope.sorttype = null;
    listnotclicked = false;

    var nodatafound = false;
    $scope.isdataexist = function () {
        return nodatafound;
    };

    $scope.isDetailShow = function () {
        return !(listnotclicked);
    };

    $scope.usearch = {};

    var mvnoenum = [];
    $scope.products = {};
    $scope.ummvnofilter = [];
    CacheAdmin.getallMvno().then(function (result) {
        result.forEach(function (e) {
            e.value = e.orgid;
            e.name = e.mvnoname;
        });
        $scope.ummvnofilter = result;

        $scope.mvnolist = result;

        result.forEach(function (e) {
            // selected index
            if (LocalStorageProvider.getMvnoid() == e.orgid) {
                $scope.usearch.mvno = e.orgid;
            }
        })

    });
    $scope.sort = function (keyname) {
        $scope.sortKey = keyname;   //set the sortKey to the param passed
        $scope.reverse = !$scope.reverse; //if true make it false and vice versa
        $scope.sortcategory = keyname;
        if ($scope.reverse == true) {
            $scope.sorttype = "descending";
        } else if ($scope.reverse == false) {
            $scope.sorttype = "ascending";
        }
        $scope.searchCustomerPaging($scope.searchparam);

    }

    $scope.selectedRow = null;

    $scope.getCustomerId = function (index) {
        $scope.selectedRow = index.username;
        UserDetailUtility.AddEmail(index.customerid);
        $scope.modal = angular.copy(index);
        $scope.olddata = angular.copy(index);
        listnotclicked = true;
        //console.log($scope.modal);
    }

    var pagenumber = 1,
        rowperpage = 10,
        nodatafound = false,
        totalPage = 1;
    $scope.pagingServerSide = 0;
    $scope.searchpagenumber = 1;

    $scope.SearchByPageNumber = function (pageNumber) {
        $scope.searchpagenumber = pageNumber;
        $scope.searchCustomerPaging($scope.searchparam);
        //num = parseInt(pageNumber, 10);
        //paginationService.setCurrentPage(paginationId, num);
    };

    $scope.searchparam = {};

    $scope.searchCustomer = function (filterdata) {
        $scope.sortKey = null;
        $scope.reverse = null;
        if (filterdata.fname == '%' || filterdata.mname == '%' || filterdata.lname == '%' || filterdata.id == '%') {
            Notification.error({
                message: '<strong>Failure!</strong> <span>Search parameter cannot contain only % </span>',
                positionY: 'top',
                positionX: 'center'
            });
        } else {
            if (typeof filterdata.id !== 'undefined' && filterdata.id.length > 0) {
                vrSubscriptionId = angular.copy(filterdata.id.replace(/%/g, ''));
                vSubscriptionId = angular.copy(/^[0-9]+$/.test(vrSubscriptionId));
                if (vSubscriptionId == false && filterdata.id !== '%%') {
                    Notification.error({
                        message: '<strong>Failure!</strong> <span>Customer ID cannot contain other than numbers and % </span>',
                        positionY: 'top',
                        positionX: 'center'
                    });
                    return false;
                };
            };
            $scope.searchparam = angular.copy(filterdata);
            CustListbyFilterService.query({ orgid: $scope.usearch.mvno, firstname: filterdata.fname, middlename: filterdata.mname, lastname: filterdata.lname, customerid: filterdata.id, pagesize: 10, pagenumber: 1, sortcategory: null, sorttype: null }, function (result) {
                $scope.searchpagenumber = 1;
                var totalCount = parseInt(result.CustCount);
                var mathVal = totalCount / rowperpage;
                var checkValue = mathVal.toString();
                if (checkValue.indexOf(".") > -1) {
                    totalPage = parseInt(checkValue.substring(0, checkValue.indexOf('.'))) + 1;
                }
                else {
                    totalPage = mathVal;
                };
                $scope.pagingServerSide = totalPage;
                $scope.CustData = result.CustList;
                if (result.CustList.length == 0) {
                    nodatafound = true;
                } else { nodatafound = false; }
                $scope.includeMultiplePageResultHtml = "Loading..."
                //$scope.includeMultiplePageResultHtml = "<div ng-include=\"'" + template + "'\"></div>"
                $timeout(function () {
                    $scope.includeMultiplePageResultHtml = "<div ng-include=\"'" + template + "'\"></div>"
                }, 500);
            });
        }
    }

    $scope.searchCustomerPaging = function (filterdata) {
        if (filterdata.fname == '%' || filterdata.mname == '%' || filterdata.lname == '%' || filterdata.id == '%') {
            Notification.error({
                message: '<strong>Failure!</strong> <span>Search parameter cannot contain only % </span>',
                positionY: 'top',
                positionX: 'center'
            });
        } else {
            if (typeof filterdata.id !== 'undefined' && filterdata.id.length > 0) {
                vrSubscriptionId = angular.copy(filterdata.id.replace(/%/g, ''));
                vSubscriptionId = angular.copy(/^[0-9]+$/.test(vrSubscriptionId));
                if (vSubscriptionId == false && filterdata.id !== '%%') {
                    Notification.error({
                        message: '<strong>Failure!</strong> <span>Customer ID cannot contain other than numbers and % </span>',
                        positionY: 'top',
                        positionX: 'center'
                    });
                    return false;
                };
            };
            $scope.searchparam = angular.copy(filterdata);
            CustListbyFilterService.query({ orgid: $scope.usearch.mvno, firstname: filterdata.fname, middlename: filterdata.mname, lastname: filterdata.lname, customerid: filterdata.id, pagesize: 10, pagenumber: $scope.searchpagenumber, sortcategory: $scope.sortcategory, sorttype: $scope.sorttype }, function (result) {
                var totalCount = parseInt(result.CustCount);
                var mathVal = totalCount / rowperpage;
                var checkValue = mathVal.toString();
                if (checkValue.indexOf(".") > -1) {
                    totalPage = parseInt(checkValue.substring(0, checkValue.indexOf('.'))) + 1;
                }
                else {
                    totalPage = mathVal;
                };
                $scope.pagingServerSide = totalPage;
                $scope.CustData = result.CustList;
                if (result.CustList.length == 0) {
                    nodatafound = true;
                } else { nodatafound = false; }
                $scope.includeMultiplePageResultHtml = "<div ng-include=\"'" + template + "'\"></div>"
            });
        }
    }

    $scope.isFormChanged = function () {
        $scope.tempmodaldata = {};
        if ($scope.modal != null) {
            $scope.tempmodaldata = $scope.modal;
            if ($scope.tempmodaldata.isclosed == "1") {
                $scope.tempmodaldata.isclosed = true
            }
            else {
                $scope.tempmodaldata.isclosed = false
            }
            if ($scope.tempmodaldata.islocked == "1") {
                $scope.tempmodaldata.islocked = true
            }
            else {
                $scope.tempmodaldata.islocked = false
            }
        }
        return !angular.equals($scope.olddata, $scope.tempmodaldata);
    };
   
    $scope.changeStatus = function (products) {
        if (products.islocked == "1") {
            products.islocked = true
        }
        else {
            products.islocked = false
        }
        if (products.isclosed == "1") {
            products.isclosed = true
        }
        else {
            products.isclosed = false
        }
        var customerid = UserDetailUtility.GetEmail();
        var updatestatus = {
            isloginallowed: products.islocked,
            isclosed: products.isclosed,
            customerid: customerid
        }
        ChangeAccountStatusService.update(updatestatus, function (result) {
            if (result.$status = 200) {
                Notification.success({
                    message: '<strong>Success!</strong> <span>Account status has been updated</span>',
                    positionY: 'top',
                    positionX: 'center'
                });
                setTimeout(function () {
                    window.location.assign('/CSR/Customer/App/Admin/CustomerAccountManagement');
                }, 4000);
            }
            else {
                Notification.error({
                    message: '<strong>Failed!</strong> <span>' + result.Messages + '.</span>',
                    positionY: 'top',
                    positionX: 'center'
                });
            }
        });
    };
});

CSRContent.controller('CSRSearchCustomerForm', function ($scope, $parse, CacheAdmin, UserDetailUtility, CustListbyFilterService) {
    $scope.usearch = {};

    $scope.resetViewUser = function () {
        $scope.usearch = {};
    };

    $scope.datas = {
        field: [
            //{
            //    type: "select",
            //    name: "usermvno",
            //    size: 6,
            //    text: "MVNO",
            //    model: "usearch.mvno",
            //    value: "ummvnofilter",
            //    required: true,
            //    validation: [{ value: "mandatory" }]
            //},
            {
                type: "text",
                name: "fname",
                size: 6,
                text: "First_Name",
                model: "usearch.fname",
                required: false
            },
            {
                type: "text",
                name: "mname",
                size: 6,
                text: "Middle_Name",
                model: "usearch.mname",
                required: false,
                maxlength: 50,
                validation: [{ value: "text" }]
            },
            {
                type: "text",
                name: "lname",
                size: 6,
                text: "Last_Name",
                model: "usearch.lname",
                required: false,
                validation: [{ value: "text" }]
            },
            {
                type: "text",
                name: "cust_id",
                size: 6,
                text: "Customer_ID",
                model: "usearch.id",
                required: false,
                validation: [{ value: "text" }]
            }
        ],
        button: [
            {
                name: "Submit",
                type: "submit",
                text: "Submit",
                click: "searchCustomer(usearch)"
            },
            {
                name: "Reset",
                type: "submit",
                text: "Reset_Form",
                click: "resetViewUser()"
            }
        ]
    };
});

CSRContent.controller('EditCustomerAccountFormController', function ($scope, $route, $http, $window, $location, ChangeUserDetail, UserDetailUtility, Notification, ChangeAccountStatusService) {
    var customerid = UserDetailUtility.GetEmail();
    //$scope.changeStatus = function (products) {
    //    ChangeAccountStatusService.update({ isloginallowed: products.isloginaloowed, isclosed: products.isclosed, customerid: customerid }, function (result) {
    //        if (result.$status = 200) {
    //            Notification.success({
    //                message: '<strong>Success!</strong> <span>Account status has been updated</span>',
    //                positionY: 'top',
    //                positionX: 'center'
    //            });
    //            setTimeout(function () {
    //                window.location.assign('/CSR/Customer/App/Admin/UserManagement');
    //            }, 4000);
    //        }
    //        else {
    //            Notification.error({
    //                message: '<strong>Failed!</strong> <span>' + result.Messages + '.</span>',
    //                positionY: 'top',
    //                positionX: 'center'
    //            });
    //        }
    //    });
    //};
});

CSRContent.controller("EditCustomerAccountForm", function ($scope, $parse) {
    $scope.datas = {
        field: [
            {
                type: "radio",
                name: "radioisloginallowed",
                size: 6,
                text: "islocked",
                model: "modal.islocked",
                required: false,
                style: "horizontal",
                content: [{ text: "Allow", value: 1 }, { text: "Deny", value: 0 }],
                validation: [{ value: "mandatory" }]
            },
            {
                type: "radio",
                name: "radioisclosed",
                size: 6,
                text: "isclosed",
                model: "modal.isclosed",
                required: false,
                style: "horizontal",
                content: [{ text: "Close", value: 1 }, { text: "Open", value: 0 }],
                validation: [{ value: "mandatory" }]
            }
        ],
        button: [
            {
                name: "Submit",
                type: "submit",
                text: "Submit",
                disabled: "!isFormChanged()",
                click: "changeStatus(modal)"
            },
            {
                name: "Cancel",
                type: "cancel",
                text: "Cancel",
                click: "modal"
            }
        ]
    };
});