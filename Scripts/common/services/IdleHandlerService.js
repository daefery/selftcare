commonModule.factory('IdleHandler', function (RefreshTokenService, CommonEnum, AuthUtilityCommon) {
    config = sessionStorage.webConfig != undefined ? JSON.parse(sessionStorage.webConfig) : {};
    var IDLE_TIMEOUT = config.IdleTimeOut;
    var _idleSecondsCounter = config.IdleSecondsCounter;
    return {
        StartIdleObserver: function () {
            window.onclick = function () {
                _idleSecondsCounter = 0;
                // TO DO: code on below is used for refresh token testing
                // this code can be removed after implementation is finished
                //$("#idleinfo").hide();// dummy
                //$("#countdown").hide();// dummy
                //$("#idlelabel").hide();// dummy

            };
            document.onmousemove = function () {
                _idleSecondsCounter = 0;
                // TO DO: code on below is used for refresh token testing
                // this code can be removed after implementation is finished
                //$("#idleinfo").hide();// dummy
                //$("#countdown").hide();// dummy
                //$("#idlelabel").hide();// dummy
            };
            document.onkeypress = function () {
                _idleSecondsCounter = 0;
                // TO DO: code on below is used for refresh token testing
                // this code can be removed after implementation is finished
                //$("#idleinfo").hide();// dummy
                //$("#countdown").hide();// dummy
                //$("#idlelabel").hide();// dummy
            };
            IDLE_OBSERVER = setInterval(this.CheckIdleTime, 1000);
        },
        CheckIdleTime: function () {
            // TO DO: code on below is used for refresh token testing
            // this code can be removed after implementation is finished
            //if (_idleSecondsCounter > 0) {
            //    $("#idleinfo").text((_idleSecondsCounter) + " seconds");// dummy
            //    $("#idleinfo").show();// dummy
            //    $("#countdown").show();// dummy
            //    $("#idlelabel").show();// dummy
            //}
            //keepAliveCounter++;
            _idleSecondsCounter++;
            if (_idleSecondsCounter - 1 > IDLE_TIMEOUT) {
                clearInterval(IDLE_OBSERVER);
                ClearCommonSession();
                AuthUtilityCommon.clearSession();
                location.href = Console.rootPath + 'Authorization/Login';
                //keepAliveCounter = 0;
                // TO DO: code on below is used for refresh token testing
                // this code can be removed after implementation is finished
                //$("#idleinfo").text("redirect to login"); // dummy
                //$("#idleinfo").show();// dummy
            }
            // TO DO: code on below is used for refresh token testing
            // this code can be removed after implementation is finished
            //var alive = document.getElementById("alive"); // dummy
            //if (alive)// dummy
            //    alive.innerHTML = (keepAliveCounter) + " seconds";// dummy
            //if (keepAliveCounter == REFRESH_TOKEN_TIME) {
            //    var authData = JSON.parse(localStorage.AuthData);
            //    var obj = "grant_type=refresh_token&refresh_token=" + authData.refreshToken;
            //    RefreshTokenService.post({}, obj, function (resp) {
            //        try {
            //            AuthUtilityCommon.AuthSuccessHandler(resp,false);                
            //        } catch (err) {
            //            console.log(err);
            //        }
            //    }, function (error) {
            //        console.log(error);
            //    });
            //    keepAliveCounter = 0;
            //}
        }

    }
});

