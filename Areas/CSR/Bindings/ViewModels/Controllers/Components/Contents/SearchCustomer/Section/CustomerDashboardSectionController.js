CSRContent.controller('CustomerDashboardSectionController', function ($scope, $filter, CSRSecureSection) {
    CSRSecureSection.get({ ModuleId: 29 }, function (result) {
        //check for Billing Info & Invoices secure section
        $scope.isBillingInvoicesEnable = false;
        var objectBilling = $filter('filter')(result, { SectionKey: 'BILLING_INFO_INVOICES' })[0];
        if (objectBilling != null) $scope.isBillingInvoicesEnable = true;
    });
});