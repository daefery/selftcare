CSRContent.controller('CustomerDetailSectionController', function ($scope, $filter, CacheNavigationService) {
    var curModuleId = 46;
    CacheNavigationService.getSecureSection(curModuleId).then(function (result) {

        $scope.isEditCustomerEnable = false;
        var EditCustomerDetail = $filter('filter')(result, { SectionKey: 'EDIT_CUSTOMER_DETAIL' })[0];
        if (EditCustomerDetail != null) $scope.isEditCustomerEnable = true;

        $scope.isDeleteCustomerEnable = false;
        var DeleteCustomerDetail = $filter('filter')(result, { SectionKey: 'DELETE_CUSTOMER_DETAIL' })[0];
        if (DeleteCustomerDetail != null) $scope.isDeleteCustomerEnable = true;

        $scope.isSuspendCustomerEnable = false;
        var SuspendCustomer = $filter('filter')(result, { SectionKey: 'SUSPEND_CUSTOMER_DETAIL' })[0];
        if (SuspendCustomer != null) $scope.isSuspendCustomerEnable = true;

        $scope.isModifyCustomerStatusEnable = false;
        var ModifyCustomerStatus = $filter('filter')(result, { SectionKey: 'MODIFY_CUSTOMER_STATUS' })[0];
        if (ModifyCustomerStatus != null) $scope.isModifyCustomerStatusEnable = true;
    
        $scope.isModifyLanguageSettingEnable = false;
        var ModifyLanguageSetting = $filter('filter')(result, { SectionKey: 'MODIFY_LANGUAGE_SETTING' })[0];
        if (ModifyLanguageSetting != null) $scope.isModifyLanguageSettingEnable = true;
    });
});