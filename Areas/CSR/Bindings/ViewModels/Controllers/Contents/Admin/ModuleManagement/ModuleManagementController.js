var maxmoduleposition = null;
var tempmvnosslist = [];
var tempmsecmvnosslist = [];
var ifcsr = null;
var resetValue;
var resetSecureSection;

CSRContent.controller('ModuleManagementController', function ($scope, $rootScope, $filter, GetModuleinTreebyParentIDService, ModuleManagementUtility, GetModulebyIDService, GetSecureSectionbyModuleIDService, CacheAdmin, CreateMvnoModuleListService, Notification, GetMvnoAccessbyModuleIdService, GetModuleChildCountService, GetSecureSectionbyIDService, GetAllModuleService, EtakOnlyModuleService, GetSecureSectionbySectionListService, CSRSecureSection) {

    $scope.isMvnoAccessChanged = function () {
        var temp = []; 
        if ($scope.accesslist != null) {
            temp = angular.copy($scope.accesslist);
        }
        var temp2 = [];
        if ($scope.oldaccesslist != null){temp2 = angular.copy($scope.oldaccesslist);}
        var result = 0;
        var containall = true;
        for (var index = 0; index < temp.length; index++) {
            var item = temp[index];
            if(temp2.indexOf(item) !== -1) {
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

    resetValue = function () {
        SSselected = false;
        $scope.secmvnosslist = [];
        $scope.iscsrchildmenu = false;
        $scope.editcsrchildmenu = false;
        $scope.selectedIndex = -1;
        $scope.mvnoname = [];
        $scope.module = {};
        $scope.oldmoduledata = {};
        $scope.mvnoaccess = [];
        moduleselected = false;
        enableaccandss = false;
        $scope.tempmvnoname = [];
        $scope.mvnosslist = [];
        $scope.accesslist = [];
        $scope.RoleList = '';
        $scope.sections = [];
        GetModuleinTreebyParentIDService.query({ parentId: ifcsr }, function (result) {
            $scope.RoleList = result;
            //ifcsr = ifcsr;
        });
    }

    $scope.oldmoduledata = {};
    $scope.module = {};

    resetSecureSection = function () {

    }

    var cacheKey = 'GetModuleTree';
    var SSselected = false;

    $scope.secmvnosslist = [];

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
            $scope.oldssdetail = angular.copy(result);
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
            $scope.oldmvnosslist = [];
            var temp = angular.copy(result);
            for (var index = 0; index < temp.length; index++) {
                var item = result[index];
                $scope.secmvnosslist.push(item.OrgID);
                $scope.oldmvnosslist.push(item.OrgID);
                
            };
            tempmvnosslist = angular.copy($scope.secmvnosslist);
        })
        SSselected = true;
        //tempmvnosslist = angular.copy($scope.secmvnosslist);
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
        var idx = $scope.mvnosslist.indexOf(employeeName);
        // is currently selected
        if (idx > -1) {
            $scope.mvnosslist.splice(idx, 1);
        }
            // is newly selected
        else {
            $scope.mvnosslist.push(employeeName);
        }
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
                var query = {
                    "orgid": item
                };
                var temp = $filter('filter')(product, query);
                $scope.mvnonamelist.push(temp[0].mvnoname);
            };
        }
        var mvnonamelist = $scope.mvnonamelist;
        var mvnomodulelist = {
            MVNOModuleID: 1,
            OrgID: accesslist,
            ModuleID: moduleid,
            MvnoName: mvnonamelist
        };
        CreateMvnoModuleListService.save(mvnomodulelist, function (result) {
            if (result.$status == 200) {
                $('#mvnoaccModal').modal('hide');
                Notification.success({
                    message: '<strong>Success!</strong> <span>The module has been created <br /></span>',
                    positionY: 'top',
                    positionX: 'center'
                });
                resetValue();
                //setTimeout(function () {
                //    window.location.assign('/CSR/Customer/App/Admin/ModuleManagement');
                //}, 4000);
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
            ifcsr = parentid;
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
        $scope.selectedIndex = -1;
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
        SSselected = false;
        enableaccandss = true;
        ModuleManagementUtility.AddEmail(moduleid);
        var temp = ModuleManagementUtility.GetEmail();
        $scope.parentmodule = angular.copy(temp);
        GetModulebyIDService.query({ moduleId: temp }, function (result) {
            $scope.module = result;
            $scope.oldmoduledata = angular.copy(result);
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
            GetModuleChildCountService.get({ parentid: result.ParentID }, function (data) {
                $scope.maxposition = data.childcount;
                maxmoduleposition = angular.copy($scope.maxposition);
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
            $scope.oldaccesslist = [];
            var data = angular.copy(mvnoaccess);
            if (data.length > 0) {
                for (var index = 0; index < data.length; index++) {
                    var item = data[index];
                    $scope.accesslist.push(item.OrgID);
                    $scope.mvnoname.push(item.MvnoName);
                    $scope.oldaccesslist.push(item.OrgID);
                };
                var var2 = $scope.accesslist;
                $scope.mvnolist.forEach(function (e) {
                    var result = false;
                    if (var2.indexOf(e.orgid) > -1) {
                        result = true;
                    }
                    e.showcheckbox = result;
                });
            }
        })
    };
});

CSRContent.controller('AddModuleFormController', function ($scope, $rootScope, $route, $http, $window, $location, ModuleManagementUtility, CreateModuleService, Notification) {
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
                if (ifcsr == 2) {
                    $rootScope.$broadcast('refresh.csr.mainmenu', true);
                }
                $('#addmodModal').modal('hide');
                resetValue();
                //setTimeout(function () {
                //    window.location.assign('/CSR/Customer/App/Admin/ModuleManagement');
                //}, 4000);
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

CSRContent.controller('ModuleDescriptionForm', function ($scope, $rootScope, $parse) {
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

CSRContent.controller('AddModuleForm', function ($scope, $rootScope, $parse) {
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
                content: [{ text: "True", value: "false" }, { text: "False", value: "true" }],
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
CSRContent.controller('AddCSRChildModuleForm', function ($scope, $rootScope, $parse) {
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
                content: [{ text: "True", value: "false" }, { text: "False", value: "true" }],
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

CSRContent.controller('ModifyModuleForm', function ($scope, $rootScope, $parse) {
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
                content: [{ text: "True", value: 0 }, { text: "False", value: 1 }],
                validation: [{ value: "mandatory" }]
            }
        ],
        button: [
            {
                name: "Submit",
                type: "submit",
                text: "Submit",
                disabled: "!isFormChanged()",
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
CSRContent.controller('ModifyCSRChildModuleForm', function ($scope, $rootScope, $parse) {
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
                content: [{ text: "True", value: 0 }, { text: "False", value: 1 }],
                validation: [{ value: "mandatory" }]
            }
        ],
        button: [
            {
                name: "Submit",
                type: "submit",
                text: "Submit",
                disabled: "!isFormChanged()",
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

CSRContent.controller('ModifyModuleFormController', function ($scope, $rootScope, $route, $http, $window, $location, ModuleManagementUtility, UpdateModuleService, Notification) {
    //{
    //    "ModuleID": 1,
    //    "ParentID": 1,
    //    "PositionNumber": 1,
    //    "ModuleName": "sample string 2",
    //    "ModulePath": "sample string 3",
    //    "IconName": "sample string 4",
    //    "ModuleDescription": "sample string 5"
    //}

    $scope.isFormChanged = function () {
        $scope.tempmodaldata = {};
        $scope.tempmodaldata = $scope.module;
        if ($scope.tempmodaldata.IsMenu == "1") {
            $scope.tempmodaldata.IsMenu = true
        }
        else {
            $scope.tempmodaldata.IsMenu = false
        }
        if ($scope.tempmodaldata.IsSecure == "1") {
            $scope.tempmodaldata.IsSecure = true
        }
        else {
            $scope.tempmodaldata.IsSecure = false
        }
        if ($scope.tempmodaldata.IsHotAction == "1") {
            $scope.tempmodaldata.IsHotAction = true
        }
        else {
            $scope.tempmodaldata.IsHotAction = false
        }
        if ($scope.tempmodaldata.UseParameter == "1") {
            $scope.tempmodaldata.UseParameter = true
        } else { $scope.tempmodaldata.UseParameter = false }
        return !angular.equals($scope.oldmoduledata, $scope.module);
    };

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
                if (ifcsr == 2) {
                    $rootScope.$broadcast('refresh.csr.mainmenu', true);
                }
                $('#modmodModal').modal('hide');
                resetValue();
                //setTimeout(function () {
                //    window.location.assign('/CSR/Customer/App/Admin/ModuleManagement');
                //}, 4000);
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

CSRContent.controller('MoveModuleForm', function ($scope, $rootScope, $parse) {
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
                disabled: "!isPositionChanged()",
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

CSRContent.controller('MoveModuleFormController', function ($scope,$rootScope, $route, $http, $window, $location, ModuleManagementUtility, MoveModuleService, Notification) {
    //{
    //    "ModuleID": 1,
    //    "ParentID": 1,
    //    "PositionNumber": 1,
    //    "ModuleName": "sample string 2",
    //    "ModulePath": "sample string 3",
    //    "IconName": "sample string 4",
    //    "ModuleDescription": "sample string 5"
    //}

    $scope.isPositionChanged = function () {
        return !angular.equals($scope.oldmoduledata.PositionNumber, $scope.module.PositionNumber);
    };

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
                    if (ifcsr == 2) {
                        $rootScope.$broadcast('refresh.csr.mainmenu', true);
                    }
                    resetValue();
                    $('#movemodModal').modal('hide');
                    //setTimeout(function () {
                    //    window.location.assign('/CSR/Customer/App/Admin/ModuleManagement');
                    //}, 4000);
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

CSRContent.controller('AddSecureSecForm', function ($scope, $rootScope, $parse) {
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

CSRContent.controller('AddSecureSecFormController', function ($scope, $rootScope, $route, $http, $window, $location, ModuleManagementUtility, CreateSecureSectionService, Notification, CacheAdmin, GetAllModuleService, CreateMVNOSecureSectionService) {
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
                var mvnosslist = tempmvnosslist;
                var mvnosecsec = {
                    MVNOSectionID: 1,
                    OrgId: mvnosslist,
                    SectionID: 1,
                    SectionName: section.SectionName,
                    SectionKey: section.SectionKey,
                    ModuleID: $scope.module.ModuleID
                }
                CreateMVNOSecureSectionService.save(mvnosecsec, function (result) {
                    if (result.$status == 200) {
                        Notification.success({
                            message: '<strong>Success!</strong> <span>The section has been created <br /></span>',
                            positionY: 'top',
                            positionX: 'center'
                        });
                        $('#secsecModal').modal('hide');
                        if (ifcsr == 2) {
                            $rootScope.$broadcast('refresh.csr.securesection', true);
                        }
                        resetValue();
                        //setTimeout(function () {
                        //    window.location.assign('/CSR/Customer/App/Admin/ModuleManagement');
                        //}, 4000);
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

CSRContent.controller('ModSecureSecForm', function ($scope, $rootScope, $parse, UpdateSecureSectionService, Notification, DeleteSecureSectionService, UpdateMVNOSecureSectionService) {

    $scope.isSSChanged = function () {
        return !angular.equals($scope.modssmodal, $scope.oldssdetail) || !angular.equals($scope.oldmvnosslist, tempmvnosslist);
    };

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
                        $('#modSSModal').modal('hide');
                        if (ifcsr == 2) {
                            $rootScope.$broadcast('refresh.csr.securesection', true);
                        }
                        resetValue();
                        //setTimeout(function () {
                        //    window.location.assign('/CSR/Customer/App/Admin/ModuleManagement');
                        //}, 4000);
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
                $('#modSSModal').modal('hide');
                if (ifcsr == 2){
                    $rootScope.$broadcast('refresh.csr.securesection', true);
                }
                resetValue();
                //setTimeout(function () {
                //    window.location.assign('/CSR/Customer/App/Admin/ModuleManagement');
                //}, 4000);
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
                disabled: "!isSSChanged()",
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

CSRContent.controller('Testing1Controller', function ($scope, $rootScope, $parse) {
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
});

CSRContent.controller('Testing2Controller', function ($scope, $rootScope, $parse) {
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
});