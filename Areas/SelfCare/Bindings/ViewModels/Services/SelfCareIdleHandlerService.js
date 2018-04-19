SelfCareContent.factory('SelfIdleHandler', function () {
    var IDLE_TIMEOUT = config.IdleTimeOut; // timeout const
    var _idleSecondsCounter = config.IdleSecondsCounter;
    var keepAliveCounter = 0;
    var start;
    return {
        StartIdleObserver: function () {
            window.onclick = function () {
                _idleSecondsCounter = 0;
                $("#idleinfo").hide();// dummy
                $("#countdown").hide();// dummy
                $("#idlelabel").hide();// dummy

            };
            document.onmousemove = function () {
                _idleSecondsCounter = 0;
                $("#idleinfo").hide();// dummy
                $("#countdown").hide();// dummy
                $("#idlelabel").hide();// dummy
            };
            document.onkeypress = function () {
                _idleSecondsCounter = 0;
                $("#idleinfo").hide();// dummy
                $("#countdown").hide();// dummy
                $("#idlelabel").hide();// dummy
            };
            start = setInterval(this.CheckIdleTime, 1000);
        },
        CheckIdleTime: function () {
            if (_idleSecondsCounter == 0) {
                keepAliveCounter++;
            } else {
                $("#idleinfo").text((_idleSecondsCounter) + " seconds");// dummy
                $("#idleinfo").show();// dummy
                $("#countdown").show();// dummy
                $("#idlelabel").show();// dummy
            }
            _idleSecondsCounter++;
            if (_idleSecondsCounter - 1 > IDLE_TIMEOUT) {
                clearInterval(start);
                //location.href = Console.rootPath + 'Authorization/Login';
                ClearCommonSession();
                keepAliveCounter = 0;
                $("#idleinfo").text("redirect to login"); // dummy
                $("#idleinfo").show();// dummy
            }
            var alive = document.getElementById("alive"); // dummy
            if (alive)// dummy
                alive.innerHTML = (keepAliveCounter) + " seconds";// dummy
        }
    }
});