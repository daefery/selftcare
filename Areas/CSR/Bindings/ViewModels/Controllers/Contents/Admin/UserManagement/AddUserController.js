var temprolelist = [];
var temprolename = [];

CSRContent.controller('AddUserController', function ($scope, $modal, CacheAdmin, CSRCache, UserDetailUtility, LocalStorageProvider, GetLoggedUserService, GetRolebyMVNOIdActiveOnlyService, CSRSecureSection) {
    $scope.rolelist = [];
    $scope.rolename = [];

    $scope.saveselection = function () {
        temprolelist = $scope.rolelist;
        temprolename = $scope.rolename;
    }
    $scope.toggleSelection = function toggleSelection(employeeName) {
        var idx = $scope.rolelist.indexOf(employeeName.RoleID);
        // is currently selected
        if (idx > -1) {
            $scope.rolelist.splice(idx, 1);
        }
            // is newly selected
        else {
            $scope.rolelist.push(employeeName.RoleID);
        }
        var idxname = $scope.rolename.indexOf(employeeName.RoleName);
        if (idxname > -1) {
            $scope.rolename.splice(idxname, 1);
        }
            // is newly selected
        else {
            $scope.rolename.push(employeeName.RoleName);
        }
    };

    GetLoggedUserService.get(function (result) {
        var mvno = result.LoggedMvno;
        GetRolebyMVNOIdActiveOnlyService.query({ MvnoId: mvno, TypeId: 1 }, function (data) {
            $scope.mvnorole = data;
            $scope.rolelist = [];
            temprolelist = [];
        });
    });

    $scope.newrole = function (mvnoid) {
        GetRolebyMVNOIdActiveOnlyService.query({ MvnoId: mvnoid, TypeId: 1 }, function (data) {
            $scope.mvnorole = data;
            $scope.rolelist = [];
            temprolelist = [];
        });
    }

    CacheAdmin.getallMvno().then(function (result) {
        $scope.mvnolist = result;
    });
    $scope.getmvno = function (mvnoid) {
        UserDetailUtility.AddMvno(mvnoid);
    };
    $scope.mvno = UserDetailUtility.GetMvno();
    $scope.mvnomissing = false;

    $scope.open = function () {
        $('#confirmCancelModal').modal('hide');
    };

    $scope.okcancel = function () {
        window.location.assign('/CSR/Customer/App/Admin/UserManagement');
    };
});

CSRContent.controller('AddUserFormController', function ($scope, $route, $http, $modal,$filter, $window, $location, AddUserCSRService, Notification, UserDetailUtility, CacheAdmin) {
    
});

CSRContent.controller('AddUserForm', function ($scope, $parse, $route, $http, $filter, $window, $location, AddUserCSRService, Notification, UserDetailUtility, CacheAdmin, LocalStorageProvider, GetLoggedUserService, GetRolebyMVNOIdActiveOnlyService) {
    $scope.$on("$locationChangeStart", function (event) {
        console.log('masuk location change');
        if ($scope.newUser.$dirty || !confirm('You have unsaved changes, are you sure want to left this page?'))
            event.preventDefault();
    });
    $scope.rolenameform = temprolename;
    var mvno = null;
    GetLoggedUserService.get(function (result) {
        mvno = result.LoggedMvno;
        GetRolebyMVNOIdActiveOnlyService.query({ MvnoId: mvno, TypeId: 1 }, function (data) {
            $scope.mvnorole = data;
            $scope.rolelist = [];
            temprolelist = [];
        });
    });
    $scope.newUser = {};
    var notvalid = "";
    $scope.getmvno = function (mvnoid) {
        UserDetailUtility.AddMvno(mvnoid);
    };

    $scope.open = function () {
        $('#confirmCancelModal').modal('hide');
    };

    $scope.ok = function () {
        $scope.showModal = false;
    };

    $scope.cancel = function () {
        $scope.showModal = false;
    };

    CacheAdmin.getallMvno().then(function (result) {
        $scope.mvnooptions = [];
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
            $scope.mvnooptions.push(mvnoenum);
        };
    });
    $scope.adduser = function (newUser) {
        var birthdayDate = $filter('date')(Date.parse(newUser.BirthDate), config.DateFormatCore);
        var rolelist = temprolelist;
        //console.log(rolelist);
        //return false;
        if (newUser.Email.length > 254)
        {
            Notification.error({
                message: '<strong>Warning!</strong> <span>Email length is too long to be saved</span>',
                positionY: 'top',
                positionX: 'center'
            });
        }
        else
        {
            if (rolelist.length > 0) {
                var userdata = {};
                if ($scope.isETAKUser == true) {
                    userdata = {
                        email: newUser.Email,
                        password: newUser.password,
                        firstname: newUser.FirstName,
                        middlename: newUser.MiddleName,
                        lastname: newUser.LastName,
                        jobtitle: newUser.JobTitle,
                        dateofbirth: birthdayDate,
                        mobilephonenumber: newUser.MobileNumber,
                        username: newUser.Email,
                        usertype: 1,
                        orgid: newUser.mvno.value,
                        address: newUser.Address,
                        RoleList: rolelist
                    };
                }
                else if ($scope.isETAKUser == false) {
                    userdata = {
                        email: newUser.Email,
                        password: newUser.password,
                        firstname: newUser.FirstName,
                        middlename: newUser.MiddleName,
                        lastname: newUser.LastName,
                        jobtitle: newUser.JobTitle,
                        dateofbirth: birthdayDate,
                        mobilephonenumber: newUser.MobileNumber,
                        username: newUser.Email,
                        usertype: 1,
                        orgid: mvno,
                        address: newUser.Address,
                        RoleList: rolelist
                    };
                }
                AddUserCSRService.save(userdata, function (result) {
                    if (result.$status == 200) {
                        Notification.success({
                            message: '<strong>Success!</strong> <span>The user has been created <br />Please check registered email for verification process </span>',
                            positionY: 'top',
                            positionX: 'center'
                        });
                        setTimeout(function () {
                            window.location.assign('/CSR/Customer/App/Admin/UserManagement');
                        }, 4000);
                        //return true;
                    }
                    else
                        Notification.error({
                            message: '<strong>Failed!</strong> <span>' + result.Messages + '.</span>',
                            positionY: 'top',
                            positionX: 'center'
                        });
                });
            }
            else {
                Notification.error({
                    message: '<strong>Warning!</strong> <span>There is no role assigned for this user</span>',
                    positionY: 'top',
                    positionX: 'center'
                });
            }
        }
    };
    $scope.isETAKUser = false;
    $scope.isETAKUser = LocalStorageProvider.isETAKUser();

    $scope.datas = {};
    if ($scope.isETAKUser == true) {
        $scope.datas = {
            field: [
                {
                    type: "text",
                    name: "fname",
                    size: 6,
                    text: "First_Name",
                    model: "newUser.FirstName",
                    required: true,
                    maxlength: 50,
                    validation: [{ value: "mandatory" }, { value: "text" }, { value: "maxlength" }]
                },
                {
                    type: "text",
                    name: "mname",
                    size: 6,
                    text: "Middle_Name",
                    model: "newUser.MiddleName",
                    required: false,
                    maxlength: 50,
                    validation: [{ value: "maxlength" }]
                },
                {
                    type: "text",
                    name: "lname",
                    size: 6,
                    text: "Last_Name",
                    model: "newUser.LastName",
                    required: true,
                    maxlength: 50,
                    validation: [{ value: "mandatory" }, { value: "text" }, { value: "maxlength" }]
                },
                {
                    type: "selectcheckchange",
                    name: "usermvno",
                    size: 6,
                    text: "MVNO",
                    model: "newUser.mvno",
                    value: "mvnooptions",
                    ngchange: "newrole(newUser.mvno.value)",
                    required: true,
                    validation: [{ value: "mandatory" }]
                },
                {
                    type: "text",
                    name: "jobtitle",
                    size: 6,
                    text: "Job_Title",
                    model: "newUser.JobTitle",
                    required: true,
                    maxlength: 50,
                    validation: [{ value: "mandatory" }, { value: "text" }, { value: "maxlength" }]
                },
                {
                    type: "birthdate",
                    name: "birthdate",
                    size: 6,
                    text: "Date_of_Birth",
                    model: "newUser.BirthDate",
                    required: true,
                    validation: [{ value: "mandatory" }]
                },
                {
                    type: "email",
                    name: "email",
                    size: 6,
                    text: "Email",
                    maxlength: 254,
                    model: "newUser.Email",
                    required: true,
                    validation: [{ value: "mandatory" }, { value: "email" }, { value: "maxlength" }]
                },
                {
                    type: "phone",
                    name: "phone",
                    size: 6,
                    text: "Mobile_Number",
                    model: "newUser.MobileNumber",
                    required: true,
                    validation: [{ value: "mandatory" }, { value: "phone" }]
                },
                {
                    type: "textarea",
                    name: "address",
                    size: 6,
                    text: "Address",
                    model: "newUser.Address",
                    required: true,
                    maxlength: 150,
                    validation: [{ value: "mandatory" }, { value: "maxlength" }]
                }
            ],
            button: [
                {
                    name: "Submit",
                    type: "submit",
                    text: "Submit",
                    click: "adduser(newUser)"
                },
                {
                    type: "showmodal",
                    name: "Cancel",
                    text: "Cancel",
                    //click: "/CSR/Customer/App/Admin/UserManagement"
                    click: "#confirmCancelModal"
                }
            ]
        };
    }
    else if ($scope.isETAKUser == false)
    {
        $scope.datas = {
            field: [
                {
                    type: "text",
                    name: "fname",
                    size: 6,
                    text: "First_Name",
                    model: "newUser.FirstName",
                    required: true,
                    maxlength: 50,
                    validation: [{ value: "mandatory" }, { value: "text" }, { value: "maxlength" }]
                },
                {
                    type: "text",
                    name: "mname",
                    size: 6,
                    text: "Middle_Name",
                    model: "newUser.MiddleName",
                    required: false,
                    maxlength: 50,
                    validation: [{ value: "maxlength" }]
                },
                {
                    type: "text",
                    name: "lname",
                    size: 6,
                    text: "Last_Name",
                    model: "newUser.LastName",
                    required: true,
                    maxlength: 50,
                    validation: [{ value: "mandatory" }, { value: "text" }, { value: "maxlength" }]
                },
                ////{
                ////    type: "selectcheckchange",
                ////    name: "usermvno",
                ////    size: 6,
                ////    text: "MVNO",
                ////    model: "newUser.mvno",
                ////    value: "mvnooptions",
                ////    ngchange: "newrole(newUser.mvno.value)",
                ////    required: true,
                ////    validation: [{ value: "mandatory" }]
                ////},
                {
                    type: "text",
                    name: "jobtitle",
                    size: 6,
                    text: "Job_Title",
                    model: "newUser.JobTitle",
                    required: true,
                    maxlength: 50,
                    validation: [{ value: "mandatory" }, { value: "text" }, { value: "maxlength" }]
                },
                {
                    type: "birthdate",
                    name: "birthdate",
                    size: 6,
                    text: "Date_of_Birth",
                    model: "newUser.BirthDate",
                    required: true,
                    validation: [{ value: "mandatory" }]
                },
                {
                    type: "email",
                    name: "email",
                    size: 6,
                    text: "Email",
                    maxlength: 254,
                    model: "newUser.Email",
                    required: true,
                    validation: [{ value: "mandatory" }, { value: "email" }, { value: "maxlength" }]
                },
                {
                    type: "phone",
                    name: "phone",
                    size: 6,
                    text: "Mobile_Number",
                    model: "newUser.MobileNumber",
                    required: true,
                    validation: [{ value: "mandatory" }, { value: "phone" }]
                },
                {
                    type: "textarea",
                    name: "address",
                    size: 6,
                    text: "Address",
                    model: "newUser.Address",
                    required: true,
                    maxlength: 150,
                    validation: [{ value: "mandatory" }, { value: "maxlength" }]
                }
            ],
            button: [
                {
                    name: "Submit",
                    type: "submit",
                    text: "Submit",
                    click: "adduser(newUser)"
                },
                {
                    type: "showmodal",
                    name: "Cancel",
                    text: "Cancel",
                    //click: "/CSR/Customer/App/Admin/UserManagement"
                    click: "#confirmCancelModal"
                }
            ]
        };
    }

    

    //setTimeout(function () {
    //    init();
    //}, 1000);
});