accountConfirm.factory('AccountConfirmation', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/accounts/confirm', null,
    {
        confirm: { method: 'PUT' }
    });
});