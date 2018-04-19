commonModule.factory('RefreshTokenService', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/Token', {}, {
        post: {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Accept': "*/*" }
        }
    });

});