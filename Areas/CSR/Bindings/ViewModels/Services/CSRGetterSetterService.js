CSRContent.service('pinnedHtmlService', function() {
    var savedData;

    var setPinned = function(Data) {
        savedData = Data;
    };

    var getPinned = function() {
        return savedData;
    };

    return {
        setPinned: setPinned,
        getPinned: getPinned
    };
});

//Customer Search MVNO Id
CSRContent.service('MvnoId', function () {
    var mvnoId;

    var setMvno = function (Data) {
        mvnoId = Data;
    };

    var getMvno = function () {
        return mvnoId;
    };

    return {
        setMvno: setMvno,
        getMvno: getMvno
    };
});

//data customer
CSRContent.service('DetailCustomer', function () {
    var customerDetail;

    var setDetail = function (object) {
        customerDetail = object;
    };

    var getDetail = function () {
        return customerDetail;
    };

    var subscriptionInformation;

    var setSubscriptionInformation = function (object) {
        subscriptionInformation = object;
    };

    var getSubscriptionInformation = function () {
        return subscriptionInformation;
    };

    return {
        setDetail: setDetail,
        getDetail: getDetail,
        setSubscriptionInformation: setSubscriptionInformation,
        getSubscriptionInformation: getSubscriptionInformation
    };

    
});

//Ticket Detail
CSRContent.service('TicketDetail', function () {
    var ticketDetail;

    var setDetail = function (object) {
        ticketDetail = object;
    };

    var getDetail = function () {
        return ticketDetail;
    };

    return {
        setDetail: setDetail,
        getDetail: getDetail
    };
})
//Refresh Cache After Create EWC-631
.service('PagingIndication', function () {
    var page;

    var setVal = function (object) {
        page = object;
    };

    var getVal = function () {
        return page;
    };

    return {
        setVal: setVal,
        getVal: getVal
    };
})
.service('PagingSelectedTT', function () {
    var page;

    var setVal = function (object) {
        page = object;
    };

    var getVal = function () {
        return page;
    };

    return {
        setVal: setVal,
        getVal: getVal
    };
});

//Ticket Detail for Update TT
CSRContent.service('UpdateTicketDetail', function () {
    var updateTicketDetail;

    var setDetail = function (object) {
        updateTicketDetail = object;
    };

    var getDetail = function () {
        return updateTicketDetail;
    };

    return {
        setDetail: setDetail,
        getDetail: getDetail
    };
});

//Ticket Detail for Update Extended Info TT
CSRContent.service('UpdateExtendedInfoTicketDetail', function () {
    var updateExtendedInfoTicketDetail;

    var setDetail = function (object) {
        updateExtendedInfoTicketDetail = object;
    };

    var getDetail = function () {
        return updateExtendedInfoTicketDetail;
    };

    return {
        setDetail: setDetail,
        getDetail: getDetail
    };
});

CSRContent.service('prevLocationService', function() {
    var savedLocation;

    var setLocation = function(data) {
        savedLocation = data;
    };

    var getLocation = function() {
        return savedLocation;
    };

    return {
        getPrevLocation: getLocation,
        setPrevLocation: setLocation
    };
});
CSRContent.service('advancesearchelementService', function() {
    var searchElement;

    var setElement = function(Data) {
        searchElement = Data;
    };

    var getElement = function() {
        return searchElement;
    };

    return {
        setElement: setElement,
        getElement: getElement
    };
});
CSRContent.service('dealerIdService', function() {
    var dealerId;

    var setDealerId = function(Data) {
        dealerId = Data;
    };
    var getDealerId = function() {
        return dealerId;
    };
    return {
        setDealerId: setDealerId,
        getDealerId: getDealerId
    };
});
//CSRContent.service('queryMsisdnElementService', function() {
//    var queryElement;

//    var setQueryElement = function(data) {
//        queryElement = data;
//    };
//    var getQueryElement = function() {
//        return queryElement;
//    };
//    return {
//        getQueryElement: getQueryElement,
//        setQueryElement: setQueryElement
//    };
//});
CSRContent.service('pagingSearchTroubleTicketByCustomerId', function () {
    var pagingObject;

    var setObject = function (data) {
        pagingObject = data;
    };
    var getObject = function () {
        return pagingObject;
    };
    return {
        getObject: getObject,
        setObject: setObject
    };
});
CSRContent.service('AddCommentParamService', function () {
    var object;
    var CommentType;

    var setObject = function (data) {
        object = data;
    };
    var getObject = function () {
        return object;
    };


    var setCommentType = function (param) {
        CommentType = param;
    };
    var getCommentType = function () {
        return CommentType;
    };

    return {
        getObject: getObject,
        setObject: setObject,
        getCommentType: getCommentType,
        setCommentType: setCommentType
    };
});
//Set SideBarTree moduleId
CSRContent.service('SideBarModule', function () {
    var moduleId;

    var setModuleId = function (object) {
        moduleId = object;
    };

    var getModuleId = function () {
        return moduleId;
    };

    var resetModuleId = function () {
        moduleId = null;
    }

    return {
        setModuleId: setModuleId,
        getModuleId: getModuleId,
        resetModuleId: resetModuleId
    };
});