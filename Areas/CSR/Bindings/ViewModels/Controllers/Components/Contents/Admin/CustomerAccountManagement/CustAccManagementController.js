CSRContent.controller('AdminSearchCustomerController', function ($scope, CacheAdmin, UserDetailUtility, CustListbyFilterService, ChangeAccountStatusService, Notification, LocalStorageProvider) {

    $scope.isETAKUser = false;
    $scope.isETAKUser = LocalStorageProvider.isETAKUser();

    var nodatafound = false;
    $scope.isdataexist = function () {
        return nodatafound;
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
    }

    $scope.selectedRow = null;

    $scope.getCustomerId = function (index) {
        $scope.selectedRow = index.username;
        UserDetailUtility.AddEmail(index.customerid);
        $scope.modal = angular.copy(index);
        //console.log($scope.modal);
    }

    $scope.searchCustomer = function (filterdata) {
        CustListbyFilterService.query({ orgid: $scope.usearch.mvno, firstname: filterdata.fname, middlename: filterdata.mname, lastname: filterdata.lname, customerid: filterdata.id }, function (result) {
            $scope.CustData = result;
            if (result.viewCustData.length == 0) {
                nodatafound = true;
            } else { nodatafound = false;}
        });
    }
   
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
                type: "number",
                name: "cust_id",
                size: 6,
                text: "Customer_ID",
                model: "usearch.id",
                required: false,
                validation: [{ value: "number" }]
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
                type: "reset",
                text: "Reset_Form",
                model: "usearch"
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