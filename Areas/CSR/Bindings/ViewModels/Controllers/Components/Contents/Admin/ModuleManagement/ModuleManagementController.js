var maxmoduleposition = null;
var tempmvnosslist = [];
var tempmsecmvnosslist = [];

CSRContent.controller('ModuleManagementController', function ($scope, $filter, GetModuleinTreebyParentIDService, ModuleManagementUtility, GetModulebyIDService, GetSecureSectionbyModuleIDService, CacheAdmin, CreateMvnoModuleListService, Notification, GetMvnoAccessbyModuleIdService, GetModuleChildCountService, GetSecureSectionbyIDService, GetAllModuleService, EtakOnlyModuleService, GetSecureSectionbySectionListService, CSRSecureSection) {
    var cacheKey = 'GetModuleTree';
    var SSselected = false;

    $scope.secmvnosslist = [];

    //var iscsrchildmenu = false;
    $scope.iscsrchildmenu = false;
    $scope.editcsrchildmenu = false;

    $scope.selectedIndex = -1;
    $scope.itemClicked = function ($index) {
        $scope.selectedIndex = $index;
    };
    $scope.etakonly = [];

    EtakOnlyModuleService.query(function (result) {
        //console.log(result);
        var temp = angular.copy(result);
        for (var index = 0; index < temp.length; index++) {
            var item = result[index];
            $scope.etakonly.push(item.ModuleID);
        };
        //console.log($scope.etakonly);
    });

    $scope.SSdetails = function (sectionid) {
        GetSecureSectionbyIDService.query({ SectionID: sectionid }, function (result) {
            $scope.modssmodal = angular.copy(result);
            if (result.TargetModuleID != null) {
                GetModulebyIDService.query({ moduleId: result.TargetModuleID }, function (data) {
                    $scope.justforlabel = angular.copy(data.ModuleName);
                });
            }
            else {
                $scope.justforlabel = "None"
            }
        });
        GetSecureSectionbySectionListService.query({ SectionId: sectionid }, function (result) {
            $scope.secmvnosslist = [];
            var temp = angular.copy(result);
            for (var index = 0; index < temp.length; index++) {
                var item = result[index];
                $scope.secmvnosslist.push(item.OrgID);
            };
        })
        SSselected = true;
    };

    CacheAdmin.getallMvno().then(function (result) {
        $scope.mvnolist = result;
    });

    $scope.mvnoname = [];

    $scope.togglemvnoname = function togglemvnoname(employeeName) {
        var idx = $scope.mvnoname.indexOf(employeeName);
        // is currently selected
        if (idx > -1) {
            $scope.mvnoname.splice(idx, 1);
        }
            // is newly selected
        else {
            $scope.mvnoname.push(employeeName);
        }
    };

    var moduleselected = false;
    var enableaccandss = false;

    $scope.isModuleSelected = function () {
        return !(moduleselected);
    }

    $scope.isEnableAccandSS = function () {
        return !(enableaccandss);
    }

    $scope.isSSSelected = function () {
        return !(SSselected);
    }

    $scope.listforadd = function () {
        $scope.mvnosslist = [];
    };

    $scope.listforedit = function () {
        $scope.mvnosslist = angular.copy($scope.secmvnosslist);
    };

    $scope.listformodulemvno = function () {
        $scope.mvnosslist = angular.copy($scope.accesslist);
    }
    $scope.tempmvnoname = [];
    $scope.mvnosslist = [];
    $scope.mvnossSelection = function toggleSelection(employeeName) {
        //console.log(employeeName);
        var idx = $scope.mvnosslist.indexOf(employeeName);
        // is currently selected
        if (idx > -1) {
            $scope.mvnosslist.splice(idx, 1);
        }
            // is newly selected
        else {
            $scope.mvnosslist.push(employeeName);
        }
        //console.log($scope.mvnosslist);
        $scope.accesslist = angular.copy($scope.mvnosslist);
        tempmvnosslist = $scope.mvnosslist;
    };

    $scope.secmvnossSelection = function (employeeName) {
        var idx = $scope.secmvnosslist.indexOf(employeeName);
        // is currently selected
        if (idx > -1) {
            $scope.secmvnosslist.splice(idx, 1);
        }
            // is newly selected
        else {
            $scope.secmvnosslist.push(employeeName);
        }
        //console.log($scope.secmvnosslist);
        tempmsecmvnosslist = $scope.secmvnosslist;
    };

    $scope.accesslist = [];

    $scope.toggleSelection = function toggleSelection(employeeName) {
        var temp = ModuleManagementUtility.GetEmail();
        if ($scope.etakonly.indexOf(temp) > -1 && employeeName.orgid != 970815) {
            Notification.error({
                message: '<strong>Warning!</strong> <span>This module cannot be assigned to non-ETAK org<br /></span>',
                positionY: 'top',
                positionX: 'center'
            });
        }
        else {
            var idx = $scope.accesslist.indexOf(employeeName.orgid);
            var namex = $scope.mvnoname.indexOf(employeeName.mvnoname);
            // is currently selected
            if (idx > -1 && namex > -1) {
                $scope.accesslist.splice(idx, 1);
                $scope.mvnoname.splice(namex, 1);
            }
                // is newly selected
            else {
                $scope.accesslist.push(employeeName.orgid);
                $scope.mvnoname.push(employeeName.mvnoname);
            }
        }
        //console.log($scope.accesslist);
    };

    $scope.setmvnoaccess = function () {
        var moduleid = ModuleManagementUtility.GetEmail();
        var product = $scope.mvnolist;
        var accesslist = $scope.accesslist;
        $scope.mvnonamelist = [];
        var data = angular.copy(accesslist);
        if (data.length > 0) {
            for (var index = 0; index < data.length; index++) {
                var item = data[index];
                //console.log(item);
                var query = {
                    "orgid": item
                };
                //console.log(query);
                var temp = $filter('filter')(product, query);
                //console.log(temp);
                //$scope.fieldmvnoname = angular.copy(temp[0].mvnoname);
                $scope.mvnonamelist.push(temp[0].mvnoname);
            };
        }
        //console.log(accesslist);
        var mvnonamelist = $scope.mvnonamelist;
        var mvnomodulelist = {
            MVNOModuleID: 1,
            OrgID: accesslist,
            ModuleID: moduleid,
            MvnoName: mvnonamelist
        };
        CreateMvnoModuleListService.save(mvnomodulelist, function (result) {
            if (result.$status == 200) {
                Notification.success({
                    message: '<strong>Success!</strong> <span>The module has been created <br /></span>',
                    positionY: 'top',
                    positionX: 'center'
                });
                setTimeout(function () {
                    window.location.assign('/CSR/Customer/App/Admin/ModuleManagement');
                }, 4000);
                //return true;
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

    $scope.mvnooptions = [
        { name: 'Admin', id: 1 },
            { mvno: 'CSR', id: 2 },
            { mvno: 'Self-Care', id: 3 }
    ];
    //var parentid = 2;
    $scope.RoleList = '';
    $scope.getModuleTree = function (parentid) {
        //ModuleManagementUtility.AddTreePeak(parentid);
        GetModuleinTreebyParentIDService.query({ parentId: parentid }, function (result) {
            $scope.RoleList = result;
        });
        GetAllModuleService.query({ parentid: parentid }, function (result) {
            $scope.mvnooptions = [];
            var temp = angular.copy(result);
            for (var index = 0; index < temp.length; index++) {
                var item = result[index];
                var name = item.ModuleName;
                var tempvalue = item.ModuleID;
                var mvnoenum = {
                    name: name,
                    value: tempvalue
                }
                $scope.mvnooptions.push(mvnoenum);
            };
        });
    };

    $scope.getmodulename = function (modulename) {
        $scope.parentmodule = angular.copy(modulename);
    };

    $scope.getmoduleid = function (moduleid) {
        if (moduleid == 2 || moduleid == 3) {
            moduleselected = false;
            //if (moduleid == 2) {
            //    $scope.iscsrchildmenu = true;
            //}
            //else {
            //    $scope.iscsrchildmenu = false;
            //}
        } else {
            moduleselected = true;
        }
        enableaccandss = true;
        ModuleManagementUtility.AddEmail(moduleid);
        var temp = ModuleManagementUtility.GetEmail();
        $scope.parentmodule = angular.copy(temp);
        GetModulebyIDService.query({ moduleId: temp }, function (result) {
            $scope.module = result;
            if (result.ParentID == 2) {
                $scope.editcsrchildmenu = true;
            }
            else {
                $scope.editcsrchildmenu = false;
            }
            if (temp == 2) {
                $scope.iscsrchildmenu = true;
            } else {
                $scope.iscsrchildmenu = false;
            }
            //console.log($scope.iscsrchildmenu);
            //console.log($scope.editcsrchildmenu);
            GetModuleChildCountService.get({ parentid: result.ParentID }, function (data) {
                //console.log(data);
                $scope.maxposition = data.childcount;
                maxmoduleposition = angular.copy($scope.maxposition);
                //console.log(maxmoduleposition)
            })
        })
        GetSecureSectionbyModuleIDService.query({ ModuleId: temp }, function (data) {
            $scope.sections = data;
        })
        GetMvnoAccessbyModuleIdService.query({ ModuleID: temp }, function (mvnoaccess) {
            //console.log(temp);
            $scope.mvnoaccess = mvnoaccess;
            $scope.accesslist = [];
            $scope.mvnoname = [];
            var data = angular.copy(mvnoaccess);
            if (data.length > 0) {
                for (var index = 0; index < data.length; index++) {
                    var item = data[index];
                    $scope.accesslist.push(item.OrgID);
                    $scope.mvnoname.push(item.MvnoName);
                };
            }
        })
    };
});

CSRContent.controller('AddModuleFormController', function ($scope, $route, $http, $window, $location, ModuleManagementUtility, CreateModuleService, Notification) {
    //{
    //    "ModuleID": 1,
    //    "ParentID": 1,
    //    "PositionNumber": 1,
    //    "ModuleName": "sample string 2",
    //    "ModulePath": "sample string 3",
    //    "IconName": "sample string 4",
    //    "ModuleDescription": "sample string 5",
    //    "IsMenu": true,
    //    "IsSecure": true,
    //    "IsHotAction": true
    //}
    var notvalid = "";
    $scope.addmodule = function (newmodule) {
        var icon = null;
        if (newmodule.ModuleIcon != null) {
            icon = newmodule.ModuleIcon;
        }
        var moduledata = {
            ModuleID: 1,
            ParentID: ModuleManagementUtility.GetEmail(),
            PositionNumber: 1,
            ModuleName: newmodule.ModuleName,
            ModulePath: newmodule.ModulePath,
            IconName: icon,
            ModuleDescription: newmodule.ModuleDescription,
            IsMenu: newmodule.ismenu,
            IsSecure: newmodule.issecure,
            IsHotAction: newmodule.ishotaction,
            Translate_Key: newmodule.TranslateKey,
            UseParameter: newmodule.isuseparameter
        };
        CreateModuleService.save(moduledata, function (result) {
            if (result.$status == 200) {
                Notification.success({
                    message: '<strong>Success!</strong> <span>The module has been created <br /></span>',
                    positionY: 'top',
                    positionX: 'center'
                });
                setTimeout(function () {
                    window.location.assign('/CSR/Customer/App/Admin/ModuleManagement');
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

    };
});

CSRContent.controller('ModuleDescriptionForm', function ($scope, $parse) {
    //{
    //    "ModuleID": 1,
    //    "ParentID": 1,
    //    "PositionNumber": 1,
    //    "ModuleName": "sample string 2",
    //    "ModulePath": "sample string 3",
    //    "IconName": "sample string 4",
    //    "ModuleDescription": "sample string 5"
    //}
    $scope.datas = {
        field: [
            {
                type: "label",
                name: "viewmodulename",
                size: 6,
                text: "Module_Name",
                model: "module.ModuleName",
            },
            {
                type: "label",
                name: "viewmoduledesc",
                size: 6,
                text: "Module_Description",
                model: "module.ModuleDescription",
            }
        ],
        button: false
    };
});

CSRContent.controller('AddModuleForm', function ($scope, $parse) {
    $scope.datas = {
        field: [
            {
                type: "label",
                name: "moduleparent",
                size: 6,
                text: "Parent_Module",
                model: "parentmodule"
            },
            {
                type: "text",
                name: "modulepath",
                size: 6,
                text: "Module_Path",
                model: "newmodule.ModulePath",
                required: true,
                maxlength: 100,
                validation: [{ value: "mandatory" }, { value: "maxlength" }]
            },
            {
                type: "text",
                name: "modulename",
                size: 6,
                text: "Module_Name",
                model: "newmodule.ModuleName",
                required: true,
                maxlength: 50,
                validation: [{ value: "mandatory" }, { value: "maxlength" }, { value: "text" }]
            },
            {
                type: "text",
                name: "translatekey",
                size: 6,
                text: "Translate_Key",
                model: "newmodule.TranslateKey",
                required: true,
                maxlength: 50,
                validation: [{ value: "mandatory" }, { value: "maxlength" }, { value: "text" }]
            },
            {
                type: "textarea",
                name: "moduledescription",
                size: 6,
                text: "Module_Description",
                model: "newmodule.ModuleDescription",
                required: false,
                maxlength: 200,
                validation: [{ value: "maxlength" }]
            },
            {
                type: "radio",
                name: "radioismenu",
                size: 6,
                text: "ismodulemenu",
                model: "newmodule.ismenu",
                required: true,
                style: "horizontal",
                content: [{ text: "True", value: "true" }, { text: "False", value: "false" }],
                validation: [{ value: "mandatory" }]
            },
            {
                type: "radio",
                name: "radioishotaction",
                size: 6,
                text: "ismodulehotaction",
                model: "newmodule.ishotaction",
                required: true,
                style: "horizontal",
                content: [{ text: "True", value: "true" }, { text: "False", value: "false" }],
                validation: [{ value: "mandatory" }]
            },
            {
                type: "radio",
                name: "radioissecure",
                size: 6,
                text: "ismodulesecure",
                model: "newmodule.issecure",
                required: true,
                style: "horizontal",
                content: [{ text: "True", value: "true" }, { text: "False", value: "false" }],
                validation: [{ value: "mandatory" }]
            },
            {
                type: "radio",
                name: "radiousepara",
                size: 6,
                text: "Link_On_Sitemap",
                model: "newmodule.isuseparameter",
                required: true,
                style: "horizontal",
                content: [{ text: "True", value: "true" }, { text: "False", value: "false" }],
                validation: [{ value: "mandatory" }]
            }
        ],
        button: [
            {
                name: "Submit",
                type: "submit",
                text: "Submit",
                click: "addmodule(newmodule)"
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
CSRContent.controller('AddCSRChildModuleForm', function ($scope, $parse) {
    $scope.datas = {
        field: [
            {
                type: "label",
                name: "moduleparent",
                size: 6,
                text: "Parent_Module",
                model: "parentmodule"
            },
            {
                type: "text",
                name: "modulepath",
                size: 6,
                text: "Module_Path",
                model: "newmodule.ModulePath",
                required: true,
                maxlength: 100,
                validation: [{ value: "mandatory" }, { value: "maxlength" }]
            },
            {
                type: "text",
                name: "modulename",
                size: 6,
                text: "Module_Name",
                model: "newmodule.ModuleName",
                required: true,
                maxlength: 50,
                validation: [{ value: "mandatory" }, { value: "maxlength" }, { value: "text" }]
            },
            {
                type: "text",
                name: "moduleicon",
                size: 6,
                text: "Module_Icon",
                model: "newmodule.ModuleIcon",
                required: true,
                maxlength: 50,
                validation: [{ value: "mandatory" }, { value: "maxlength" }, { value: "text" }]
            },
            {
                type: "text",
                name: "translatekey",
                size: 6,
                text: "Translate_Key",
                model: "newmodule.TranslateKey",
                required: true,
                maxlength: 50,
                validation: [{ value: "mandatory" }, { value: "maxlength" }, { value: "text" }]
            },
            {
                type: "textarea",
                name: "moduledescription",
                size: 6,
                text: "Module_Description",
                model: "newmodule.ModuleDescription",
                required: false,
                maxlength: 200,
                validation: [{ value: "maxlength" }]
            },
            {
                type: "radio",
                name: "radioismenu",
                size: 6,
                text: "ismodulemenu",
                model: "newmodule.ismenu",
                required: true,
                style: "horizontal",
                content: [{ text: "True", value: "true" }, { text: "False", value: "false" }],
                validation: [{ value: "mandatory" }]
            },
            {
                type: "radio",
                name: "radioishotaction",
                size: 6,
                text: "ismodulehotaction",
                model: "newmodule.ishotaction",
                required: true,
                style: "horizontal",
                content: [{ text: "True", value: "true" }, { text: "False", value: "false" }],
                validation: [{ value: "mandatory" }]
            },
            {
                type: "radio",
                name: "radioissecure",
                size: 6,
                text: "ismodulesecure",
                model: "newmodule.issecure",
                required: true,
                style: "horizontal",
                content: [{ text: "True", value: "true" }, { text: "False", value: "false" }],
                validation: [{ value: "mandatory" }]
            },
            {
                type: "radio",
                name: "radiousepara",
                size: 6,
                text: "Link_On_Sitemap",
                model: "newmodule.isuseparameter",
                required: true,
                style: "horizontal",
                content: [{ text: "True", value: "true" }, { text: "False", value: "false" }],
                validation: [{ value: "mandatory" }]
            }
        ],
        button: [
            {
                name: "Submit",
                type: "submit",
                text: "Submit",
                click: "addmodule(newmodule)"
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

CSRContent.controller('ModifyModuleForm', function ($scope, $parse) {
    $scope.datas = {
        field: [
            {
                type: "text",
                name: "modulename",
                size: 6,
                text: "Module_Name",
                model: "module.ModuleName",
                required: true,
                maxlength: 50,
                validation: [{ value: "mandatory" }, { value: "maxlength" }, { value: "text" }]
            },
            {
                type: "text",
                name: "modulepath",
                size: 6,
                text: "Module_Path",
                model: "module.ModulePath",
                required: true,
                maxlength: 100,
                validation: [{ value: "mandatory" }, { value: "maxlength" }]
            },
            {
                type: "text",
                name: "translatekey",
                size: 6,
                text: "Translate_Key",
                model: "module.Translate_Key",
                required: true,
                maxlength: 100,
                validation: [{ value: "mandatory" }, { value: "maxlength" }]
            },
            {
                type: "textarea",
                name: "moduledescription",
                size: 6,
                text: "Module_Description",
                model: "module.ModuleDescription",
                required: false,
                maxlength: 200,
                validation: [{ value: "maxlength" }]
            },
            {
                type: "radio",
                name: "radioismenu",
                size: 6,
                text: "ismodulemenu",
                model: "module.IsMenu",
                required: true,
                style: "horizontal",
                content: [{ text: "True", value: 1 }, { text: "False", value: 0 }],
                validation: [{ value: "mandatory" }]
            },
            {
                type: "radio",
                name: "radioishotaction",
                size: 6,
                text: "ismodulehotaction",
                model: "module.IsHotAction",
                required: true,
                style: "horizontal",
                content: [{ text: "True", value: 1 }, { text: "False", value: 0 }],
                validation: [{ value: "mandatory" }]
            },
            {
                type: "radio",
                name: "radioissecure",
                size: 6,
                text: "ismodulesecure",
                model: "module.IsSecure",
                required: true,
                style: "horizontal",
                content: [{ text: "True", value: 1 }, { text: "False", value: 0 }],
                validation: [{ value: "mandatory" }]
            },
            {
                type: "radio",
                name: "radioisuseparam",
                size: 6,
                text: "Link_On_Sitemap",
                model: "module.UseParameter",
                required: true,
                style: "horizontal",
                content: [{ text: "True", value: 1 }, { text: "False", value: 0 }],
                validation: [{ value: "mandatory" }]
            }
        ],
        button: [
            {
                name: "Submit",
                type: "submit",
                text: "Submit",
                click: "modifymodule(module)"
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
CSRContent.controller('ModifyCSRChildModuleForm', function ($scope, $parse) {
    $scope.datas = {
        field: [
            {
                type: "text",
                name: "modulename",
                size: 6,
                text: "Module_Name",
                model: "module.ModuleName",
                required: true,
                maxlength: 50,
                validation: [{ value: "mandatory" }, { value: "maxlength" }, { value: "text" }]
            },
            {
                type: "text",
                name: "moduleicon",
                size: 6,
                text: "Module_Icon",
                model: "module.IconName",
                required: true,
                maxlength: 50,
                validation: [{ value: "mandatory" }, { value: "maxlength" }, { value: "text" }]
            },
            {
                type: "text",
                name: "modulepath",
                size: 6,
                text: "Module_Path",
                model: "module.ModulePath",
                required: true,
                maxlength: 100,
                validation: [{ value: "mandatory" }, { value: "maxlength" }]
            },
            {
                type: "text",
                name: "translatekey",
                size: 6,
                text: "Translate_Key",
                model: "module.Translate_Key",
                required: true,
                maxlength: 100,
                validation: [{ value: "maxlength" }]
            },
            {
                type: "textarea",
                name: "moduledescription",
                size: 6,
                text: "Module_Description",
                model: "module.ModuleDescription",
                required: false,
                maxlength: 200,
                validation: [{ value: "maxlength" }]
            },
            {
                type: "radio",
                name: "radioismenu",
                size: 6,
                text: "ismodulemenu",
                model: "module.IsMenu",
                required: true,
                style: "horizontal",
                content: [{ text: "True", value: 1 }, { text: "False", value: 0 }],
                validation: [{ value: "mandatory" }]
            },
            {
                type: "radio",
                name: "radioishotaction",
                size: 6,
                text: "ismodulehotaction",
                model: "module.IsHotAction",
                required: true,
                style: "horizontal",
                content: [{ text: "True", value: 1 }, { text: "False", value: 0 }],
                validation: [{ value: "mandatory" }]
            },
            {
                type: "radio",
                name: "radioissecure",
                size: 6,
                text: "ismodulesecure",
                model: "module.IsSecure",
                required: true,
                style: "horizontal",
                content: [{ text: "True", value: 1 }, { text: "False", value: 0 }],
                validation: [{ value: "mandatory" }]
            },
            {
                type: "radio",
                name: "radioisuseparam",
                size: 6,
                text: "Link_On_Sitemap",
                model: "module.UseParameter",
                required: true,
                style: "horizontal",
                content: [{ text: "True", value: 1 }, { text: "False", value: 0 }],
                validation: [{ value: "mandatory" }]
            }
        ],
        button: [
            {
                name: "Submit",
                type: "submit",
                text: "Submit",
                click: "modifymodule(module)"
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

CSRContent.controller('ModifyModuleFormController', function ($scope, $route, $http, $window, $location, ModuleManagementUtility, UpdateModuleService, Notification) {
    //{
    //    "ModuleID": 1,
    //    "ParentID": 1,
    //    "PositionNumber": 1,
    //    "ModuleName": "sample string 2",
    //    "ModulePath": "sample string 3",
    //    "IconName": "sample string 4",
    //    "ModuleDescription": "sample string 5"
    //}

    var notvalid = "";
    $scope.modifymodule = function (newmodule) {
        var icon = null;
        if (newmodule.IconName != null) {
            icon = newmodule.IconName;
        }
        if (newmodule.IsMenu == "1") {
            newmodule.IsMenu = true
        }
        else {
            newmodule.IsMenu = false
        }
        if (newmodule.IsSecure == "1") {
            newmodule.IsSecure = true
        }
        else {
            newmodule.IsSecure = false
        }
        if (newmodule.IsHotAction == "1") {
            newmodule.IsHotAction = true
        }
        else {
            newmodule.IsHotAction = false
        }
        if (newmodule.UseParameter == "1") {
            newmodule.UseParameter = true
        } else { newmodule.UseParameter = false }
        //console.log(newmodule);
        var moduledata = {
            ModuleID: $scope.module.ModuleID,
            ParentID: $scope.module.ParentID,
            PositionNumber: $scope.module.PositionNumber,
            ModuleName: newmodule.ModuleName,
            ModulePath: newmodule.ModulePath,
            IconName: icon,
            ModuleDescription: newmodule.ModuleDescription,
            IsMenu: newmodule.IsMenu,
            IsSecure: newmodule.IsSecure,
            IsHotAction: newmodule.IsHotAction,
            Translate_Key: newmodule.Translate_Key,
            UseParameter: newmodule.UseParameter
        };
        UpdateModuleService.update(moduledata, function (result) {
            if (result.$status == 200) {
                Notification.success({
                    message: '<strong>Success!</strong> <span>The module has been updated <br /></span>',
                    positionY: 'top',
                    positionX: 'center'
                });
                setTimeout(function () {
                    window.location.assign('/CSR/Customer/App/Admin/ModuleManagement');
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

    };
});

CSRContent.controller('MoveModuleForm', function ($scope, $parse) {
    $scope.datas = {
        field: [
            {
                type: "number",
                name: "modulename",
                size: 6,
                text: "Set_New_Position",
                model: "module.PositionNumber",
                required: true,
                validation: [{ value: "mandatory" }, { value: "number" }]
            }
        ],
        button: [
            {
                name: "Submit",
                type: "submit",
                text: "Submit",
                click: "movemodule(module)"
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

CSRContent.controller('MoveModuleFormController', function ($scope, $route, $http, $window, $location, ModuleManagementUtility, MoveModuleService, Notification) {
    //{
    //    "ModuleID": 1,
    //    "ParentID": 1,
    //    "PositionNumber": 1,
    //    "ModuleName": "sample string 2",
    //    "ModulePath": "sample string 3",
    //    "IconName": "sample string 4",
    //    "ModuleDescription": "sample string 5"
    //}
    var notvalid = "";
    $scope.movemodule = function (movemodule) {
        var moduledata = {
            ModuleID: $scope.module.ModuleID,
            ParentID: $scope.module.ParentID,
            PositionNumber: movemodule.PositionNumber,
            ModuleName: $scope.module.ModuleName,
            ModulePath: $scope.module.ModulePath,
            IconName: $scope.module.IconName,
            ModuleDescription: $scope.module.ModuleDescription,
            IsMenu: $scope.module.IsMenu,
            IsSecure: $scope.module.IsSecure,
            IsHotAction: $scope.module.IsHotAction,
            Translate_Key: $scope.module.Translate_Key,
            UseParameter: $scope.module.UseParameter
        };
        var maxpos = maxmoduleposition;
        //console.log(movemodule.PositionNumber);
        //console.log(maxpos);
        if (0 < movemodule.PositionNumber && movemodule.PositionNumber <= maxpos) {
            MoveModuleService.update(moduledata, function (result) {
                if (result.$status == 200) {
                    Notification.success({
                        message: '<strong>Success!</strong> <span>The module position has been updated <br /></span>',
                        positionY: 'top',
                        positionX: 'center'
                    });
                    setTimeout(function () {
                        window.location.assign('/CSR/Customer/App/Admin/ModuleManagement');
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
                message: '<strong>Failure!</strong> <span>New module position is not valid <br /></span>',
                positionY: 'top',
                positionX: 'center'
            });
        }
    };
});

CSRContent.controller('AddSecureSecForm', function ($scope, $parse) {
    $scope.section = {};
    $scope.datas = {
        field: [
            {
                type: "text",
                name: "sectionkey",
                size: 6,
                text: "Section_Key",
                model: "section.SectionKey",
                maxlength: 50,
                required: true,
                validation: [{ value: "mandatory" }, { value: "text" }, { value: "maxlength" }]
            },
            {
                type: "text",
                name: "sectionname",
                size: 6,
                text: "Section_Name",
                model: "section.SectionName",
                maxlength: 50,
                required: true,
                validation: [{ value: "mandatory" }, { value: "text" }, { value: "maxlength" }]
            },
            {
                type: "select",
                name: "usermvno",
                size: 6,
                text: "Target_Module",
                model: "section.TargetModuleID",
                value: "mvnooptions",
                required: false,
                validation: [{ value: "mandatory" }]
            }
        ],
        button: [
            {
                name: "Submit",
                type: "submit",
                text: "Submit",
                click: "addsection(section)"
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

CSRContent.controller('AddSecureSecFormController', function ($scope, $route, $http, $window, $location, ModuleManagementUtility, CreateSecureSectionService, Notification, CacheAdmin, GetAllModuleService, CreateMVNOSecureSectionService) {
    var notvalid = "";
    $scope.addsection = function (section) {
        var targetmodule = null;
        if (section.TargetModuleID != null) {
            targetmodule = section.TargetModuleID.value;
        }
        var sectiondata = {
            SectionID: 1,
            ModuleID: $scope.module.ModuleID,
            SectionKey: section.SectionKey,
            SectionName: section.SectionName,
            TargetModuleID: targetmodule,
        };
        CreateSecureSectionService.save(sectiondata, function (result) {
            if (result.$status == 200) {
                //Notification.success({
                //    message: '<strong>Success!</strong> <span>The section has been created <br /></span>',
                //    positionY: 'top',
                //    positionX: 'center'
                //});
                var mvnosslist = tempmvnosslist;
                var mvnosecsec = {
                    MVNOSectionID: 1,
                    OrgId: mvnosslist,
                    SectionID: 1,
                    SectionName: section.SectionName,
                    SectionKey: section.SectionKey,
                    ModuleID: $scope.module.ModuleID
                }
                //console.log(mvnosecsec);
                //return false;
                CreateMVNOSecureSectionService.save(mvnosecsec, function (result) {
                    if (result.$status == 200) {
                        Notification.success({
                            message: '<strong>Success!</strong> <span>The section has been created <br /></span>',
                            positionY: 'top',
                            positionX: 'center'
                        });
                        setTimeout(function () {
                            window.location.assign('/CSR/Customer/App/Admin/ModuleManagement');
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

            }
            else
                Notification.error({
                    message: '<strong>Failed!</strong> <span>' + result.Messages + '.</span>',
                    positionY: 'top',
                    positionX: 'center'
                });
        });

    };
});

CSRContent.controller('ModSecureSecForm', function ($scope, $parse, UpdateSecureSectionService, Notification, DeleteSecureSectionService, UpdateMVNOSecureSectionService) {
    $scope.updateSS = function (update) {
        var targetmodule = null;
        if (update.TargetModuleID != null) {
            targetmodule = update.TargetModuleID.value;
        }
        var secsec = {
            SectionID: $scope.modssmodal.SectionID,
            ModuleID: $scope.modssmodal.ModuleID,
            SectionKey: update.SectionKey,
            SectionName: update.SectionName,
            TargetModuleID: targetmodule
        };
        UpdateSecureSectionService.update(secsec, function (result) {
            if (result.$status == 200) {
                var mvnolist = tempmvnosslist;
                var mvnosecsec = {
                    MVNOSectionID: 1,
                    OrgId: mvnolist,
                    SectionID: $scope.modssmodal.SectionID,
                    SectionName: update.SectionName,
                    SectionKey: update.SectionKey,
                    ModuleID: $scope.modssmodal.ModuleID
                }
                UpdateMVNOSecureSectionService.update(mvnosecsec, function (result) {
                    if (result.$status == 200) {
                        Notification.success({
                            message: '<strong>Success!</strong> <span>The section has been updated <br /></span>',
                            positionY: 'top',
                            positionX: 'center'
                        });
                        setTimeout(function () {
                            window.location.assign('/CSR/Customer/App/Admin/ModuleManagement');
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
            }
            else
                Notification.error({
                    message: '<strong>Failed!</strong> <span>' + result.Messages + '.</span>',
                    positionY: 'top',
                    positionX: 'center'
                });
        });
    };

    $scope.deleteSS = function () {
        //console.log($scope.modssmodal.SectionID);
        var SectionID = $scope.modssmodal.SectionID;
        //console.log(SectionID);
        var secsec = {
            SectionID: $scope.modssmodal.SectionID,
            ModuleID: $scope.modssmodal.ModuleID,
            SectionKey: $scope.modssmodal.SectionKey,
            SectionName: $scope.modssmodal.SectionName,
            TargetModuleID: $scope.modssmodal.TargetModuleID
        };
        DeleteSecureSectionService.update(secsec, function (result) {
            if (result.$status == 200) {
                Notification.success({
                    message: '<strong>Success!</strong> <span>The section has been deleted <br /></span>',
                    positionY: 'top',
                    positionX: 'center'
                });
                setTimeout(function () {
                    window.location.assign('/CSR/Customer/App/Admin/ModuleManagement');
                }, 4000);
            }
            else
                Notification.error({
                    message: '<strong>Failed!</strong> <span>' + result.Messages + '.</span>',
                    positionY: 'top',
                    positionX: 'center'
                });
        })
    }

    $scope.datas = {
        field: [
            {
                type: "text",
                name: "sectionkey",
                size: 6,
                text: "Section_Key",
                model: "modssmodal.SectionKey",
                maxlength: 50,
                required: true,
                validation: [{ value: "mandatory" }, { value: "text" }, { value: "maxlength" }]
            },
            {
                type: "text",
                name: "sectionname",
                size: 6,
                text: "Section_Name",
                model: "modssmodal.SectionName",
                maxlength: 50,
                required: true,
                validation: [{ value: "mandatory" }, { value: "text" }, { value: "maxlength" }]
            },
            {
                type: "label",
                name: "viewmodulename",
                size: 6,
                text: "Old_Target_Module",
                model: "justforlabel",
            },
            {
                type: "select",
                name: "usermvno",
                size: 6,
                text: "New_Target_Module",
                model: "modssmodal.TargetModuleID",
                value: "mvnooptions",
                required: false,
                validation: [{ value: "mandatory" }]
            }
        ],
        button: [
            {
                name: "Submit",
                type: "submit",
                text: "Submit",
                click: "updateSS(modssmodal)"
            },
            {
                name: "Submit",
                type: "submit",
                text: "Remove",
                click: "deleteSS()"
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