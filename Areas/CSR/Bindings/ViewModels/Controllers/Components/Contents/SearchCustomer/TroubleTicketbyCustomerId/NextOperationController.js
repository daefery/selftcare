CSRContent.controller('ActionCloseTTController', function ($scope, $rootScope, DetailCustomer, UpdateTicketDetail, ExecuteTTWorkflow
    , TTCommonService, PagingSelectedTT, CSRCache, TroubleTicketFunctionService, LocalStorageProvider) {

    $scope.isETAKUser = false;
    $scope.isETAKUser = LocalStorageProvider.isETAKUser();

    //Initialization
    var OperationTypeId;
    var closeModalActionCloseTTForm = angular.element('#ActionCloseTT');
    var screenType;
    customerDetail = DetailCustomer.getDetail();
    mvnoId = customerDetail.MVNOId;
    phone = customerDetail.MSISDN;
    customerId = customerDetail.CustomerId;

    $scope.ActionCloseTT = {};

    $scope.CustomerDetailforTT = {
        MVNOName: customerDetail.MVNOName,
        MVNO: mvnoId,
        PhoneNumber: phone,
        CustomerId: customerId
    };

    $scope.ActionName = '';
    $scope.CommentTypeText = ''
    var notificationErrorMessageText,
    notificationSuccessActionMessageText,
    notificationSuccessCommentMessageText,
    commentTypeId;

    var refreshTTDetail = function () {
        $rootScope.$broadcast('justrefresh-thedetail');
        $scope.CancelSubmitActionCloseTT();
        TroubleTicketFunctionService.clearViewAllCache(customerId);
    }

    $scope.$on('nextaction-closett', function (event, args) {
        OperationTypeId = args.OperationTypeId;
        $scope.ActionName = args.actionName;
        screenType = args.screenType;
        $scope.ActionCloseTT.Resolution = '';

        switch (screenType) {
            case 1: //Close
                $scope.CommentTypeText = 'RESOLUTION';
                notificationErrorMessageText = 'Please give the explanation on the resolution box';
                notificationSuccessActionMessageText = 'Success ' + $scope.ActionName.toLowerCase() + ' the trouble ticket';
                notificationSuccessCommentMessageText = 'Success adding the resolution updates';
                $scope.ActionName += 'TT';
                commentTypeId = 1;
                break;
            case 0:
                $scope.CommentTypeText = 'Comments';
                notificationErrorMessageText = 'Please add your comment';
                notificationSuccessActionMessageText = 'Success doing ' + $scope.ActionName.toLowerCase() + ' operation ';
                notificationSuccessCommentMessageText = 'Success adding the comment updates';
                commentTypeId = 0;
                break;
        }

        TTdetails = UpdateTicketDetail.getDetail();
        departmentId = angular.copy(TTdetails.DepartmentId);
        statusId = angular.copy(TTdetails.StatusId);
        TicketNumber = angular.copy(TTdetails.TicketNumber);
        TicketCode = angular.copy(TTdetails.TicketCode);
        selectedTicketType = angular.copy(TTdetails.selectedTicketType);
        selectedTicketSubtype = angular.copy(TTdetails.selectedTicketSubtype);
        selectedClass = angular.copy(TTdetails.selectedClass);
        selectedPriority = angular.copy(TTdetails.selectedPriority);
        currentDescription = angular.copy(TTdetails.TicketDescription);

        temporaryTicketType = angular.copy(selectedTicketType);
        temporaryTicketSubtype = angular.copy(selectedTicketSubtype);
        $scope.ActionCloseTT.Type = temporaryTicketType.name;
        $scope.ActionCloseTT.Subtype = temporaryTicketSubtype.name;
        $scope.ActionCloseTT.IncidentClass = selectedClass.name;
        $scope.ActionCloseTT.Priority = selectedPriority.name;
        $scope.ActionCloseTT.TicketCode = TicketCode;
        $scope.ActionCloseTT.TicketNumber = TicketNumber;
    });

    $scope.ActionCloseTTDetails = {
        field: [
            {
                type: "label",
                name: "ActionCloseTTCode",
                size: 6,
                text: "TT_Code",
                model: "ActionCloseTT.TicketCode",
            },
            {
                type: "label",
                name: "ActionCloseTTNumber",
                size: 6,
                text: "Ticket_Number",
                model: "ActionCloseTT.TicketNumber",
            },
            {
                type: "label",
                name: "ActionCloseType",
                size: 6,
                text: "Type",
                model: "ActionCloseTT.Type",
            },
            {
                type: "label",
                name: "ActionCloseSubtype",
                size: 6,
                text: "Subtype",
                model: "ActionCloseTT.Subtype",
            },
            {
                type: "label",
                name: "ActionClosePriority",
                size: 6,
                text: "Priority",
                model: "ActionCloseTT.Priority",
            },
            {
                type: "label",
                name: "ActionCloseIncidentClass",
                size: 6,
                text: "Incident_Class",
                model: "ActionCloseTT.IncidentClass",
            }
        ]
    };

    $scope.SubmitActionCloseTT = function () {
        var resolution = $scope.ActionCloseTT.Resolution;
        console.log(resolution)
        var resolutionLength = TroubleTicketFunctionService.getLengthValidation('comment');
        if (typeof resolution === 'undefined' || resolution.trim() === null || resolution.trim().length < 1) {
            TroubleTicketFunctionService.showNotificationError(notificationErrorMessageText)
        } else if (resolution.trim().length > resolutionLength){
            TroubleTicketFunctionService.showNotificationError('The remarks length can not more than ' + resolutionLength + ', your current length is ' + resolution.trim().length)
        } else {
            ExecuteTTWorkflow.get({ OperationTypeId: OperationTypeId, TicketNumber: TicketNumber}, function (result) {
                TroubleTicketFunctionService.showNotification(notificationSuccessActionMessageText, result)
                if (result.ResultCode === 0) {
                    var submitResolution = {
                        TicketNumber: TicketNumber,
                        CommentType: commentTypeId,
                        Comment: resolution
                    }
                    var ConnectionAPIIU = new TTCommonService.TTPostComment(submitResolution);
                    ConnectionAPIIU.$save(function (result) {
                        TroubleTicketFunctionService.showNotification(notificationSuccessCommentMessageText, result);
                        if (result.ResultCode === 0) {
                            if ($scope.sendemailforclose == true) {
                                var sendemail = {
                                    TicketNumber: TicketNumber,
                                    Comment: resolution
                                }
                                var Connectionsendemail = new TTCommonService.TTSendEmailNotification(sendemail);
                                Connectionsendemail.$save(function (result) {
                                    if (result.success == true) {
                                        TroubleTicketFunctionService.showNotificationSuccess('Success send the email');
                                    } else {
                                        TroubleTicketFunctionService.showNotificationError(result.message)
                                    }
                                    refreshTTDetail();
                                });
                            }
                            else {
                                refreshTTDetail();
                            }
                        }
                    });
                };
            });
        };
    }

    $scope.CancelSubmitActionCloseTT = function () {
        closeModalActionCloseTTForm.modal('hide');
    }
})

.controller('ActionAssociateTTController', function ($scope, $rootScope, CacheTroubleTicketService, DetailCustomer, UpdateTroubleTicketService
    , TTCommonService, UpdateTicketDetail, ExecuteTTWorkflow, PagingSelectedTT, CSRCache, TroubleTicketFunctionService, LocalStorageProvider) {

    $scope.isETAKUser = false;
    $scope.isETAKUser = LocalStorageProvider.isETAKUser();

    //reuse update TT controller Content for just for a while so some of the variable name using name of variable in Update Controller
    //Initialization
    var restructureClass, resultClass = [],
        restructurePriority, resultPriority = [],
        restructureType, resultType = [],
        restructureSubtype, resultSubtype = [],
        restructureQuestion, resultQuestion = [],
        TicketCode, TicketNumber,
        temporaryTicketType, temporaryTicketSubtype, temporaryQA,
        selectedTicketType, selectedTicketSubtype, selectedClass, selectedPriority, currentDescription,
        OperationTypeId;
    var closeUpdateTTForm = angular.element('#ActionAssociateTT');

    customerDetail = DetailCustomer.getDetail();
    mvnoId = customerDetail.MVNOId;
    phone = customerDetail.MSISDN;
    customerId = customerDetail.CustomerId;

    var TTdetails = {};
    $scope.UpdateTTSection = {}
    temporaryQA = [];

    $scope.ticketType = resultType;
    $scope.ticketSubtype = resultSubtype;
    $scope.questionAndAnswer = resultQuestion;
    $scope.TTClass = resultClass;
    $scope.TTPriority = resultPriority;

    $scope.CustomerDetailforTT = {
        MVNOName: customerDetail.MVNOName,
        MVNO: mvnoId,
        PhoneNumber: phone,
        CustomerId: customerId
    };
    $scope.ActionName = '';
    var notificationErrorMessageText,
    notificationSuccessActionMessageText,
    notificationSuccessCommentMessageText;

    //$scope.TTDetailsGetSet = UpdateTicketDetail.getDetail();
    $scope.$on('nextaction-associatett', function (event, args) {
        OperationTypeId = args.OperationTypeId;
        $scope.ActionName = args.actionName;

        TroubleTicketFunctionService.updateTicketStarterPack(mvnoId).then(function (result) {
            console.log(result);

            TTdetails = result.TicketDetail;
            departmentId = angular.copy(TTdetails.DepartmentId);
            statusId = angular.copy(TTdetails.StatusId);
            TicketNumber = angular.copy(TTdetails.TicketNumber);
            TicketCode = angular.copy(TTdetails.TicketCode);
            selectedTicketType = angular.copy(TTdetails.selectedTicketType);
            selectedTicketSubtype = angular.copy(TTdetails.selectedTicketSubtype);
            selectedClass = angular.copy(TTdetails.selectedClass);
            selectedPriority = angular.copy(TTdetails.selectedPriority);
            currentDescription = angular.copy(TTdetails.TicketDescription);

            temporaryTicketType = angular.copy(selectedTicketType);
            temporaryTicketSubtype = angular.copy(selectedTicketSubtype);
            $scope.UpdateTTSection.TicketType = temporaryTicketType;
            $scope.UpdateTTSection.TicketSubtype = temporaryTicketSubtype;
            $scope.UpdateTTSection.TTClass = selectedClass;
            $scope.UpdateTTSection.TTPriority = selectedPriority;
            $scope.UpdateTTSection.TicketCode = TicketCode;
            $scope.UpdateTTSection.TicketNumber = TicketNumber;
            $scope.UpdateTTSection.Description = currentDescription;
            $scope.UpdateTTSection.InformativeUpdates = '';
            temporaryQA = TTdetails.questionAndAnswer;
            $scope.questionAndAnswer = angular.copy(temporaryQA);
            $scope.TTClass = result.ListOfClass;
            $scope.TTPriority = result.ListOfPriority;
            $scope.ticketType = result.ListOfType;
        });
    });

    $scope.$watch('UpdateTTSection.TicketType', function () {
        if ($scope.UpdateTTSection.TicketType) {
            temporaryTicketType = $scope.UpdateTTSection.TicketType.typeId
            TicketCode = temporaryTicketType
            $scope.ticketSubtype = [];
            TroubleTicketFunctionService.restructureTicketSubtype(mvnoId, temporaryTicketType).then(function (restructureResult) {
                $scope.ticketSubtype = restructureResult;
            });
            if ($scope.UpdateTTSection.TicketType.typeId !== selectedTicketType.typeId) {
                $scope.UpdateTTSection.TicketSubtype = null;
                $scope.UpdateTTSection.TicketCode = '';
            } else {
                $scope.UpdateTTSection.TicketSubtype = selectedTicketSubtype;
                $scope.UpdateTTSection.TicketCode = TicketCode;
            };
        };

    }, true);

    $scope.$watch('UpdateTTSection.TicketSubtype', function () {
        if ($scope.UpdateTTSection.TicketSubtype) {
            if (typeof temporaryTicketType.typeId === 'undefined') {
                //nothing
            } else {
                temporaryTicketType = temporaryTicketType.typeId;
            };
            if (selectedTicketSubtype.subtypeId === $scope.UpdateTTSection.TicketSubtype.subtypeId && $scope.UpdateTTSection.TicketType.typeId === selectedTicketType.typeId) {
                $scope.questionAndAnswer = []
                $scope.questionAndAnswer = angular.copy(temporaryQA);
            } else {
                temporaryTicketSubtype = $scope.UpdateTTSection.TicketSubtype.subtypeId;
                $scope.questionAndAnswer = [];
                $scope.UpdateTTSection.TicketCode = TicketCode;
                CacheTroubleTicketService.getTicketQuestion(mvnoId, temporaryTicketType, temporaryTicketSubtype).then(function (result) {
                    data = angular.copy(result);
                    restructureQuestion = data.TTQuestions
                    for (i = 0; i < restructureQuestion.length; i++) {
                        $scope.questionAndAnswer[i] = {}
                        $scope.questionAndAnswer[i].question = restructureQuestion[i].QuestionCode.NameId.DefaultMessage;
                        $scope.questionAndAnswer[i].questionId = restructureQuestion[i].QuestionId;
                        $scope.questionAndAnswer[i].answer = "";
                    }
                });
            };
        };
    }, true);

    $scope.UpdateTT = TroubleTicketFunctionService.updateTTGenericFormValue();
    
    var refreshTTDetailandAnswer = function () {
        $rootScope.$broadcast('refreshdetailtt-now');
        $scope.CancelUpdateTT();
        TroubleTicketFunctionService.clearViewAllCache(customerId);
    }

    var refreshTTDetail = function () {
        $rootScope.$broadcast('justrefresh-thedetail');
        $scope.CancelUpdateTT();
        TroubleTicketFunctionService.clearViewAllCache(customerId);
    }

    var descriptionLength = TroubleTicketFunctionService.getLengthValidation('description');
    var answerLength = TroubleTicketFunctionService.getLengthValidation('answer');
    var informativeUpdatesLength = TroubleTicketFunctionService.getLengthValidation('comment');

    $scope.SubmitUpdateTT = function () {
        var checkError = 0;
        var checkChanges = 0;
        var checkLength = 0;
        $scope.refreshDetailFlag = 0;
        $scope.refreshQandAFlag = 0;
        console.log($scope.questionAndAnswer);
        TroubleTicketFunctionService.updateValidationCheck($scope.UpdateTTSection, $scope.questionAndAnswer, temporaryQA, selectedTicketType, selectedTicketSubtype).then(function (updateValidationCheckResult) {
            console.log(updateValidationCheckResult);
            var error = updateValidationCheckResult;
            console.log(error);
            if (error.errorUpdateValCaught === 0) {
                if (error.checkError > 0) {
                    TroubleTicketFunctionService.showNotificationError('You must answer all of question');
                } else if (error.checkLength > 0) {
                } else {
                    if (selectedTicketType.typeId === $scope.UpdateTTSection.TicketType.typeId && selectedTicketSubtype.subtypeId === $scope.UpdateTTSection.TicketSubtype.subtypeId &&
                        selectedClass.classId === $scope.UpdateTTSection.TTClass.classId && selectedPriority.priorityId === $scope.UpdateTTSection.TTPriority.priorityId &&
                        currentDescription === $scope.UpdateTTSection.Description && error.checkChanges === 0) {
                        var submitInformativeUpdates = $scope.UpdateTTSection.InformativeUpdates;
                        TroubleTicketFunctionService.executeWorkflow(OperationTypeId, TicketNumber, submitInformativeUpdates, $scope.sendemailforassociate).then(function (executeResult) {
                            refreshTTDetail();
                        });
                    } else {
                        var updateTTAPIObject = {
                            Id: TicketNumber,
                            TicketCode: ($scope.UpdateTTSection.TicketCode).toString(),
                            Fuid: parseInt(mvnoId),
                            ClassId: $scope.UpdateTTSection.TTClass.classId,
                            PriorityId: $scope.UpdateTTSection.TTPriority.priorityId,
                            DepartmentId: departmentId,
                            StatusId: statusId,
                            Description: $scope.UpdateTTSection.Description,
                            TypeId: $scope.UpdateTTSection.TicketType.typeId,
                            SubTypeId: $scope.UpdateTTSection.TicketSubtype.subtypeId
                        }
                        var submitTicketSubtype = $scope.UpdateTTSection.TicketSubtype.subtypeId;
                        var submitInformativeUpdates = $scope.UpdateTTSection.InformativeUpdates;
                        var submitTTUpdateAnswer;

                        if (
                            updateTTAPIObject.TicketCode !== TTdetails.TicketCode ||
                            updateTTAPIObject.ClassId !== TTdetails.selectedClass.classId ||
                            updateTTAPIObject.Priority !== TTdetails.selectedPriority.priorityId ||
                            updateTTAPIObject.StatusId !== TTdetails.StatusId ||
                            updateTTAPIObject.Description !== TTdetails.TicketDescription
                            ) {
                            UpdateTroubleTicketService.update(updateTTAPIObject, function (result) {
                                TroubleTicketFunctionService.showNotification('Success update the ticket', result)
                                $scope.refreshDetailFlag += 1;
                            });
                        } else {
                            $scope.refreshDetailFlag += 1;
                        };


                        if (parseInt(updateTTAPIObject.TicketCode) === selectedTicketType.typeId && submitTicketSubtype === selectedTicketSubtype.subtypeId) {
                            for (i = 0; i < temporaryQA.length; i++) {
                                if ($scope.questionAndAnswer[i].answer !== temporaryQA[i].answer) {
                                    submitTTUpdateAnswer = {
                                        AnswerId: $scope.questionAndAnswer[i].answerId,
                                        QuestionId: $scope.questionAndAnswer[i].questionId,
                                        TicketNumber: TicketNumber,
                                        Answer: $scope.questionAndAnswer[i].answer
                                    }
                                    TTCommonService.TTUpdateAnswer.update(submitTTUpdateAnswer, function (result) {
                                        TroubleTicketFunctionService.showNotification('Success update the answer', result)
                                        $scope.refreshQandAFlag += 1;
                                    });
                                } else {
                                    $scope.refreshQandAFlag += 1;
                                };
                            }
                        } else {
                            var deleteAnswer = {},
                                submitQuestion = {};
                            for (i = 0; i < temporaryQA.length; i++) {

                                deleteAnswer = {
                                    AnswerId: temporaryQA[i].answerId
                                }
                                var notificationText = 'Success delete answer for question: ' + temporaryQA[i].question;
                                var ConnectionAPIDeleteComment = new TTCommonService.TTDeleteAnswer(deleteAnswer);
                                ConnectionAPIDeleteComment.$save(function (result) {
                                    TroubleTicketFunctionService.showNotification(notificationText, result);
                                });
                            }
                            for (i = 0; i < $scope.questionAndAnswer.length; i++) {
                                submitQuestion.QuestionId = $scope.questionAndAnswer[i].questionId;
                                submitQuestion.TicketNumber = TicketNumber;
                                submitQuestion.Answer = $scope.questionAndAnswer[i].answer;
                                var notificationText = 'Success submit answer for question: ' + $scope.questionAndAnswer[i].question;
                                var AddAnswer = new TTCommonService.TTAddAnswer(submitQuestion);
                                AddAnswer.$save(function (result) {
                                    TroubleTicketFunctionService.showNotification(notificationText, result)
                                    $scope.refreshQandAFlag += 1;
                                })
                            }

                        };
                        TroubleTicketFunctionService.executeWorkflow(OperationTypeId, TicketNumber, submitInformativeUpdates, $scope.sendemailforassociate).then(function (executeResult) {
                            $scope.refreshDetailFlag += 1;
                        });
                        $scope.$watch('refreshDetailFlag', function () {
                            if ($scope.refreshDetailFlag === 2 && $scope.refreshQandAFlag === $scope.questionAndAnswer.length) {
                                refreshTTDetailandAnswer();
                            }
                        });
                        $scope.$watch('refreshQandAFlag', function () {
                            if ($scope.refreshDetailFlag === 2 && $scope.refreshQandAFlag === $scope.questionAndAnswer.length) {
                                refreshTTDetailandAnswer();
                            }
                        });
                    }
                }
            }
        });
    }

    $scope.associate = {};
    $scope.CancelUpdateTT = function () {
        closeUpdateTTForm.modal('hide');
    }
})