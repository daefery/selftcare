CSRContent.controller('CustomerDashboardSectionController', function ($scope, $filter, CacheNavigationService) {
    var curModuleId = 29;
    CacheNavigationService.getSecureSection(curModuleId).then(function (result) {
        //TROUBLE TICKET
        $scope.isCustomerSummary_NewTTEnable = false;
        var CustomerSummary_NewTT = $filter('filter')(result, { SectionKey: 'CustomerSummary_NewTT' })[0];
        if (CustomerSummary_NewTT != null) $scope.isCustomerSummary_NewTTEnable = true;

        $scope.isCustomerSummary_DetailTTEnable = false;
        var CustomerSummary_DetailTT = $filter('filter')(result, { SectionKey: 'CustomerSummary_DetailTT' })[0];
        if (CustomerSummary_DetailTT != null) $scope.isCustomerSummary_DetailTTEnable = true;

        //SUBSCRIPTION LIST
        $scope.isCustomerSummary_SubscriptionSwitchEnable = false;
        var CustomerSummary_SubscriptionSwitch = $filter('filter')(result, { SectionKey: 'CustomerSummary_SubscriptionSwitch' })[0];
        if (CustomerSummary_SubscriptionSwitch != null) $scope.isCustomerSummary_SubscriptionSwitchEnable = true;

        //SUBSCRIPTION INFO - Subscription Options
        $scope.isSubscriptionOptionsEnable = false;
        var objectSubscriptionOptions = $filter('filter')(result, { SectionKey: 'SUBSCRIPTION_OPTIONS' })[0];
        if (objectSubscriptionOptions != null) $scope.isSubscriptionOptionsEnable = true;

        $scope.isCustomerSummary_UpdateSubscriptionOptionsEnable = false;
        var CustomerSummary_UpdateSubscriptionOptions = $filter('filter')(result, { SectionKey: 'CustomerSummary_UpdateSubscriptionOptions' })[0];
        if (CustomerSummary_UpdateSubscriptionOptions != null) $scope.isCustomerSummary_UpdateSubscriptionOptionsEnable = true;

        $scope.isCustomerSummary_AdjustBalanceEnable = false;
        var CustomerSummary_AdjustBalance = $filter('filter')(result, { SectionKey: 'CustomerSummary_AdjustBalance' })[0];
        if (CustomerSummary_AdjustBalance != null) $scope.isCustomerSummary_AdjustBalanceEnable = true;

        $scope.isCustomerSummary_ButtonActionEnable = false;
        var CustomerSummary_ButtonAction = $filter('filter')(result, { SectionKey: 'CustomerSummary_ButtonAction' })[0];
        if (CustomerSummary_ButtonAction != null) $scope.isCustomerSummary_ButtonActionEnable = true;
        
        $scope.isCustomerSummary_DeactivateSubscriptionEnable = false;
        var CustomerSummary_DeactivateSubscription = $filter('filter')(result, { SectionKey: 'CustomerSummary_DeactivateSubscription' })[0];
        if (CustomerSummary_DeactivateSubscription != null) $scope.isCustomerSummary_DeactivateSubscriptionEnable = true;

        $scope.isCustomerSummary_ManageAutoPayEnable = false;
        var CustomerSummary_ManageAutoPay = $filter('filter')(result, { SectionKey: 'CustomerSummary_ManageAutoPay' })[0];
        if (CustomerSummary_ManageAutoPay != null) $scope.isCustomerSummary_ManageAutoPayEnable = true;

        //ORDERS
        $scope.isCustomerSummary_ViewOrderEnable = false;
        var CustomerSummary_ViewOrder = $filter('filter')(result, { SectionKey: 'CustomerSummary_ViewOrder' })[0];
        if (CustomerSummary_ViewOrder != null) $scope.isCustomerSummary_ViewOrderEnable = true;

        $scope.isCustomerSummary_NewOrderEnable = false;
        var CustomerSummary_NewOrder = $filter('filter')(result, { SectionKey: 'CustomerSummary_NewOrder' })[0];
        if (CustomerSummary_NewOrder != null) $scope.isCustomerSummary_NewOrderEnable = true;

        //check for Billing Info & Invoices secure section
        $scope.isBillingInvoicesEnable = false;
        var objectBilling = $filter('filter')(result, { SectionKey: 'BILLING_INFO_INVOICES' })[0];
        if (objectBilling != null) $scope.isBillingInvoicesEnable = true;

        $scope.isCustomerSummary_AdjustInvoiceEnable = false;
        var CustomerSummary_AdjustInvoice = $filter('filter')(result, { SectionKey: 'CustomerSummary_AdjustInvoice' })[0];
        if (CustomerSummary_AdjustInvoice != null) $scope.isCustomerSummary_AdjustInvoiceEnable = true;

        //Balance & Adjustment
        $scope.isBalanceAdjustmentEnable = false;
        var BALANCE_ADJUSTMENT = $filter('filter')(result, { SectionKey: 'BALANCE_ADJUSTMENT' })[0];
        if (BALANCE_ADJUSTMENT != null) $scope.isBalanceAdjustmentEnable = true;

        $scope.isCustomerSummary_Balance_AdjustBalanceEnable = false;
        var CustomerSummary_Balance_AdjustBalance = $filter('filter')(result, { SectionKey: 'CustomerSummary_Balance_AdjustBalance' })[0];
        if (CustomerSummary_Balance_AdjustBalance != null) $scope.isCustomerSummary_Balance_AdjustBalanceEnable = true;

    });
});