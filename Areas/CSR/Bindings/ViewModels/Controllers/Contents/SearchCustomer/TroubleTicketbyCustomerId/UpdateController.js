CSRContent.controller('UpdateTroubleTicketbyCustomerIdController', function ($scope, $rootScope, CacheTroubleTicketService, DetailCustomer, UpdateTroubleTicketService
    , TTCommonService, Notification, UpdateTicketDetail, PagingSelectedTT, CSRCache, TroubleTicketFunctionService, LocalStorageProvider) {

    $scope.isETAKUser = false;
    $scope.isETAKUser = LocalStorageProvider.isETAKUser();

    //Initialization
    var restructureClass, resultClass = [],
        restructurePriority, resultPriority = [],
        restructureType, resultType = [],
        restructureSubtype, resultSubtype = [],
        restructureQuestion, resultQuestion = [],
        TicketCode, TicketNumber,
        temporaryTicketType, temporaryTicketSubtype, temporaryQA,
        selectedTicketType, selectedTicketSubtype, selectedClass, selectedPriority, currentDescription;
    var closeUpdateTTForm = angular.element('#UpdateTT');

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

    $scope.$on('updatett-canbeprocessed', function (event, args) {
        TroubleTicketFunctionService.updateTicketStarterPack(mvnoId).then(function (result) {
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
                $scope.questionAndAnswer = [];
                $scope.questionAndAnswer = angular.copy(temporaryQA);
            } else {
                temporaryTicketSubtype = $scope.UpdateTTSection.TicketSubtype.subtypeId;
                $scope.UpdateTTSection.TicketCode = TicketCode;
                $scope.questionAndAnswer = []
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

    var refreshTTDetail = function () {
        $scope.CancelUpdateTT();
        $rootScope.$broadcast('refreshdetailtt-now');
        TroubleTicketFunctionService.clearViewAllCache(customerId);
    }

    $scope.SubmitUpdateTT = function () {
        $scope.refreshDetailFlag = 0;
        $scope.refreshQandAFlag = 0;
        TroubleTicketFunctionService.updateValidationCheck($scope.UpdateTTSection, $scope.questionAndAnswer, temporaryQA, selectedTicketType, selectedTicketSubtype).then(function (updateValidationCheckResult) {
            var error = updateValidationCheckResult;
            if (error.errorUpdateValCaught === 0) {
                if (error.checkError > 0) {
                    TroubleTicketFunctionService.showNotificationError('You must answer all of question');
                } else if (error.checkLength > 0) {
                } else {
                    if (selectedTicketType.typeId === $scope.UpdateTTSection.TicketType.typeId && selectedTicketSubtype.subtypeId === $scope.UpdateTTSection.TicketSubtype.subtypeId &&
                        selectedClass.classId === $scope.UpdateTTSection.TTClass.classId && selectedPriority.priorityId === $scope.UpdateTTSection.TTPriority.priorityId &&
                        currentDescription === $scope.UpdateTTSection.Description && error.checkChanges === 0) {
                        TroubleTicketFunctionService.showNotificationError('You haven\'t changed anything yet');
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


                        if ($scope.UpdateTTSection.TicketType.typeId === selectedTicketType.typeId && submitTicketSubtype === selectedTicketSubtype.subtypeId) {
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
                                var ConnectionAPIDeleteComment = new TTCommonService.TTDeleteAnswer(deleteAnswer);
                                ConnectionAPIDeleteComment.$save(function (result) {
                                    if (result.ResultCode !== 0) {
                                        TroubleTicketFunctionService.showNotificationError(result.Messages)
                                    }
                                });
                            }
                            for (i = 0; i < $scope.questionAndAnswer.length; i++) {
                                submitQuestion.QuestionId = $scope.questionAndAnswer[i].questionId;
                                submitQuestion.TicketNumber = TicketNumber;
                                submitQuestion.Answer = $scope.questionAndAnswer[i].answer;
                                var AddAnswer = new TTCommonService.TTAddAnswer(submitQuestion);
                                AddAnswer.$save(function (result) {
                                    if (result.ResultCode !== 0) {
                                        TroubleTicketFunctionService.showNotificationError(result.Messages)
                                    }
                                    $scope.refreshQandAFlag += 1;
                                })
                            }
                        };

                        if (typeof submitInformativeUpdates !== 'undefined') {
                            if (submitInformativeUpdates.trim() !== null && submitInformativeUpdates.trim().length > 0) {
                                var submitObjectIU = {
                                    TicketNumber: TicketNumber,
                                    CommentType: 2,
                                    Comment: submitInformativeUpdates
                                }
                                var ConnectionAPIIU = new TTCommonService.TTPostComment(submitObjectIU);
                                ConnectionAPIIU.$save(function (result) {
                                    TroubleTicketFunctionService.showNotification('Success adding the informatives updates', result);
                                    $scope.refreshDetailFlag += 1;
                                });
                            } else {
                                $scope.refreshDetailFlag += 1;
                            }
                        };
                        $scope.$watch('refreshDetailFlag', function () {
                            if ($scope.refreshDetailFlag === 2 && $scope.refreshQandAFlag === $scope.questionAndAnswer.length) {
                                refreshTTDetail();
                            }
                        });
                        $scope.$watch('refreshQandAFlag', function () {
                            if ($scope.refreshDetailFlag === 2 && $scope.refreshQandAFlag === $scope.questionAndAnswer.length) {
                                refreshTTDetail();
                            }
                        });
                    }
                }
            }
        })
    }

    $scope.CancelUpdateTT = function () {
        closeUpdateTTForm.modal('hide');
    }
})

.controller('UpdateExtendedTTTroubleTicketbyCustomerIdController', function ($scope, $rootScope, DetailCustomer, Notification,
    UpdateExtendedInfoTicketDetail, CommonEnum, UpdateExtendedInfoTroubleTicketService, PagingSelectedTT, CSRCache, TroubleTicketFunctionService,
    LocalStorageProvider) {

    $scope.isETAKUser = false;
    $scope.isETAKUser = LocalStorageProvider.isETAKUser();

    //Initialization
    var TTExtendedDetails = {},
        tTTag,
        tTEscalation,
        tTEscalationReason;
    var closeUpdateExtendedInfoTTForm = angular.element('#UpdateExtendedInfoTT');

    var remarksLength = TroubleTicketFunctionService.getLengthValidation('REMARKS');

    customerDetail = DetailCustomer.getDetail();
    mvnoId = customerDetail.MVNOId;
    phone = customerDetail.MSISDN;
    customerId = customerDetail.CustomerId;

    $scope.UpdateExtendedTTSection = {}

    $scope.CustomerDetailforTT = {
        MVNOName: customerDetail.MVNOName,
        MVNO: mvnoId,
        PhoneNumber: phone,
        CustomerId: customerId
    };

    tTTag = CommonEnum.getTtTagEnum();
    tTEscalation = CommonEnum.getTtEscalationEnum();
    tTEscalationReason = CommonEnum.getTtEscalationReasonEnum();

    $scope.$on('updateextendedtt-canbeprocessed', function (event, args) {
        getDetails = UpdateExtendedInfoTicketDetail.getDetail();
        TTExtendedDetails = angular.copy(getDetails);
        $scope.UpdateExtendedTTSection = {
            TicketCode: TTExtendedDetails.TicketCode,
            TicketNumber: TTExtendedDetails.TicketNumber,
            Tag: TTExtendedDetails.Tag,
            Escalation: TTExtendedDetails.Escalation,
            EscalationReason: TTExtendedDetails.EscalationReason,
            Remarks: TTExtendedDetails.Remarks
        };

        $scope.TagObject = tTTag;
        $scope.EscalationObject = tTEscalation;
        $scope.EscalationReasonObject = tTEscalationReason;
    });

    $scope.UpdateExtendedInfoTT = {
        field: [
            {
                type: "label",
                name: "UpdateExtendedTTCode",
                size: 6,
                text: "TT_Code",
                model: "UpdateExtendedTTSection.TicketCode",
            },
            {
                type: "label",
                name: "UpdateExtendedTTNumber",
                size: 6,
                text: "Ticket_Number",
                model: "UpdateExtendedTTSection.TicketNumber",
            },
            {
                type: "select",
                name: "UpdateExtendedTTTag",
                size: 6,
                text: "TAG",
                model: "UpdateExtendedTTSection.Tag",
                value: "TagObject",
                required: true,
                validation: [{ value: "mandatory" }]
            },
            {
                type: "select",
                name: "UpdateExtendedTTEscalation",
                size: 6,
                text: "ESCALATION",
                model: "UpdateExtendedTTSection.Escalation",
                value: "EscalationObject",
                required: true,
                validation: [{ value: "mandatory" }]
            },
            {
                type: "select",
                name: "UpdateExtendedTTEscalationReason",
                size: 6,
                text: "ESCALATION_REASON",
                model: "UpdateExtendedTTSection.EscalationReason",
                value: "EscalationReasonObject",
                required: true,
                validation: [{ value: "mandatory" }]
            },

        ]
    };

    $scope.SubmitUpdateExtendedInfoTT = function () {
        var updateExtendedObject = {
            Id: $scope.UpdateExtendedTTSection.TicketNumber,
            Tag: $scope.UpdateExtendedTTSection.Tag.value,
            Escalation: $scope.UpdateExtendedTTSection.Escalation.value,
            EscalationReason: $scope.UpdateExtendedTTSection.EscalationReason.value,
            Remarks: $scope.UpdateExtendedTTSection.Remarks,
        };
        if (updateExtendedObject.Tag === getDetails.Tag.value && updateExtendedObject.Escalation === getDetails.Escalation.value &&
            updateExtendedObject.EscalationReason === getDetails.EscalationReason.value && updateExtendedObject.Remarks === getDetails.Remarks) {
            TroubleTicketFunctionService.showNotificationError('You haven\'t changed anything yet')
        } else if (updateExtendedObject.Remarks != null && updateExtendedObject.Remarks.length > remarksLength) {
            TroubleTicketFunctionService.showNotificationError('The remarks length can not more than ' + remarksLength + ', your current length is ' + updateExtendedObject.Remarks.length);
        } else {
            UpdateExtendedInfoTroubleTicketService.update(updateExtendedObject, function (result) {
                TroubleTicketFunctionService.showNotification('Success update the extended info', result)
                if (result.ResultCode === 0) {
                    $rootScope.$broadcast('justrefresh-thedetail');
                    $scope.CancelUpdateExtendedInfoTT();
                    TroubleTicketFunctionService.clearViewAllCache(customerId);
                };
            });
        };
    }

    $scope.CancelUpdateExtendedInfoTT = function () {
        closeUpdateExtendedInfoTTForm.modal('hide');
    }
})
