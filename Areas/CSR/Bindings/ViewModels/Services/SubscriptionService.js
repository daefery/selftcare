CSRContent.factory('SubscriptionService', function ($resource, ApiConnection) {
    return {
        SwapMDN: $resource(ApiConnection + '/api/csr/customers/swapmdn', {}, {
            save: {
                method: 'POST'
            }
        }),
        SwapESN: $resource(ApiConnection + '/api/csr/customers/swapesn', {}, {
            save: {
                method: 'POST'
            }
        }),
        SwapSimCard: $resource(ApiConnection + '/api/common/customer/swapsimcard', {}, {
            save: {
                method: 'POST'
            }
        }),
        NewCC: $resource(ApiConnection + '/api/payment/paymentmean/add', {}, {
            save: {
                method: 'POST'
            }
        }),
        SetDefaultCC: $resource(ApiConnection + '/api/common/customer/setdefaultpaymentmean', {}, {
            save: {
                method: 'POST'
            }
        }),
        //api/common/customers/paymentmeans/{customerid}
        CustomerCC: $resource(ApiConnection + '/api/common/customers/paymentmeans/:customerid', {}, {
            query: {
                method: 'GET'
            }
        }),
    }
});