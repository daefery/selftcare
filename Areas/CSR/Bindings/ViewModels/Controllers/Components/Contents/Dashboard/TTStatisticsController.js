CSRContent.controller('TTStatisticsController', function ($scope, CacheTroubleTicketService, LocalStorageProvider, CacheEnumService) {

    $scope.isETAKUser = false;
    $scope.isETAKUser = LocalStorageProvider.isETAKUser();

    $scope.form = {}; //to set default name on UI Form

    $scope.keySearch = {
        MvnoId: ''
    };
    var keySearchDefault = angular.copy($scope.keySearch);

    $scope.updateOnChangeMVNO = function (data) {
        $scope.keySearch = data;
        $scope.getSearch($scope.keySearch);
    }

    $scope.TTMVNO = [];
    CacheEnumService.getTTMVNO().then(function (result) {
        result.forEach(function (e) {
            e.value = e.dealerid;
            e.name = e.mvnoname;
        });

        $scope.TTMVNO = result;

        //$scope.keySearch.keyMVNO = $scope.TTMVNO[0].value; // selected first index
        result.forEach(function (e) {
            // selected index
            if (LocalStorageProvider.getMvnoid() == e.orgid) {
                $scope.keySearch.MvnoId = e.value;
            }
        })

        $scope.updateOnChangeMVNO($scope.keySearch);
    });

    var colors = [ '#ff1a1a', '#33ccff','#0000b3','#ffff1a','#ff00ff','#39ac39','#330033', '#ff99ff','#00b2b3'];

    $scope.getSearch = function (object, clearCache) {
        CacheTroubleTicketService.getStatisticsData(object, clearCache).then(function (result) {
            var data = [];

            console.log('result', result);
            var responseData = result.TTChartValues;
            var lengthData = responseData.length;
            if (lengthData > 0)
            {
                for (var i = 0; i < lengthData; i++) {
                    var item = {
                        value: responseData[i].Total,
                        color: colors[i],
                        label: responseData[i].Name
                    }

                    data.push(item);
                }
            }
         
            var context = document.getElementById('chart').getContext('2d');
            var myPieChart = new Chart(context).Pie(data);
            document.getElementById('legend').innerHTML = myPieChart.generateLegend();
            
           
        });
    }
   
    
});