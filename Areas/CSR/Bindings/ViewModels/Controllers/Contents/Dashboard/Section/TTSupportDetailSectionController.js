CSRContent.controller('TTSupportDetailSectionController', function ($scope, $filter, CacheNavigationService) {
    var curModuleId = 122;
    CacheNavigationService.getSecureSection(curModuleId).then(function (result) {

        $scope.isSupportTTDetailAddCommentEnable = false;
        var SupportTTDetailAddComment = $filter('filter')(result, { SectionKey: 'SUPPORT_TT_DETAIL_ADD_COMMENT' })[0];
        if (SupportTTDetailAddComment != null) $scope.isSupportTTDetailAddCommentEnable = true;

        $scope.isSupportTTDetailDeleteCommentEnable = false;
        var SupportTTDetailDeleteComment = $filter('filter')(result, { SectionKey: 'SUPPORT_TT_DETAIL_DELETE_COMMENT' })[0];
        if (SupportTTDetailDeleteComment != null) $scope.isSupportTTDetailDeleteCommentEnable = true;

        $scope.isSupportTTDetailUpdateSupportEnable = false;
        var SupportTTDetailUpdateSupport = $filter('filter')(result, { SectionKey: 'SUPPORT_TT_DETAIL_UPDATE_SUPPORT' })[0];
        if (SupportTTDetailUpdateSupport != null) $scope.isSupportTTDetailUpdateSupportEnable = true;

        $scope.isSupportTTDetailEscalateSupportEnable = false;
        var SupportTTDetailEscalateSupport = $filter('filter')(result, { SectionKey: 'SUPPORT_TT_DETAIL_ESCALATE_SUPPORT' })[0];
        if (SupportTTDetailEscalateSupport != null) $scope.isSupportTTDetailEscalateSupportEnable = true;

        $scope.isSupportTTDetailCloseSupportEnable = false;
        var SupportTTDetailCloseSupport = $filter('filter')(result, { SectionKey: 'SUPPORT_TT_DETAIL_CLOSE_SUPPORT' })[0];
        if (SupportTTDetailCloseSupport != null) $scope.isSupportTTDetailCloseSupportEnable = true;
    });
});