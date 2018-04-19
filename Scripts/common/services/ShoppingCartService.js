commonModule.factory('ShoppingCartService', function (SessionService, AuthUtilityCommon) {
    
    return {
        GenerateSessionId: function () {
            SessionService.get(function (resp) {
                if (resp != null && resp.SessionId !== undefined && resp.CreationDate !== undefined) {
                    if (resp.SessionId !== "" && resp.CreationDate !== "") {
                        AuthUtilityCommon.StoreShoppingCartSessionId(resp);
                      //  AuthUtilityCommon.ClearSession("ShoppingCartSession");
                    }
                }   
            });
        },
        IsHasShoppingCartSessionId: function () {
            if (localStorage.ShoppingCartSession != null || localStorage.ShoppingCartSession !== undefined) {
                var obj = JSON.parse(localStorage.ShoppingCartSession);
                if (obj !== undefined && obj != null) {
                    if ((obj.SessionId != null && obj.SessionId !== undefined && obj.SessionId !== "")) {
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    return false;
                }
            } else {
                return false;
            }
            
        },
        CreateShoppingCartSession: function () {
            SessionService.get(function (resp) {
                if (resp != null && resp.SessionId !== undefined && resp.CreationDate !== undefined) {
                    if (resp.SessionId !== "" && resp.CreationDate !== "") {
                      //  AuthUtilityCommon.StoreShoppingCartSessionId(resp);
                      //  AuthUtilityCommon.ClearSession("ShoppingCartSession");
                    }
                }
            });
        },
        FilteringFeature: function (options) {
            var i;
            var mandatoryGroupFeatureList;
            var mandatorySpecifiedFeatureList;
            var optionalSpecifiedFeatureList;
            var optionalGroupFeatureList;

            for (i = 0; i < options.length ; i++) {
                if (options[i].MinOccurs == 1 && options[i].MaxOccurs > 0) {
                    if (options[i].ProductOfferingsInGroup !== undefined && options[i].ProductOfferingsInGroup.length > 0) {
                        mandatoryGroupFeatureList = options[i].ProductOfferingsInGroup;
                    }

                    if (options[i].SpecifiedProductOffering !== undefined) {
                        mandatorySpecifiedFeatureList = options[i].SpecifiedProductOffering;
                    }
                }
                if (options[i].MinOccurs == 0) {
                    if (options[i].ProductOfferingsInGroup !== undefined && options[i].ProductOfferingsInGroup.length > 0) {
                        optionalGroupFeatureList = options[i].ProductOfferingsInGroup;
                    }

                    if (options[i].SpecifiedProductOffering !== undefined) {
                        optionalSpecifiedFeatureList = options[i].SpecifiedProductOffering;
                    }
                }
            }

            var featureList = {
                MandatoryGroupFeatureList: mandatoryGroupFeatureList,
                MandatorySpecifiedFeatureList: mandatorySpecifiedFeatureList,
                OptionalGroupFeatureList: optionalGroupFeatureList,
                OptionalSpecifiedFeatureList: optionalSpecifiedFeatureList
               
            };
            return featureList;
        },
        SaveCartCount: function (newCount) {
            cartCount = newCount;
        },
        GetCartCount: function () {
            return (cartCount === undefined ? 0 : cartCount);
        }
        
    }
});

commonModule.factory('ShoppingCartHelper', function () {
    var cartCount;

    var saveCartCount = function (newCount) {
        cartCount = null;
        cartCount = newCount;
    };

    var getCartCount = function () {
        return cartCount;
    };

    return {
        SaveCartCount: saveCartCount,
        GetCartCount: getCartCount
    };
});

commonModule.factory('SessionService', function ($resource) {
    return $resource('/Utility/GetSessionId');
});

commonModule.factory('CreateShoppingCartService', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/shoppingcart/createsession', {}, {
        save: {
            method: 'POST'
        }
    });
});

commonModule.factory('UpdateShoppingCartService', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/shoppingcart/updatesession', {}, {
        update: {
            method: 'PUT'
        }
    });
});

commonModule.factory('RemoveShoppingCartService', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/shoppingcart/removesession?SessionId=:id', {}, {
        remove: {
            method: 'DELETE'
        }
    });
});

commonModule.factory('GetShoppingCartService', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/shoppingcart/getsession?SessionId=:id');
});