SelfCareContent.factory("RevenueService", function ($resource, ApiConnection) {
    return {
        getBuckets: $resource(ApiConnection + '/api/common/revenue/querybuckets?MobileNumber=:mobileNumber&BalanceType=:balanceType&SweepOn=:sweepOn', {}, {}),
    }
});