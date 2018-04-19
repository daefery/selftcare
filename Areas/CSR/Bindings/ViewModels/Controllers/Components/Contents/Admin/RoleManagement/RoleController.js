var roletypeid = null;

CSRContent.controller('RoleStatusForm', function ($scope, $parse) {
    $scope.datasrole = {
        field: [
            {
                type: "text",
                name: "rolename",
                size: 6,
                text: "Role_Name",
                model: "products.RoleName",
                required: true,
                maxlength: 50,
                validation: [{ value: "mandatory" }, { value: "text" }, { value: "maxlength" }]
            },
            {
                type: "radio",
                name: "radioissecure",
                size: 6,
                text: "Role_Status",
                model: "products.IsActive",
                required: false,
                style: "horizontal",
                content: [{ text: "True", value:1}, { text: "False", value:0}],
                validation: [{ value: "mandatory" }]
            }
        ],
        button: false
    };
});

CSRContent.controller('viewRoleCtrl', function ($scope, $route, $http, $window, $location, GetRolebyMVNOIdService, RoleManagementUtility, GetRoleDetailbyIdService, GetUserbyRoleIdService, GetRoleModuleTreebyId, DeleteRolebyIdService, Notification, GetModuleinTreebyParentIDService, CSRCache, CreateRoleService, GetRoleIDbyNameService, CreateRoleModuleTreeService, UpdateRoleService, ReplaceRoleModuleService, CacheAdmin, GetRoleModuleListbyRoleIdService, GetSSbyRoleService, GetAllSecureSectionService, CreateRoleSectionbyListService, GetModuleTreebyMVNOAccessService, ModuleIdbyRoleService, LocalStorageProvider, GetSecureSectionbyRoleDomainService, CSRSecureSection) {
    $scope.role = {};
    $scope.isETAKUser = false;
    $scope.isETAKUser = LocalStorageProvider.isETAKUser();

    $scope.roleSSlist = [];

    $scope.moduleparent = 2;
    $scope.roletypeid = 1;

    $scope.setmoduleparent = function (int) {
        if (int == 2) {
            $scope.moduleparent = 2;
            $scope.roletypeid = 1;
        } else if (int == 3) {
            $scope.moduleparent = 3;
            $scope.roletypeid = 2;
        }
    };

    $scope.selectedIndex = -1; // Whatever the default selected index is, use -1 for no selection

    $scope.itemClicked = function ($index) {
        $scope.selectedIndex = $index;
    };

    var roleselected = false;

    var mvnoselected = false;

    $scope.isRoleSelected = function () {
        return !(roleselected);
    }

    $scope.isMvnoSelected = function () {
        return !(mvnoselected);
    }

    $scope.ssSelection = function toggleSelection(employeeName) {
        var idx = $scope.roleSSlist.indexOf(employeeName);
        // is currently selected
        if (idx > -1) {
            $scope.roleSSlist.splice(idx, 1);
        }
            // is newly selected
        else {
            $scope.roleSSlist.push(employeeName);
        }
    };

    $scope.assignss = function () {
        var roleid = RoleManagementUtility.GetRoleid();
        var SSlist = $scope.roleSSlist;
        var data = {
            RoleId: roleid,
            SectionList : SSlist
        }
        CreateRoleSectionbyListService.save(data, function (result) {
            if (result.$status = 200) {
                Notification.success({
                    message: '<strong>Success!</strong> <span>Role secure sections has been created</span>',
                    positionY: 'top',
                    positionX: 'center'
                });
                setTimeout(function () {
                    window.location.assign('/CSR/Customer/App/Admin/RoleManagement');
                }, 4000);
            }
            else {
                Notification.error({
                    message: '<strong>Failed!</strong> <span>' + result.Messages + '.</span>',
                    positionY: 'top',
                    positionX: 'center'
                });
            }
        })
    }

    $scope.preselectednodes = [];
    $scope.showPreselected = function (node, selected) {
        $("#multi-selection-events-listing").append("+"
            + node.label + (selected ? "selected" : " deselected") + ""
            );
        //console.log('masuk preselected')
    };

    $scope.emptylist = function () {
        $scope.rolelist = [];
    };

    $scope.emptylistthenfill = function () {
        $scope.rolelist = [];
        $scope.rolelist = CSRCache.get('moduleidlistbyrole');
    };

    $scope.treeOptions = { multiSelection: true };
    $scope.selectedNodes = [];
    $scope.showSelected = function (node, selected) {
        $("#multi-selection-events-listing").append("+"
            + node.label + (selected ? "selected" : " deselected") + ""
            );
        //console.log('masuk selected');
    };
    
    $scope.treeOptions = {
        nodeChildren: "children",
        dirSelectable: true,
        injectClasses: {
            ul: "a1",
            li: "a2",
            liSelected: "a7",
            iExpanded: "a3",
            iCollapsed: "a4",
            iLeaf: "a5",
            label: "a6",
            labelSelected: "a8"
        }
    };

    $scope.filter = {};

    CacheAdmin.getallMvno().then(function (result) {
        $scope.mvnolist = result;

        result.forEach(function (e) {
            // selected index
            if (LocalStorageProvider.getMvnoid() == e.orgid) {
                $scope.filter.mvno = e.orgid;
            }
        })
    });
    var dataCache = CSRCache;
    var name = '';
    var timerRun = false;
    $scope.mvnorole = '';
    $scope.clickedroleid = '';
    $scope.csrtree = '';
    $scope.addroletree = '';
    $scope.modroletree = '';
    $scope.admintree = '';
    GetModuleinTreebyParentIDService.query({ parentId: 1 }, function (adminresult) {
        $scope.admintree = adminresult;
    });
    //GetModuleinTreebyParentIDService.query({ parentId: 2 }, function (csrresult) {
    //    $scope.csrtree = csrresult;
    //});
    
    //$scope.gettree = function () {
    //    GetModuleinTreebyParentIDService.query({ parentId: 1 }, function (adminresult) {
    //        $scope.admintree = adminresult;
    //    })
    //    GetModuleinTreebyParentIDService.query({ parentId: 2 }, function (csrresult) {
    //        $scope.csrtree = csrresult;
    //        $scope.addroletree = angular.copy(csrresult);
    //        $scope.modroletree = angular.copy(csrresult);
    //    })
    //};
    $scope.getmvnorole = function (filter) {
        $scope.addroletree = {};
        $scope.modroletree = {};
        $scope.csrtree = {};
        $scope.moduletree = {};
        $scope.allsecsec = {};
        $scope.roleusers = {};
        $scope.rolesecsec = {};
        $scope.selectedIndex = -1;
        mvnoselected = true;
        roleselected = false;
        //console.log(filter);
        RoleManagementUtility.AddEmail(filter.mvno);
        roletypeid = filter.roletypeid;
        var parentid = null;
        if ($scope.moduleparent == 2) {
            GetModuleTreebyMVNOAccessService.query({ parentId: 2, MvnoId: filter.mvno }, function (csrresult) {
                $scope.csrtree = csrresult;
                $scope.addroletree = angular.copy(csrresult);
                $scope.modroletree = angular.copy(csrresult);
            });
        } else if ($scope.moduleparent == 3) {
            GetModuleTreebyMVNOAccessService.query({ parentId: 3, MvnoId: filter.mvno }, function (csrresult) {
                $scope.csrtree = csrresult;
                $scope.addroletree = angular.copy(csrresult);
                $scope.modroletree = angular.copy(csrresult);
            });
        }
        GetRolebyMVNOIdService.query({ MvnoId: filter.mvno, TypeId: $scope.roletypeid }, function (result) {
            $scope.mvnorole = result;
        })
        //GetAllSecureSectionService.query({ ParentId: $scope.moduleparent }, function (result) {
        //    $scope.allsecsec = result;
        //});
    };
    $scope.deleterole = function () {
        var RoleID = RoleManagementUtility.GetRoleid();
        var role = {
            roleid: RoleID,
        };
        DeleteRolebyIdService.update(role, function (result) {
            if (result.$status = 200) {
                Notification.success({
                    message: '<strong>Success!</strong> <span>Role has been deleted</span>',
                    positionY: 'top',
                    positionX: 'center'
                });
                setTimeout(function () {
                    window.location.assign('/CSR/Customer/App/Admin/RoleManagement');
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
    $scope.getroleid = function (id) {
        $scope.clickedroleid = id;
        roleselected = true;
        RoleManagementUtility.AddRoleid(id);
        var temp2 = RoleManagementUtility.GetRoleid();
        GetRoleDetailbyIdService.query({ RoleID: id }, function (result) {
            $scope.products = angular.copy(result);
            $scope.temprole = angular.copy(result);
        })
        GetUserbyRoleIdService.query({ RoleID: id }, function (result) {
            $scope.roleusers = result;
        })
        GetSSbyRoleService.query({ RoleId: id }, function (result) {
            $scope.roleSSlist = [];
            $scope.rolesecsec = result;
            var data = angular.copy(result);
            if (data.length > 0) {
                for (var index = 0; index < data.length; index++) {
                    var item = data[index];
                    $scope.roleSSlist.push(item.SectionID);
                };
            }
        })
        var mvno = RoleManagementUtility.GetEmail();
        GetRoleModuleTreebyId.query({ RoleId: id, MvnoId: mvno }, function (result) {
            $scope.moduletree = result;
        })
        ModuleIdbyRoleService.query({ RoleId: id, MvnoId: mvno }, function (result) {
            CSRCache.put('moduleidlistbyrole', result);
        })
        GetSecureSectionbyRoleDomainService.query({ domainId: $scope.moduleparent, roleId: id }, function (result) {
            var data = angular.copy(result);
            for (var index = 0; index < data.length; index++) {
                var item = data[index];
                if (item.TargetModuleName == null) {
                    item.TargetModuleName = "None";
                }
            };
            $scope.allsecsec = data;
        })
    };

    $scope.rolelist = [];

    $scope.toggleSelection = function toggleSelection(employeeName) {
        //console.log(employeeName);
        if (employeeName == 2 || employeeName == 3)
        {
            var idx0 = $scope.rolelist.indexOf(employeeName);
            if (idx0 > -1) {
                $scope.rolelist.splice(idx0, 1);
            }
            else {
                $scope.rolelist.push(employeeName);
            }
        }
        else {
            var idx = $scope.rolelist.indexOf(employeeName.ModuleID);
            if (employeeName.children != null) {
                var data = angular.copy(employeeName.children);
            }
            // is currently selected
            if (idx > -1) {
                $scope.rolelist.splice(idx, 1);
                ///
                if (data.length > 0) {
                    for (var index = 0; index < data.length; index++) {
                        var item = data[index];
                        var idx2 = $scope.rolelist.indexOf(item.ModuleID);
                        if (idx2 > -1) {
                            $scope.rolelist.splice(idx2, 1);
                            ///
                            if (item.children != null) {
                                var datas2 = angular.copy(item.children);
                                if (datas2.length > 0) {
                                    for (var indexs2 = 0; indexs2 < datas2.length; indexs2++) {
                                        var items2 = datas2[indexs2];
                                        var idxs2 = $scope.rolelist.indexOf(items2.ModuleID);
                                        if (idxs2 > -1) {
                                            $scope.rolelist.splice(idxs2, 1);
                                            ///
                                            if (items2.children != null) {
                                                var datas3 = angular.copy(items2.children);
                                                if (datas3.length > 0) {
                                                    for (var indexs3 = 0; indexs3 < datas3.length; indexs3++) {
                                                        var items3 = datas3[indexs3];
                                                        var idxs3 = $scope.rolelist.indexOf(items3.ModuleID);
                                                        if (idxs3 > -1) {
                                                            $scope.rolelist.splice(idxs3, 1);
                                                            ///
                                                            if (items3.children != null) {
                                                                var datas4 = angular.copy(items3.children);
                                                                if (datas4.length > 0) {
                                                                    for (var indexs4 = 0; indexs4 < datas4.length; indexs4++) {
                                                                        var items4 = datas4[indexs4];
                                                                        var idxs4 = $scope.rolelist.indexOf(items4.ModuleID);
                                                                        if (idxs4 > -1) {
                                                                            $scope.rolelist.splice(idxs4, 1);
                                                                            ///
                                                                        }
                                                                        else {
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                        else {
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                        else {
                                        }
                                    }
                                }
                            }
                        }
                        else {
                            //console.log('');
                        }
                    };
                }
            }
            else {
                $scope.rolelist.push(employeeName.ModuleID);
                ///
                if (data.length > 0) {
                    for (var index = 0; index < data.length; index++) {
                        var item = data[index];
                        var idx2 = $scope.rolelist.indexOf(item.ModuleID);
                        if (idx2 > -1) {
                            //$scope.rolelist.splice(idx, 1);
                            //console.log('');
                        }
                        else {
                            $scope.rolelist.push(item.ModuleID);
                            ///
                            if (item.children != null) {
                                var datap2 = angular.copy(item.children);
                                if (datap2.length > 0) {
                                    for (var indexp2 = 0; indexp2 < datap2.length; indexp2++) {
                                        var itemp2 = datap2[indexp2];
                                        var idxp2 = $scope.rolelist.indexOf(itemp2.ModuleID);
                                        if (idxp2 > -1) {
                                            //$scope.rolelist.splice(idx, 1);
                                            //console.log('');
                                        }
                                        else {
                                            $scope.rolelist.push(itemp2.ModuleID);
                                            ///
                                            if (itemp2.children != null) {
                                                var datap3 = angular.copy(itemp2.children);
                                                if (datap3.length > 0) {
                                                    for (var indexp3 = 0; indexp3 < datap3.length; indexp3++) {
                                                        var itemp3 = datap3[indexp3];
                                                        var idxp3 = $scope.rolelist.indexOf(itemp3.ModuleID);
                                                        if (idxp3 > -1) {
                                                            
                                                        }
                                                        else {
                                                            $scope.rolelist.push(itemp3.ModuleID);
                                                            ///
                                                            if (itemp3.children != null) {
                                                                var datap4 = angular.copy(itemp3.children);
                                                                if (datap4.length > 0) {
                                                                    for (var indexp4 = 0; indexp4 < datap4.length; indexp4++) {
                                                                        var itemp4 = datap4[indexp4];
                                                                        var idxp4 = $scope.rolelist.indexOf(itemp4.ModuleID);
                                                                        if (idxp4 > -1) {

                                                                        }
                                                                        else {
                                                                            $scope.rolelist.push(itemp4.ModuleID);
                                                                            ///
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    };
                }
            }
        }
        //console.log($scope.rolelist);
    };

    $scope.newrolelist = [];

    $scope.newroleseletion = function newroleseletion(employeeName) {
        var idx = $scope.newrolelist.indexOf(employeeName);
        // is currently selected
        if (idx > -1) {
            $scope.newrolelist.splice(idx, 1);
        }
            // is newly selected
        else {
            $scope.newrolelist.push(employeeName);
        }
        //console.log($scope.newrolelist);
    };

    $scope.modifyrole = function (modrole) {
        if (angular.isUndefined(modrole) || modrole.RoleName == null || modrole.IsActive == null) {
            Notification.error({
                message: '<strong>Failure!</strong> <span>Role name or status is empty</span>',
                positionY: 'top',
                positionX: 'center',
                duration: 10000
            });
        }
        else
        {
            //console.log(modrole);
            var mvno = RoleManagementUtility.GetEmail();
            var nosc = /[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\@?]/g.test(modrole.RoleName);
            var name = modrole.RoleName;
            var roleid = $scope.products.RoleID;
            var isactive = false;
            if (modrole.IsActive == "1") {
                isactive = true
            }
            else {
                isactive = false
            }
            var role = {
                RoleID: roleid,
                OrgID: mvno,
                RoleName: name,
                IsActive: isactive,
                IDType: $scope.roletypeid
            };
            var list = $scope.rolelist;
            if (nosc == false) {
                UpdateRoleService.update(role, function (result) {
                    if (result.$status != 200) {
                        Notification.error({
                            message: '<strong>Failed!</strong> <span>' + result.Messages + '.</span>',
                            positionY: 'top',
                            positionX: 'center'
                        });
                    } else {
                        var modroleid = RoleManagementUtility.GetRoleid();
                        var rolemodule = {
                            RolePermissionID: 1,
                            RoleID: modroleid,
                            ModuleIDTree: list
                        }
                        ReplaceRoleModuleService.update(rolemodule, function (result) {
                            if (result.$status = 200) {
                                Notification.success({
                                    message: '<strong>Success!</strong> <span>Role has been updated</span>',
                                    positionY: 'top',
                                    positionX: 'center'
                                });
                                setTimeout(function () {
                                    window.location.assign('/CSR/Customer/App/Admin/RoleManagement');
                                }, 4000);
                            }
                            else {
                                Notification.error({
                                    message: '<strong>Failed!</strong> <span>' + result.Messages + '.</span>',
                                    positionY: 'top',
                                    positionX: 'center'
                                });
                            }
                            $('#modroleModal').modal('hide');
                        });
                    }
                });
            }
            else {
                Notification.error({
                    message: '<strong>Error!</strong> <span>Role name contain special character</span>',
                    positionY: 'top',
                    positionX: 'center'
                });
            }
        }
    }

    $scope.actrolestatus = function(status)
    {
        $scope.rolestatus = status;
    }

    $scope.createRole = function (id) {
        if (angular.isUndefined(id) || id.name == null || id.isactive == null) {
            Notification.error({
                message: '<strong>Failure!</strong> <span>Role name or status is empty</span>',
                positionY: 'top',
                positionX: 'center',
                duration: 10000
            });
        }
        else
        {
            var status = null;
            if (id.isactive == 1) {
                status = true;
            } else if (id.isactive == 0) {
                status = false;
            }
            var mvno = RoleManagementUtility.GetEmail();
            var nosc = /[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?@]/g.test(id.name);
            var name = id.name;
            var isactive = id.isactive;
            var role = {
                RoleID: 1,
                OrgID: mvno,
                RoleName: name,
                IsActive: status,
                IDType: $scope.roletypeid
            };
            //console.log(role);
            var list = $scope.rolelist;
            if (nosc == false) {
                CreateRoleService.save(role, function (result) {
                    if (result.$status != 200) {
                        Notification.error({
                            message: '<strong>Failed!</strong> <span>' + result.Messages + '.</span>',
                            positionY: 'top',
                            positionX: 'center'
                        });
                    }
                    else {
                        var mvno = RoleManagementUtility.GetEmail();
                        GetRoleIDbyNameService.query({ rolename: name, mvno: mvno, TypeId: $scope.roletypeid }, function (data) {
                            if (data.$status != 200) {
                                Notification.error({
                                    message: '<strong>Failed!</strong> <span>' + data.Messages + '.</span>',
                                    positionY: 'top',
                                    positionX: 'center'
                                });
                            }
                            else {
                                var roleid = data.RoleID;
                                var rolemodule = {
                                    RolePermissionID: 1,
                                    RoleID: roleid,
                                    ModuleIDTree: list
                                }
                                CreateRoleModuleTreeService.save(rolemodule, function (result) {
                                    if (result.$status = 200) {
                                        Notification.success({
                                            message: '<strong>Success!</strong> <span>Role has been created</span>',
                                            positionY: 'top',
                                            positionX: 'center'
                                        });
                                        setTimeout(function () {
                                            window.location.assign('/CSR/Customer/App/Admin/RoleManagement');
                                        }, 4000);
                                    }
                                    else {
                                        Notification.error({
                                            message: '<strong>Failed!</strong> <span>' + result.Messages + '.</span>',
                                            positionY: 'top',
                                            positionX: 'center'
                                        });
                                    }
                                    $('#addroleModal').modal('hide');
                                });
                            }
                        });
                    }
                });
            }
            else {
                Notification.error({
                    message: '<strong>Error!</strong> <span>Role name contain special character</span>',
                    positionY: 'top',
                    positionX: 'center'
                });
            }
        }
    };
});

CSRContent.controller("AddRoleForm", function ($scope, $parse) {
    //$scope.role = {};
    $scope.datas = {
        field: [
            {
                type: "text",
                name: "rolename",
                size: 6,
                text: "Role_Name",
                model: "role.name",
                required: true,
                maxlength: 50,
                validation: [{ value: "mandatory" }, { value: "text" }, { value: "maxlength" }]
            },
            {
                type: "radio",
                name: "radioissecure",
                size: 6,
                text: "Role_Status",
                model: "role.isactive",
                required: true,
                style: "horizontal",
                content: [{ text: "True", value: 1 }, { text: "False", value: 0 }],
                validation: [{ value: "mandatory" }]
            }
        ],
        button: false
    };
});

CSRContent.controller("ModifyRoleForm", function ($scope, $parse) {
    $scope.datas = {
        field: [
            {
                type: "text",
                name: "rolename",
                size: 6,
                text: "Role_Name",
                model: "modifyrole.name",
                required: true,
                validation: [{ value: "mandatory" }]
            },
            {
                type: "textarea",
                name: "roledescription",
                size: 6,
                text: "Role_Description",
                model: "modifyrole.description",
                required: true,
                validation: [{ value: "mandatory" }]
            },
            {
                type: "radio",
                name: "roleactive",
                size: 6,
                text: "activate_role",
                model: "modifyrole.isactive",
                required: false,
                style: "horizontal",
                content: [{ text: "Yes", value: "true" }, { text: "No", value: "false" }],
                validation: [{ value: "mandatory" }]
            }
        ],
        button: false
    };

});