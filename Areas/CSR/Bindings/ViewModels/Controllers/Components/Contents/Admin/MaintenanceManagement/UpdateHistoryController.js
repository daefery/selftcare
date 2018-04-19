CSRContent.controller('UpdateHistoryController', function ($scope, $filter, GetAllUpdateHistory, RemoveUpdateHistory, Notification, GetAllMVNOService, CacheAdmin) {
    $scope.currentPage = 1;
    $scope.isUpdateSelected = true;
    $scope.listOrgid = [];
    $scope.selection = [];
    $scope.selectionforedit = [];
    $scope.accesslist = [];

    //funtion for iterate checkbox
    $scope.toggleSelection = function toggleSelection(item) {
        var idx = $scope.selection.indexOf(item);

        // is currently selected
        if (idx > -1) {
            $scope.selection.splice(idx, 1);
        }

            // is newly selected
        else {
            $scope.selection.push(item);
        }
        //console.log($scope.selection);
    };

    //funtion for iterate checkbox
    $scope.toggleSelectionforedit = function toggleSelectionforedit(item) {
        var idx = $scope.selectionforedit.indexOf(item);

        // is currently selected
        if (idx > -1) {
            $scope.selectionforedit.splice(idx, 1);
        }

            // is newly selected
        else {
            $scope.selectionforedit.push(item);
        }
        //console.log($scope.selectionforedit);
    };

    // get all mvno
    CacheAdmin.getallMvno().then(function (result) {
        result.forEach(function (e) {
            temp = { text: e.mvnoname, value: e.orgid };
            $scope.listOrgid.push(temp);
            //console.log($scope.listOrgid);
        });
    });    

    //get all update history data
    GetAllUpdateHistory.query({}, function (result) {

        result.MaintenanceInfo.forEach(function (e) {
            e.MaintenanceDate = moment(e.MaintenanceDate).format(config.DateFormatMoment);
        })

        $scope.allUpdateHistory = angular.copy(result.MaintenanceInfo);
    });

    //funtion sort
    $scope.sort = function (keyname) {
        $scope.sortkey = keyname;
        $scope.reverse = !$scope.reverse;
        $scope.allUpdateHistory.MaintenanceInfo = $filter('orderBy')($scope.allUpdateHistory.MaintenanceInfo, keyname, $scope.reverse);
    };

    //funtion convert mvnoid to mvnoname for view
    $scope.mvnoconvert = function (orgId) {
        console.log($scope.listOrgid);
        console.log(orgId);
        temp = $filter('filter')($scope.listOrgid, { "value": orgId }, true);
        if (temp.length == 0) return "unknown";
        else {
            return temp[0].text;
        }
    }

    //get update history for specifix maintenanceinfo id
    $scope.getMaintenanceInfo = function (item) {
        $scope.accesslist = [];
        $scope.selectionforedit = [];
        $scope.selectedRow = item.MaintenanceInfoID;
        $scope.isUpdateSelected = false;
        $scope.MaintenanceInfo = item;
        $scope.modupdatehistory = angular.copy($scope.MaintenanceInfo);
        $scope.remupdatehistory = angular.copy($scope.MaintenanceInfo);
        angular.copy($scope.MaintenanceInfo.MaintenanceInfoMVNOes).forEach(function (e) {
            $scope.accesslist.push(e.OrgID);
            $scope.selectionforedit.push(e.OrgID);
        });
    };

    // remove update history
    $scope.removeupdatehistory = function () {
        var maintenanceinfoid = $scope.remupdatehistory.MaintenanceInfoID;
        RemoveUpdateHistory.remove({ MaintenanceInfoID: maintenanceinfoid }, function (result) {
            if (result.$status == 200) {
                Notification.success({
                    message: '<strong>Success!</strong> <span>Update History has been deleted <br /></span>',
                    positionY: 'top',
                    positionX: 'center'
                });
                setTimeout(function () {
                    window.location.assign('/CSR/Customer/App/Admin/UpdateHistory');
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
});

CSRContent.controller('AddUpdateHistoryFormController', function ($scope, $route, $http, $window, $location, CreateUpdateHistory, Notification) {
    $scope.datas = {
        field: [
            //{
            //    type: "checkbox",
            //    name: "affectedmvnos",
            //    size: 6,
            //    text: "Affected_MVNOs",
            //    model: "newupdatehistory.MaintenanceInfoMVNOes",
            //    required: false,
            //    style: "horizontal",
            //    content: $scope.listOrgid,
            //    validation: [{ value: "mandatory" }]
            //},
            {
                type: "text",
                name: "updatesversion",
                size: 6,
                text: "Updates_Version",
                model: "newupdatehistory.Description",
                required: true,
                maxlength: 50,
                validation: [{ value: "maxlength" }]
            },
            {
                type: "date",
                name: "releasedate",
                size: 6,
                text: "Release_Date",
                model: "newupdatehistory.MaintenanceDate",
                required: true
            },
            {
                type: "text",
                name: "shortupdatedescription",
                size: 6,
                text: "Short_Update_Description",
                model: "newupdatehistory.Detail",
                required: true,
                maxlength: 500,
                validation: [{ value: "mandatory" }, { value: "maxlength" }, { value: "text" }]
            },
            {
                type: "text",
                name: "fulldetailupdate",
                size: 6,
                text: "Full_Detail_Update",
                model: "newupdatehistory.URLReference",
                required: false,
                maxlength: 150,
                validation: [{ value: "mandatory" }, { value: "maxlength" }, { value: "text" }]
            }
        ],
        button: [
            {
                name: "Submit",
                type: "submit",
                text: "Submit",
                click: "addupdatehistory(newupdatehistory)"
            },
            {
                name: "Cancel",
                type: "cancel",
                text: "Cancel",
                click: "modal"
            }
        ]
    };

    setTimeout(function () {
        datepicker();
    }, 1000);

    var notvalid = "";
    $scope.addupdatehistory = function (newupdatehistory) {
        var update = {
            MaintenanceInfoID: 1,
            MaintenanceType: 2,
            MaintenanceDate: newupdatehistory.MaintenanceDate,
            MaintenanceDuration: null,
            Description: newupdatehistory.Description,
            Detail: newupdatehistory.Detail,
            URLReference: newupdatehistory.URLReference,
            CreatedDate: null,
            CreatedBy: 3, //Hardcode
            MaintenanceInfoMVNOes: []
        };
        $scope.selection.forEach(function (e) {
            temp = { OrgID: e.value };
            update.MaintenanceInfoMVNOes.push(temp);
        });

        CreateUpdateHistory.save(update, function (result) {
            if (result.ResultType == 0 && result.ResultCode == 0) {
                Notification.success({
                    message: '<strong>Success!</strong> <span>Update History has been created <br /></span>',
                    positionY: 'top',
                    positionX: 'center'
                });
                setTimeout(function () {
                    window.location.assign('/CSR/Customer/App/Admin/UpdateHistory');
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

CSRContent.controller('ModifyUpdateHistoryFormController', function ($scope, $route, $http, $window, $location, EditUpdateHistory, Notification) {
    $scope.datas = {
        field: [
            //{
            //    type: "checkbox",
            //    name: "affectedmvnos",
            //    size: 6,
            //    text: "Affected_MVNOs",
            //    model: "modupdatehistory.MaintenanceInfoMVNOes",
            //    required: false,
            //    style: "horizontal",
            //    content: [{ text: "ETNA", value: 999999 }, { text: "LOWI", value: 970100 }],
            //    //validation: [{ value: "mandatory" }]
            //},
            {
                type: "label",
                name: "updatesversion",
                size: 6,
                text: "Updates_Version",
                model: "modupdatehistory.Description",
            },
            {
                type: "label",
                name: "releasedate",
                size: 6,
                text: "Release_Date",
                model: "modupdatehistory.MaintenanceDate",
            },
            {
                type: "text",
                name: "shortupdatedescription",
                size: 6,
                text: "Short_Update_Description",
                model: "modupdatehistory.Detail",
                required: true,
                maxlength: 500,
                validation: [{ value: "mandatory" }, { value: "maxlength" }, { value: "text" }]
            },
            {
                type: "text",
                name: "fulldetailupdate",
                size: 6,
                text: "Full_Detail_Update",
                model: "modupdatehistory.URLReference",
                required: false,
                maxlength: 150,
                validation: [{ value: "mandatory" }, { value: "maxlength" }, { value: "text" }]
            }
        ],
        button: [
            {
                name: "Submit",
                type: "submit",
                text: "Submit",
                click: "modifyupdatehistory(modupdatehistory)"
            },
            {
                name: "Cancel",
                type: "cancel",
                text: "Cancel",
                click: "modal"
            }
        ]
    };

    var notvalid = "";
    $scope.modifyupdatehistory = function (modupdatehistory) {
        var updatehistorydata = {
            MaintenanceInfoID: modupdatehistory.MaintenanceInfoID,
            MaintenanceType: modupdatehistory.MaintenanceType,
            MaintenanceDate: modupdatehistory.MaintenanceDate,
            MaintenanceDuration: null,
            Description: modupdatehistory.Description,
            Detail: modupdatehistory.Detail,
            URLReference: modupdatehistory.URLReference,
            CreatedDate: null,
            CreatedBy: 5, //Hardcode
            MaintenanceInfoMVNOes: []
        };
        $scope.selectionforedit.forEach(function (e) {
            temp = { OrgID: e };
            updatehistorydata.MaintenanceInfoMVNOes.push(temp);
        });
        EditUpdateHistory.edit(updatehistorydata, function (result) {
            if (result.ResultType == 0 && result.ResultCode == 0) {
                Notification.success({
                    message: '<strong>Success!</strong> <span>Update History has been edited <br /></span>',
                    positionY: 'top',
                    positionX: 'center'
                });
                setTimeout(function () {
                    window.location.assign('/CSR/Customer/App/Admin/UpdateHistory');
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