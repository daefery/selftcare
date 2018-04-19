'use strict';

CSRContent.factory('CreateModuleService', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/authorization/module/create', {}, {
        save: {
            method: 'PUT'
        }
    });
});

CSRContent.factory('CreateMVNOSecureSectionService', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/authorization/mvnosecuresection/create', {}, {
        save: {
            method: 'PUT'
        }
    });
});

//api/authorization/securesec/update
CSRContent.factory('UpdateSecSecService', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/authorization/securesec/update', {}, {
        update: {
            method: 'PUT'
        }
    });
});
//api/authorization/module/etonly
CSRContent.factory('EtakOnlyModuleService', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/authorization/module/etonly', {}, {
        query: {
            method: 'GET',
            isArray: true,
            cache: true
        }
    });
});

CSRContent.factory('UpdateModuleService', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/authorization/module/update', {}, {
        update: {
            method: 'PUT'
        }
    });
});

//api/authorization/module/parentchildcount parentid
CSRContent.factory('GetModuleChildCountService', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/authorization/module/parentchildcount?parentid=:parentid', { method: 'GET' });
});

CSRContent.factory('GetAllModuleService', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/authorization/module/getbyparent?parentid=:parentid', {}, {
        query: {
            method: 'GET',
            isArray:true
        }
    });
});

CSRContent.factory('GetSecureSectionbyMvnoListService', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/authorization/mvnosecuresection/getbymvno?MvnoId=:MvnoId', {}, {
        query: {
            method: 'GET',
            isArray: true
        }
    });
});

CSRContent.factory('GetSecureSectionbySectionListService', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/authorization/mvnosecuresection/getbysection?SectionId=:SectionId', {}, {
        query: {
            method: 'GET',
            isArray: true
        }
    });
});

CSRContent.factory('GetModuleTreebyMVNOAccessService', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/authorization/module/getreewithmvno?parentId=:parentId&MvnoId=:MvnoId', { method: 'GET' });
});

CSRContent.factory('MoveModuleService', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/authorization/module/updateposition', {}, {
        update: {
            method: 'PUT'
        }
    });
});

CSRContent.factory('UpdateMVNOSecureSectionService', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/authorization/mvnosecuresection/update', {}, {
        update: {
            method: 'PUT'
        }
    });
});

//PUT api/authorization/module/delete?moduleId={moduleId}
CSRContent.factory('DeleteModuleService', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/authorization/module/delete?moduleId=:moduleId', {}, {
        update: {
            method: 'PUT'
        }
    });
});

CSRContent.factory('DeleteMVNOSecureSectionService', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/authorization/mvnosecuresection/delete?OrgId=:OrgId&SectionId=:SectionId', {}, {
        update: {
            method: 'PUT'
        }
    });
});
//GET api/authorization/module/get?moduleId={moduleId}
CSRContent.factory('GetModulebyIDService', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/authorization/module/get?moduleId=:moduleId', {}, {
        query: {
            method: 'GET'
        }
    });
});
//GET api/authorization/module/getbyparent?parentId={parentId}
CSRContent.factory('GetModulebyParentIDService', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/authorization/module/get?moduleId=:moduleId', {}, {
        query: {
            method: 'GET'
        }
    });
});
//GET api/authorization/module/getalldomain
CSRContent.factory('GetAllDomainService', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/authorization/module/getalldomain', null, {
    });
});
//PUT api/authorization/mvnomodule/create
CSRContent.factory('CreateMVNOModuleService', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/authorization/mvnomodule/create', {}, {
        save: {
            method: 'PUT'
        }
    });
});
//PUT api/authorization/mvnomodule/update
CSRContent.factory('UpdateMVVNOModuleService', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/authorization/mvnomodule/update', {}, {
        update: {
            method: 'PUT'
        }
    });
});
//PUT api/authorization/mvnomodule/delete?MVNOModuleID={MVNOModuleID}
CSRContent.factory('DeleteMVNOModuleService', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/authorization/module/delete?MVNOModuleID=:MVNOModuleID', {}, {
        update: {
            method: 'PUT'
        }
    });
});
//GET api/authorization/mvnomodule/get?MVNOModuleID={MVNOModuleID}
CSRContent.factory('GetMVNOModulebyIDService', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/authorization/mvnomodule/get?MVNOModuleID=:MVNOModuleID', {}, {
        query: {
            method: 'GET'
        }
    });
});
//PUT api/authorization/securesec/create
CSRContent.factory('CreateSecureSectionService', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/authorization/securesec/create', {}, {
        save: {
            method: 'PUT'
        }
    });
});
//PUT api/authorization/securesec/update
CSRContent.factory('UpdateSecureSectionService', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/authorization/securesec/update', {}, {
        update: {
            method: 'PUT'
        }
    });
});
//PUT api/authorization/securesec/delete?SectionID={SectionID}
CSRContent.factory('DeleteSecureSectionService', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/authorization/securesec/delete', {}, {
        update: {
            method: 'PUT'
        }
    });
});
//GET api/authorization/securesec/get?SectionID={SectionID}
CSRContent.factory('GetSecureSectionbyIDService', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/authorization/securesec/get?SectionID=:SectionID', {}, {
        query: {
            method: 'GET'
        }
    });
});
//GET api/authorization/securesec/getbymodule?ModuleId={ModuleId}
CSRContent.factory('GetSecureSectionbyModuleIDService', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/authorization/securesec/getbymodule?ModuleId=:ModuleId', {}, {
        query: {
            method: 'GET',
            isArray: true
        }
    });
});
//GET api/authorization/module/getree?parentId={parentId}
CSRContent.factory('GetModuleinTreebyParentIDService', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/authorization/module/getree?parentId=:parentId', {}, {
        query: {
            method: 'GET',
            isArray: true
        }
    });
});

CSRContent.factory('CreateMvnoModuleListService', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/authorization/mvnomodule/createlist', {}, {
        save: {
            method: 'PUT'
        }
    });
});

//api/authorization/mvnomodule/getaccess
CSRContent.factory('GetMvnoAccessbyModuleIdService', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/authorization/mvnomodule/getbymodule?ModuleID=:ModuleID', {}, {
        query: {
            method: 'GET',
            isArray: true
        }
    });
});

CSRContent.factory('ModuleManagementUtility', function () {
    var userName;
    var question;
    var confirmKey;
    var email;
    var modulename;
    var treepeak;

    var addModuleName = function (newObj) {
        modulename = null;
        modulename = newObj;
    };

    var getModuleName = function () {
        return modulename;
    }

    var addTreePeak = function (newObj) {
        treepeak = null;
        treepeak = newObj;
    };

    var getTreePeak = function () {
        return treepeak;
    }

    var addEmail = function (newObj) {
        email = null;
        email = newObj;
    };

    var getEmail = function () {
        return email;
    }

    var addUsername = function (newObj) {
        username = null;
        userName = newObj;
    };

    var getUsername = function () {
        return userName;
    };

    var addQuestion = function (newObj) {
        question = newObj;
    };

    var getQuestion = function () {
        var newquestion = question;
        question = null;
        return newquestion;
    };

    var addConfirmKey = function (newConfirmKey) {
        confirmKey = null;
        confirmKey = newConfirmKey;
    };

    var getConfirmKey = function () {
        return confirmKey;
    };

    return {
        AddTreePeak: addTreePeak,
        GetTreePeak: getTreePeak,
        AddUsername: addUsername,
        GetUsername: getUsername,
        AddModuleName: addModuleName,
        GetModuleName: getModuleName,
        AddQuestion: addQuestion,
        GetQuestion: getQuestion,
        AddConfirmKey: addConfirmKey,
        GetConfirmKey: getConfirmKey,
        AddEmail: addEmail,
        GetEmail: getEmail
    };
});