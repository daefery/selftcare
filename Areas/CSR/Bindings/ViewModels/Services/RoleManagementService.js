'use strict';
//api/authorization/rolesection/createfromlist

CSRContent.factory('CreateRoleSectionbyListService', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/authorization/rolesection/createfromlist', {}, {
        save: {
            method: 'PUT'
        }
    });
});
//PUT api/authorization/rolemodule/create

CSRContent.factory('CreateRoleModuleService', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/authorization/rolemodule/create', {}, {
        save: {
            method: 'PUT'
        }
    });
});

CSRContent.factory('GetSecureSectionbyRoleDomainService', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/authorization/securesec/getallbydomain?domainId=:domainId&roleId=:roleId', {}, {
        query: {
            method: 'GET',
            isArray: true
        }
    });
});

CSRContent.factory('GetSecureSectionbyRoleDomainwithBracketService', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/authorization/securesec/getallbydomainandbracket?domainId=:domainId&roleId=:roleId', {}, {
        query: {
            method: 'GET',
            isArray: true
        }
    });
});


//PUT api/authorization/rolemodule/update

CSRContent.factory('UpdateRoleModuleService', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/authorization/rolemodule/update', {}, {
        update: {
            method: 'PUT'
        }
    });
});

//api/authorization/securesec/getall
CSRContent.factory('GetAllSecureSectionService', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/authorization/securesec/getall?ParentId=:ParentId', {}, {
        query: {
            method: 'GET',
            isArray: true
        }
    });
});
//GET api/authorization/role/getbymvno?MvnoId={MvnoId}
CSRContent.factory('GetRolebyMVNOIdService', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/authorization/role/getbymvno?MvnoId=:MvnoId&TypeId=:TypeId', {}, {
        query: {
            method: 'GET',
            isArray: true
        }
    });
});

CSRContent.factory('GetRolebyMVNOIdActiveOnlyService', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/authorization/role/getbymvnoactiveonly?MvnoId=:MvnoId&TypeId=:TypeId', {}, {
        query: {
            method: 'GET',
            isArray: true
        }
    });
})
//api/authorization/securesec/getbyroleidwithmodulename
CSRContent.factory('GetSSbyRoleService', function ($resource, ApiConnection) {
    //return $resource(ApiConnection + '/api/authorization/securesec/getbyroleid?RoleId=:RoleId', {}, {
    return $resource(ApiConnection + '/api/authorization/securesec/getbyroleidwithmodulename?RoleId=:RoleId', {}, {
        query: {
            method: 'GET',
            isArray: true
        }
    });
});

//httplocalhost:25131/api/authorization/role/allmvno
CSRContent.factory('GetAllMVNOService', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/authorization/role/allmvno', {}, {
        query: {
            method: 'GET',
            isArray: true
        }
    });
});

//GET api/authorization/role/get?RoleID={RoleID}
CSRContent.factory('GetRoleDetailbyIdService', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/authorization/role/get?RoleID=:RoleID', {}, {
        query: {
            method: 'GET'
        }
    });
});

//GET api/authorization/userrole/get?RoleId={RoleId}
CSRContent.factory('GetUserbyRoleIdService', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/authorization/userrole/get?RoleId=:RoleID', {}, {
        query: {
            method: 'GET',
            isArray: true
        }
    });
});

//gethttp://localhost:25131/api/authorization/rolemodule/get?RoleID=2&MvnoId=970100
CSRContent.factory('GetRoleModuleTreebyId', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/authorization/rolemodule/get?RoleId=:RoleId&MvnoId=:MvnoId', {}, {
        query: {
            method: 'GET',
            isArray: true
        }
    });
});
//api/authorization/rolemodule/idbyrole
CSRContent.factory('ModuleIdbyRoleService', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/authorization/rolemodule/idbyrole?RoleId=:RoleId&MvnoId=:MvnoId', {}, {
        query: {
            method: 'GET',
            isArray: true
        }
    });
});

//PUT api/authorization/role/delete?RoleID={RoleID}
CSRContent.factory('DeleteRolebyIdService', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/authorization/role/delete', {}, {
        update: {
            method: 'PUT'
        }
    });
});

//PUT api/authorization/role/create
CSRContent.factory('CreateRoleService', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/authorization/role/create', {}, {
        save: {
            method: 'PUT'
        }
    });
});

CSRContent.factory('UpdateRoleService', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/authorization/role/update', {}, {
        update: {
            method: 'PUT'
        }
    });
});

CSRContent.factory('ReplaceRoleModuleService', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/authorization/rolemodule/replace', {}, {
        update: {
            method: 'PUT'
        }
    });
});



//GET api/authorization/role/getbyrolename?rolename={rolename}&mvno={mvno}

CSRContent.factory('GetRoleIDbyNameService', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/authorization/role/getbyrolename?rolename=:rolename&mvno=:mvno&TypeId=:TypeId', {}, {
        query: {
            method: 'GET'
        }
    });
});

//PUT api/authorization/rolemodule/createwithtree
CSRContent.factory('CreateRoleModuleTreeService', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/authorization/rolemodule/createwithtree', {}, {
        save: {
            method: 'PUT'
        }
    });
});

//PUT api/authorization/userrole/create
CSRContent.factory('CreateRoleUserService', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/authorization/userrole/create', {}, {
        save: {
            method: 'PUT'
        }
    });
});

//PUT api/authorization/userrole/update
CSRContent.factory('UpdateRoleUserService', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/authorization/userrole/update', {}, {
        update: {
            method: 'PUT'
        }
    });
});

//PUT api/authorization/userrole/delete?UserRoleID={UserRoleID}
CSRContent.factory('DeleteRoleUserService', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/authorization/userrole/delete?UserRoleID=:UserRoleID', {}, {
        update: {
            method: 'PUT'
        }
    });
});

//GET api/authorization/rolemodule/getlist?roleid={roleid}
CSRContent.factory('GetRoleModuleListbyRoleIdService', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/authorization/rolemodule/getlist?roleid=:roleid', {}, {
        query: {
            method: 'GET',
            isArray: true
        }
    });
});
CSRContent.factory('RoleManagementUtility', function () {
    var userName;
    var question;
    var confirmKey;
    var email;
    var roleid;

    var addRoleid = function (newObj) {
        roleid = null;
        roleid = newObj;
    };

    var getRoleid = function () {
        return roleid;
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
        AddRoleid: addRoleid,
        GetRoleid: getRoleid,
        AddUsername: addUsername,
        GetUsername: getUsername,
        AddQuestion: addQuestion,
        GetQuestion: getQuestion,
        AddConfirmKey: addConfirmKey,
        GetConfirmKey: getConfirmKey,
        AddEmail: addEmail,
        GetEmail: getEmail
    };
});