publicContent.service('dealerIdService', function () {
    var dealerId;

    var setDealerId = function (Data) {
        dealerId = Data;
    };
    var getDealerId = function () {
        return dealerId;
    };
    return {
        setDealerId: setDealerId,
        getDealerId: getDealerId
    };
});
publicContent.service('queryMsisdnElementService', function () {
    var queryElement;

    var setQueryElement = function (data) {
        queryElement = data;
    };
    var getQueryElement = function () {
        return queryElement;
    };
    return {
        getQueryElement: getQueryElement,
        setQueryElement: setQueryElement
    };
});
