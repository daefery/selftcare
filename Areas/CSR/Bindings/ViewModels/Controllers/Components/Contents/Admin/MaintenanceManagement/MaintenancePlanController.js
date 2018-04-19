CSRContent.controller("MaintenancePlanController", function ($scope, $filter, GetAllMaintenancePlan, RemoveMaintenancePlan, Notification, CacheAdmin) {

    //initialization
    $scope.currentPage = 1;
    $scope.disableButton = true;
    $scope.mvnoselection = [];
    $scope.mvnoselection2 = [];
    $scope.addform = {
        MaintenanceDate: null,
        MaintenanceDuration: null,
        Description: null,
        Detail: null,
        URLReference: null,
        timestart: null
    };
    $scope.addform.timestart = new Date();

    $scope.editform = {
        MaintenanceDate: null,
        MaintenanceDuration: null,
        Description: null,
        Detail: null,
        URLReference: null,
        timestart: null
    };
    $scope.configDateFormatMoment = config.DateFormatMoment;

    //Read
    var getData = function () {
        GetAllMaintenancePlan.query({}, function (result) {
            //dummy
            //result = 
            //{
            //    "MaintenanceInfo": [
            //      {
            //          "MaintenanceInfoID": 43,
            //          "MaintenanceType": 1,
            //          "MaintenanceDate": "2016-03-22T00:00:00",
            //          "MaintenanceDuration": 25,
            //          "Description": "server reset",
            //          "Detail": "done by admin",
            //          "URLReference": null,
            //          "CreatedDate": null,
            //          "CreatedBy": 3,
            //          "MaintenanceInfoMVNOes": [
            //            {
            //                "MaintenanceInfoID": 43,
            //                "OrgID": 970100
            //            },
            //            {
            //                "MaintenanceInfoID": 43,
            //                "OrgID": 999999
            //            }
            //          ]
            //      }
            //    ]
            //    "ResultType": 0,
            //    "ResultCode": 0,
            //    "Messages": [
            //        "Query Success"
            //    ]
            //};

            CacheAdmin.getallMvno().then(function (result2) {
                //dummy
                //result2 =
                //[
                //    {
                //        "orgid": 999999,
                //        "mvnoname": "ETNA",
                //        "dealerid": 900000
                //    },
                //    {
                //        "orgid": 970100,
                //        "mvnoname": "LOWI",
                //        "dealerid": 190000
                //    }
                //];

                $scope.MaintenancePlan = result.MaintenanceInfo;
                $scope.mvnocheckbox = result2;

                var getMVNOName = function (OrgID) {
                    temp = $filter('filter')(result2, { "orgid": OrgID }, true);
                    if (temp.length == 0) return "unknown";
                    else {
                        return temp[0].mvnoname;
                    }
                };

                result.MaintenanceInfo.forEach(function (e) {
                    temp = moment(e.MaintenanceDate);
                    temp2 = moment(e.MaintenanceDate).add(e.MaintenanceDuration, 'm');
                    e.MaintenanceDate2 = moment(temp).format(config.DateFormatMoment);
                    e.MaintenanceStartTime = moment(temp).format('h:mm a');
                    e.MaintenanceDate2end = moment(temp2).format(config.DateFormatMoment);
                    e.MaintenanceEndTime = moment(temp2).format('h:mm a');
                    if (moment(temp).isSame(temp2, 'day')) {
                        e.MaintenanceDate2end = null;
                    } else {
                        e.MaintenanceDate2end = ' - '.concat(e.MaintenanceDate2end);
                    }
                });

                result.MaintenanceInfo.forEach(function (element, index, array) {
                    $scope.MaintenancePlan[index].Affected_MVNOs = "";
                    foo = '';
                    element.MaintenanceInfoMVNOes.forEach(function (e, i, a) {
                        if (getMVNOName(e.OrgID) != "unknown") {
                            if (i < element.MaintenanceInfoMVNOes.length - 1) {
                                foo = foo + getMVNOName(e.OrgID) + ", ";
                            } else {
                                foo = foo + getMVNOName(e.OrgID);
                            }
                            $scope.MaintenancePlan[index].Affected_MVNOs = foo;
                        }
                    });
                    var trim = $scope.MaintenancePlan[index].Affected_MVNOs.replace(/(^,)|(,$)/g, "");
                    $scope.MaintenancePlan[index].Affected_MVNOs = trim;
                });
            });
        });
    };
    //dummyObject(true, true);
    getData();


    $scope.togglemvnoselection = function (item) {
        var idx = $scope.mvnoselection.indexOf(item);

        // is currently selected
        if (idx > -1) {
            $scope.mvnoselection.splice(idx, 1);
        }

        // is newly selected
        else {
            $scope.mvnoselection.push(item);
        }
    };

    $scope.togglemvnoselection2 = function (item) {
        var idx = $scope.mvnoselection2.indexOf(item);

        // is currently selected
        if (idx > -1) {
            $scope.mvnoselection2.splice(idx, 1);
        }

            // is newly selected
        else {
            $scope.mvnoselection2.push(item);
        }
    };

    //initialize pagination
    $scope.setClickedRow = function (item) {
        $scope.selectedRow = item.MaintenanceInfoID;
        $scope.data = item;
        $scope.disableButton = false;

        $scope.refresheditform(item);
    };

    $scope.refreshaddform = function () {
        $scope.addform = {
            MaintenanceDate: null,
            MaintenanceDuration: null,
            Description: null,
            Detail: null,
            URLReference: null,
            timestart: null
        };
        $scope.mvnoselection2 = [];
        $scope.addform.timestart = new Date();
    };

    $scope.refresheditform = function (item) {
        $scope.editform = angular.copy(item);

        $scope.mvnoselection = [];
        $scope.data.MaintenanceInfoMVNOes.forEach(function (e) {
            temp = $filter('filter')($scope.mvnocheckbox, { "orgid": e.OrgID }, true);
            if (temp.length == 0) {
                $scope.mvnoselection.push({
                    "orgid": e.OrgID,
                    "mvnoname": "n.a.",
                    "dealerid": null
                });
            }
            else {
                $scope.mvnoselection.push(temp[0]);
            }
        });

        $scope.editform.MaintenanceDate = moment(item.MaintenanceDate).format(config.DateFormatMoment);
        $scope.editform.timestart = new Date(moment(item.MaintenanceDate).format());
    }

    //Create
    $scope.AddMaintenanceModal = function () {
        angular.element('#addMaintenanceModal').modal('show');
    };

    //Update
    $scope.EditMaintenanceModal = function () {
        angular.element('#editMaintenanceModal').modal('show');
    }

    //Delete
    $scope.removeMaintenancePlan = function (id) {
        RemoveMaintenancePlan.remove({ maintenanceId: id }, function (result) {
            if (result.$status == 200) {
                Notification.success({
                        message: '<strong>Success!</strong><br /> <span>Maintenance info has been deleted </span>',
                        positionY: 'top',
                        positionX: 'center'
                    });
                angular.element('#deleteMaintenanceModal').modal('hide');
                setTimeout(function () {
                    window.location.assign('/CSR/Customer/App/Admin/MaintenanceManagement');
                },1000);
            } else {
                Notification.error({
                    message: 'Failed delete maintenance info',
                    positionY: 'top',
                    positionX: 'center'
                });
            }
        });
    };
});

CSRContent.controller('AddMaintenanceForm', function ($scope, $parse, CreateMaintenancePlan, Notification) {

    

    $scope.addmaintenance = function (item) {

        var maintenance = {
            MaintenanceInfoID: 1,
            MaintenanceType: 1,
            MaintenanceDate: null,
            MaintenanceDuration: item.MaintenanceDuration,
            Description: item.Description,
            Detail: item.Detail,
            URLReference: item.URLReference,
            CreatedDate: null,
            CreatedBy: 3, //Hardcode
            MaintenanceInfoMVNOes: []
        };

        var date = moment(item.MaintenanceDate, config.DateFormatMoment);
        date.hour(item.timestart.getHours());
        date.minute(item.timestart.getMinutes());
        maintenance.MaintenanceDate = moment(date).format();

        $scope.mvnoselection2.forEach(function (e) {
            maintenance.MaintenanceInfoMVNOes.push({ OrgID: e.orgid });
        })

        CreateMaintenancePlan.save(maintenance, function (result) {
            if (result.ResultType == 0 && result.ResultCode == 0) {
                Notification.success({
                    message: '<strong>Success!</strong><br /> <span>Maintenance plan has been created </span>',
                    positionY: 'top',
                    positionX: 'center'
                });
                angular.element('#addMaintenanceModal').modal('hide');
                setTimeout(function () {
                    window.location.assign('/CSR/Customer/App/Admin/MaintenanceManagement');
                }, 1000);
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

    $scope.datas = {
        field: [
            {
                type: "date",
                name: "maintenancedate",
                size: 6,
                text: "Maintenance_Date",
                model: "addform.MaintenanceDate",
                required: true
            },
            {
                type: "number",
                name: "duration",
                size: 6,
                text: "Duration",
                model: "addform.MaintenanceDuration",
                required: true,
                validation: [{ value: "mandatory" }, { value: "number" }]
            },
            {
                type: "text",
                name: "description",
                size: 6,
                text: "Description",
                model: "addform.Description",
                required: true,
                validation: false
            },
            {
                type: "text",
                name: "detail",
                size: 6,
                text: "Detail",
                model: "addform.Detail",
                required: true,
                validation: false
            },
            {
                type: "checkbox",
                name: "affectedmvnos",
                size: 6,
                text: "Affected_MVNOs",
                model: "addform.Affected_MVNOs",
                required: false,
                style: "horizontal",
                content: [{ text: "LOWI", value: "970100" }, { text: "ETNA", value: "999999" }],
                validation: false
            }
        ],
        button: [
            {
                name: "Submit",
                type: "submit",
                text: "Submit",
                click: "addmaintenance(addform)"
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
});

CSRContent.controller('EditMaintenanceForm', function ($scope, $parse, CreateMaintenancePlan, UpdateMaintenancePlan, Notification) {

    $scope.editmaintenance = function (item) {
        var maintenance = {
            MaintenanceInfoID: item.MaintenanceInfoID,
            MaintenanceType: 1,
            MaintenanceDate: item.MaintenanceDate,
            MaintenanceDuration: item.MaintenanceDuration,
            Description: item.Description,
            Detail: item.Detail,
            URLReference: item.URLReference,
            CreatedDate: null,
            CreatedBy: 3, //Hardcode
            MaintenanceInfoMVNOes: []
        };

        var date = moment(item.MaintenanceDate, config.DateFormatMoment);
        date.hour(item.timestart.getHours());
        date.minute(item.timestart.getMinutes());
        maintenance.MaintenanceDate = moment(date).format();

        $scope.mvnoselection.forEach(function (e) {
            maintenance.MaintenanceInfoMVNOes.push({ OrgID: e.orgid });
        })

        UpdateMaintenancePlan.save({ maintenanceId: item.MaintenanceInfoID }, maintenance, function (result) {
            if (result.ResultType == 0 && result.ResultCode == 0) {
                Notification.success({
                    message: '<strong>Success!</strong><br /> <span>Maintenance plan has been updated </span>',
                    positionY: 'top',
                    positionX: 'center'
                });
                angular.element('#editMaintenanceModal').modal('hide');
                setTimeout(function () {
                    window.location.assign('/CSR/Customer/App/Admin/MaintenanceManagement');
                }, 1000);
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

    $scope.datas = {
        field: [
            {
                type: "date",
                name: "maintenancedate",
                size: 6,
                text: "Maintenance_Date",
                model: "editform.MaintenanceDate",
                required: false
            },
            {
                type: "number",
                name: "duration",
                size: 6,
                text: "Duration",
                model: "editform.MaintenanceDuration",
                required: false,
                validation: [{ value: "mandatory" }, { value: "number" }]
            },
            {
                type: "text",
                name: "description",
                size: 6,
                text: "Description",
                model: "editform.Description",
                required: false,
                validation: false
            },
            {
                type: "text",
                name: "detail",
                size: 6,
                text: "Detail",
                model: "editform.Detail",
                required: false,
                validation: false
            },
            {
                type: "checkbox",
                name: "affectedmvnos",
                size: 6,
                text: "Affected_MVNOs",
                model: "editform.Affected_MVNOs",
                required: false,
                style: "horizontal",
                content: [{ text: "LOWI", value: "970100" }, { text: "ETNA", value: "999999" }],
                validation: false
            }
        ],
        button: [
            {
                name: "Submit",
                type: "submit",
                text: "Submit",
                click: "editmaintenance(editform)"
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
});

