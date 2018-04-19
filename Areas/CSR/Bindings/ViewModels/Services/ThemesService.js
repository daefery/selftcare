'use strict';
CSRContent.factory('ThemesService', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/CSRThemes?UserId=:UserId&ThemeId=:ThemeId', { UserId: '@MUserId', ThemeId: '@ThemeId' }, {
        get: {
            method: 'GET',
            cache: true
        }
    });
});
