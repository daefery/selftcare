SelfCareContent.factory("GetTroubleTicket", function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/selfcare/troubleticket/:customerid', {}, {});
});

SelfCareContent.factory("DetailTroubleTicket", function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/common/troubleticket/detail/:Id', {}, {});
});

SelfCareContent.factory("CommentTroubleTicket", function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/common/troubleticket/comment/create', {}, {
        
    });
});