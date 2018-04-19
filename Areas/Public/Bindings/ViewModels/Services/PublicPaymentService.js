'use strict';

publicContent.factory('chargeCreditCardService', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/payment/chargecreditcard');
});

publicContent.factory('getPaymentMethodsService', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/payment/getpaymentmethods');
});

publicContent.factory('createPaypalChargeAccountService', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/payment/createchargeaccount');
});

publicContent.factory('executePaypalAccountService', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/payment/executechargeaccount?PayerId:=PayerId&PaymentId:=PaymentId');
});

publicContent.factory('createCreditCardProfileService', function($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/payment/createcreditcardprofile');
});

publicContent.factory('initRegisterService', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/common/customers/initialregister?LandingPage=:LandingPage', { LandingPage: '@LandingPage' });
});

publicContent.factory('finalRegisterService', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/common/customers/finalregister?OrderNumber=:OrderNumber&ShippingMethod=:ShippingMethod&RegisterOrderCode=:RegisterOrderCode', { OrderNumber: '@OrderNumber', ShippingMethod: '@ShippingMethod', RegisterOrderCode: '@RegisterOrderCode' });
});