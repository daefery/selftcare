resendKey.factory('ResendKeyApiService', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/accounts/ResendKey?Email=:email', {},{});
});