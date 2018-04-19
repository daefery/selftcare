//TroubleTicket API, for common service
CSRContent.factory('TTCommonService', function ($resource, ApiConnection) {
    return {
        TTGetType: $resource(ApiConnection + '/api/common/troubleticket/type?MvnoId=:MvnoId', {}),
        TTGetSubtype: $resource(ApiConnection + '/api/common/troubleticket/subtype?MvnoId=:MvnoId&TypeId=:TypeId', {}),
        TTGetQuestion: $resource(ApiConnection + '/api/common/troubleticket/questions?MvnoId=:MvnoId&TypeId=:TypeId&SubTypeId=:SubtypeId', {}),
        TTGetDetail: $resource(ApiConnection + '/api/common/troubleticket/detail/:Id?ShowAvailableOperations=true&ShowResponseTime=true&ShowReferences=true', {}),
        TTPostComment: $resource(ApiConnection + '/api/common/troubleticket/comment/create', {}, {
            save: {
                method: 'POST'
            }
        }),
        TTDeleteComment: $resource(ApiConnection + '/api/common/troubleticket/comment/delete', {}, {
            delete: {
                method: 'POST'
            }
        }),
        TTPostAttachment: $resource(ApiConnection + '/api/common/troubleticket/attachment/add', {}, {
            add: {
                method: 'POST'
            }
        }),
        TTDeleteAttachment: $resource(ApiConnection + '/api/common/troubleticket/attachment/delete', {}, {
            delete: {
                method: 'POST'
            }
        }),
        TTUploadFileAttachment: $resource(ApiConnection + '/api/csr/troubleticket/attachment/uploadfile', {}, {
            upload: {
                method: 'POST'
            }
        }),
        TTDownloadFileAttachment: $resource(ApiConnection + '/api/csr/troubleticket/attachment/downloadfile', {}, {
            download: {
                method: 'POST'
            }
        }),
        TTDeleteFileAttachment: $resource(ApiConnection + '/api/csr/troubleticket/attachment/deletefile', {}, {
            delete: {
                method: 'POST'
            }
        }),
        TTSendEmailNotification: $resource(ApiConnection + '/api/common/troubleticket/email/notification', {}),
        TTAddAnswer: $resource(ApiConnection + '/api/common/troubleticket/answer/add', {}),
        TTDeleteAnswer: $resource(ApiConnection + '/api/common/troubleticket/answer/delete', {}),
        TTGetAnswer: $resource(ApiConnection + '/api/common/troubleticket/answers?TicketNo=:TicketNo', {}),
        TTUpdateAnswer: $resource(ApiConnection + '/api/common/troubleticket/answer/update', {}, {
            update: {
                method: 'PUT'
            }
        }),
    }
});

CSRContent.factory('TTEnumService', function ($resource, ApiConnection) {
    return {
        TTStatus: $resource(ApiConnection + '/api/csr/troubleticket/status/getall', {}, {
            method: 'GET', isArray: false
        }),
        TTClassandPriority: $resource(ApiConnection + '/api/csr/troubleticket/classandpriority?dealerId=:dealerId', {}, {
            method: 'GET', isArray: false
        }),
        TTMVNO: $resource(ApiConnection + '/api/authorization/role/allmvno', {}, {
            method: 'GET', isArray: true
        }),
        TTFlowType: $resource(ApiConnection + '/api/csr/troubleticket/flowtype/getall', {}, {
            method: 'GET', isArray: false
        }),
        TTFlowTypeFromTemplate: $resource(ApiConnection + '/api/csr/troubleticket/flowtype/getallfromtemplate', {}, {
            method: 'GET', isArray: false
        }),
        TTOperationType: $resource(ApiConnection + '/api/csr/troubleticket/operationtype/getall', {}, {
            method: 'GET', isArray: false
        }),
        TTGetDepartment: $resource(ApiConnection + '/api/csr/troubleticket/department/getbymvno/:dealerId', {}),
        TTGetDepartmentForWorkflow: $resource(ApiConnection + '/api/csr/troubleticket/department/Workflow/:dealerId', {}),
    }
});


CSRContent.factory('SupportRequestTTDetailService', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/common/troubleticket/detail/:Id', {}, {
        method: 'GET', isArray: true
    });
});

CSRContent.factory('BrowseTTService', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/csr/troubleticket/dashboard?DealerId=:DealerId&PageNumber=:PageNumber&PageSize=:PageSize&TicketNumber=:TicketNumber&TicketCode=:TicketCode&MSISDN=:MSISDN&From=:From&To=:To&StatusId=:StatusId&ClassId=:ClassId&Priority=:Priority&OrderBy=:OrderBy&OrderType=:OrderType', {}, {
        method: 'GET', isArray: true
    });
});

CSRContent.factory('SupportRequestTTService', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/csr/troubleticket/dashboard?DealerId=:DealerId&PageNumber=:PageNumber&PageSize=:PageSize&MSISDN=:MSISDN&From=:From&To=:To&StatusId=:StatusId&TypeId=:TypeId&IsSupport=true', {}, {
        method: 'GET', isArray: true
    });
});

CSRContent.factory('UpdateTroubleTicket', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/csr/troubleticket/update', {}, {
        update: {
            method: 'PUT'
        }
    });
});

CSRContent.factory('WorkFlowConfigurationTTService', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/csr/troubleticket/dealerid/:dealerId/flowtypeid/:flowtypeId', null, {
    });
});
CSRContent.factory('WorkFlowAddFromTemplateService', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/csr/troubleticket/workflow/addfromtemplate', null, {
        add: {
            method: 'POST'
        }
    });
});
CSRContent.factory('WorkFlowGetDepartmentMappingService', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/csr/troubleticket/department/getmapping?FlowTypeId=:FlowTypeId', null, {
        get: {
            method: 'GET'
        }
    });
});
CSRContent.factory('AddStepWorkflowService', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/csr/troubleticket/workflow/create', null, {
        create: {
            method: 'POST'
        }
    });
});
CSRContent.factory('ModifyStepWorkflowService', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/csr/troubleticket/workflow/update', null, {
        update: {
            method: 'PUT'
        }
    });
});
CSRContent.factory('RemoveStepWorkflowService', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/csr/troubleticket/workflow/delete', null, {
        delete: {
            method: 'POST'
        }
    });
});

CSRContent.factory('DepartmentConfigurationService', function ($resource, ApiConnection) {
    return {
        TTDepartmentAdd: $resource(ApiConnection + '/api/csr/troubleticket/department/add', null, {
            add: {
                method: 'POST'
            }
        }),
        TTDepartmentUpdate: $resource(ApiConnection + '/api/csr/troubleticket/department/update', null, {
            update: {
                method: 'PUT'
            }
        }),
        TTDepartmentDelete: $resource(ApiConnection + '/api/csr/troubleticket/department/delete', null, {
            delete: {
                method: 'POST'
            }
        }),
    }
});

CSRContent.factory('StatusConfigurationService', function ($resource, ApiConnection) {
    return {
        TTStatusAdd: $resource(ApiConnection + '/api/csr/troubleticket/Status/add', null, {
            add: {
                method: 'POST'
            }
        }),
        TTStatusUpdate: $resource(ApiConnection + '/api/csr/troubleticket/Status/update', null, {
            update: {
                method: 'PUT'
            }
        }),
        TTStatusDelete: $resource(ApiConnection + '/api/csr/troubleticket/Status/delete', null, {
            delete: {
                method: 'POST'
            }
        }),
    }
});

CSRContent.factory('FlowTypeConfigurationService', function ($resource, ApiConnection) {
    return {
        TTFlowTypeAdd: $resource(ApiConnection + '/api/csr/troubleticket/FlowType/add', null, {
            add: {
                method: 'POST'
            }
        }),
        TTFlowTypeUpdate: $resource(ApiConnection + '/api/csr/troubleticket/FlowType/update', null, {
            update: {
                method: 'PUT'
            }
        }),
        TTFlowTypeDelete: $resource(ApiConnection + '/api/csr/troubleticket/FlowType/delete', null, {
            delete: {
                method: 'POST'
            }
        }),
    }
});

CSRContent.factory('TypeConfigurationService', function ($resource, ApiConnection) {
    return {
        TTTypeGetAll: $resource(ApiConnection + '/api/csr/troubleticket/Types/all', null, {
            get: {
                method: 'GET'
            }
        }),
        TTTypeInFlowRule: $resource(ApiConnection + '/api/csr/troubleticket/types/all/inflowrule', null, {
            get: {
                method: 'GET'
            }
        }),
        TTTypeAdd: $resource(ApiConnection + '/api/csr/troubleticket/Type/add', null, {
            add: {
                method: 'POST'
            }
        }),
        TTTypeUpdate: $resource(ApiConnection + '/api/csr/troubleticket/Type/update', null, {
            update: {
                method: 'PUT'
            }
        }),
        TTTypeDelete: $resource(ApiConnection + '/api/csr/troubleticket/Type/delete', null, {
            delete: {
                method: 'POST'
            }
        }),
    }
});

CSRContent.factory('PriorityConfigurationService', function ($resource, ApiConnection) {
    return {
        TTPriorityAdd: $resource(ApiConnection + '/api/csr/troubleticket/Priority/add', null, {
            add: {
                method: 'POST'
            }
        }),
        TTPriorityUpdate: $resource(ApiConnection + '/api/csr/troubleticket/Priority/update', null, {
            update: {
                method: 'PUT'
            }
        }),
        TTPriorityDelete: $resource(ApiConnection + '/api/csr/troubleticket/Priority/delete', null, {
            delete: {
                method: 'POST'
            }
        }),
    }
});

CSRContent.factory('ClassConfigurationService', function ($resource, ApiConnection) {
    return {
        TTClassAdd: $resource(ApiConnection + '/api/csr/troubleticket/Class/add', null, {
            add: {
                method: 'POST'
            }
        }),
        TTClassUpdate: $resource(ApiConnection + '/api/csr/troubleticket/Class/update', null, {
            update: {
                method: 'PUT'
            }
        }),
        TTClassDelete: $resource(ApiConnection + '/api/csr/troubleticket/Class/delete', null, {
            delete: {
                method: 'POST'
            }
        }),
    }
});

CSRContent.factory('OperationTypeConfigurationService', function ($resource, ApiConnection) {
    return {
        TTOperationTypeAdd: $resource(ApiConnection + '/api/csr/troubleticket/OperationType/add', null, {
            add: {
                method: 'POST'
            }
        }),
        TTOperationTypeUpdate: $resource(ApiConnection + '/api/csr/troubleticket/OperationType/update', null, {
            update: {
                method: 'PUT'
            }
        }),
        TTOperationTypeDelete: $resource(ApiConnection + '/api/csr/troubleticket/OperationType/delete', null, {
            delete: {
                method: 'POST'
            }
        }),
    }
});

CSRContent.factory('SubTypeConfigurationService', function ($resource, ApiConnection) {
    return {
        TTSubTypeGetAll: $resource(ApiConnection + '/api/csr/troubleticket/SubTypes/all', null, {
            get: {
                method: 'GET'
            }
        }),
        TTSubTypeInFlowRule: $resource(ApiConnection + '/api/csr/troubleticket/subtypes/:TypeId/inflowrule', null, {
            get: {
                method: 'GET'
            }
        }),
        TTSubTypeAdd: $resource(ApiConnection + '/api/csr/troubleticket/SubType/add', null, {
            add: {
                method: 'POST'
            }
        }),
        TTSubTypeUpdate: $resource(ApiConnection + '/api/csr/troubleticket/SubType/update', null, {
            update: {
                method: 'PUT'
            }
        }),
        TTSubTypeDelete: $resource(ApiConnection + '/api/csr/troubleticket/SubType/delete', null, {
            delete: {
                method: 'POST'
            }
        }),
    }
});

CSRContent.factory('QuestionCodeConfigurationService', function ($resource, ApiConnection) {
    return {
        TTQuestionCodeGetAll: $resource(ApiConnection + '/api/csr/troubleticket/QuestionCode/getall', null, {
            get: {
                method: 'GET'
            }
        }),
        TTQuestionCodeAdd: $resource(ApiConnection + '/api/csr/troubleticket/QuestionCode/add', null, {
            add: {
                method: 'POST'
            }
        }),
        TTQuestionCodeUpdate: $resource(ApiConnection + '/api/csr/troubleticket/QuestionCode/update', null, {
            update: {
                method: 'PUT'
            }
        }),
        TTQuestionCodeDelete: $resource(ApiConnection + '/api/csr/troubleticket/QuestionCode/delete', null, {
            delete: {
                method: 'POST'
            }
        }),
    }
});

CSRContent.factory('QuestionConfigurationService', function ($resource, ApiConnection) {
    return {
        TTQuestionGetAll: $resource(ApiConnection + '/api/csr/troubleticket/Question/getall', null, {
            get: {
                method: 'GET'
            }
        }),
        TTQuestionAdd: $resource(ApiConnection + '/api/csr/troubleticket/Question/add', null, {
            add: {
                method: 'POST'
            }
        }),
        TTQuestionUpdate: $resource(ApiConnection + '/api/csr/troubleticket/Question/update', null, {
            update: {
                method: 'PUT'
            }
        }),
        TTQuestionDelete: $resource(ApiConnection + '/api/csr/troubleticket/Question/delete', null, {
            delete: {
                method: 'POST'
            }
        }),
    }
});

CSRContent.factory('KPIConfigurationService', function ($resource, ApiConnection) {
    return {
        TTKPIGetAll: $resource(ApiConnection + '/api/csr/troubleticket/classtypes/:dealerid', null, {
            get: {
                method: 'GET'
            }
        }),
        TTKPIUpdate: $resource(ApiConnection + '/api/csr/troubleticket/classtype/update', null, {
            update: {
                method: 'PUT'
            }
        }),
    }
});

CSRContent.factory('FlowRuleConfigurationService', function ($resource, ApiConnection) {
    return {
        TTFlowRuleGetAll: $resource(ApiConnection + '/api/csr/troubleticket/FlowRule/:FlowTypeId', null, {
            get: {
                method: 'GET'
            }
        }),
        TTFlowRuleAdd: $resource(ApiConnection + '/api/csr/troubleticket/FlowRule/add', null, {
            add: {
                method: 'POST'
            }
        }),
        TTFlowRuleUpdate: $resource(ApiConnection + '/api/csr/troubleticket/FlowRule/update', null, {
            update: {
                method: 'PUT'
            }
        }),
        TTFlowRuleDelete: $resource(ApiConnection + '/api/csr/troubleticket/FlowRule/delete', null, {
            delete: {
                method: 'POST'
            }
        }),
    }
});

CSRContent.factory('StatisticsConfigurationService', function ($resource, ApiConnection) {
    return {
        TTStatisticsGetAll: $resource(ApiConnection + '/api/csr/troubleticket/chart/status?MvnoId=:MvnoId', null, {
            get: {
                method: 'GET'
            }
        }),
    }
});

//Trouble ticket by customer ID

CSRContent.factory('SearchTroubleTicketsByCustomerIdService', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/csr/troubleticket/getbycustomerid?CustomerId=:customerId&PageNumber=:pageNumber&PageSize=:pageSize&ExcludeClosedTicket=:ExcludeClosedTicket', {});
});

CSRContent.factory('CreateTroubleTicketService', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/csr/troubleticket/create', {});
});

CSRContent.factory('AddReferenceTroubleTicketService', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/csr/troubleticket/references/add', {});
});

CSRContent.factory('UpdateTroubleTicketService', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/csr/troubleticket/update', {}, {
        update: {
            method: 'PUT'
        }
    });
});

CSRContent.factory('UpdateExtendedInfoTroubleTicketService', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/csr/troubleticket/additionalinfo/update', {}, {
        update: {
            method: 'PUT'
        }
    });
});

CSRContent.factory('ExecuteTTWorkflow', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/csr/troubleticket/workflow/execute?TicketNumber=:TicketNumber&OperationTypeId=:OperationTypeId', {});
});

