commonModule.controller("LogoutController", function ($scope, AuthUtilityCommon) {
    this.destroySession = function () {
        AuthUtilityCommon.clearSession();
        clearInterval(IDLE_OBSERVER);
        location.href = Console.rootPath + 'Authorization/Login';
    };
});