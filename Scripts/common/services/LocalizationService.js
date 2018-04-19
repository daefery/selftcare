commonModule.factory('LocalizationService', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/LocalizationController?key=' + ':key' + '&id=' + ':id', { key: '@_key', id: '@_id' }, {
        /*
        update: {
            method: 'PUT'
        },
        */
        get: {
            method: 'GET',
            cache: true
        }
    });
});