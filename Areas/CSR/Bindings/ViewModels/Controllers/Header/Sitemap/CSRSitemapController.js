CSRContent.controller('SitemapCtrl', function ($scope, $modal, $http, CSRSitemap, CacheAdmin) {

    $scope.openSitemapModal = function () {
        CacheAdmin.getSitemap().then(function (result) {
            $scope.moduletree = result;

            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'Templates/Common/DynamicNavigation/Sitemap.html',
                controller: 'SitemapModalCtrl',
                scope: $scope,
                size: 'lg'
            });

            //Hardcode showed link
            var skim = function (arr) {
                arr.forEach(function (element) {
                    if ((element.ModuleDescription === '') || (element.ModuleDescription === null)) {
                        element.ModuleDescription = '-No Description Yet-';
                    }
                    skim(element.Child);
                });
            }
            skim($scope.moduletree);
        });
    };
});


CSRContent.controller('SitemapModalCtrl', function ($scope, $modalInstance) {

    $scope.close = function () {
        $modalInstance.close();
    };
});
