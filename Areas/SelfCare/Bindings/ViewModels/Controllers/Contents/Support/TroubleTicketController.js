SelfCareContent.controller("ViewTroubleTicketController", function ($scope, SupportCache, CustomerCache, DetailTroubleTicket, CommentTroubleTicket, ErrorHandlerUtility,
    Notification, SelfcareSecureSection, $filter, $location, SelectedTicketNumberService) {
    $scope.selected = false;
    $scope.showDetail = false;
    $scope.troubleTicket = {};
    $scope.troubleTicketDetail = {};
    $scope.ExcludeTTClosed = [];

    $scope.SelectedTicket = "";
    $scope.ngClickSelectedTicket = function (ticketNumber) {
        $scope.SelectedTicket = ticketNumber;
        sessionStorage.setItem('selectedTicketForTicketDetails', ticketNumber);
    };
    $scope.gotoDetailTroubleTicket = function () {
        if (!$scope.SelectedTicket) {
            Notification.error({
                message: '<span>Please select the ticket.</span>',
                positionY: 'top',
                positionX: 'center'
            });
        } else {
            $location.path("SelfCare/Customer/App/ViewTroubleTicket/Details");
        }
    };

    $scope.showBackToStartingPage = false;
    if (typeof (JSON.parse(localStorage.self_scope).activeDevice.Msisdn) === 'undefined') {
        $scope.showBackToStartingPage = true;
    };

    SupportCache.getTroubleTicket({ customerid: wrapper.customerInfo.CustomerID }).then(function (result) {
        $scope.troubleTicket = result.TTInfo.TroubleTicketList;
        angular.forEach($scope.troubleTicket, function (value, key) {
            $scope.troubleTicket[key].ReportTime = moment(value.ReportTime).format(config.DateFormatMoment + ', h:mm:ss a');
            $scope.troubleTicket[key].UpdateTime = moment(value.UpdateTime).format(config.DateFormatMoment + ', h:mm:ss a');
        });

        for (i = 0; i < $scope.troubleTicket.length; i++) {
            if ($scope.troubleTicket[i].Status.Id !== 105) {
                $scope.ExcludeTTClosed.push($scope.troubleTicket[i])
            }
        };
        // Show all status as Open ticket 
        for (i = 0; i < $scope.ExcludeTTClosed.length; i++) {
            $scope.ExcludeTTClosed[i].Status.Id = 100;
            $scope.ExcludeTTClosed[i].Status.Name = 'Open';
            $scope.ExcludeTTClosed[i].IndexTable = i + 1;
        };
    });

    $scope.sort = function (keyname) {
        $scope.sortKey = keyname;   //set the sortKey to the param passed
        $scope.reverse = !$scope.reverse; //if true make it false and vice versa

        switch (keyname) {
            case "Status":
                //Sorting String Method
                if ($scope.reverse == true) {
                    $scope.ExcludeTTClosed.sort(function (a, b) {
                        var x = a.Status.Name.toLowerCase();
                        var y = b.Status.Name.toLowerCase();
                        return x < y ? -1 : x > y ? 1 : 0;
                    });
                } else {
                    $scope.ExcludeTTClosed.sort(function (a, b) {
                        var x = a.Status.Name.toLowerCase();
                        var y = b.Status.Name.toLowerCase();
                        return x < y ? 1 : x > y ? -1 : 0;
                    });
                }
                break
            case "TicketNumber":
                //Sorting Number Method
                if ($scope.reverse == true) {
                    $scope.ExcludeTTClosed.sort(function (a, b) {
                        return a.TicketNumber - b.TicketNumber
                    });
                } else {
                    $scope.ExcludeTTClosed.sort(function (a, b) {
                        return b.TicketNumber - a.TicketNumber
                    });
                }
                break
            case "ReportTime":
                //Sorting Date Method
                if ($scope.reverse == true) {
                    $scope.ExcludeTTClosed.sort(function (a, b) {
                        return new Date(a.ReportTime) - new Date(b.ReportTime);
                    });
                } else {
                    $scope.ExcludeTTClosed.sort(function (a, b) {
                        return new Date(b.ReportTime) - new Date(a.ReportTime);
                    });
                }
                break
            case "Type":
                if ($scope.reverse == true) {
                    $scope.ExcludeTTClosed.sort(function (a, b) {
                        var x = a.Type.Name.toLowerCase();
                        var y = b.Type.Name.toLowerCase();
                        return x < y ? -1 : x > y ? 1 : 0;
                    });
                } else {
                    $scope.ExcludeTTClosed.sort(function (a, b) {
                        var x = a.Type.Name.toLowerCase();
                        var y = b.Type.Name.toLowerCase();
                        return x < y ? 1 : x > y ? -1 : 0;
                    });
                }
                break
            case "UpdateTime":
                if ($scope.reverse == true) {
                    $scope.ExcludeTTClosed.sort(function (a, b) {
                        return new Date(a.UpdateTime) - new Date(b.UpdateTime);
                    });
                } else {
                    $scope.ExcludeTTClosed.sort(function (a, b) {
                        return new Date(b.UpdateTime) - new Date(a.UpdateTime);
                    });
                }
                break
            case "MSISDN":
                if ($scope.reverse == true) {
                    $scope.ExcludeTTClosed.sort(function (a, b) {
                        return a.MSISDN - b.MSISDN
                    });
                } else {
                    $scope.ExcludeTTClosed.sort(function (a, b) {
                        return b.MSISDN - a.MSISDN
                    });
                }
                break
        }
    }

    $scope.focusComment = function () {
        $("#comment_box").focus();
    }

    $scope.tt = {};

    SelfcareSecureSection.get({ ModuleId: 75 }, function (result) {
        $scope.isCreateTicketEnable = false;
        var objectCreateTicket = $filter('filter')(result, { SectionKey: 'Create_Ticket_Button' })[0];
        if (objectCreateTicket != null) {
            $scope.isCreateTicketEnable = true;
        }
    });
});

SelfCareContent.controller("CreateTroubleTicketController", function ($scope, $timeout, $location, CustomerCache, TroubleTicketService, Notification, ErrorHandlerUtility, SelfCareCache) {

    var createTicketbyActiveMsisdn = JSON.parse(localStorage.self_scope).activeDevice != undefined ? JSON.parse(localStorage.self_scope).activeDevice : {};
    $scope.createTicket = function (data) {
        var param =
        {
            "TicketCode": data.category.value,
            "Fuid": config.DealerId,
            "TypeId": data.category.value,
            "MSISDN": createTicketbyActiveMsisdn.Msisdn,
            "Description": data.description
        };
        TroubleTicketService.TTCreate.save({ customerid: wrapper.customerInfo.CustomerID }, param, function (result) {
            if (ErrorHandlerUtility.IsResultTypeOK(result) && result.ResultCode == 0) {

                SelfCareCache.remove("getTT");

                Notification.success({
                    message: 'you have create trouble ticket successfully with ticket number = <b>' + result.TicketNumber + '</b>'+
                             '<br>you will direct to view trouble ticket in 3 sec...',
                    positionY: 'top',
                    positionX: 'center'
                });
                $timeout(function () {
                    $location.path('/SelfCare/Customer/App/ViewTroubleTicket');
                }, 3000);

            } else {
                Notification.error({
                    message: '<strong>Failed!</strong> <span>' + result.Messages + '.</span>',
                    positionY: 'top',
                    positionX: 'center'
                });
            }

            
            
        });
    }
});

SelfCareContent.controller("DetailsTroubleTicketController", function ($scope, Notification, SelectedTicketNumberService, DetailTroubleTicket, SelfcareSecureSection, $filter, CommentTroubleTicket,
    ErrorHandlerUtility) {
    var selectedTicket = sessionStorage.selectedTicketForTicketDetails
    $scope.TTaddComment = [];
    $scope.TTaddComment.TicketNumber = selectedTicket;
    var getTicketDetail = function () {
        DetailTroubleTicket.get({ Id: selectedTicket }, function (result) {
            if (ErrorHandlerUtility.IsResultTypeOK(result)) {
                $scope.TroubleTicketDetailResponse = result;
                $scope.TroubleTicketDetailResponse.TroubleTicketDetail.ReportTime = moment($scope.TroubleTicketDetailResponse.TroubleTicketDetail.ReportTime).format(config.DateFormatMoment + ', h:mm:ss a');
                $scope.TroubleTicketDetailResponse.TroubleTicketDetail.UpdateTime = moment($scope.TroubleTicketDetailResponse.TroubleTicketDetail.UpdateTime).format(config.DateFormatMoment + ', h:mm:ss a');
                $scope.TroubleTicketDetailResponse.TroubleTicketDetail.Status.Name = "Open"
                angular.forEach(result.Comments, function (value, key) {
                    result.Comments[key].UpdateTime = moment(value.UpdateTime).format(config.DateFormatMoment + ', h:mm:ss a');
                });
                $scope.ttcomments = result.Comments.reverse();
            } else {
                notificationError(result.Messages);
            }
        });
    }
    var notificationError = function (Message) {
        Notification.error({
            message: '<strong>'+Message+'</strong>',
            positionY: 'top',
            positionX: 'center'
        });
    }
    if (selectedTicket === undefined) {
        notificationError('No Data Selected')
    } else {
        SelfcareSecureSection.get({ ModuleId: 75 }, function (result) {
            $scope.isAddCommentEnable = false;
            var objectAddComment = $filter('filter')(result, { SectionKey: 'Add_Comment' })[0];
            if (objectAddComment != null) $scope.isAddCommentEnable = true;
        });
        getTicketDetail();
    }

    $scope.add_comment = function (data, form) {
        var temp = {
            TicketNumber: data.TicketNumber,
            CommentType: 3,
            Comment: data.comment
        }
        CommentTroubleTicket.save(temp, function (response) {
            if (ErrorHandlerUtility.IsResultTypeOK(response)) {
                getTicketDetail();
                $scope.TTaddComment.comment = null;
                if (form) {
                    form.$setPristine();
                    form.$setUntouched();
                }
            } else {
                notificationError(result.Messages[0]);
            }
        });
    };
});