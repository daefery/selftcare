CSRContent.controller('TTQuestionConfigurationSectionController', function ($scope, $filter, CacheNavigationService) {
    var curModuleId = 99;
    CacheNavigationService.getSecureSection(curModuleId).then(function (result) {

        $scope.isTTQuestionLibAddEnable = false;
        var TTQuestionLibAdd = $filter('filter')(result, { SectionKey: 'TT_QUESTION_LIB_ADD' })[0];
        if (TTQuestionLibAdd != null) $scope.isTTQuestionLibAddEnable = true;

        $scope.isTTQuestionLibModifyEnable = false;
        var TTQuestionLibModify = $filter('filter')(result, { SectionKey: 'TT_QUESTION_LIB_MODIFY' })[0];
        if (TTQuestionLibModify != null) $scope.isTTQuestionLibModifyEnable = true;

        $scope.isTTQuestionLibRemoveEnable = false;
        var TTQuestionLibRemove = $filter('filter')(result, { SectionKey: 'TT_QUESTION_LIB_REMOVE' })[0];
        if (TTQuestionLibRemove != null) $scope.isTTQuestionLibRemoveEnable = true;

    });
});