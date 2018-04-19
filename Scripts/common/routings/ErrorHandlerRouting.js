ErrorHandler.config(function ($httpProvider) {
    $httpProvider.interceptors.push('httpRequestInterceptor');
});


ErrorHandler.run(function ($rootScope, Notification) {
    $rootScope.$on('responseError', function (event, message) {
      //  $rootScope.test = data;
        Notification.error({
            message: '<span>' + message + '</span>',
            positionY: 'bottom',
            positionX: 'center',
            delay: 10000,
            title: "<span ><h5 style='color: white;'>Oops, something went wrong!!!</h5></span>"
        });
    });

    $rootScope.$on('errorConnection', function (event) {
        //  $rootScope.test = data;
        Notification.error({
            message: '<span>Please make sure you have an internet connection and try refresh the page again.</span>',
            positionY: 'bottom',
            positionX: 'center',
            replaceMessage: true,
            delay: 10000,
            title: "<span ><h5 style='color: white;'>Network Error</h5></span>"
        });
    });
});
