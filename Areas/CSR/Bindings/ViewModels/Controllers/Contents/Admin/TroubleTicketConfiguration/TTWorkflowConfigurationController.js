
CSRContent.controller("WorkFlowConfigurationTTController", function ($scope, $filter, LocalStorageProvider, CommonEnum, CSRCache, CacheSearch, CacheEnumService, Notification, RemoveStepWorkflowService) {

    $scope.isETAKUser = false;
    $scope.isETAKUser = LocalStorageProvider.isETAKUser();
    $scope.draftMode = false; //!change
    $scope.DraftModeText = $scope.draftMode == true ? ($filter('translate')('DRAFT_MODE')) : ($filter('translate')('NORMAL_MODE'));
    $scope.changeDraftMode = function () {
        $scope.draftMode = !$scope.draftMode;
        if ($scope.draftMode == true) {
            $scope.DraftModeText = ($filter('translate')('DRAFT_MODE'));
        } else {
            $scope.DraftModeText = ($filter('translate')('NORMAL_MODE'));
        }
    }

    $scope.form = {}; //to set default name on UI Form
    $scope.currentPage = 1;

    $scope.keySearch = {
        keyMVNO: '',
        keyFlowType: null,
    };
    var keySearchDefault = angular.copy($scope.keySearch);
    $scope.updateOnChangeFlowType = function (data) {
        $scope.keySearch = data;

        $scope.getSearch($scope.keySearch);
    }

    $scope.updateOnChangeMVNO = function (data) {
        $scope.keySearch = data;

        $scope.TTFlowType = [];
        CacheEnumService.getTTFlowType().then(function (result) {
            result.TTFlowTypeList.forEach(function (e) {
                e.value = e.FlowTypeId;
                e.name = e.Names.DefaultMessage;
            });;

            $scope.TTFlowType = result.TTFlowTypeList;

            $scope.keySearch.keyFlowType = $scope.TTFlowType[0].value; // selected first index

            $scope.updateOnChangeFlowType($scope.keySearch);
        });
    }

    $scope.TTMVNO = [];
    CacheEnumService.getTTMVNO().then(function (result) {
        result.forEach(function (e) {
            e.value = e.dealerid;
            e.name = e.mvnoname;
        });

        $scope.TTMVNO = result;

        //$scope.keySearch.keyMVNO = $scope.TTMVNO[0].value; // selected first index
        result.forEach(function (e) {
            // selected index
            if (LocalStorageProvider.getMvnoid() == e.orgid) {
                $scope.keySearch.keyMVNO = e.value;
            }
        })

        $scope.updateOnChangeMVNO($scope.keySearch);
    });

    $scope.Modal_RemoveStepModal = '';
    $scope.Modal_ModifyStepModal = '';

    var cacheKey = 'WorkFlowConfigurationTTData';
    $scope.CstData = '';
    $scope.getSearch = function (object, clearCache) {

        $scope.Modal_RemoveStepModal = ''; //setdefault
        $scope.Modal_ModifyStepModal = ''; //setdefault

        $scope.selectedRow = undefined;
        CacheSearch.getWorkFlowConfigurationTTService(object, clearCache).then(function (result) {
            result.Workflows.forEach(function (e) {
                e.ScreenType = CommonEnum.convertTTScreenType(e.ScreenTypeId).name;
            });

            $scope.CstData = result.Workflows;
        });

    };

    $scope.update = {};
    $scope.addstep = {};
    $scope.addflow = {};

    $scope.add = {};//for add TTDepartment
    $scope.getSearchTTDepartment = function (clearCache) {

        var object = {
            keyMVNO: $scope.keySearch.keyMVNO
        }

        CacheEnumService.getTTGetDepartmentForWorkflow(object.keyMVNO, clearCache).then(function (result) {
            result.TTDepartments.forEach(function (e) {
                e.name = e.Names.DefaultMessage;
                e.value = e.Id;
            });
            $scope.addflow.TTDepartment = result.TTDepartments;
        });

    };

    //for AddTTDepartment
    $scope.doing = function (param) {

        if (param == 'Add') {
            angular.element('#AddFlowModal').modal('hide');
            $scope.add.openAddTTDepartmentInterface();

            $scope.add.overrideFunction_closeTTDepartmentModal(function () {   //override
                angular.element('#AddFlowModal').modal('show');
                angular.element('#AddTTDepartmentModal').modal('hide');
            })
        }
    }
    $scope.$watch('add.addTTDepartment_done', function () {
        if ($scope.add.addTTDepartment_done == true) {
            angular.element('#AddFlowModal').modal('show');
            $scope.getSearchTTDepartment(clearCache = true);
        }
    })

    $scope.setClickedRow = function (data) {
        $scope.selectedRow = data.WorkflowId;

        $scope.Modal_RemoveStepModal = '#RemoveStepModal';
        $scope.Modal_ModifyStepModal = '#ModifyStepModal';

        $scope.update.WorkflowId = $scope.selectedRow;
        $scope.update.data = data;

    }

    $scope.deleteDisabled = false;

    $scope.removeStep = function () {
        if ($scope.selectedRow == undefined) {
            Notification.error({
                message: '<span>Please select one</span>',
                positionY: 'top',
                positionX: 'center',
                delay: 10000
            });
        } else {
            if ($scope.draftMode == true) {

                for (var i = 0; i < $scope.CstData.length; i++) {
                    if ($scope.CstData[i].WorkflowId.toString() == $scope.selectedRow.toString()) {
                        $scope.CstData.splice(i, 1);

                        Notification.success({
                            message: '<strong>Success!</strong> <span>Workflow Step Is Successfully deleted.</span>',
                            positionY: 'top',
                            positionX: 'center',
                            title: "<span ><h4 style='color: white;'>DRAFT MODE</h4></span>"
                        });

                        angular.element('#RemoveStepModal').modal('hide');

                        break;
                    }
                }
            } else {
                RemoveStepWorkflowService.delete({
                    WorkflowId: $scope.selectedRow
                }, function (response) {
                    if (response.ResultType != 0 || response.ResultCode != 0) {
                        Notification.error({
                            message: '<strong>Failed!</strong> <span>' + response.Messages + '.</span>',
                            positionY: 'top',
                            positionX: 'center'
                        });
                        angular.element('#RemoveStepModal').modal('hide');
                    } else {
                        Notification.success({
                            message: '<strong>Success!</strong> <span>Workflow Step Is Successfully deleted.</span>',
                            positionY: 'top',
                            positionX: 'center'
                        });

                        angular.element('#RemoveStepModal').modal('hide');
                        $scope.getSearch($scope.keySearch, clearCache = true);
                    }
                })
            }
        }

    }
});

CSRContent.controller("AddFlowTTConfigController", function ($scope, CommonEnum, CSRCache, CacheEnumService, WorkFlowAddFromTemplateService, CacheTroubleTicketService, Notification) {

    $scope.addflow.openAddFlowInterface = function (MVNOId, FlowTypeId) {

        if ($scope.CstData.length > 0) {   //validation length -- 'Only Empty Step Allow to Add from Template'
            var msg = 'Flow Type already available';

            Notification.error({
                message: '<strong>Failed!</strong> <span>' + msg + '</span>',
                positionY: 'top',
                positionX: 'center',
                title: "<span ><h4 style='color: white;'>Failed!</h4></span>"
            });
        }
        else {
            $scope.add.addTTDepartment_done = false;

            $scope.addflow.FlowTypeTemplateName = '';

            $scope.addflow.TemplateNotAvailableMessage = 'Flow Type do not have template';
            $scope.addflow.TemplateAvailable = false;

            $scope.addflow.MVNOId = MVNOId;

            for (var i = 0; i < $scope.TTMVNO.length; i++) {
                if ($scope.addflow.MVNOId == $scope.TTMVNO[i].value) {
                    $scope.addflow.MVNOName = $scope.TTMVNO[i].name;
                }
            }

            $scope.addflow.FlowTypeId = FlowTypeId;

            for (var i = 0; i < $scope.TTFlowType.length; i++) {
                if ($scope.addflow.FlowTypeId == $scope.TTFlowType[i].value) {
                    $scope.addflow.FlowTypeName = $scope.TTFlowType[i].name;
                }
            }

            $scope.addflow.TTFlowType_template = [];
            CacheEnumService.getTTFlowTypeFromTemplate().then(function (result) {

                result.TTFlowTypeList.forEach(function (e) {
                    e.value = e.FlowTypeId;
                    e.name = e.Names.DefaultMessage;

                    if (e.FlowTypeId == FlowTypeId) {
                        $scope.addflow.FlowTypeTemplateName = e.name;
                        $scope.addflow.TemplateAvailable = true;
                        $scope.addflow.Flow_Type = e.FlowTypeId;
                    }

                });

                if ($scope.addflow.TemplateAvailable == true) {
                    $scope.getSearchTTDepartment();
                    $scope.addflow.showMappingDepartment($scope.addflow.Flow_Type);
                    angular.element('#AddFlowModal').modal('show');
                } else {

                    var msg = $scope.addflow.TemplateNotAvailableMessage;
                    Notification.error({
                        message: '<strong>Failed!</strong> <span>' + msg + '</span>',
                        positionY: 'top',
                        positionX: 'center',
                        title: "<span ><h4 style='color: white;'>Failed!</h4></span>"
                    });
                }

                //$scope.addflow.TTFlowType_template = result.TTFlowTypeList;

            });
        }
    }

    $scope.addflow.showMappingDepartment = function (FlowTypeIdTemplate) {

        $scope.addflow.TTDepartmentMapping = [];

        var object = {
            FlowTypeId: FlowTypeIdTemplate
        }
        CacheTroubleTicketService.getWorkFlowDepartmentMapping(object, clearCache = false).then(function (result) {

            $scope.addflow.TTDepartmentMapping = result.TTDepartmentMapping;
        })

    }

    $scope.AddFlowSubmit = function () {

        if ($scope.addflow.TemplateAvailable == false) {

            Notification.error({
                message: '<strong>Failed!</strong> <span>' + $scope.addflow.TemplateAvailable + '</span>',
                positionY: 'top',
                positionX: 'center',
                title: "<span ><h4 style='color: white;'>Failed!</h4></span>"
            });
        }

        //MappingDepartmentValidation
        var valid = false;
        var validCount = 0;
        if ($scope.addflow.TTDepartmentMapping == undefined)
            valid = false;
        else {
            for (var i = 0; i < $scope.addflow.TTDepartmentMapping.length; i++) {
                if ($scope.addflow.TTDepartmentMapping[i].specificDepartmentId != undefined && $scope.addflow.TTDepartmentMapping[i].specificDepartmentId != null) {
                    valid = true;
                    validCount += 1;
                }
            }
        }

        if (validCount == $scope.addflow.TTDepartmentMapping.length) {
            valid = true;

            $scope.addflow.MappingDepartmentForTemplate = [];
            for (var i = 0; i < $scope.addflow.TTDepartmentMapping.length; i++) {
                var MappingDepartmentForTemplate = {
                    defaultDepartmentId: $scope.addflow.TTDepartmentMapping[i].Id,
                    specificDepartmentId: $scope.addflow.TTDepartmentMapping[i].specificDepartmentId,
                }
                $scope.addflow.MappingDepartmentForTemplate.push(MappingDepartmentForTemplate);
            }

            $scope.AddFlowFromTemplate($scope.addflow);

        } else {
            Notification.error({
                message: '<strong>Failed!</strong> <span>Department Mapping should be mapped.</span>',
                positionY: 'top',
                positionX: 'center',
                title: "<span ><h4 style='color: white;'>Failed!</h4></span>"
            });
        }
        return valid;
    }

    $scope.AddFlowFromTemplate = function (addflow) {
        var param = {
            DealerId: addflow.MVNOId,
            FlowTypeId: addflow.FlowTypeId,
            MappingDepartmentForTemplate: addflow.MappingDepartmentForTemplate
        }

        WorkFlowAddFromTemplateService.add(param, function (response) {

            if (response.ResultType != 0 || response.ResultCode != 0) {
                Notification.error({
                    message: '<strong>Failed!</strong> <span>' + response.Messages + '.</span>',
                    positionY: 'top',
                    positionX: 'center',
                    title: "<span ><h4 style='color: white;'>Failed!</h4></span>"
                });
                return false;
            } else {
                Notification.success({
                    message: '<strong>Success!</strong> <span>Template Workflow Step Is Successfully Added.</span>',
                    positionY: 'top',
                    positionX: 'center',
                    title: "<span ><h4 style='color: white;'>Success!</h4></span>"
                });

                angular.element('#AddFlowModal').modal('hide');
                $scope.getSearch($scope.keySearch, clearCache = true);
            }
        })

    }

    $scope.datas = {

        field: [
            {
                type: "label",
                name: "MVNO",
                size: 6,
                text: "MVNO",
                model: "addflow.MVNOName",
            },
            {
                type: "label",
                name: "Flow_Type",
                size: 6,
                text: "Flow_Type",
                model: "addflow.FlowTypeName",
            },
            {
                type: "select",
                name: "Flow_Type_Template",
                size: 6,
                text: "Flow_Type_Template",
                model: "addflow.FlowTypeTemplate",
                required: true,
                value: "addflow.TTFlowType_template",
            },
        ],
        button: [
            {
                name: "btnSubmitAddFlow",
                type: "submit",
                text: "Submit",
                click: "AddFlowFromTemplate(addflow)"
            },
            {
                name: "btnCancelAddFlow",
                type: "cancel",
                text: "Cancel",
                click: "modal"
            }
        ]
    }
});

CSRContent.controller("AddStepTTConfigController", function ($scope, CommonEnum, CSRCache, CacheEnumService, Notification, AddStepWorkflowService) {

    $scope.addstep.openAddStepInterface = function (MVNOId) {

        $scope.AddStepTTConfigForm.$setPristine();
        angular.element('#AddStepModal').modal('show');

        if (MVNOId == undefined) {
            MVNOId = $scope.keySearch.keyMVNO;
        } else {
            MVNOId = MVNOId;
        }

        $scope.addstep.departments = [];
        $scope.addstep.nextdepartments = [];
        CacheEnumService.getTTGetDepartmentForWorkflow(MVNOId).then(function (result) {
            result.TTDepartments.forEach(function (e) {
                e.value = e.Id;
                e.name = e.Names.DefaultMessage;
            });
            $scope.addstep.departments = angular.copy(result.TTDepartments);
            $scope.addstep.nextdepartments = angular.copy(result.TTDepartments);

            var blankChoice = { value: null, name: "None" };
            $scope.addstep.departments.push(blankChoice);
            $scope.addstep.nextdepartments.push(blankChoice);

            $scope.addstep.CurrentDepartment = blankChoice;
            $scope.addstep.NextDepartment = blankChoice;

        });

        $scope.addstep.TTStatusCurrent = [];
        $scope.addstep.TTStatusNext = [];
        CacheEnumService.getTTStatus().then(function (result) {
            result.TTStatusInfo.forEach(function (e) {
                e.value = e.StatusId;
                e.name = e.Names.DefaultMessage;
            });
            $scope.addstep.TTStatusCurrent = angular.copy(result.TTStatusInfo);
            $scope.addstep.TTStatusNext = angular.copy(result.TTStatusInfo);

            var blankChoice = { value: null, name: "None" };
            $scope.addstep.TTStatusCurrent.push(blankChoice);

            $scope.addstep.CurrentStatus = blankChoice;

        });

        $scope.addstep.operations = [];
        CacheEnumService.getTTOperationType().then(function (result) {
            result.TTOperationTypeInfo.forEach(function (e) {
                e.value = e.Id;
                e.name = e.Names.DefaultMessage;
            });
            $scope.addstep.operations = result.TTOperationTypeInfo;
        });

        $scope.addstep.screenTypes = CommonEnum.getTTScreenType();
    }

    $scope.submitAddStep = function (data) {
        var param = {
            DealerId: $scope.keySearch.keyMVNO,
            FlowTypeId: $scope.keySearch.keyFlowType,
            OperationTypeId: data.OperationType.value,
            CurrentDepartmentId: data.CurrentDepartment.value,
            CurrentStatusId: data.CurrentStatus.value,
            NextDepartmentId: data.NextDepartment.value,
            NextStatusId: data.NextStatus.value,
            ScreenTypeId: data.ScreenType.value,
        };

        if (param.CurrentDepartmentId == null && param.NextDepartmentId == null) {
            var msg = 'Current Department or Next Department must be choose';
            Notification.error({
                message: '<strong>Failed!</strong> <span>' + msg + '.</span>',
                positionY: 'top',
                positionX: 'center'
            });
        } else {
            if ($scope.draftMode == true) {
                var WorkflowId_Dummy = Date.now();
                var Step_Dummy = {
                    CurrentDepartment: {
                        Id: data.CurrentDepartment.value,
                        Names: {
                            DefaultMessage: data.CurrentDepartment.name
                        }
                    },
                    CurrentStatus: {
                        StatusId: data.CurrentStatus.value,
                        Names: {
                            DefaultMessage: data.CurrentStatus.name
                        }
                    },
                    FlowType: {
                        FlowTypeId: $scope.keySearch.keyFlowType,
                        Names: {
                            DefaultMessage: 'Un-dummy-able'
                        }
                    },
                    NextDepartment: {
                        Id: data.NextDepartment.value,
                        Names: {
                            DefaultMessage: data.NextDepartment.name
                        }
                    },
                    NextStatus: {
                        StatusId: data.NextStatus.value,
                        Names: {
                            DefaultMessage: data.NextStatus.name
                        }
                    },
                    OperationType: {
                        Id: data.OperationType.value,
                        Names: {
                            DefaultMessage: data.OperationType.name
                        }
                    },
                    ScreenTypeId: data.ScreenType.value,
                    WorkflowId: WorkflowId_Dummy,
                    ScreenType: data.ScreenType.name
                }

                $scope.CstData.push(Step_Dummy);

                Notification.success({
                    message: '<strong>Success!</strong> <span>Workflow Step Is Successfully Added.</span>',
                    positionY: 'top',
                    positionX: 'center',
                    title: "<span ><h4 style='color: white;'>DRAFT MODE</h4></span>"
                });

                $scope.addstep.CurrentDepartment = null;
                $scope.addstep.CurrentStatus = null;
                $scope.addstep.OperationType = null;
                $scope.addstep.NextStatus = null;
                $scope.addstep.NextDepartment = null;
                $scope.addstep.ScreenType = null;

                angular.element('#AddStepModal').modal('hide');

            } else {
                AddStepWorkflowService.create(param, function (response) {
                    if (response.ResultType != 0 || response.ResultCode != 0) {
                        Notification.error({
                            message: '<strong>Failed!</strong> <span>' + response.Messages + '.</span>',
                            positionY: 'top',
                            positionX: 'center'
                        });
                        return false;
                    } else {
                        Notification.success({
                            message: '<strong>Success!</strong> <span>Workflow Step Is Successfully Added.</span>',
                            positionY: 'top',
                            positionX: 'center'
                        });

                        $scope.addstep.CurrentDepartment = null;
                        $scope.addstep.CurrentStatus = null;
                        $scope.addstep.OperationType = null;
                        $scope.addstep.NextStatus = null;
                        $scope.addstep.NextDepartment = null;
                        $scope.addstep.ScreenType = null;

                        angular.element('#AddStepModal').modal('hide');
                        $scope.getSearch($scope.keySearch, clearCache = true);
                    }
                });
            }
        }
    }

    $scope.datas = {

        field: [
            //{
            //    type: "label",
            //    name: "DRAFT_MODE",
            //    size: 6,
            //    text: "DRAFT_MODE",
            //    model: "DraftModeText",
            //},
            {
                type: "select",
                name: "Current_Department",
                size: 6,
                text: "Current_Department",
                model: "addstep.CurrentDepartment",
                value: "addstep.departments",
            },
            {
                type: "select",
                name: "Current_Status",
                size: 6,
                text: "Current_Status",
                model: "addstep.CurrentStatus",
                value: "addstep.TTStatusCurrent",
            },
            {
                type: "select",
                name: "OperationType",
                size: 6,
                text: "Operation",
                model: "addstep.OperationType",
                required: true,
                value: "addstep.operations",
                validation: [{ value: "mandatory" }]
            },
            {
                type: "select",
                name: "Next_Status",
                size: 6,
                text: "Next_Status",
                model: "addstep.NextStatus",
                required: true,
                value: "addstep.TTStatusNext",
                validation: [{ value: "mandatory" }]
            },
            {
                type: "select",
                name: "Next_Department",
                size: 6,
                text: "Next_Department",
                model: "addstep.NextDepartment",
                value: "addstep.nextdepartments",
            },
            {
                type: "select",
                name: "ScreenType",
                size: 6,
                text: "Screen_Type",
                model: "addstep.ScreenType",
                required: true,
                value: "addstep.screenTypes",
                validation: [{ value: "mandatory" }]
            },
        ],
        button: [
            {
                name: "btnSubmitAddStep",
                type: "submit",
                text: "Submit",
                click: "submitAddStep(addstep)"
            },
            {
                name: "btnCancelAddStep",
                type: "cancel",
                text: "Cancel",
                click: "modal"
            }
        ]
    }
});

CSRContent.controller("ModifyStepTTConfigController", function ($scope, CommonEnum, CSRCache, CacheEnumService, Notification, ModifyStepWorkflowService) {

    $scope.update.openModifyStepInterface = function (MVNOId) {

        $scope.ModifyStepTTConfigForm.$setPristine();
        if ($scope.update.data == undefined) {
            angular.element('#ModifyStepModal').modal('hide');
            Notification.error({
                message: '<span>Please select one</span>',
                positionY: 'top',
                positionX: 'center',
                delay: 10000
            });
        } else {
            var data = $scope.update.data;

            angular.element('#ModifyStepModal').modal('show');

            if (MVNOId == undefined) {
                MVNOId = $scope.keySearch.keyMVNO;
            } else {
                MVNOId = MVNOId;
            }

            $scope.update.departments = [];
            $scope.update.nextdepartments = [];
            CacheEnumService.getTTGetDepartmentForWorkflow(MVNOId).then(function (result) {
                result.TTDepartments.forEach(function (e) {
                    e.value = e.Id;
                    e.name = e.Names.DefaultMessage;
                });
                $scope.update.departments = angular.copy(result.TTDepartments);
                $scope.update.nextdepartments = angular.copy(result.TTDepartments);

                var blankChoice = { value: null, name: "None" };
                $scope.update.nextdepartments.push(blankChoice);
                $scope.update.departments.push(blankChoice);

                $scope.update.CurrentDepartment = data.CurrentDepartment == null ? blankChoice : { name: data.CurrentDepartment.Names.DefaultMessage, value: data.CurrentDepartment.Id };
                $scope.update.NextDepartment = data.NextDepartment == null ? blankChoice : { name: data.NextDepartment.Names.DefaultMessage, value: data.NextDepartment.Id };

            });

            $scope.update.TTStatusCurrent = [];
            $scope.update.TTStatusNext = [];
            CacheEnumService.getTTStatus().then(function (result) {
                result.TTStatusInfo.forEach(function (e) {
                    e.value = e.StatusId;
                    e.name = e.Names.DefaultMessage;
                });
                $scope.update.TTStatusCurrent = angular.copy(result.TTStatusInfo);
                $scope.update.TTStatusNext = angular.copy(result.TTStatusInfo);

                var blankChoice = { value: null, name: "None" };
                $scope.update.TTStatusCurrent.push(blankChoice);

                $scope.update.CurrentStatus = data.CurrentStatus == null ? blankChoice : { name: data.CurrentStatus.Names.DefaultMessage, value: data.CurrentStatus.StatusId };

                $scope.update.NextStatus = { name: data.NextStatus.Names.DefaultMessage, value: data.NextStatus.StatusId };
            });

            $scope.update.operations = [];
            CacheEnumService.getTTOperationType().then(function (result) {
                result.TTOperationTypeInfo.forEach(function (e) {
                    e.value = e.Id;
                    e.name = e.Names.DefaultMessage;
                });
                $scope.update.operations = result.TTOperationTypeInfo;

                $scope.update.OperationType = { name: data.OperationType.Names.DefaultMessage, value: data.OperationType.Id };
            });

            $scope.update.screenTypes = CommonEnum.getTTScreenType();
            $scope.update.ScreenType = data.ScreenTypeId == null ? { name: null, value: null } : { name: CommonEnum.convertTTScreenType(data.ScreenTypeId).name, value: data.ScreenTypeId };
        }
    }

    $scope.isFormChanged = function (data) {
        if (data.data == undefined
            || data.OperationType == undefined
            || data.CurrentDepartment == undefined
            || data.CurrentStatus == undefined
            || data.NextDepartment == undefined
            || data.NextStatus == undefined
            || data.ScreenType == undefined
        ) {
            return false;
        }
        var param = {
            WorkflowId: $scope.selectedRow,
            DealerId: $scope.keySearch.keyMVNO,
            FlowTypeId: $scope.keySearch.keyFlowType,
            OperationTypeId: data.OperationType.value,
            CurrentDepartmentId: data.CurrentDepartment.value,
            CurrentStatusId: data.CurrentStatus.value,
            NextDepartmentId: data.NextDepartment.value,
            NextStatusId: data.NextStatus.value,
            ScreenTypeId: data.ScreenType.value,
        };

        var valid = false;
        if (data.data.OperationType.Id == param.OperationTypeId
            && (data.data.CurrentDepartment == null ? data.data.CurrentDepartment : data.data.CurrentDepartment.Id) == param.CurrentDepartmentId
            && (data.data.CurrentStatus == null ? data.data.CurrentStatus : data.data.CurrentStatus.StatusId) == param.CurrentStatusId
            && (data.data.NextDepartment == null ? data.data.NextDepartment : data.data.NextDepartment.Id) == param.NextDepartmentId
            && (data.data.NextStatus == null ? data.data.NextStatus : data.data.NextStatus.StatusId) == param.NextStatusId
            && data.data.ScreenTypeId == param.ScreenTypeId
        ) {
            valid = false;
        } else {
            valid = true;
        }
        return valid;
    }

    $scope.submitModifyStep = function (data) {
        var param = {
            WorkflowId: $scope.selectedRow,
            DealerId: $scope.keySearch.keyMVNO,
            FlowTypeId: $scope.keySearch.keyFlowType,
            OperationTypeId: data.OperationType.value,
            CurrentDepartmentId: data.CurrentDepartment.value,
            CurrentStatusId: data.CurrentStatus.value,
            NextDepartmentId: data.NextDepartment.value,
            NextStatusId: data.NextStatus.value,
            ScreenTypeId: data.ScreenType.value,
        };

        var valid = false;
        if (param.CurrentDepartmentId == null && param.NextDepartmentId == null) {
            var msg = 'Current Department or Next Department must be choose';
            Notification.error({
                message: '<strong>Failed!</strong> <span>' + msg + '.</span>',
                positionY: 'top',
                positionX: 'center'
            });
            valid = false;
        } else if (data.data.OperationType.Id == param.OperationTypeId
            && (data.data.CurrentDepartment == null ? data.data.CurrentDepartment : data.data.CurrentDepartment.Id) == param.CurrentDepartmentId
            && (data.data.CurrentStatus == null ? data.data.CurrentStatus : data.data.CurrentStatus.StatusId) == param.CurrentStatusId
            && (data.data.NextDepartment == null ? data.data.NextDepartment : data.data.NextDepartment.Id) == param.NextDepartmentId
            && (data.data.NextStatus == null ? data.data.NextStatus : data.data.NextStatus.StatusId) == param.NextStatusId
            && data.data.ScreenTypeId == param.ScreenTypeId
        ) {
            Notification.error({
                message: '<strong>Failed!</strong> <span>You havent changed anything yet</span>',
                positionY: 'top',
                positionX: 'center'
            });
            valid = false;
        } else {
            valid = true;
        }

        if (valid) {
            if ($scope.draftMode == true) {
                var WorkflowId_Dummy = param.WorkflowId;
                var Step_Dummy = {
                    CurrentDepartment: {
                        Id: data.CurrentDepartment.value,
                        Names: {
                            DefaultMessage: data.CurrentDepartment.name
                        }
                    },
                    CurrentStatus: {
                        StatusId: data.CurrentStatus.value,
                        Names: {
                            DefaultMessage: data.CurrentStatus.name
                        }
                    },
                    FlowType: {
                        FlowTypeId: $scope.keySearch.keyFlowType,
                        Names: {
                            DefaultMessage: 'Un-dummy-able'
                        }
                    },
                    NextDepartment: {
                        Id: data.NextDepartment.value,
                        Names: {
                            DefaultMessage: data.NextDepartment.name
                        }
                    },
                    NextStatus: {
                        StatusId: data.NextStatus.value,
                        Names: {
                            DefaultMessage: data.NextStatus.name
                        }
                    },
                    OperationType: {
                        Id: data.OperationType.value,
                        Names: {
                            DefaultMessage: data.OperationType.name
                        }
                    },
                    ScreenTypeId: data.ScreenType.value,
                    WorkflowId: WorkflowId_Dummy,
                    ScreenType: data.ScreenType.name
                }

                for (var i = 0; i < $scope.CstData.length; i++) {
                    if ($scope.CstData[i].WorkflowId.toString() == WorkflowId_Dummy.toString()) {
                        $scope.CstData.splice(i, 1);

                        $scope.CstData.push(Step_Dummy);

                        Notification.success({
                            message: '<strong>Success!</strong> <span>Workflow Step Is Successfully Updated.</span>',
                            positionY: 'top',
                            positionX: 'center',
                            title: "<span ><h4 style='color: white;'>DRAFT MODE</h4></span>"
                        });

                        $scope.update.CurrentDepartment = null;
                        $scope.update.CurrentStatus = null;
                        $scope.update.OperationType = null;
                        $scope.update.NextStatus = null;
                        $scope.update.NextDepartment = null;
                        $scope.update.ScreenType = null;

                        angular.element('#ModifyStepModal').modal('hide');

                        break;
                    }
                }
            } else {
                ModifyStepWorkflowService.update(param, function (response) {
                    if (response.ResultType != 0 || response.ResultCode != 0) {
                        Notification.error({
                            message: '<strong>Failed!</strong> <span>' + response.Messages + '.</span>',
                            positionY: 'top',
                            positionX: 'center'
                        });
                        return false;
                    } else {
                        Notification.success({
                            message: '<strong>Success!</strong> <span>Workflow Step Is Successfully Updated.</span>',
                            positionY: 'top',
                            positionX: 'center'
                        });

                        $scope.update.CurrentDepartment = null;
                        $scope.update.CurrentStatus = null;
                        $scope.update.OperationType = null;
                        $scope.update.NextStatus = null;
                        $scope.update.NextDepartment = null;
                        $scope.update.ScreenType = null;

                        angular.element('#ModifyStepModal').modal('hide');
                        $scope.getSearch($scope.keySearch, clearCache = true);
                    }
                });
            }
        }
    };

    $scope.datas = {

        field: [
            //{
            //    type: "label",
            //    name: "DRAFT_MODE",
            //    size: 6,
            //    text: "DRAFT_MODE",
            //    model: "DraftModeText",
            //},
            {
                type: "select",
                name: "updateCurrentDepartment",
                size: 6,
                text: "Current_Department",
                model: "update.CurrentDepartment",
                value: "update.departments",
            },
            {
                type: "select",
                name: "updateCurrentStatus",
                size: 6,
                text: "Current_Status",
                model: "update.CurrentStatus",
                value: "update.TTStatusCurrent",
            },
            {
                type: "select",
                name: "updateOperationType",
                size: 6,
                text: "Operation",
                model: "update.OperationType",
                required: true,
                value: "update.operations",
                validation: [{ value: "mandatory" }]
            },
            {
                type: "select",
                name: "updateNextStatus",
                size: 6,
                text: "Next_Status",
                model: "update.NextStatus",
                required: true,
                value: "update.TTStatusNext",
                validation: [{ value: "mandatory" }]
            },
            {
                type: "select",
                name: "updateNextDepartment",
                size: 6,
                text: "Next_Department",
                model: "update.NextDepartment",
                value: "update.nextdepartments",
            },
            {
                type: "select",
                name: "updateScreenType",
                size: 6,
                text: "Screen_Type",
                model: "update.ScreenType",
                required: true,
                value: "update.screenTypes",
                validation: [{ value: "mandatory" }]
            },
        ],
        button: [
            {
                name: "btnSubmitModifyStep",
                type: "submit",
                text: "Submit",
                disabled: "!isFormChanged(update)",
                click: "submitModifyStep(update)"
            },
            {
                name: "btnCancelModifyStep",
                type: "cancel",
                text: "Cancel",
                click: "modal"
            }
        ]
    }
});
