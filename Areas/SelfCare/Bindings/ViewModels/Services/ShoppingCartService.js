SelfCareContent.factory('SelfShoppingCartResource', function ($resource, ApiConnection) {
    return {
        getsessioncart: $resource(ApiConnection + '/api/selfshoppingcart/getsession', {}, {}),
        removesessioncart: $resource(ApiConnection + '/api/selfshoppingcart/removesession', {}, {
            removeSession: {
                method:"DELETE"
            }
        }),
        updatesessioncart: $resource(ApiConnection + '/api/selfshoppingcart/updatesession', {}, {}),
        updatesessioncart: $resource(ApiConnection + '/api/selfshoppingcart/updatesession', {}, {}),
        createsessioncart: $resource(ApiConnection + '/api/selfshoppingcart/createsession', {}, {}),

        checkoutcart: $resource(ApiConnection + '/api/selfshoppingcart/checkout', {}, {}),
        createorder: $resource(ApiConnection + '/api/selfshoppingcart/createorder', {}, {}),
        validateorder: $resource(ApiConnection + '/api/selfshoppingcart/validateorder', {}, {}),
        getorderitem: $resource(ApiConnection + '/api/common/orders/:OrderNumber', {}, {}),
    }
});