commonModule.controller('LocalizationController', function ($translate, $scope, LocalizationService) {
    $scope.lang = {};
    $scope.languages = {
        'en': { name: 'English-US', code: 'en' },
        'es': { name: 'Spanish', code :'es'}
        //,'id': { name: 'Indonesian', code: 'id' }
    };
    // Default language is english
    $scope.initialize = function () {


        var authData = JSON.parse(localStorage.AuthData);
        if (authData.langCode == undefined) {
            authData.langCode = 'en';
        }
        var langKey = authData.langCode;

        $scope.SelectedLanguage = $scope.languages[langKey];
        localStorage.langCode = langKey;
        localStorage.AuthData = JSON.stringify(authData);

        LocalizationService.get({ key: langKey, id: 0 }, function (result) {
            $scope.resourceFile = result;
            $scope.lang = angular.copy(result);

            $translate.injectResource(langKey, $scope.resourceFile);
            $translate.use(langKey);
        });

    }

    $scope.startingPage = function () {

        LocalizationService.get({ key: "", id: 0 }, function (result) {
            $scope.resourceFile = result;
            $scope.lang = angular.copy(result);
        });
    }

    $scope.changeLanguage = function (langKey) {
        
        $scope.SelectedLanguage = $scope.languages[langKey];
        var authData = JSON.parse(localStorage.AuthData);
        authData.langCode = langKey;
        localStorage.langCode = langKey;
        localStorage.AuthData = JSON.stringify(authData)

        LocalizationService.get({ key: langKey, id: authData.uid }, function (result) {
            $scope.resourceFile = result;
            $scope.lang = angular.copy(result);
            $translate.injectResource(langKey, $scope.resourceFile)
            $translate.use(langKey);
        });

    };
});