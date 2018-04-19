SelfCareContent.factory("BuyMoreService", function ($resource, ApiConnection) {
    return {
        VoucherTopUp: $resource(ApiConnection + '/api/selfcare/payment/vouchertopup', {}, {}),
        AdjustBalance: $resource(ApiConnection + '/api/common/customer/adjustbalance', {}, {}),
        getProduct: $resource(ApiConnection + '/api/common/products/msisdn/:msisdn', {}, {}),

        removeFeature: $resource(ApiConnection + '/api/common/product/removefeature', {}, {
            save:
            {
                method: 'POST'
            }
        })
    }
});