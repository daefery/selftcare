CSRContent.controller('TTQuestionCodeConfigurationSectionController', function ($scope, $filter, CacheNavigationService) {
    var curModuleId = 98;
    CacheNavigationService.getSecureSection(curModuleId).then(function (result) {

        $scope.isTTQuestionCodeAddEnable = false;
        var TTQuestionCodeAdd = $filter('filter')(result, { SectionKey: 'TT_QUESTION_CODE_ADD' })[0];
        if (TTQuestionCodeAdd != null) $scope.isTTQuestionCodeAddEnable = true;

        $scope.isTTQuestionCodeModifyEnable = false;
        var TTQuestionCodeModify = $filter('filter')(result, { SectionKey: 'TT_QUESTION_CODE_MODIFY' })[0];
        if (TTQuestionCodeModify != null) $scope.isTTQuestionCodeModifyEnable = true;

        $scope.isTTQuestionCodeRemoveEnable = false;
        var TTQuestionCodeRemove = $filter('filter')(result, { SectionKey: 'TT_QUESTION_CODE_REMOVE' })[0];
        if (TTQuestionCodeRemove != null) $scope.isTTQuestionCodeRemoveEnable = true;

    });
});