CSRContent.controller('TTWorkflowConfigurationSectionController', function ($scope, $filter, CacheNavigationService) {
    var curModuleId = 83;
    CacheNavigationService.getSecureSection(curModuleId).then(function (result) {
        
        $scope.isTTWorkflowAddEnable = false;
        var TTWorkflowAdd = $filter('filter')(result, { SectionKey: 'TT_WORKFLOW_ADD' })[0];
        if (TTWorkflowAdd != null) $scope.isTTWorkflowAddEnable = true;
        
        $scope.isTTWorkflowModifyEnable = false;
        var TTWorkflowModify = $filter('filter')(result, { SectionKey: 'TT_WORKFLOW_MODIFY' })[0];
        if (TTWorkflowModify != null) $scope.isTTWorkflowModifyEnable = true;
        
        $scope.isTTWorkflowRemoveEnable = false;
        var TTWorkflowRemove = $filter('filter')(result, { SectionKey: 'TT_WORKFLOW_REMOVE' })[0];
        if (TTWorkflowRemove != null) $scope.isTTWorkflowRemoveEnable = true;
        
        $scope.isTTWorkflowAddFromTemplateEnable = false;
        var TTWorkflowAddFromTemplate = $filter('filter')(result, { SectionKey: 'TT_WORKFLOW_ADD_FROM_TEMPLATE' })[0];
        if (TTWorkflowAddFromTemplate != null) $scope.isTTWorkflowAddFromTemplateEnable = true;
        
        $scope.isTTWorkflowAddDepartmentEnable = false;
        var TTWorkflowAddDepartment = $filter('filter')(result, { SectionKey: 'TT_WORKFLOW_ADD_DEPARTMENT' })[0];
        if (TTWorkflowAddDepartment != null) $scope.isTTWorkflowAddDepartmentEnable = true;

        $scope.isTTWorkflowDraftModeEnable = false;
        var TTWorkflowDraftMode = $filter('filter')(result, { SectionKey: 'TT_WORKFLOW_DRAFT_MODE' })[0];
        if (TTWorkflowDraftMode != null) $scope.isTTWorkflowDraftModeEnable = true;

    });
});