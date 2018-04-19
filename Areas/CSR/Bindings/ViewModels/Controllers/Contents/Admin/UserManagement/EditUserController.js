var orgid = 0;
var differentdealer = true;

CSRContent.controller('ViewUserDetailController', function ($scope, $rootScope, $modal, $q, $http, $location, $filter, ApiConnection, GetUserDetail, UserDetailUtility, GetRolebyMVNOIdService, CreateRoleUserService, Notification, AssignRoleTreeService, GetUserRolesService, GetDealerbyMvnoService, AssignDealerService, GetMvnoDetailService, GetDepartmentbyUserDealerIdService, AssignUserDeptService, GetUserDeptbyIdService, LocalStorageProvider, CSRCache, CacheAdmin, DealerMvnoDetailService, SelfUpdateService, GetRolebyMVNOIdActiveOnlyService, CSRSecureSection) {

    $scope.tempmodaldata = {};

    $scope.isNoDept = null;
    $scope.isETAKUser = false;
    $scope.isETAKUser = LocalStorageProvider.isETAKUser();
    $scope.olddetail = {};
    $scope.newdetail = {};
    $scope.isdealerexist = false;

    $scope.isDetailChanged = function () {
        var newdata = !angular.equals($scope.olddetail, $scope.newdetail);
        if (newdata == true) {
            GetUserDetail.query({ email: temp, orgid:tenant }, function (result) {
                $scope.olddetail = angular.copy(result);
                var item = angular.copy(result);
                var temp = item.dateofbirth;
                if ((temp === null) || (temp === undefined)) {
                    item.dateofbirth = "";
                } else {
                    item.dateofbirth = moment(temp).format(config.DateFormatMoment);
                }
                orgid = result.orgid;
                CacheAdmin.getallMvno().then(function (product) {
                    $scope.mvnolist = product;
                    var query = {
                        "orgid": result.orgid
                    };
                    var temp = $filter('filter')(product, query);
                    $scope.fieldmvnoname = angular.copy(temp[0].mvnoname);
                    $scope.detail = angular.copy(item);
                });
                var dealer = angular.copy(result.dealerId);
                if (dealer != null) {
                    $scope.isdealerexist = true;
                    DealerMvnoDetailService.get({ dealerid: dealer }, function (data) {
                        var temp = data.MVNOInfo;
                        $scope.dealername = temp[0].DealerNode;
                    });
                } else { $scope.isdealerexist = false;}
                $scope.products = angular.copy(item);
                tempemail = item.email;
                $scope.editmodaldata = angular.copy(item);
                $scope.emailmodaldata = angular.copy(item);
                var cacheKey = 'changeemail';
                CSRCache.put(cacheKey, item);
            });
        }
    };

    var list = [];
    $scope.rolelist = [];
    $scope.oldrolelist = [];
    $scope.deptlist = [];
    $scope.olddeptlist = [];
    $scope.emailmodaldata = {};
    var globaluserid = {};
    var tempemail = "";
    $scope.delete = function (data) {
        data.nodes = [];
    };
    $scope.add = function (data) {
        var post = data.nodes.length + 1;
        var newName = data.name + '-' + post;
        data.nodes.push({ name: newName, nodes: [] });
    };
    $scope.tree = [{ name: "Lowi", id: 190000, nodes: [] }];
    var temp = UserDetailUtility.GetEmail();
    var tenant = UserDetailUtility.GetMvno();
    GetUserDetail.query({ email: temp, orgid: tenant }, function (result) {
        $scope.olddetail = angular.copy(result);
        var item = angular.copy(result);
        var temp = item.dateofbirth;
        if ((temp === null) || (temp === undefined)) {
            item.dateofbirth = "";
        } else {
            item.dateofbirth = moment(temp).format(config.DateFormatMoment);
        }
        CacheAdmin.getallMvno().then(function (product) {
            $scope.mvnolist = product;
            var query = {
                "orgid": result.orgid
            };
            var temp = $filter('filter')(product, query);
            $scope.fieldmvnoname = angular.copy(temp[0].mvnoname);
            $scope.detail = angular.copy(item);

        });
        var dealer = angular.copy(result.dealerid);
        if (dealer != null) {
            $scope.isdealerexist = true;
            DealerMvnoDetailService.get({ dealerid: dealer }, function (data) {
                var temp = data.MVNOInfo;
                if (temp.length > 0) {
                    $scope.dealername = temp[0].DealerNode;
                }
            });
        } else { $scope.isdealerexist = false;}
        $scope.products = angular.copy(item);
        tempemail = item.email;
        $scope.editmodaldata = angular.copy(item);
        $scope.emailmodaldata = angular.copy(item);
        var cacheKey = 'changeemail';
        CSRCache.put(cacheKey, item);
        //$scope.detail = angular.copy(item);
        //console.log(result);
        var mvno = result.orgid;
        var userid = result.userid;
        globaluserid = result.userid;
        var dealerid = result.dealerid;
        GetUserDeptbyIdService.get({ userId: userid }, function (result) {
            if (result.$status == 200) {
                $scope.userdprt = result.TTSimpleDepartment;
                var data = angular.copy(result.TTSimpleDepartment);
                if (data.length > 0) {
                    for (var index = 0; index < data.length; index++) {
                        var item = data[index];
                        $scope.deptlist.push(item.DepartmentId);
                        $scope.olddeptlist.push(item.DepartmentId);
                    };
                }
            }
            else {
                Notification.success({
                    message: '<strong>Empty data!</strong> <span>Account profile has no designated department</span>',
                    positionY: 'top',
                    positionX: 'center'
                });
            }
        })
        if (dealerid != null) {
            $scope.isdealerexist = true;
            GetDepartmentbyUserDealerIdService.query({ dealerId: dealerid }, function (dprt) {
                $scope.departments = dprt.TTDepartments;
                var temp = angular.copy(dprt.TTDepartments);
                if (temp.length !=  0) {
                    $scope.isNoDept = false;
                }
                else
                {
                    $scope.isNoDept = true;
                }
            })
        }
        else {
            $scope.isdealerexist = false;
            Notification.success({
                message: '<strong>Empty data</strong> <span>User has no assigned Dealer ID. Please assign Dealer ID first</span>',
                positionY: 'top',
                positionX: 'center'
            });
        }
        GetUserRolesService.query({ UserAccountKey: userid, IsActive: true }, function (rolesresult) {
            $scope.userroles = rolesresult;
            var data = angular.copy(rolesresult);
            if (data.length > 0) {
                for (var index = 0; index < data.length; index++) {
                    var item = data[index];
                    $scope.rolelist.push(item.RoleID);
                    $scope.oldrolelist.push(item.RoleID);
                };
            }
        });
        GetRolebyMVNOIdActiveOnlyService.query({ MvnoId: mvno, TypeId: 1 }, function (data) {
            $scope.mvnorole = data;
        });
        GetMvnoDetailService.query({ mvnoid: mvno }, function (detail) {
            var dealerid = detail.dealerid;
            $scope.maindealer = angular.copy(detail);
            GetDealerbyMvnoService.query({ dealerid: dealerid }, function (dealers) {
                $scope.previous = dealerid;
                
            });
        });
    });

    $scope.recorddealerid = function () {
        var email = UserDetailUtility.GetEmail();
        var dealerid = $scope.assigneddealer;
        var mvno = UserDetailUtility.GetMvno();
        var assigninfo = {
            dealerid: dealerid,
            email: email,
            mvno: mvno
        };
        AssignDealerService.update(assigninfo, function (result) {
            if (result.$status = 200) {
                if (dealerid != null) {
                    $scope.isdealerexist = true;
                    DealerMvnoDetailService.get({ dealerid: dealerid }, function (data) {
                        var temp = data.MVNOInfo;
                        if (temp.length > 0) {
                            $scope.dealername = temp[0].DealerNode;
                        }
                        else { $scope.dealername = "Unknown";}
                    });
                } else { $scope.isdealerexist = false;}
                GetDepartmentbyUserDealerIdService.query({ dealerId: dealerid }, function (dprt) {
                    $scope.departments = dprt.TTDepartments;
                    var temp = angular.copy(dprt.TTDepartments);
                    if (temp.length == 0) {
                        $scope.isNoDept = true;
                    }
                    else
                    {
                        $scope.isNoDept = false;
                    }
                })
                GetUserDetail.query({ email: temp, orgid: tenant }, function (result) {
                    var item = angular.copy(result);
                    var temp = item.dateofbirth;
                    if ((temp === null) || (temp === undefined)) {
                        item.dateofbirth = "";
                        $scope.detail = angular.copy(item);
                    } else {
                        item.dateofbirth = moment(temp).format(config.DateFormatMoment);
                        $scope.detail = angular.copy(item);
                    }
                    $scope.products = angular.copy(item);
                    //$scope.detail = angular.copy(item);
                });
                Notification.success({
                    message: '<strong>Success!</strong> <span>Dealer has been assigned to user</span>',
                    positionY: 'top',
                    positionX: 'center'
                });
                //setTimeout(function () {
                //    window.location.assign('/CSR/Customer/App/Admin/UserManagement');
                //}, 4000);
                $('#dealerModal').modal('hide');
            }
            else {
                Notification.error({
                    message: '<strong>Failed!</strong> <span>' + result.Messages + '.</span>',
                    positionY: 'top',
                    positionX: 'center'
                });
            }
        });
    }

    $scope.getprevious = function () {
        var dealerid = $scope.previous;
        GetDealerbyMvnoService.query({ dealerid: dealerid }, function (dealers) {
            $scope.dealers = dealers.DealerInfo;
        });
    }

    $scope.assigndealer = function (dealerid) {
        if (dealerid != $scope.detail.dealerid) {
            differentdealer = false;
        }
        else {
            differentdealer = true;
        }
        $scope.assigneddealer = dealerid;
    }

    $scope.getfirstdealer = function (dealerid) {
        GetDealerbyMvnoService.query({ dealerid: dealerid }, function (dealers) {
            $scope.dealers = dealers.DealerInfo;
        });
    }

    $scope.getsubdealer = function(dealerid)
    {
        GetDealerbyMvnoService.query({ dealerid: dealerid }, function (dealers) {
            $scope.subdealers = dealers.DealerInfo;
        });
    }

    $scope.getsecsubdealer = function (dealerid) {
        GetDealerbyMvnoService.query({ dealerid: dealerid }, function (dealers) {
            $scope.secsubdealers = dealers.DealerInfo;
        });
    }

    $scope.lockcheck = true;

    //var mvno = $scope.products.orgid;

    

    $scope.toggleDeptSelecct = function toggleDeptSelecct(employeeName) {
        var idx = $scope.deptlist.indexOf(employeeName);
        // is currently selected
        if (idx > -1) {
            $scope.deptlist.splice(idx, 1);
        }
            // is newly selected
        else {
            $scope.deptlist = [];
            $scope.deptlist.push(employeeName);
        }
        //console.log($scope.deptlist);
    };

    

    $scope.toggleSelection = function toggleSelection(employeeName) {
        var idx = $scope.rolelist.indexOf(employeeName);
        // is currently selected
        if (idx > -1) {
            $scope.rolelist.splice(idx, 1);
        }
        // is newly selected
        else {
            $scope.rolelist.push(employeeName);
        }
    };

    $scope.pushRole = function (role) {
        role.chosen = true;
        $scope.rolelist.push(role);
    };
    $scope.unpushRole = function (role) {
        role.chosen = false;
        var index = $scope.rolelist.indexOf(role);
        $scope.rolelist.splice(index, 1);
    };

    var isselfupdate = null;
    SelfUpdateService.get({email: temp, orgid: tenant},function (result) {
        //console.log(result);
        isselfupdate = result.IsSelfRoleUpdate;
    });

    $scope.isDealerChanged = function () {
        return differentdealer;
    };

    $scope.isDeptChanged = function () {
        return angular.equals($scope.olddeptlist, $scope.deptlist);
    };

    $scope.isRoleChanged = function () {
        var temp = [];
        if ($scope.rolelist != null) {
            temp = angular.copy($scope.rolelist);
        }
        var temp2 = [];
        if ($scope.oldrolelist != null) { temp2 = angular.copy($scope.oldrolelist); }
        var result = 0;
        var containall = true;
        for (var index = 0; index < temp.length; index++) {
            var item = temp[index];
            if (temp2.indexOf(item) !== -1) {
                result = result + 1;
                //containall = true;
            } else {
                //break;
                result = result + 1;
                containall = false;
            }
        };
        if (result == temp2.length && containall == false) {
            return false;
        }
        else if (result != temp2.length && containall == true) {
            return false;
        }
        else if (result == temp2.length && containall == true) {
            return true;
        }
        else if (result != temp2.length && containall == false) {
            return false;
        }
        //return angular.equals($scope.oldaccesslist, $scope.accesslist);
    };

    $scope.assignrole = function () {
        
        GetUserDetail.query({ email: temp, orgid: tenant }, function (result) {
            var userid = result.userid;
            var rolelist = $scope.rolelist;
            var userroledata = {
                UserRoleID: 1,
                UserID: userid,
                RoleID: rolelist
            };
            //console.log(isselfupdate);
            AssignRoleTreeService.save(userroledata, function (result) {
                if (result.$status = 200) {
                    Notification.success({
                        message: '<strong>Success!</strong> <span>Roles has been assigned to user</span>',
                        positionY: 'top',
                        positionX: 'center'
                    });
                    GetUserRolesService.query({ UserAccountKey: globaluserid, IsActive: true }, function (rolesresult) {
                        $scope.userroles = {};
                        $scope.userroles = rolesresult;
                        $scope.rolelist.length = 0;
                        var data = angular.copy(rolesresult);
                        if (data.length > 0) {
                            for (var index = 0; index < data.length; index++) {
                                var item = data[index];
                                $scope.rolelist.push(item.RoleID);
                                $scope.oldrolelist.push(item.RoleID);
                            };
                        }
                    });
                    $('#roleModal').modal('hide');
                    if (isselfupdate == true) {
                        $rootScope.$broadcast('refresh.csr.mainmenu', true);
                        $rootScope.$broadcast('refresh.csr.securesection', true);
                        setTimeout(function () {
                            window.location.assign('/CSR/Customer/App');
                        }, 1000);
                    }
                }
                else {
                    Notification.error({
                        message: '<strong>Failed!</strong> <span>' + result.Messages + '.</span>',
                        positionY: 'top',
                        positionX: 'center'
                    });
                }
            });
        });
    }

    $scope.assigndept = function () {
        GetUserDetail.query({ email: temp, orgid: tenant }, function (result) {
            var userid = result.userid;
            var deptlist = $scope.deptlist;
            var userdeptdata = {
                UserId: userid,
                DeptId: deptlist
            };
            AssignUserDeptService.save(userdeptdata, function (result) {
                if (result.$status = 200) {
                    Notification.success({
                        message: '<strong>Success!</strong> <span>Department(s) has been assigned to user</span>',
                        positionY: 'top',
                        positionX: 'center'
                    });
                    //setTimeout(function () {
                    //    window.location.assign('/CSR/Customer/App/Admin/UserManagement');
                    //}, 4000);
                    GetUserDeptbyIdService.get({ userId: globaluserid }, function (result) {
                        $scope.userdprt = {};
                        $scope.userdprt = result.TTSimpleDepartment;
                        $scope.deptlist.length = 0;
                        var data = angular.copy(result.TTSimpleDepartment);
                        if (data.length > 0) {
                            $scope.isNoDept = false;
                            for (var index = 0; index < data.length; index++) {
                                var item = data[index];
                                $scope.deptlist.push(item.DepartmentId);
                                $scope.olddeptlist.push(item.DepartmentId);
                            };
                        }
                        else {
                            $scope.isNoDept = true;
                        }
                    });
                    $('#deptModal').modal('hide');
                }
                else {
                    Notification.error({
                        message: '<strong>Failed!</strong> <span>' + result.Messages + '.</span>',
                        positionY: 'top',
                        positionX: 'center'
                    });
                }
            });
        });
    }
    var tempemail = UserDetailUtility.GetEmail();

    $scope.isFormChangedEmail = function () {
        return !angular.equals(tempemail, $scope.emailmodaldata.email);
    };
});

CSRContent.controller('EditUserDetailFormController', function ($scope, $rootScope, $route, $http, $window, $location, ChangeUserDetail, GetUserDetail, UserDetailUtility, Notification) {
    $scope.return = function () {
        window.location.href = '/CSR/Customer/App/Admin/UserManagement';
    }

    $scope.isFormChanged = function () {
        $scope.tempmodaldata = {};
        if ($scope.editmodaldata != null) {
            $scope.tempmodaldata = $scope.editmodaldata;
            if ($scope.tempmodaldata.isclosed == "1") {
                $scope.tempmodaldata.isclosed = true
            }
            else {
                $scope.tempmodaldata.isclosed = false
            }
            if ($scope.tempmodaldata.isloginallowed == "1") {
                $scope.tempmodaldata.isloginallowed = true
            }
            else {
                $scope.tempmodaldata.isloginallowed = false
            }
        }
        return !angular.equals($scope.products, $scope.tempmodaldata);
    };

    var temp = UserDetailUtility.GetEmail();
    var inttenant = UserDetailUtility.GetMvno();
    $scope.changeDetail = function (products) {
        if (products.isclosed == "1") {
            products.isclosed = true
        }
        else {
            products.isclosed = false
        }
        if (products.isloginallowed == "1") {
            products.isloginallowed = true
        }
        else {
            products.isloginallowed = false
        }
        var notvalid = "";
        var updateInfoData = {
            mobilenumber: products.mobilenumber,
            email: temp,
            firstname: products.firstname,
            middlename: products.middlename,
            lastname: products.lastname,
            jobtitle: products.jobtitle,
            dateofbirth: products.dateofbirth,
            isloginallowed: products.isloginallowed,
            isverified: products.isverified,
            isclosed: products.isclosed,
            address: products.address,
            tenant: inttenant
        };
        //$scope.updateinfo = formData;
        if (updateInfoData.address != notvalid && updateInfoData.phonenumber != notvalid) {
            ChangeUserDetail.update(updateInfoData, function (result) {
                if (result.$status = 200) {
                    Notification.success({
                        message: '<strong>Success!</strong> <span>User details has been updated</span>',
                        positionY: 'top',
                        positionX: 'center'
                    });
                    //$route.reload();
                    //setTimeout(function () {
                    //    window.location.assign('/CSR/Customer/App/Admin/UserManagement');
                    //}, 4000);
                    
                    $('#userModal').modal('hide');
                }
                else {
                    Notification.error({
                        message: '<strong>Failed!</strong> <span>' + result.Messages + '.</span>',
                        positionY: 'top',
                        positionX: 'center'
                    });
                }
                var tempresult = {};
                GetUserDetail.query({ email: temp, orgid: inttenant }, function (result) {
                    $scope.newdetail = angular.copy(result);
                    var item = angular.copy(result);
                    var temp = item.dateofbirth;
                    if ((temp === null) || (temp === undefined)) {
                        $scope.DateofBirth = "";
                        $scope.detail = angular.copy(item);
                    } else {
                        item.dateofbirth = moment(temp).format(config.DateFormatMoment);
                        $scope.detail = angular.copy(item);
                    }
                    //$scope.detail = item;
                    tempemail = item.email;
                    tempresult = angular.copy(result);
                    $scope.editmodaldata = angular.copy(item);
                    //$scope.detail = angular.copy(tempresult);
                });
                $scope.isDetailChanged();
            });
        } else {
            return false;
        }
    };
});

CSRContent.controller("EditUserDetailForm", function ($scope, $parse) {
   $scope.datas = {
        field: [
            {
                type: "text",
                name: "fname",
                size: 6,
                text: "First_Name",
                model: "editmodaldata.firstname",
                required: true,
                maxlength: 50,
                validation: [{ value: "mandatory" }, { value: "text" }, { value: "maxlength" }]
            },
            {
                type: "text",
                name: "mname",
                size: 6,
                text: "Middle_Name",
                model: "editmodaldata.middlename",
                required: false,
                maxlength: 50,
                validation: [{ value: "maxlength" }]
            },
            {
                type: "text",
                name: "lname",
                size: 6,
                text: "Last_Name",
                model: "editmodaldata.lastname",
                required: true,
                maxlength: 50,
                validation: [{ value: "mandatory" }, { value: "text" }, { value: "maxlength" }]
            },
            {
                type: "text",
                name: "jobtitle",
                size: 6,
                text: "Job_Title",
                model: "editmodaldata.jobtitle",
                required: true,
                maxlength: 50,
                validation: [{ value: "mandatory" }, { value: "text" }, { value: "maxlength" }]
            },
            {
                type: "birthdate",
                name: "birthdate",
                size: 6,
                text: "Date_of_Birth",
                model: "editmodaldata.dateofbirth",
                required: true,
                validation: [{ value: "mandatory" }]
            },
            {
                type: "phone",
                name: "phone",
                size: 6,
                text: "Mobile_Number",
                model: "editmodaldata.mobilenumber",
                required: true,
                validation: [{ value: "mandatory" }, { value: "phone" }]
            },
            {
                type: "textarea",
                name: "address",
                size: 6,
                text: "Address",
                model: "editmodaldata.address",
                required: true,
                maxlength: 150,
                validation: [{ value: "mandatory" }, { value: "maxlength" }]
            },
            {
                type: "radio",
                name: "radioisloginallowed",
                size: 6,
                text: "islocked",
                model: "editmodaldata.isloginallowed",
                required: true,
                style: "horizontal",
                content: [{ text: "Allow", value: 1 }, { text: "Deny", value: 0 }],
                validation: [{ value: "mandatory" }]
            },
            {
                type: "radio",
                name: "radioisclosed",
                size: 6,
                text: "isclosed",
                model: "editmodaldata.isclosed",
                required: true,
                style: "horizontal",
                content: [{ text: "Close", value: 1 }, { text: "ReOpen", value: 0 }],
                validation: [{ value: "mandatory" }]
            }
        ],
        button: [
            {
                name: "Submit",
                type: "submit",
                text: "Submit",
                disabled: "!isFormChanged()",
                click: "changeDetail(editmodaldata)"
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

CSRContent.controller("ChangeEmailForm", function ($scope, $parse, UserDetailUtility) {
    

    $scope.datas = {
        field: [
            {
                type: "email",
                name: "newemail",
                size: 6,
                text: "Email",
                maxlength: 254,
                model: "emailmodaldata.email",
                required: true,
                validation: [{ value: "mandatory" }, { value: "email" }, {value: "maxlength"}]
            }
        ],
        button: [
            {
                name: "Submit",
                type: "submit",
                text: "Submit",
                disabled: "!isFormChangedEmail()",
                click: "changeEmail(emailmodaldata)"
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

CSRContent.controller('ChangeEmailFormController', function ($scope, $rootScope, $route, $http, $window, $location, ChangeUserEmail, UserDetailUtility, Notification) {

    $scope.return = function () {
        window.location.href = '/CSR/Customer/App/Admin/UserManagement';
    }

    var temp = UserDetailUtility.GetEmail();
    var tempemail = '';
    $scope.changeEmail = function (change) {
        var notvalid = "";
        if (change.email.length > 254) {
            Notification.error({
                message: '<strong>Warning!</strong> <span>Email length is too long to be saved</span>',
                positionY: 'top',
                positionX: 'center'
            });
        }
        else
        {
            tempemail = change.email;
            var updateInfoData = {
                oldemail: temp,
                newemail: change.email,
                orgid : orgid
            };
            if (updateInfoData.newemail != notvalid && updateInfoData.oldemail != notvalid) {
                ChangeUserEmail.update(updateInfoData, function (result) {
                    //console.log(result);
                    if (result.ResultCode != 2) {
                        UserDetailUtility.AddEmail(tempemail);
                        $scope.detail.email = tempemail;
                        Notification.success({
                            message: '<strong>Success!</strong> <span>User email has been changed</span>',
                            positionY: 'top',
                            positionX: 'center'
                        });
                        //setTimeout(function () {
                        //    window.location.assign('/CSR/Customer/App/Admin/UserManagement');
                        //}, 4000);
                        $('#emailModal').modal('hide');
                    }
                    else {
                        Notification.error({
                            message: '<strong>Warning!</strong> <span>Email is used by another account</span>',
                            positionY: 'top',
                            positionX: 'center'
                        });
                    }
                });
                return true;
            } else {
                return false;
            }
        }
    };
});