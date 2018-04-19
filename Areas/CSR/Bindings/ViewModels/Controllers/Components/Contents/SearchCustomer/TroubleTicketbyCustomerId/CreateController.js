//Created By Revani Bagus Amrulloh
//8 Dec 2015
//For create trouble ticket by customer id

CSRContent.controller('CreateTroubleTicketbyCustomerIdController', function ($scope, $rootScope, CacheTroubleTicketService, DetailCustomer, CreateTroubleTicketService,
    TTCommonService, Notification, TroubleTicketFunctionService, LocalStorageProvider) {

    $scope.isETAKUser = false;
    $scope.isETAKUser = LocalStorageProvider.isETAKUser();

    var restructureObject;
    var resultObject = [];
    var restructureSubtype;
    var resultSubtype = [];
    var restructureQuestion;
    var temporaryTicketCode;

    var customerId,
        msisdn,
        mvnoId,
        description;

    var descriptionLength = TroubleTicketFunctionService.getLengthValidation('description');
    var answerLength = TroubleTicketFunctionService.getLengthValidation('answer');

    $scope.CreateTTSelection = {
        TicketType: '',
        TicketSubtype: '',
        TicketCode: ''
    };

    $scope.ticketType = resultObject;
    $scope.ticketSubtype = resultSubtype;
    $scope.questionAndAnswer = [];


    $scope.CustomerDetailforTT = {
        MVNO: mvnoId,
        PhoneNumber: msisdn,
        CustomerId: customerId
    };

    $scope.$on('startquery-creatett', function (event, args) {

        $scope.CreateTTSelection = {
            TicketType: '',
            TicketSubtype: '',
            TicketCode: ''
        };
        temporaryTicketCode = $scope.CreateTTSelection.TicketType.typeId;
        $scope.questionAndAnswer = [];
        $scope.CreateTicketEditor = '';

        customerDetail = DetailCustomer.getDetail();
        customerId = customerDetail.CustomerId;
        var customerActiveCreateTTCSR = sessionStorage.CustomerDataForCustomerSummary != undefined ? JSON.parse(sessionStorage.CustomerDataForCustomerSummary) : {};
        if (!customerActiveCreateTTCSR) {
            msisdn = customerDetail.MSISDN;
        } else {
            msisdn = customerActiveCreateTTCSR.msisdn;
        }
        console.log(msisdn)
        mvnoId = customerDetail.MVNOId;

        $scope.CustomerDetailforTT = {
            MVNOName: customerDetail.MVNOName,
            MVNO: mvnoId,
            PhoneNumber: msisdn,
            CustomerId: customerId
        };

        CacheTroubleTicketService.getTicketType(mvnoId).then(function (result) {
            data = angular.copy(result);
            restructureObject = data.TroubleTicketTypeLists;

            for (i = 0; i < restructureObject.length; i++) {
                resultObject[i] = {}
                resultObject[i].name = restructureObject[i].NameId.DefaultMessage;
                resultObject[i].typeId = restructureObject[i].TypeId;
            }
        });
    });

    $scope.CreateTT = {
        field: [
            {
                type: "select",
                name: "CreateTTticketType",
                size: 6,
                text: "TT_Type",
                model: "CreateTTSelection.TicketType",
                value: "ticketType",
                required: true,
                validation: [{ value: "mandatory" }]
            },
            {
                type: "select",
                name: "CreateTTticketSubtype",
                size: 6,
                text: "TT_Subtype",
                model: "CreateTTSelection.TicketSubtype",
                value: "ticketSubtype",
                required: true,
                validation: [{ value: "mandatory" }]
            },
            {
                type: "label",
                name: "CreateTTticketCode",
                size: 6,
                text: "TT_Code",
                model: "CreateTTSelection.TicketCode",
            }
        ]
    };

    $scope.$watch('CreateTTSelection.TicketType', function () {
        if ($scope.CreateTTSelection.TicketType !== '') {
            $scope.CreateTTSelection.TicketSubtype = '';
            resultSubtype = [];
            $scope.CreateTTSelection.TicketCode = '';
            temporaryTicketCode = $scope.CreateTTSelection.TicketType.typeId
            CacheTroubleTicketService.getTicketSubtype(mvnoId, temporaryTicketCode).then(function (result) {
                data = angular.copy(result);
                restructureSubtype = data.TTSubTypeLists;

                for (i = 0; i < restructureSubtype.length; i++) {
                    resultSubtype[i] = {}
                    resultSubtype[i].name = restructureSubtype[i].NameId.DefaultMessage;
                    resultSubtype[i].SubtypeId = restructureSubtype[i].SubTypeId;
                }
                $scope.ticketSubtype = resultSubtype;
            });
        }
    }, true);
    $scope.$watch('CreateTTSelection.TicketSubtype', function () {
        if ($scope.CreateTTSelection.TicketSubtype !== '') {
            $scope.questionAndAnswer = []
            CacheTroubleTicketService.getTicketQuestion(mvnoId, temporaryTicketCode, $scope.CreateTTSelection.TicketSubtype.SubtypeId).then(function (result) {
                data = angular.copy(result);
                restructureQuestion = data.TTQuestions
                $scope.CreateTTSelection.TicketCode = temporaryTicketCode;
                for (i = 0; i < restructureQuestion.length; i++) {
                    $scope.questionAndAnswer[i] = {}
                    $scope.questionAndAnswer[i].question = restructureQuestion[i].QuestionCode.NameId.DefaultMessage;
                    $scope.questionAndAnswer[i].questionId = restructureQuestion[i].QuestionId;
                    $scope.questionAndAnswer[i].answer = "";
                    $scope.snippet = {}
                }
                $scope.questionAndAnswer = $scope.questionAndAnswer;
            });
        }
    }, true);

    $scope.snippet = {}

    $scope.upload = {};

    $scope.SubmitCreateTT = function () {
        //ticket details
        var checkError = 0;
        var checkLength = 0;
        var editorinner = $scope.CreateTicketEditor;
        console.log(editorinner)
        if (typeof $scope.CreateTTSelection.TicketType.typeId === 'undefined' || $scope.CreateTTSelection.TicketType.typeId === null || 
            $scope.CreateTTSelection.TicketType.typeId < 1) {
            notificationError('You must pick the ticket type');
        } else if (typeof $scope.CreateTTSelection.TicketSubtype.SubtypeId === 'undefined' || $scope.CreateTTSelection.TicketSubtype.SubtypeId === null || 
            $scope.CreateTTSelection.TicketSubtype.SubtypeId < 1) {
            notificationError('You must pick the ticket subtype');
        } else if (editorinner === 'undefined' || editorinner === null || editorinner.trim().length < 1 || editorinner.trim() === '<br>') {
            notificationError('The description is empty');
        } else if (editorinner.length > descriptionLength) {
            notificationError('The desciption length can not more than '+descriptionLength+' (include the style editor), your current length is ' + editorinner.length);
        } else {
            for (i = 0; i < $scope.questionAndAnswer.length; i++) {
                if (typeof $scope.snippet[i] === 'undefined' || $scope.snippet[i].trim() === null || $scope.snippet[i].trim().length < 1) {
                    checkError += 1;
                } else if ($scope.snippet[i].trim().length > answerLength) {
                    notificationError('<b>Answer Error For Question Number ' + (i + 1) + '. (' + $scope.questionAndAnswer[i].question + ')' +
                        '</b></n> The answer length can not more than '+answerLength+' letter, your current length is ' + $scope.snippet[i].trim().length);
                    checkLength += 1;
                } else {
                    $scope.questionAndAnswer[i].answer = $scope.snippet[i]
                }
            }

            if (checkError > 0) {
                notificationError('You must answer all of question');
            } else if (checkLength > 0) {
            } else {
                $scope.refreshQandAFlag = 0;
                var submitTT = {
                    TicketCode: temporaryTicketCode,
                    Fuid: mvnoId,
                    CustomerId: customerId,
                    TypeId: $scope.CreateTTSelection.TicketType.typeId,
                    SubTypeId: $scope.CreateTTSelection.TicketSubtype.SubtypeId,
                    MSISDN: msisdn,
                    Description: editorinner,
                }
                var CreateTroubleTicket = new CreateTroubleTicketService(submitTT);
                CreateTroubleTicket.$save(function (result) {
                    notification('Success create the ticket', result)
                    if (result.ResultCode === 0) {
                        var ticketnumber = result.TicketNumber;

                        $scope.upload.uploadFileAttachments(ticketnumber);

                        //question and answer
                        var submitQuestion;
                        submitQuestion = {};
                        for (i = 0; i < $scope.questionAndAnswer.length; i++) {
                            submitQuestion.QuestionId = $scope.questionAndAnswer[i].questionId;
                            submitQuestion.TicketNumber = ticketnumber;
                            submitQuestion.Answer = $scope.questionAndAnswer[i].answer;
                            var AddAnswer = new TTCommonService.TTAddAnswer(submitQuestion);
                            AddAnswer.$save(function (result) {
                                if (result.ResultCode !== 0) {
                                    notificationError(result.Messages)
                                }
                                $scope.refreshQandAFlag += 1;
                            })
                        }
                        $scope.$watch('refreshQandAFlag', function () {
                            if ($scope.refreshQandAFlag === $scope.questionAndAnswer.length) {
                                $scope.CloseCreateTTModal();
                                $rootScope.$broadcast('refreshtableviewtt');
                            }
                        });
                    };
                })
            }
        };
    }

    var notification = function (notificationMessage, result) {
        if (result.ResultCode === 0) {
            notificationSuccess(notificationMessage)
        }
        else {
            notificationError(result.Messages)
        };
    }

    var notificationSuccess = function (notificationMessage) {
        Notification.success({
            message: '<span>' + notificationMessage + '</span>',
            positionY: 'top',
            positionX: 'center'
        });
    }

    var notificationError = function (notificationMessage) {
        Notification.error({
            message: '<span>' + notificationMessage + '</span>',
            positionY: 'top',
            positionX: 'center',
            delay: 10000
        });
    }

    $scope.CloseCreateTTModal = function () {
        angular.element('#CreateTT').modal('hide');
    }
})