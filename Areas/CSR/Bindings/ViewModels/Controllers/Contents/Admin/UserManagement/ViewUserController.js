CSRContent.controller('ViewUserController', function ($scope, $location, GetUsersbyOrgID, CSRCache, CacheAdmin, UserDetailUtility, GetUsersbySelectedMvnoService, UserListbyFilterService, LocalStorageProvider, CSRSecureSection, paginationService, Notification, $timeout) {

    var template = "/templates/csr/administrator/usermanagement/viewuser/viewusertable.html"
    $scope.includeMultiplePageResultHtml = "<div ng-include=\"'" + template + "'\"></div>"

    var pagenumber = 1,
        rowperpage = 10,
        nodatafound = false,
        totalPage = 1;
    $scope.pagingServerSide = 0;
    $scope.searchpagenumber = 1;

    $scope.sortcategory = null;
    $scope.sorttype = null;

    $scope.searchparam = {};

    $scope.isETAKUser = false;
    $scope.isETAKUser = LocalStorageProvider.isETAKUser();

    var cacheKey = 'ViewUserData';
    $scope.CstData = '';

    UserDetailUtility.AddBool(false);

    $scope.isDetailShow = function () {
        return !(UserDetailUtility.GetBool());
    };

    $scope.okcancel = function () {
        $location.path('/CSR/Customer/App/Admin/UserManagement/UserDetail');
    };

    $scope.usearch = {};

    CacheAdmin.getallMvno().then(function (result) {
        $scope.mvnolist = result;

        result.forEach(function (e) {
            // selected index
            if (LocalStorageProvider.getMvnoid() == e.orgid) {
                $scope.usearch.mvno = e.orgid;
            }
        })
    });
    $scope.viewgetMvno = function (mvnoid) {
        UserDetailUtility.AddMvno(mvnoid);
    };
    $scope.getSearch = function () {
        var temp = UserDetailUtility.GetMvno();
        GetUsersbySelectedMvnoService.query({ orgid: temp }, function (result) {
            $scope.CstData = result;
        })
    };
    CacheAdmin.getallMvno().then(function (result) {
        var tempenum = [];
        $scope.mvnolist = result;
        var temp = angular.copy(result);
        for (var index = 0; index < temp.length; index++) {
            var item = result[index];
            var name = item.mvnoname;
            var tempvalue = item.orgid;
            var mvnoenum = {
                name: name,
                value: tempvalue
            }
            tempenum.push(mvnoenum);
        }
        UserDetailUtility.AddMvnoEnum(tempenum);
    });

    var nodatafound = false;
    $scope.isdataexist = function () {
        return nodatafound;
    };

    $scope.searchUserPaging = function (filterdata) {
        if (filterdata.fname == '%' || filterdata.mname == '%' || filterdata.lname == '%' || filterdata.email == '%') {
            Notification.error({
                message: '<strong>Failure!</strong> <span>Search parameter cannot contain only % </span>',
                positionY: 'top',
                positionX: 'center'
            });
        }
        else {
            UserListbyFilterService.query({ orgid: $scope.usearch.mvno, firstname: filterdata.fname, middlename: filterdata.mname, lastname: filterdata.lname, email: filterdata.email, pagesize: 10, pagenumber: $scope.searchpagenumber, sortcategory: $scope.sortcategory, sorttype: $scope.sorttype }, function (result) {
                //return false;
                $scope.searchparam = angular.copy(filterdata);
                UserDetailUtility.AddMvno($scope.usearch.mvno);
                var totalCount = parseInt(result.UserCount);
                var mathVal = totalCount / rowperpage;
                var checkValue = mathVal.toString();
                if (checkValue.indexOf(".") > -1) {
                    totalPage = parseInt(checkValue.substring(0, checkValue.indexOf('.'))) + 1;
                }
                else {
                    totalPage = mathVal;
                };
                $scope.pagingServerSide = totalPage;
                $scope.CstData = result.UserList;
                if (result.UserList.length == 0) {
                    nodatafound = true;
                }
                else {
                    nodatafound = false;
                }
                $scope.showdetail = true;
                //$scope.includeMultiplePageResultHtml = "Loading..."
                $scope.includeMultiplePageResultHtml = "<div ng-include=\"'" + template + "'\"></div>"
                //$timeout(function () {
                //    $scope.includeMultiplePageResultHtml = "<div ng-include=\"'" + template + "'\"></div>"
                //}, 500);
            });
        }
    };

    $scope.searchUser = function (filterdata) {
        $scope.sortKey = null;
        $scope.reverse = null;
        if (filterdata.fname == '%' || filterdata.mname == '%' || filterdata.lname == '%' || filterdata.email == '%') {
            Notification.error({
                message: '<strong>Failure!</strong> <span>Search parameter cannot contain only % </span>',
                positionY: 'top',
                positionX: 'center'
            });
        }
        else {
            UserListbyFilterService.query({ orgid: $scope.usearch.mvno, firstname: filterdata.fname, middlename: filterdata.mname, lastname: filterdata.lname, email: filterdata.email, pagesize: 10, pagenumber: 1, sortcategory: null, sorttype: null }, function (result) {
                $scope.searchpagenumber = 1;
                //return false;
                $scope.searchparam = angular.copy(filterdata);
                UserDetailUtility.AddMvno($scope.usearch.mvno);
                var totalCount = parseInt(result.UserCount);
                var mathVal = totalCount / rowperpage;
                var checkValue = mathVal.toString();
                if (checkValue.indexOf(".") > -1) {
                    totalPage = parseInt(checkValue.substring(0, checkValue.indexOf('.'))) + 1;
                }
                else {
                    totalPage = mathVal;
                };
                $scope.pagingServerSide = totalPage;
                $scope.CstData = result.UserList;
                if (result.UserList.length == 0) {
                    nodatafound = true;
                }
                else {
                    nodatafound = false;
                }
                $scope.showdetail = true;
                $scope.includeMultiplePageResultHtml = "Loading..."
                //$scope.includeMultiplePageResultHtml = "<div ng-include=\"'" + template + "'\"></div>"
                $timeout(function () {
                    $scope.includeMultiplePageResultHtml = "<div ng-include=\"'" + template + "'\"></div>"
                }, 500);
            });
        }
    };

    $scope.SearchByPageNumber = function (pageNumber) {
        $scope.searchpagenumber = pageNumber;
        $scope.searchUserPaging($scope.searchparam);
    };

    $scope.sort = function (keyname) {
        $scope.sortKey = keyname;   //set the sortKey to the param passed
        $scope.reverse = !$scope.reverse; //if true make it false and vice versa
        $scope.sortcategory = keyname;
        if ($scope.reverse == true) {
            $scope.sorttype = "descending";
        } else if ($scope.reverse == false) {
            $scope.sorttype = "ascending";
        }
        $scope.searchUserPaging($scope.searchparam);
    }
});

CSRContent.controller('viewuserpaginationController', function ($scope, ApiConnection, UserDetailUtility) {
    

    $scope.selectedRow = null;
    $scope.setClickedRow = function (index) {
        $scope.selectedRow = index;
        alert('Event: you clicked email '+ index)
    }

    $scope.getUserDetail = function (index) {
        $scope.selectedRow = index;
        UserDetailUtility.AddEmail(index);
        UserDetailUtility.AddBool(true);

    }
});

CSRContent.controller('ViewCSRUsersForm', function ($scope, $parse, $route, $http, $filter, $window, UserDetailUtility, $location, CacheAdmin, UserListbyFilterService) {
    $scope.usearch = {};

    $scope.resetViewUser = function () {
        $scope.searchpagenumber = 1;
        $scope.usearch = {};
    };

    CacheAdmin.getallMvno().then(function (result) {
        //$scope.ummvnofilter = [];
        $scope.ummvnofilter = UserDetailUtility.GetMvnoEnum();
        $scope.mvnolist = result;
        //var temp = angular.copy(result);
        //for (var index = 0; index < temp.length; index++) {
        //    var item = result[index];
        //    var name = item.mvnoname;
        //    var tempvalue = item.orgid;
        //    var mvnoenum = {
        //        name: name,
        //        value: tempvalue
        //    }
        //    $scope.ummvnofilter.push(mvnoenum);
        //};
    });
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
                required: false,
                validation: [{ value: "text" }]
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
                name: "useremail",
                size: 6,
                text: "Email",
                model: "usearch.email",
                required: false,
                validation: [{ value: "email" }]
            }
        ],
        button: [
            {
                name: "Submit",
                type: "submit",
                text: "Submit",
                click: "searchUser(usearch)"
            },
            {
                name: "Reset",
                type: "submit",
                text: "Reset_Form",
                click: "resetViewUser()"
                //model: "usearch"
            }
        ]
    };
});
