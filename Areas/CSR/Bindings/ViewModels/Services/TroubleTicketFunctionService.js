'use strict';

//The purpose of this function is to facilitate trouble ticket controller to call general function for easier maintenance
CSRContent.service('TroubleTicketFunctionService', function ($q, CSRCache, Notification, UpdateTicketDetail, CacheTroubleTicketService, ExecuteTTWorkflow, TTCommonService) {
    var dataCache = CSRCache;
    return {
        removeCacheByProperties: function (cacheName, keyObject) {
            var cacheVal,
                index;

            cacheVal = angular.copy(CSRCache.get(cacheName));
            index = searchObjectData(cacheVal, keyObject);
            if (index > -1) {
                cacheVal.splice(index, 1);
                CSRCache.put(cacheName, cacheVal)
            } else {
                console.log('Cache Object Is Not Found.')
            }
        },
        getCacheByProperties: function (cacheName, keyObject) {
            var cacheVal,
                index,
                returnDataCache;

            cacheVal = angular.copy(CSRCache.get(cacheName));
            index = searchObjectData(cacheVal, keyObject);
            if (index > -1) {
                returnDataCache = angular.copy(cacheVal).splice(index, 1);
                returnDataCache = returnDataCache[0].Data
            } else {
                returnDataCache = index;
            }
            return returnDataCache;
        },
        getLengthValidation: function (VariableName) {
            var returnVal;
            returnVal = getLengthVal(VariableName);
            return returnVal;
        },
        showNotification: function (message, result) {
            notification(message, result);
        },
        showNotificationError: function (message) {
            notificationError(message);
        },
        showNotificationSuccess: function (message) {
            notificationSuccess(message);
        },
        updateTicketStarterPack: function (mvnoId) {
            var deferred = $q.defer();
            var updateTicketStarterPackValue = {};
            var ticketDetail = {};

            ticketDetail = UpdateTicketDetail.getDetail();
            var ticketNumber = ticketDetail.TicketNumber;
            var questionAndAnswer = [];

            $q.all([
            getAnswer(ticketNumber),
            getType(mvnoId),
            getClassAndPriority(mvnoId)
            ]).then(function (value) {
                // Success callback where value is an array containing the success values
                ticketDetail.questionAndAnswer = value[0];
                updateTicketStarterPackValue.TicketDetail = ticketDetail;
                updateTicketStarterPackValue.ListOfType = value[1];
                updateTicketStarterPackValue.ListOfClass = value[2].Class;
                updateTicketStarterPackValue.ListOfPriority = value[2].Priority;

                deferred.resolve(updateTicketStarterPackValue);
            //}, function (reason) {
                //    // Error callback where reason is the value of the first rejected promise
                //not implemented yet
            });

            return deferred.promise
        },
        updateTTGenericFormValue: function () {
            var formField = {
                field: [
                    {
                        type: "label",
                        name: "UpdateTTCode",
                        size: 6,
                        text: "TT_Code",
                        model: "UpdateTTSection.TicketCode",
                    },
                    {
                        type: "label",
                        name: "UpdateTTNumber",
                        size: 6,
                        text: "Ticket_Number",
                        model: "UpdateTTSection.TicketNumber",
                    },
                    {
                        type: "select",
                        name: "UpdateTTType",
                        size: 6,
                        text: "TT_Type",
                        model: "UpdateTTSection.TicketType",
                        value: "ticketType",
                        required: true,
                        validation: [{ value: "mandatory" }]
                    },
                    {
                        type: "select",
                        name: "UpdateTTSubtype",
                        size: 6,
                        text: "TT_Subtype",
                        model: "UpdateTTSection.TicketSubtype",
                        value: "ticketSubtype",
                        required: true,
                        validation: [{ value: "mandatory" }]
                    },
                    {
                        type: "select",
                        name: "UpdateTTClass",
                        size: 6,
                        text: "Incident_Class",
                        model: "UpdateTTSection.TTClass",
                        value: "TTClass",
                        required: true,
                        validation: [{ value: "mandatory" }]
                    },
                    {
                        type: "select",
                        name: "UpdateTTPriority",
                        size: 6,
                        text: "Priority",
                        model: "UpdateTTSection.TTPriority",
                        value: "TTPriority",
                        required: true,
                        validation: [{ value: "mandatory" }]
                    }

                ]
            };
            return formField;
        },
        updateValidationCheck: function (updateTTVal, questionAndAnswer, temporaryQA, selectedTicketType, selectedTicketSubtype) {
            var descriptionLength = getLengthVal('description');
            var answerLength = getLengthVal('answer');
            var informativeUpdatesLength = getLengthVal('comment');
            var errorChecker = {};
            errorChecker.errorUpdateValCaught = 1;
            var checkError = 0;
            var checkChanges = 0;
            var checkLength = 0;

            var deferred = $q.defer();
            if (typeof updateTTVal.TicketSubtype === 'undefined' || updateTTVal.TicketSubtype === null) {
                notificationError('You must pick the subtype');
            } else if (typeof updateTTVal.Description === 'undefined') {
                notificationError('The description is empty');
            } else if (typeof updateTTVal.InformativeUpdates === 'undefined') {
                notificationError('The informative updates is empty');
            } else if (updateTTVal.Description.trim() === null || updateTTVal.Description.trim().length < 1) {
                notificationError('The description is empty');
            } else if (updateTTVal.Description.trim().length > descriptionLength) {
                notificationError('The desciption length can not more than ' + descriptionLength + ', your current length is ' + updateTTVal.Description.trim().length) + ' (with style).';
            } else if (updateTTVal.InformativeUpdates.trim().length > informativeUpdatesLength) {
                notificationError('The Informative updates length can not more than ' + informativeUpdatesLength + ', your current length is ' + updateTTVal.InformativeUpdates.trim().length) + ' (with style).';
            } else if (updateTTVal.InformativeUpdates.trim() === null || updateTTVal.InformativeUpdates.trim().length < 1) {
                notificationError('The informative updates is empty');
            } else {
                for (i = 0; i < questionAndAnswer.length; i++) {
                    if (typeof questionAndAnswer[i].answer === 'undefined') {
                        checkError += 1;
                    } else if (questionAndAnswer[i].answer.trim() === null || questionAndAnswer[i].answer.trim().length < 1) {
                        checkError += 1;
                    } else if (questionAndAnswer[i].answer.trim().length > answerLength) {
                        notificationError('<b>Answer Error For Question Number ' + (i + 1) + '. (' + questionAndAnswer[i].question + ')' +
                            '</b></n> The answer length can not more than ' + answerLength + ' letter, your current length is ' + questionAndAnswer[i].answer.trim().length);
                        checkLength += 1;
                    };

                    if (parseInt(updateTTVal.TicketType.typeId) === selectedTicketType.typeId && updateTTVal.TicketSubtype.subtypeId === selectedTicketSubtype.subtypeId) {
                        if (questionAndAnswer[i].answer !== temporaryQA[i].answer) {
                            checkChanges += 1;
                        };
                    }
                };
                errorChecker.checkError = checkError;
                errorChecker.checkLength = checkLength;
                errorChecker.checkChanges = checkChanges;
                errorChecker.errorUpdateValCaught = 0;
            }

            deferred.resolve(errorChecker);
            return deferred.promise
        },
        executeWorkflow: function (OperationTypeId, TicketNumber, submitInformativeUpdates, sendEmail) {
            var deferred = $q.defer();
            var sendEmailStatus;
            ExecuteTTWorkflow.get({ OperationTypeId: OperationTypeId, TicketNumber: TicketNumber }, function (result) {
                notification('Success associate the trouble ticket', result)
                console.log('associate',result)
                if (result.ResultCode === 0) {
                    var submitComment = {
                        TicketNumber: TicketNumber,
                        CommentType: 2,
                        Comment: submitInformativeUpdates
                    };
                    var ConnectionAPIIU = new TTCommonService.TTPostComment(submitComment);
                    ConnectionAPIIU.$save(function (result) {
                        notification('Success adding the informative updates', result);
                        if (result.ResultCode === 0) {
                            if (sendEmail == true) {
                                var sendemail = {
                                    TicketNumber: TicketNumber,
                                    Comment: submitInformativeUpdates
                                };
                                var Connectionsendemail = new TTCommonService.TTSendEmailNotification(sendemail);
                                Connectionsendemail.$save(function (result) {
                                    if (result.success == true) {
                                        notificationSuccess('Success send the email');
                                    } else {
                                        notificationError(result.message);
                                    };
                                    sendEmailStatus = true;
                                    deferred.resolve(sendEmailStatus);
                                });
                            }
                            else {
                                sendEmailStatus = false;
                                deferred.resolve(sendEmailStatus);
                            }
                        }
                    });
                };
            });

            return deferred.promise;
        },
        restructureTicketSubtype: function (mvnoId, temporaryTicketType) {
            var deferred = $q.defer();
            var resultSubtype = [];
            CacheTroubleTicketService.getTicketSubtype(mvnoId, temporaryTicketType).then(function (result) {
                var restructureSubtype = result.TTSubTypeLists;

                for (i = 0; i < restructureSubtype.length; i++) {
                    resultSubtype[i] = {};
                    resultSubtype[i].name = restructureSubtype[i].NameId.DefaultMessage;
                    resultSubtype[i].subtypeId = restructureSubtype[i].SubTypeId;
                }
                deferred.resolve(resultSubtype);
            });
            return deferred.promise;
        },
        clearViewAllCache: function (customerId) {
            var cacheKey = 'searchTroubleTicketByCustomerId=' + customerId;
            CSRCache.remove(cacheKey);
            CSRCache.remove('SearchBrowseTT');
        }
    }

    function getLengthVal(VariableName) {
        var length;
        VariableName = VariableName.toUpperCase();
        switch (VariableName) {
            case 'DESCRIPTION':
                length = 3000;
                break;
            case 'ANSWER':
            case 'REFERENCE':
            case 'REMARKS':
                length = 1024;
                break;
            case 'COMMENT':
                length = 3096;
                break;
            default:
                length = -1
                console.log('Failed to check length in getLengthValidation function');
        }
        if (length > 0) {
            return length;
        };
    };

    function getAnswer(ticketNumber) {
        var deferred = $q.defer();
        var questionAndAnswer = [];

        CacheTroubleTicketService.getAnswer(ticketNumber).then(function (result) {
            var ticketAnswerList = result.TroubleTicketAnswerList;
            for (i = 0; i < ticketAnswerList.length; i++) {
                questionAndAnswer[i] = {};
                questionAndAnswer[i].question = ticketAnswerList[i].Question.QuestionCode.NameId.DefaultMessage;
                questionAndAnswer[i].questionId = ticketAnswerList[i].Question.QuestionId;
                questionAndAnswer[i].answer = ticketAnswerList[i].Answer;
                questionAndAnswer[i].answerId = ticketAnswerList[i].AnswerId;
            };
            deferred.resolve(questionAndAnswer);
        });
        return deferred.promise;
    }

    function getType(mvnoId) {
        var deferred = $q.defer();
        var resultType = [];

        CacheTroubleTicketService.getTicketType(mvnoId).then(function (result) {
            var restructureType = result.TroubleTicketTypeLists;
            for (i = 0; i < restructureType.length; i++) {
                resultType[i] = {};
                resultType[i].name = restructureType[i].NameId.DefaultMessage;
                resultType[i].typeId = restructureType[i].TypeId;
            }
            deferred.resolve(resultType);
        });
        return deferred.promise;
    }

    function getClassAndPriority(mvnoId) {
        var deferred = $q.defer();
        var resultClass = [];
        var resultPriority = [];
        var returnVal = {}

        CacheTroubleTicketService.getClassAndPriority(mvnoId).then(function (result) {
            var restructureClass = result.ClassList;
            var restructurePriority = result.PriorityList;

            for (i = 0; i < restructureClass.length; i++) {
                resultClass[i] = {};
                resultClass[i].name = restructureClass[i].Name;
                resultClass[i].classId = restructureClass[i].Id;
            }
            for (i = 0; i < restructurePriority.length; i++) {
                resultPriority[i] = {};
                resultPriority[i].name = restructurePriority[i].Name;
                resultPriority[i].priorityId = restructurePriority[i].Id;
            }
            returnVal.Class = resultClass;
            returnVal.Priority = resultPriority;
            deferred.resolve(returnVal);
        });
        return deferred.promise;
    }

    function searchObjectData(dataForChecking, keyObject) {
        var retVal = -1,
            condition;

        for (var i = 0; i < dataForChecking.length; i++) {
            var item = dataForChecking[i];
            for (var j = 0; j < keyObject.length; j++) {
                condition = checkingCondition(item, keyObject[j]);
                if (condition == false) {
                    break;
                } else if (j === (keyObject.length - 1) && condition == true) {
                    return i;
                }
            };
        };
        return retVal;
    };

    function checkingCondition(item, key) {
        if (item[key.name] === key.value) {
            return true;
        };
        return false;
    }

    function notification(message, result) {
        //need more verification about success indicator
        if (result.ResultCode === 0) {
            notificationSuccess(message)
        }
        else {
            notificationError(result.Messages)
        };
    }

    function notificationSuccess(notificationMessage) {
        Notification.success({
            message: '<span><b>Success!</b> ' + notificationMessage + '</span>',
            positionY: 'top',
            positionX: 'center',
            delay: 7500
        });
    }

    //Showing the error message 
    function notificationError(errorMessage) {
        return Notification.error({
            message: '<span><b>Error!</b> ' + errorMessage + '</span>',
            positionY: 'top',
            positionX: 'center',
            delay: 7500
        });
    }
});