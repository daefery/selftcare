commonModule.controller('EventsCtrl', function ($scope, Idle) {
    $scope.events = [];

    $scope.$on('IdleStart', function () {
        // the user appears to have gone idle
        $("#indicator").text("AWAY FROM KEYBOARD");
        $("#indicator").css("color", "goldenrod");
    });

    $scope.$on('IdleWarn', function (e, countdown) {
        // follows after the IdleStart event, but includes a countdown until the user is considered timed out
        // the countdown arg is the number of seconds remaining until then.
        // you can change the title or display a warning dialog from here.
        // you can let them resume their session by calling Idle.watch()
        $("#countdown").show();
        $("#countdown").text(countdown);
        $("#countdown").css("color","red");

    });

    $scope.$on('IdleTimeout', function () {
        // the user has timed out (meaning idleDuration + timeout has passed without any activity)
        // this is where you'd log them
        $("#indicator").text("Session is EXPIRED!!");
        $("#countdown").hide();
        $("#back").hide();
        $("#indicator").css("color", "red");
        location.href = Console.rootPath + 'Authorization/Login';
    });

    $scope.$on('IdleEnd', function () {
        // the user has come back from AFK and is doing stuff. if you are warning them, you can use this to hide the dialog
        $("#back").text("I'm BACK");
        $("#countdown").hide();
    });

    $scope.$on('Keepalive', function () {
        // do something to keep the user's session alive
        $("#indicator").text("Session is ALIVE!!");
        $("#indicator").css("color", "green");
        $("#back").hide();
    });

})
.config(function (IdleProvider, KeepaliveProvider) {
    // configure Idle settings
    IdleProvider.idle(3); // in seconds
    IdleProvider.timeout(3); // in seconds
    KeepaliveProvider.interval(2); // in seconds
})
.run(function (Idle) {
    // start watching when the app runs. also starts the Keepalive service by default.
    Idle.watch();
});