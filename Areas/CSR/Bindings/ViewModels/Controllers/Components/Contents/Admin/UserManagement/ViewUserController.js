CSRContent.controller('ViewUserController', function ($scope, GetUsersbyOrgID, CSRCache, CacheAdmin, UserDetailUtility, GetUsersbySelectedMvnoService, UserListbyFilterService, LocalStorageProvider, CSRSecureSection) {

    $scope.isETAKUser = false;
    $scope.isETAKUser = LocalStorageProvider.isETAKUser();

    var cacheKey = 'ViewUserData';
    $scope.CstData = '';

    UserDetailUtility.AddBool(false);

    $scope.isDetailShow = function () {
        return !(UserDetailUtility.GetBool());
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

    $scope.searchUser = function (filterdata) {
        UserListbyFilterService.query({ orgid: $scope.usearch.mvno, firstname: filterdata.fname, middlename: filterdata.mname, lastname: filterdata.lname, email: filterdata.email }, function (result) {
            UserDetailUtility.AddMvno($scope.usearch.mvno);
            $scope.CstData = result;
            if (result.viewUserData.length == 0) {
                nodatafound = true;
            }
            else {
                nodatafound = false;
            }
            $scope.showdetail = true;
        });
    }
});

CSRContent.controller('viewuserpaginationController', function ($scope, ApiConnection, UserDetailUtility) {
    $scope.sort = function (keyname) {
        $scope.sortKey = keyname;   //set the sortKey to the param passed
        $scope.reverse = !$scope.reverse; //if true make it false and vice versa
    }

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
                type: "reset",
                text: "Reset_Form",
                model: "usearch"
            }
        ]
    };
});
