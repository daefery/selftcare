'use strict';

CSRContent.factory('AdvanceSearchService', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/csr/customers/pagination?PageNumber=:PageNumber&RowsPerPage=:RowsPerPage&OrderBy=:OrderBy&CustomerId=:CustomerId&SubscriptionId=:SubscriptionId&IMSI=:IMSI&CustomerName=:CustomerName&MSISDN=:MSISDN&ICCID=:ICCID&IMEI=:IMEI&IdNumber=:IdNumber&Email=:Email&FiscalUnitId=:FiscalUnitId', {})
});