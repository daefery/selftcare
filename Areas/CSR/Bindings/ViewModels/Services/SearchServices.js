'use strict';

CSRContent.factory('ListDataService', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/PaginationData', {
        update: {
            method: 'PUT'
        }
    });
});

CSRContent.factory('SearchPageService', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/csr/Search?CustomerId=:customerId&PhoneNumber=:phoneNumber', { method: 'GET', isArray: true });
});

CSRContent.factory('SearchCustomerGeneralInfoService', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/csr/customers/:customerId/info', { method: 'GET' });
});

CSRContent.factory('GetCustomerIdByPhoneNumberService', function ($resource, ApiConnection) {;
    return $resource(ApiConnection + '/api/csr/customersbymsisdn/:phoneNumber', { method: 'GET' });
});

CSRContent.factory('SearchCustomerDetailService', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/csr/customers/:customerIdtemp', { method: 'GET' });
});

CSRContent.factory('SearchCustomerTroubleTicketsService', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/csr/customers/:customerIdtemp/troubleticket', {});
});

CSRContent.factory('ViewTroubleTicketByCustomerIdService', function ($resource, ApiConnection) {
    return $resource(ApiConnection + 'api/csr/troubleticket/ttinfobycustid?CustomerId=1673007293&PageNumber=1&PageSize=10', {});
});

CSRContent.factory('SearchMultiSubscriptionByCustomerIdService', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/csr/customer/subscriptions/:customerId', { method: 'GET' });
});
CSRContent.factory('SearchSubscriptionByMSISDNService', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/common/customers/:MSISDN/subscriptionpromotion', { method: 'GET' });
});

CSRContent.factory('GetCustomerProductsByMSISDNService', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/csr/customers/products?MobileNumber=:MobileNumber', { method: 'GET' });
});