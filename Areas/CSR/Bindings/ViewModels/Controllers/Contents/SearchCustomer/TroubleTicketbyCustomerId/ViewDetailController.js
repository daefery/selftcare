//For: trouble ticket info from trouble ticket by customer id controller
//Used by: Templates/CSR/Customer/TroubleTicket/Content/DetailTTInfo.html

CSRContent.controller('TicketInformationTroubleTicketbyCustomerIdController', function ($scope, $rootScope, $location, DetailCustomer, CSRCache, UpdateTicketDetail,
    CommonEnum, TicketDetail, CacheTroubleTicketService, AddCommentParamService, ErrorHandlerUtility, Notification, TTCommonService, UpdateExtendedInfoTicketDetail,
    $filter, CacheNavigationService, LocalStorageProvider) {

    $scope.isETAKUser = false;
    $scope.isETAKUser = LocalStorageProvider.isETAKUser();

    if ($location.path() == '/CSR/Customer/App/SearchPage/TroubleTicketInfo' && $location.$$search.dashboard != undefined) {//Dashboard
        $scope.Link_Back_To_List = '/CSR/Customer/App/TroubleTickets/Dashboard';
    } else if ($location.path() == '/CSR/Customer/App/SearchPage/TroubleTicketInfo') {//SearchPage
        $scope.Link_Back_To_List = '/CSR/Customer/App/SearchPage/TroubleTickets';
    } else {
        $scope.Link_Back_To_List = '';
    }

    //Initialization
    //Customer Detail
    var mvnoId, phone, customerId;

    //Ticket Info
    var ticketId;

    //Question And Answer
    var questionAndAnswer;

    //General Info
    var description, informativeUpdates, resolution, comments;

    //End Initialization

    if (DetailCustomer.getDetail() == undefined || TicketDetail.getDetail() == undefined) {

        //Check sessionStorage
        if (sessionStorage.TTDetailSession != undefined) {
            var TTDetailSession = JSON.parse(sessionStorage.TTDetailSession);

            if (TTDetailSession.MVNOId == undefined || TTDetailSession.MSISDN == undefined || TTDetailSession.CustomerId == undefined || TTDetailSession.TicketNumber == undefined) {

                var msg = 'Ticket cannot be found';
                Notification.error({
                    message: '<span>' + msg + '</span>',
                    positionY: 'top',
                    positionX: 'center',
                    title: "<span ><h5 style='color: white;'>" + msg + "</h5></span>",
                    delay: 10000
                });

                $location.path($scope.Link_Back_To_List);
            } else {
                DetailCustomer.setDetail({
                    MVNOName: TTDetailSession.MVNOName,
                    MVNOId: TTDetailSession.MVNOId,
                    MSISDN: TTDetailSession.MSISDN,
                    CustomerId: TTDetailSession.CustomerId,
                });

                TicketDetail.setDetail({
                    TicketNumber: TTDetailSession.TicketNumber,
                });
            }
        } else {
            var msg = 'Ticket cannot be found';
            Notification.error({
                message: '<span>' + msg + '</span>',
                positionY: 'top',
                positionX: 'center',
                title: "<span ><h5 style='color: white;'>" + msg + "</h5></span>",
                delay: 10000
            });

            $location.path($scope.Link_Back_To_List);
        }
    }

    customerDetail = DetailCustomer.getDetail();
    mvnoId = customerDetail.MVNOId;
    phone = customerDetail.MSISDN;
    customerId = customerDetail.CustomerId;

    var getDetail = TicketDetail.getDetail();
    ticketId = getDetail.Id
    ticketnumbergetdetail = getDetail.TicketNumber;

    //Store to sessionStorage
    var TTDetailSession = {
        MVNOName: customerDetail.MVNOName,
        MVNOId: mvnoId,
        MSISDN: phone,
        CustomerId: customerId,
        TicketNumber: ticketnumbergetdetail
    }
    sessionStorage.TTDetailSession = JSON.stringify(TTDetailSession);

    //Displayed Object
    $scope.TicketInfo = {
        CustomerDetail: {
            MVNOName: customerDetail.MVNOName,
            MVNO: mvnoId,
            PhoneNumber: phone,
            CustomerId: customerId
        },
        GeneralInfo: {
            //TicketDetail data taken from get ticket detail by id
            TicketDetail: {},
            QuestionAndAnswer: questionAndAnswer,
            Description: description,
            InformativeUpdates: informativeUpdates,
            Resolution: resolution,
            Comments: comments
        },
        ExtendedInfo: {
            TimeLeftForResolution: 0,
            KPITime: 0,
            Tag: '',
            Escalation: '',
            EscalationReason: '',
            Remarks: '',
            ExternalReferences: ''
        },
        AvailableOperation: {}
    };

    $scope.TimeSpentVal = 0;
    $scope.TimeLeftVal = 100;
    //End Displayed Object

    $scope.addcomment = {};

    $scope.getTicketDetailFromAPI = function () {

        //Get Data
        //Get ticket detail by id
        CacheTroubleTicketService.getTicketDetail(ticketnumbergetdetail).then(function (result) {
            var data = angular.copy(result);
            var ttDetails = data.TroubleTicketDetail;

            if (data.TroubleTicketDetail == undefined) {
                var msg = 'Ticket cannot be found';
                Notification.error({
                    message: '<span>' + msg + '</span>',
                    positionY: 'top',
                    positionX: 'center',
                    title: "<span ><h5 style='color: white;'>" + msg + "</h5></span>",
                    delay: 10000
                });

                $location.path($scope.Link_Back_To_List);
            }

            $scope.Attachment = data.Attachment;

            //AddComment Page, begin
            $scope.data = ttDetails;
            //AddComment Page, end

            var commentCollections = data.Comments;
            comments = [];
            resolution = [];
            informativeUpdates = [];
            questionAndAnswer = [];

            var generalInfo = $scope.TicketInfo.GeneralInfo;
            var extendedInfo = $scope.TicketInfo.ExtendedInfo;

            generalInfo.TicketDetail = {
                TicketCode: ttDetails.TicketCode,
                TicketType: ttDetails.Type.Name,
                CreationTime: moment(ttDetails.ReportTime).format(config.DateFormatMoment+' HH:mm'),
                IncidentClass: ttDetails.Class.Name,
                SubmittedBy: ttDetails.OperatorInfo.FullName,
                Status: ttDetails.Status.Name,
                TicketNumber: ttDetails.TicketNumber,
                TimeReceived: moment(ttDetails.ReportTime).format(config.DateFormatMoment+' HH:mm'),
                Priority: ttDetails.Priority.Name,
                Department: ttDetails.Department.Name,
                TicketSubtype: ttDetails.SubType.Name

            };
            generalInfo.Description = ttDetails.Description;
            extendedInfo.Tag = CommonEnum.convertTTTag(ttDetails.Tag);
            extendedInfo.Escalation = CommonEnum.convertTTEscalation(ttDetails.Escalation);
            extendedInfo.EscalationReason = CommonEnum.convertTTEscalationReason(ttDetails.EscalationReason);
            extendedInfo.Remarks = ttDetails.Remarks;
            extendedInfo.TimeLeftForResolution = ttDetails.KPIResponseHours - ttDetails.DurationResponseHours;
            extendedInfo.KPITime = ttDetails.KPIResponseHours;
            extendedInfo.ExternalReferences = data.References;
            $scope.TicketInfo.AvailableOperation = data.AvailableOperations;

            
            $scope.TimeLeftVal = (extendedInfo.TimeLeftForResolution / extendedInfo.KPITime) * 100;
            $scope.TimeSpentVal = 100 - $scope.TimeLeftVal;

            for (i = 0, x = 0, y = 0, z = 0; i < commentCollections.length; i++) {
                commentCollections[i].UpdateTime = moment(commentCollections[i].UpdateTime).format(config.DateFormatMoment+' HH:mm');
                switch (parseInt(commentCollections[i].CommentType)) {
                    case 0:
                        comments[x] = commentCollections[i];
                        x++;
                        break;
                    case 3:
                        comments[x] = commentCollections[i];
                        x++;
                        break;
                    case 1:
                        resolution[y] = commentCollections[i];
                        y++;
                        break;
                    case 2:
                        informativeUpdates[z] = commentCollections[i];
                        z++;
                        break;
                }
                generalInfo.Comments = comments;
                generalInfo.Resolution = resolution;
                generalInfo.InformativeUpdates = informativeUpdates;
            };

            $scope.upload.TicketNumber = $scope.TicketInfo.GeneralInfo.TicketDetail.TicketNumber;

            CacheTroubleTicketService.getAnswer(ttDetails.TicketNumber).then(function (result) {
                var dataAnswer = angular.copy(result);
                var ttAnswer = dataAnswer.TroubleTicketAnswerList
                for (i = 0; i < ttAnswer.length; i++) {
                    questionAndAnswer[i] = {};
                    if (ttAnswer[i].Question != null){
                        questionAndAnswer[i].question = ttAnswer[i].Question.QuestionCode.NameId.DefaultMessage;
                    }
                    questionAndAnswer[i].answer = ttAnswer[i].Answer;
                }
                generalInfo.QuestionAndAnswer = questionAndAnswer;

                var updateTicketDetail = {
                    DepartmentId: ttDetails.Department.Id,
                    StatusId: ttDetails.Status.Id,
                    TicketNumber: ttDetails.TicketNumber,
                    TicketCode: ttDetails.TicketCode,
                    TicketDescription: ttDetails.Description,
                    selectedTicketType: {
                        name: ttDetails.Type.Name,
                        typeId: ttDetails.Type.Id
                    },
                    selectedTicketSubtype: {
                        name: generalInfo.TicketDetail.TicketSubtype,
                        subtypeId: ttDetails.SubType.Id
                    },
                    selectedClass: {
                        name: generalInfo.TicketDetail.IncidentClass,
                        classId: ttDetails.Class.Id
                    },
                    selectedPriority: {
                        name: generalInfo.TicketDetail.Priority,
                        priorityId: ttDetails.Priority.Id
                    }
                }
                UpdateTicketDetail.setDetail(updateTicketDetail);
                var extendedInfoObject = {
                    TicketNumber: ttDetails.TicketNumber,
                    TicketCode: ttDetails.TicketCode,
                    Tag: {
                        name: extendedInfo.Tag,
                        value: ttDetails.Tag
                    },
                    Escalation: {
                        name: extendedInfo.Escalation,
                        value: ttDetails.Escalation
                    },
                    EscalationReason: {
                        name: extendedInfo.EscalationReason,
                        value: ttDetails.EscalationReason
                    },
                    Remarks: extendedInfo.Remarks
                }
                UpdateExtendedInfoTicketDetail.setDetail(extendedInfoObject)
            });
        });
        //End Get Data
    }

    $scope.$on('refreshdetailtt-now', function (event, args) {
        cacheKeyAnswer = 'AnswerByTicketNo' + $scope.TicketInfo.GeneralInfo.TicketDetail.TicketNumber;
        CSRCache.remove(cacheKeyAnswer);
        $scope.loadpage();
    });

    $scope.$on('add-reference-success', function (event, args) {
        $scope.loadpage()
    });

    $scope.$on('justrefresh-thedetail', function (event, args) {
        $scope.loadpage()
    });

    $scope.getTicketDetailFromAPI();


    $scope.loadpage = function () {
        cacheKey = 'DetailByTicketId' + ticketnumbergetdetail;
        CSRCache.remove(cacheKey);
        $scope.getTicketDetailFromAPI();
    }
    $scope.upload = {};
    $scope.upload.files = [];
    $scope.upload.loadpage = function () {
        $scope.loadpage();
    };

    $scope.openAddCommentModal_InformativeUpdates = function () {

        $scope.addcomment.Title = 'Add_Updates';
        AddCommentParamService.setObject($scope.data);
        AddCommentParamService.setCommentType(2);
        $scope.addcomment.showAddCommentInterface($scope.data);
    }

    $scope.openAddCommentModal_Comments = function () {

        $scope.addcomment.Title = 'Add_Comment';
        AddCommentParamService.setObject($scope.data);
        AddCommentParamService.setCommentType(0);
        $scope.addcomment.showAddCommentInterface($scope.data);
    }


    $scope.openDeleteCommentModal = function (id) {

        angular.element('#DeleteCommentModal').modal('show');
        $scope.deleteId = id;
    }
    $scope.deleteComment = function () {

        if ($scope.deleteId != undefined) {
            TTCommonService.TTDeleteComment.delete({
                Id: $scope.deleteId
            }, function (result) {
                if (ErrorHandlerUtility.IsResultTypeOK(result)) {
                    Notification.success({
                        message: '<strong>Success!</strong> <span>Comment Is Successfully Deleted.</span>',
                        positionY: 'top',
                        positionX: 'center'
                    });

                    angular.element('#DeleteCommentModal').modal('hide');
                    $scope.loadpage();
                } else {

                    Notification.error({
                        message: '<span>' + ErrorHandlerUtility.GetErrorMessage(result) + '</span>',
                        positionY: 'top',
                        positionX: 'center',
                        delay: 10000,
                        title: "<span ><h5 style='color: white;'>" + ErrorHandlerUtility.GetErrorMessage(result) + "</h5></span>"
                    });
                    angular.element('#DeleteCommentModal').modal('hide');
                }
            });
        } else {
            Notification.error({
                message: '<span>No Comment to delete</span>',
                positionY: 'top',
                positionX: 'center',
                delay: 10000,
                title: "<span ><h5 style='color: white;'>No Comment to delete</h5></span>"
            });
        }
    };

    $scope.OpenUpdateTTModal = function () {
        angular.element('#UpdateTT').modal('show');
        $rootScope.$broadcast('updatett-canbeprocessed');
    }

    $scope.TimeSpentStyle = function () {
        return { "width": $scope.TimeSpentVal + '%'};
    };
    $scope.TimeLeftStyle = function () {
        return { "width": $scope.TimeLeftVal + '%' };
    };
    $scope.ColorProgressControl = function () {
        if ($scope.TimeLeftVal > 59) {
            return "progress-bar-success";
        } else if ($scope.TimeLeftVal < 60 && $scope.TimeLeftVal >  19) {
            return "progress-bar-warning";
        } else {
            return "progress-bar-danger";
        }
    };

    $scope.OpenUpdateExtendedInfoTTModal = function () {
        angular.element('#UpdateExtendedInfoTT').modal('show');
        $rootScope.$broadcast('updateextendedtt-canbeprocessed');
    }

    $scope.openActionPageModal = function (actionId, actionName, screenType) {
        switch (screenType) {
            case 0: //Comment
            case 1: //Resolution
                angular.element('#ActionCloseTT').modal('show');
                $rootScope.$broadcast('nextaction-closett', { OperationTypeId: actionId, actionName: actionName, screenType: screenType });
                break;
            case 2: //Update
                angular.element('#ActionAssociateTT').modal('show');
                $rootScope.$broadcast('nextaction-associatett', { OperationTypeId: actionId, actionName: actionName });
                break;
            default:
                Notification.error({
                    message: '<span>This feature still not implemented</span>',
                    positionY: 'top',
                    positionX: 'center',
                    delay: 10000,
                    title: "<span ><h5 style='color: white;'>Error</h5></span>"
                });
                break;
        }
    }

    $scope.OpenAddReferenceModal = function () {
        angular.element('#AddReferenceTT').modal('show');
        $rootScope.$broadcast('reset-add_reference-value');
    };

    var curModuleId = 108;
    CacheNavigationService.getSecureSection(curModuleId).then(function (result) {
        //check for Update Extended Info secure section
        $scope.isUpdateExtendedInfoEnable = false;
        var objectBilling = $filter('filter')(result, { SectionKey: 'EXTENDED_INFO' })[0];
        if (objectBilling != null) $scope.isUpdateExtendedInfoEnable = true;

        $scope.isTTDetailAddCommentEnable = false;
        var TTDetailAddComment = $filter('filter')(result, { SectionKey: 'TT_DETAIL_ADD_COMMENT' })[0];
        if (TTDetailAddComment != null) $scope.isTTDetailAddCommentEnable = true;

        $scope.isTTDetailDeleteCommentEnable = false;
        var TTDetailDeleteComment = $filter('filter')(result, { SectionKey: 'TT_DETAIL_DELETE_COMMENT' })[0];
        if (TTDetailDeleteComment != null) $scope.isTTDetailDeleteCommentEnable = true;

        $scope.isTTDetailAddUpdatesEnable = false;
        var TTDetailAddUpdates = $filter('filter')(result, { SectionKey: 'TT_DETAIL_ADD_UPDATES' })[0];
        if (TTDetailAddUpdates != null) $scope.isTTDetailAddUpdatesEnable = true;

        $scope.isTTDetailDeleteUpdatesEnable = false;
        var TTDetailDeleteUpdates = $filter('filter')(result, { SectionKey: 'TT_DETAIL_DELETE_UPDATES' })[0];
        if (TTDetailDeleteUpdates != null) $scope.isTTDetailDeleteUpdatesEnable = true;

        $scope.isTTDetailAddAttachmentEnable = false;
        var TTDetailAddAttachment = $filter('filter')(result, { SectionKey: 'TT_DETAIL_ADD_ATTACHMENT' })[0];
        if (TTDetailAddAttachment != null) $scope.isTTDetailAddAttachmentEnable = true;

        $scope.isTTDetailActionsEnable = false;
        var TTDetailActions = $filter('filter')(result, { SectionKey: 'TT_DETAIL_ACTIONS' })[0];
        if (TTDetailActions != null) $scope.isTTDetailActionsEnable = true;

        $scope.isTTDetailUpdateTroubleTicketEnable = false;
        var TTDetailUpdateTroubleTicket = $filter('filter')(result, { SectionKey: 'TT_DETAIL_UPDATE_TROUBLE_TICKET' })[0];
        if (TTDetailUpdateTroubleTicket != null) $scope.isTTDetailUpdateTroubleTicketEnable = true;
    });
})