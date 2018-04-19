//Created By Revani Bagus Amrulloh
//8 Dec 2015
//For View Trouble ticket By Customer Id
//Used by Templates/CSR/Customer/TroubleTicket/Index.html
//Using CacheSearch.getTroubleTicketsByCustomerId() for Call the Api, URL: Areas/CSR/Bindings/ViewModels/Services/CacheSearchServices.js
//Using CSRCache for caching, URL: Areas/CSR/Bindings/ViewModels/Services/CSRCacheServices.js
//Using pagingSearchTroubleTicketByCustomerId for getter setter, URL: Areas/CSR/Bindings/ViewModels/Services/CSRGetterSetterService.js
//TODO (1) translate the notification error

CSRContent.controller('CustomerTroubleTickets', function ($scope, $rootScope, CacheSearch, CSRCache, DetailCustomer, pagingSearchTroubleTicketByCustomerId,
    TicketDetail, Notification, PagingIndication, PagingSelectedTT, TroubleTicketFunctionService, paginationService) {

    var ttdetail = {},
        pagenumber = 1,
        rowsperpage = 10,
        nodatafound = false,
        lastpaging = 1;
    $scope.getSearchByPageNumberForTroubleTicketByCustomerId = 0;
    $scope.currentPage = pagenumber;

    var PagingLastValue = PagingSelectedTT.getVal();
    if (PagingLastValue != undefined) {
        pagenumber = PagingLastValue.pageNumber;
        pageSize = PagingLastValue.rowsperpage;
        lastpaging = PagingLastValue.pageNumber;
        $scope.currentPage = pagenumber;
        paginationService.setCurrentPage('tt-view', pagenumber);
    }

    var pangingObject = {
        pageNumber: pagenumber,
        pageSize: rowsperpage
    };

    customerDetail = DetailCustomer.getDetail();
    if (typeof customerDetail === 'undefined') {
        var customerSession = sessionStorage.CustomerDataForCustomerSummary != undefined ? JSON.parse(sessionStorage.CustomerDataForCustomerSummary) : {};
        pinHtml = customerSession.pinned;
        customerDetail = customerSession.detailcustomer;
        $rootScope.pinnedCustId = pinHtml.pinnedId;
        $rootScope.pinnedCustName = pinHtml.pinnedName;
        $rootScope.pinnedMSISDN = pinHtml.pinnedPhone;
    };

    var cacheKey = 'searchTroubleTicketByCustomerId=' + customerDetail.CustomerId,
        pagingSelectedObject = {
            pageNumber: pagenumber,
            rowsperpage: rowsperpage,
            CustomerId: customerDetail.CustomerId
        };
    var pagingIndicationVal = {
        pagenumber: lastpaging,
        rowsperpage: rowsperpage,
        customerid: customerDetail.CustomerId
    }
    var testpaging = PagingIndication.getVal();
    if (typeof testpaging === 'undefined') {
        PagingIndication.setVal(pagingIndicationVal);

    };

    PagingSelectedTT.setVal(pagingSelectedObject);
    DetailCustomer.setDetail(customerDetail);

    $scope.listTT = [];
    $scope.listTT_TotalCount = 0;
    var callService = function () {
        CacheSearch.getTroubleTicketsByCustomerId(customerDetail.CustomerId).then(function (result) {
            data = angular.copy(result);
            $scope.listTT = data.TTInfo.TroubleTicketList;
            $scope.listTT_TotalCount = data.TTInfo.TotalCount;
            CSRCache.put('currentMSISDNTroubleticketByCustomerId', temporarydata)
            var dataFound = parseInt(data.TTInfo.TotalCount);
            if (dataFound < 1) {
                nodatafound = true;
            }
            else {
                nodatafound = false;
            };

            var totalCount = parseInt(data.TTInfo.TotalCount);
            var mathVal = totalCount / rowsperpage;
            var checkValue = mathVal.toString();
            if (checkValue.indexOf(".") > -1) {
                totalPage = parseInt(checkValue.substring(0, checkValue.indexOf('.'))) + 1;
            }
            else {
                totalPage = mathVal;
            };
            pagingIndicationVal.pagenumber = totalPage;
            $scope.PagingServerSideForTroubleTicketByCustomerId = totalPage;
            PagingIndication.setVal(pagingIndicationVal);
            $scope.CompilePaginationServerSide = '<server-side-paging total-page="{{PagingServerSideForTroubleTicketByCustomerId}}" function-name="getSearchByPageNumberForTroubleTicketByCustomerId" max-grid="5"></server-side-paging>'
        });
    }

    pagingSearchTroubleTicketByCustomerId.setObject(pangingObject)
    callService();

    $scope.isdataexist = function () {
        return nodatafound;
    };

    $scope.getSearchByPageNumberForTroubleTicketByCustomerId = function (pageNumber) {
        typeof ttdetail === 'undefined';
        $scope.selectedRow = null;
        TicketDetail.setDetail(ttdetail);
        pangingObject = {
            pageNumber: pageNumber,
            pageSize: rowsperpage
        }
        if (lastpaging < pageNumber) {
            lastpaging = pageNumber
        };
        pagingSelectedObject = {
            pageNumber: pageNumber,
            rowsperpage: rowsperpage,
            CustomerId: customerDetail.CustomerId
        };
        PagingSelectedTT.setVal(pagingSelectedObject);
        pagingSearchTroubleTicketByCustomerId.setObject(pangingObject)
        $scope.currentPage = pageNumber;
        paginationService.setCurrentPage('tt-view', pageNumber);
        callService();
    }

    $scope.selectedRow = null;
    $scope.setClickedRow = function (index) {  //function that sets the value of selectedRow to current index
        $scope.selectedRow = index;
        TicketDetail.setDetail($scope.listTT[index]);
    }

    $scope.$watch('selectedRow', function () {
        if ($scope.selectedRow === null || typeof $scope.selectedRow === 'undefined') {
            $scope.LinkToDetailTT = '#';
        } else {
            $scope.LinkToDetailTT = '/CSR/Customer/App/SearchPage/TroubleTicketInfo';
        }
    }, true);

    $scope.CheckSelectedTicket = function () {
        if ($scope.selectedRow === null || typeof $scope.selectedRow === 'undefined') {
            //TODO (1)
            Notification.error({
                message: '<span>Please Select The Ticket</span>',
                positionY: 'top',
                positionX: 'center'
            });
        }
    }
    $scope.OpenCreateTTModal = function () {
        angular.element('#CreateTT').modal('show');
        $rootScope.$broadcast('startquery-creatett');
    }

    $scope.$on('refreshtableviewtt', function (event, args) {
        CSRCache.remove(cacheKey);
        $scope.CompilePaginationServerSide = 'reset',
        callService();
    });
})