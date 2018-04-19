//02.10.2015 Agung Meinastesi Caesar
//Themes Controller
//I join Jquery and angular in one controller, Angular is used to get/post data to server and Jquery is used to change the UI
CSRHeader.controller('themesCtrl', function ($scope, $http, ThemesService) {
    var authData = JSON.parse(localStorage.AuthData);
    var curUserId = authData.uid;
    var curThemeId = authData.theme_id;
    //
    function themeUpdate(themeId, isUpdateDb) {
        $('head').append('<link rel="stylesheet" href="/Areas/CSR/Content/styles/themes/theme' + themeId + '.css" type="text/css" />');
        //
        if (isUpdateDb) {
            ThemesService.get({ UserId: authData.uid, ThemeId: themeId });
            authData.theme_id = themeId;
            localStorage.AuthData = JSON.stringify(authData);
        };
    };
    ThemesService.get({ UserId: curUserId, ThemeId: curThemeId }, function (data) {
        themesdata = data.theme;
        if (themesdata == 'themes1') { themeUpdate(1, false); };
        if (themesdata == 'themes2') { themeUpdate(2, false); };
        if (themesdata == 'themes3') { themeUpdate(3, false); };
        if (themesdata == 'themes4') { themeUpdate(4, false); };
    });
    this.changeThemesOne = function () {
        themeUpdate(1, true);
    };
    this.changeThemesTwo = function () {
        themeUpdate(2, true);
    };
    this.changeThemesThree = function () {
        themeUpdate(3, true);
    };
    this.changeThemesFour = function () {
        themeUpdate(4, true);
    };
});