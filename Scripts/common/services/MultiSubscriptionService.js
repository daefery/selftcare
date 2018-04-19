commonModule.factory('MultiSubscriptionsResource', function ($resource, ApiConnection) {
    return {
        getSubscriptionsList: $resource(ApiConnection + '/api/common/customers/:customerId/subscriptions?isActiveOnly=false', {}, {}),
        getOrderItem: $resource(ApiConnection + '/api/common/customers/orderitem/:subsidentifier', {}, {})
    }
});