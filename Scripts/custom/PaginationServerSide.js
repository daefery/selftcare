/*
 * paginationServerSide - AngularJS module for paginating from serverside.
 *
 * Created by:
 * Revani Bagus Amrulloh
 * On 24 Nov 2015
 */

angular.module('serverSidePaginationFrameWorkModule',[])
.directive('serverSidePaging', function ($compile) {
    return {
        restrict: 'E',
        replace: true,
        link: function (scope, element, attr) {

            var template = attr.totalPage,
            functionName = attr.functionName,
            maxGrid = attr.maxGrid,
            activePage = 1,
            firstGrid = '<ul class="pagination" ng-controller="pagingServerSideController">',
            lastGrid = '</ul>'
            
            var lowerLimit = maxGrid / 2;
            var checkValue = lowerLimit.toString();
            if (checkValue.indexOf(".") > -1) {
                lowerLimit = parseInt(checkValue.substring(0, checkValue.indexOf('.'))) + 1;
            }

            var upperLimit = lowerLimit - 1;

            function compilePaging(grid) {
                CompleteGrid = firstGrid + grid + lastGrid

                element.html(CompleteGrid)
                $compile(element.contents())(scope);
            };

            function checkActive(activePage, i) {
                if (i === activePage) {
                    grid += '<li class="active" ><a ng-click="pagingActivePointer(' + i + ')">' + i + '</a></li>'
                }
                else {
                    grid += '<li style="cursor:pointer"><a ng-click="pagingActivePointer(' + i + ')">' + i + '</a></li>'
                };
                return grid
            }

            function middlePaging(activePage) {
                grid = '';
                for (i = upperLimit ; i > 0; i--) {
                    grid += '<li style="cursor:pointer"><a ng-click="pagingActivePointer(' + (activePage - i) + ')">' + (activePage - i) + '</a></li>'
                }
                grid += '<li class="active"><a ng-click="pagingActivePointer(' + (activePage) + ')">' + (activePage) + '</a></li>'

                for (i = 1; i <= upperLimit; i++) {
                    grid += '<li style="cursor:pointer"><a ng-click="pagingActivePointer(' + (activePage + i) + ')">' + (activePage + i) + '</a></li>'
                }

                return grid;
            };
            function beginPaging(activePage) {
                grid = '';
                if (template < maxGrid) {
                    countPage = template
                }
                else {
                    countPage = maxGrid
                };
                for (i = 1; i <= countPage; i++) {
                    grid = checkActive (activePage,i)
                }
                return grid;
            };
            function endPaging(activePage) {
                grid = '';
                for (i = template - (maxGrid - 1) ; i <= template; i++) {
                    if (i > 0) {
                        grid = checkActive(activePage, i)
                    }
                }
                return grid;
            };

            function checkServerPaging(activePage) {
                activePage = parseInt(activePage);
                startSymbolServerSidePaging = '';
                endSymbolServerSidePaging = '';
                template = parseInt(template)

                if (template > maxGrid) {
                    startSymbolServerSidePaging = '<li style="cursor:pointer"><a ng-click="pagingActivePointer(1)"><<</a></li>' +
                                                    '<li style="cursor:pointer"><a ng-click="pagingActivePointer(' + (activePage - 1) + ')"><</a></li>'
                    endSymbolServerSidePaging = '<li style="cursor:pointer"><a ng-click="pagingActivePointer(' + (activePage + 1) + ')">></a></li>' +
                                                    '<li style="cursor:pointer"><a ng-click="pagingActivePointer(' + template + ')">>></a></li>'
                    activePage = parseInt(activePage)

                    if (activePage === 1) {
                        var startSymbolServerSidePaging = '<li><a class="disabled" style="cursor:no-drop"><<</a></li>' +
                                                            '<li><a class="disabled" style="cursor:no-drop"><</a></li>'
                    }
                    else if (activePage === template) {
                        endSymbolServerSidePaging = '<li><a class="disabled" style="cursor:no-drop">></a></li>' +
                                                    '<li><a class="disabled" style="cursor:no-drop">>></a></li>'
                    }
                };

                var clickerYourFunction = '<a id="pagingServerSideClicker" ng-click="' + functionName + '(' + activePage + ')"></a>' +
                    '<div class="col-sm-12 no-padding">Page ' + activePage + ' of ' + template + ' pages</div>'
                if (activePage <= (lowerLimit)) {
                    grid = beginPaging(activePage)
                }
                else if (activePage > (lowerLimit) && activePage < (template - upperLimit)) {
                    grid = middlePaging(activePage)
                }
                else {
                    grid = endPaging(activePage)
                };
                var totalServersidePaging = startSymbolServerSidePaging + grid + endSymbolServerSidePaging + clickerYourFunction;

                return totalServersidePaging;
            };

            scope.$watch('pagingServerSide', function () {
                template = attr.totalPage
                activePage = 1
                
                if (template <= 1) {
                    compile = '';
                }
                else {
                    compile = checkServerPaging(activePage);
                };
                
                compilePaging(compile);
            });
            
            scope.$parent.$on('reloadServerSidePaging', function (event, args) {
                var activePage = args.message;
                
                compile = checkServerPaging(activePage);
                compilePaging(compile);
            })
        }
    };
})
.controller('pagingServerSideController', function ($scope, $timeout) {

    $scope.pagingActivePointer = function (selectedPage) {
        $scope.selectedPageOnServerSidePaging = selectedPage;
        $timeout(function () {
            angular.element('#pagingServerSideClicker').trigger('click');
        }, 100);
        $scope.$emit('reloadServerSidePaging', { message: selectedPage });
    }
})