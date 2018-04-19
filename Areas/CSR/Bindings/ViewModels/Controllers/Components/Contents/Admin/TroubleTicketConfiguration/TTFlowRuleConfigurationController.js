
CSRContent.controller("ManageTTFlowRuleController", function ($scope, LocalStorageProvider, CommonEnum, CSRCache, CacheSearch, CacheEnumService, CacheTroubleTicketService, Notification, FlowRuleConfigurationService) {

    $scope.isETAKUser = false;
    $scope.isETAKUser = LocalStorageProvider.isETAKUser();

    $scope.form = {}; //to set default name on UI Form
    $scope.currentPage = 1;

    $scope.keySearch = {
        keyFlowType: '',
    };
    var keySearchDefault = angular.copy($scope.keySearch);

    $scope.updateOnChangeFlowType = function (data) {
        $scope.keySearch = data;
        $scope.getSearch($scope.keySearch);
    }

    $scope.TTFlowType = [];
    CacheEnumService.getTTFlowType().then(function (result) {
        result.TTFlowTypeList.forEach(function (e) {
            e.value = e.FlowTypeId;
            e.name = e.Names.DefaultMessage;
        });;

        $scope.TTFlowType = result.TTFlowTypeList;
        if ($scope.TTFlowType.length > 0) {
            $scope.keySearch.keyFlowType = $scope.TTFlowType[0].value;
            keySearchDefault.keyFlowType = $scope.TTFlowType[0].value;
        }

        $scope.updateOnChangeFlowType($scope.keySearch);
    });

    $scope.Modal_RemoveTTFlowRuleModal = '';

    var cacheKey = 'TTFlowRuleData';
    $scope.CstData = '';
    $scope.getSearch = function (object, clearCache) {

        $scope.Modal_RemoveTTFlowRuleModal = ''; //setdefault

        $scope.selectedRow = undefined;
        $scope.data = undefined;

        CacheTroubleTicketService.getFlowRule(object, clearCache).then(function (result) {
            $scope.CstData = result.TTFlowRuleList;
        });

    };

    $scope.doing = function (param) {

        if (param == 'Add') {
            $scope.add.openAddTTFlowRuleInterface();
        }

        if ($scope.data != undefined) {
            if (param == 'Modify') {
                $scope.update.openModifyTTFlowRuleInterface($scope.data);
            }
        }
    }

    $scope.update = {};
    $scope.add = {};

    $scope.setClickedRow = function (data) {
        $scope.selectedRow = data;

        $scope.data = data;

        $scope.Modal_RemoveTTFlowRuleModal = '#RemoveTTFlowRuleModal';
    }

    $scope.deleteDisabled = false;

    $scope.removeTTFlowRule = function () {
        if ($scope.selectedRow == undefined) {
            Notification.error({
                message: '<span>Please select one</span>',
                positionY: 'top',
                positionX: 'center',
                delay: 10000
            });
        } else {
            var param = {
                FlowTypeId: $scope.selectedRow.FlowType.FlowTypeId,
                TypeId: $scope.selectedRow.Type.TypeId,
                SubTypeId: $scope.selectedRow.SubType.SubTypeId,
            };

            FlowRuleConfigurationService.TTFlowRuleDelete.delete(param, function (response) {
                if (response.ResultType != 0 || response.ResultCode != 0) {
                    Notification.error({
                        message: '<strong>Failed!</strong> <span>' + response.Messages + '.</span>',
                        positionY: 'top',
                        positionX: 'center'
                    });
                    angular.element('#RemoveTTFlowRuleModal').modal('hide');
                } else {
                    Notification.success({
                        message: '<strong>Success!</strong> <span>FlowRule Is Successfully deleted.</span>',
                        positionY: 'top',
                        positionX: 'center'
                    });

                    angular.element('#RemoveTTFlowRuleModal').modal('hide');
                    $scope.getSearch($scope.keySearch, clearCache = true);
                }
            })
        }

    }
});

CSRContent.controller("AddTTFlowRuleController", function ($scope, CommonEnum, CSRCache, CacheEnumService, CacheTroubleTicketService, Notification, FlowRuleConfigurationService) {

    $scope.add.openAddTTFlowRuleInterface = function () {

        angular.element('#AddTTFlowRuleModal').modal('show');

        $scope.add.TTType = [];
        CacheTroubleTicketService.getAllType().then(function (result) {
            result.TTTypeList.forEach(function (e) {
                e.name = e.NameId.DefaultMessage;
                e.value = e.TypeId;
            });
            $scope.add.TTType = result.TTTypeList;
        });

        $scope.add.TTSubType = [];
        CacheTroubleTicketService.getAllSubtype().then(function (result) {
            result.TTSubTypeList.forEach(function (e) {
                e.name = e.NameId.DefaultMessage;
                e.value = e.SubTypeId;
            });
            $scope.add.TTSubType = result.TTSubTypeList;
        });
    }

    $scope.submitAddTTFlowRule = function (data) {
        var param = {
            FlowTypeId: $scope.keySearch.keyFlowType,
            TypeId: data.TypeId.value,
            SubTypeId: data.SubTypeId.value,
        };

        FlowRuleConfigurationService.TTFlowRuleAdd.add(param, function (response) {
            if (response.ResultType != 0 || response.ResultCode != 0) {
                Notification.error({
                    message: '<strong>Failed!</strong> <span>' + response.Messages + '.</span>',
                    positionY: 'top',
                    positionX: 'center'
                });
                return false;
            } else {
                Notification.success({
                    message: '<strong>Success!</strong> <span>FlowRule Is Successfully Added.</span>',
                    positionY: 'top',
                    positionX: 'center'
                });

                $scope.add.TypeId = null;
                $scope.add.SubTypeId = null;

                angular.element('#AddTTFlowRuleModal').modal('hide');
                $scope.getSearch($scope.keySearch, clearCache = true);
            }
        });
    }

    $scope.datas = {

        field: [
            {
                type: "select",
                name: "TT_Type",
                size: 6,
                text: "TT_Type",
                model: "add.TypeId",
                required: true,
                value: "add.TTType",
                validation: [{ value: "mandatory" }]
            },
            {
                type: "select",
                name: "TT_Subtype",
                size: 6,
                text: "TT_Subtype",
                model: "add.SubTypeId",
                required: true,
                value: "add.TTSubType",
                validation: [{ value: "mandatory" }]
            },
        ],
        button: [
            {
                name: "btnSubmitAddTTFlowRule",
                type: "submit",
                text: "Submit",
                click: "submitAddTTFlowRule(add)"
            },
            {
                name: "btnCancelAddTTFlowRule",
                type: "cancel",
                text: "Cancel",
                click: "modal"
            }
        ]
    }
});

CSRContent.controller("ModifyTTFlowRuleController", function ($scope, CommonEnum, CSRCache, CacheEnumService, CacheTroubleTicketService, Notification, FlowRuleConfigurationService) {

    $scope.update.openModifyTTFlowRuleInterface = function (data) {

        $scope.update.data = data;

        angular.element('#ModifyTTFlowRuleModal').modal('show');

        $scope.update.TypeId = { name: data.Type.NameId.DefaultMessage, value: data.Type.TypeId };
        $scope.update.SubTypeId = { name: data.SubType.NameId.DefaultMessage, value: data.SubType.SubTypeId };

        $scope.update.TTFlowType = [];
        CacheEnumService.getTTFlowType().then(function (result) {
            result.TTFlowTypeList.forEach(function (e) {
                e.value = e.FlowTypeId;
                e.name = e.Names.DefaultMessage;
            });;

            $scope.update.TTFlowType = result.TTFlowTypeList;
            $scope.update.FlowTypeId = { name: data.FlowType.Names.DefaultMessage, value: data.FlowType.FlowTypeId };
        });

    }

    $scope.submitModifyTTFlowRule = function (data) {
        var param = {
            FlowTypeId: data.FlowTypeId.value,  //change from UI
            TypeId: data.TypeId.value,
            SubTypeId: data.SubTypeId.value,
        };
        
        var valid = false;
        if (data.data.Type.TypeId == param.TypeId && data.data.SubType.SubTypeId == param.SubTypeId && data.data.FlowType.FlowTypeId == param.FlowTypeId) {
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
            FlowRuleConfigurationService.TTFlowRuleUpdate.update(param, function (response) {
                if (response.ResultType != 0 || response.ResultCode != 0) {
                    Notification.error({
                        message: '<strong>Failed!</strong> <span>' + response.Messages + '.</span>',
                        positionY: 'top',
                        positionX: 'center'
                    });
                    return false;
                } else {
                    Notification.success({
                        message: '<strong>Success!</strong> <span>FlowRule Is Successfully Updated.</span>',
                        positionY: 'top',
                        positionX: 'center'
                    });

                    angular.element('#ModifyTTFlowRuleModal').modal('hide');
                    CSRCache.remove('FlowRule' + param.FlowTypeId.toString());  //remove Cache on another FlowType
                    $scope.getSearch($scope.keySearch, clearCache = true);
                }
            });
        }
    };

    $scope.datas = {

        field: [
            {
                type: "label",
                name: "TT_Type",
                size: 6,
                text: "TT_Type",
                model: "update.TypeId.name",
            },
            {
                type: "label",
                name: "TT_Subtype",
                size: 6,
                text: "TT_Subtype",
                model: "update.SubTypeId.name",
            },
            {
                type: "select",
                name: "Flow_Type",
                size: 6,
                text: "Flow_Type",
                model: "update.FlowTypeId",
                required: true,
                value: "update.TTFlowType",
                validation: [{ value: "mandatory" }]
            },
        ],
        button: [
            {
                name: "btnSubmitModifyTTFlowRule",
                type: "submit",
                text: "Submit",
                click: "submitModifyTTFlowRule(update)"
            },
            {
                name: "btnCancelModifyTTFlowRule",
                type: "cancel",
                text: "Cancel",
                click: "modal"
            }
        ]
    }
});
