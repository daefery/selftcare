'use strict';
//api/csr/devices
CSRContent.factory('UploadtoTestService', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/csr/test?localFilePath=:localFilePath&filename=:filename', {}, {
        save: {
            method: 'POST'
        }
    });
});

//api/payment/createchargeaccount
CSRContent.factory('CSRCreateChargeAccountService', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/payment/createchargeaccount', { method: 'POST' });
});

//POST api/payment/chargecreditcard
CSRContent.factory('CSRChargeCCService', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/payment/createchargeaccount', { method: 'POST' });
});

//GET api/payment/executechargeaccount?PayerId={PayerId}&PaymentId={PaymentId}&LandingPage={LandingPage}
CSRContent.factory('CSRExecuteCCService', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/payment/executechargeaccount?PayerId=:PayerId&PaymentId=:PaymentId&LandingPage=:LandingPage', { method: 'GET' });
});

//api / common / customers / adjustbalance
CSRContent.factory('CSRAdjustBalanceService', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/common/customers/adjustbalance', {}, {
        save: {
            method: 'POST'
        }
    });
});

//api/selfcare/payment/vouchertopup
CSRContent.factory('CSRAdjustwithVoucherService', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/selfcare/payment/vouchertopup', {}, {
        save: {
            method: 'POST'
        }
    });
});

//customers/balance/{msisdn}
CSRContent.factory('CSRGetCustomerBalanceService', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/common/balance/:mobileNumber', { method: 'GET' });
});

//GET api/common/customers/{parentId}/child
CSRContent.factory('GetMultiDevicebyParentService', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/common/customers/parentchild?customerId=:customerId&msisdn=:msisdn', { method: 'GET' });
});