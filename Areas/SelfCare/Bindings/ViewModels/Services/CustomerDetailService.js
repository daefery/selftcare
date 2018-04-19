'use strict';
SelfCareContent.factory('CustomerInfo', function ($resource, ApiConnection) {
    return {
        getcustomerinfo : $resource(ApiConnection + '/api/selfcare/customer/info/:customerid', {}, {}),
        updatecustomerinfo: $resource(ApiConnection + '/api/selfcare/customer/info', {}, {
            update: {
                method: 'PUT'
            }
        }),
        getsubscriptionbycustomerid: $resource(ApiConnection + '/api/selfcare/customers/subscription/:customerid', {}, {}),
        getsubscriptionsbycustomerid: $resource(ApiConnection + '/api/selfcare/customer/subscriptions/:customerid', {}, {}),
        getbalanceET: $resource(ApiConnection + '/api/selfcare/customer/subscription/active/:customerid', {}, {}),
        getbalanceETNA: $resource(ApiConnection + '/api/selfcare/customers/balance/:mdn', {}, {}),
        getbalanceCommon: $resource(ApiConnection + '/api/common/balance/:mobileNumber', {}, {}),
        getusageET: $resource(ApiConnection + '/api/selfcare/customer/usage?customerid=:customerid&MSISDN=:MSISDN&StartDate=:StartDate&EndDate=:EndDate', {}, {}),
        getRmPromotionUsage: $resource(ApiConnection + '/api/common/revenue/rmpromotionusagemsisdn/:msisdn', {}, {}),

    }
});

SelfCareContent.factory('UpdatePassword', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/selfcare/accounts/changepassword', {}, {
        update: {
            method: 'PUT'
        }
    });
});