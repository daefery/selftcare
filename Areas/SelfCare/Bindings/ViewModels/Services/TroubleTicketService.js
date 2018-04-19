SelfCareContent.factory("TroubleTicketService", function ($resource, ApiConnection) {
    return {
        TTCategory: $resource(ApiConnection + '/api/common/troubleticket/type?MvnoId=:MvnoId', {}, {}),
        TTCreate: $resource(ApiConnection + '/api/selfcare/troubleticket/:customerid', {}, {})
    }
});