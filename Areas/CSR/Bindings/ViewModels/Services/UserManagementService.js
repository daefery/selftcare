'use strict';

CSRContent.factory('AddUserCSRService', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/csr/users/add', {}, {
        save: {
            method: 'POST'
        }
    });
});

//api / csr / users / viewbymvno
CSRContent.factory('GetUsersbySelectedMvnoService', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/csr/users/viewbymvno?orgid=:orgid', {}, {
        query: {
            method: 'GET',
            isArray: false
        }
    });
});

//api/csr/users/changestatus bool isloginallowed, bool isclosed, int? customerid
CSRContent.factory('ChangeAccountStatusService', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/csr/users/changestatus', {}, {
        update: {
            method: 'PUT'
        }
    });
});

//api/csr/users/viewbyfilter
CSRContent.factory('UserListbyFilterService', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/csr/users/viewbyfilter?orgid=:orgid&firstname=:firstname&middlename=:middlename&lastname=:lastname&email=:email&pagesize=:pagesize&pagenumber=:pagenumber&sortcategory=:sortcategory&sorttype=:sorttype', {}, {
        query: {
            method: 'GET',
            isArray: false
        }
    });
});

CSRContent.factory('CustListbyFilterService', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/csr/users/customerlist?orgid=:orgid&firstname=:firstname&middlename=:middlename&lastname=:lastname&customerid=:customerid&pagesize=:pagesize&pagenumber=:pagenumber&sortcategory=:sortcategory&sorttype=:sorttype', {}, {
        query: {
            method: 'GET',
            isArray: false
        }
    });
});

//api/csr/troubleticket/department/getbyuser/{userId}
CSRContent.factory('GetUserDeptbyIdService', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/csr/troubleticket/department/getbyuser/:userId', null, {
    });
});

//POST api/common/troubleticket/deptusers/addtree
CSRContent.factory('AssignUserDeptService', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/common/troubleticket/deptusers/addtree', {}, {
        save: {
            method: 'POST'
        }
    });
});

CSRContent.factory('GetUsersbyOrgID', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/csr/users/view', null, {
    });
});

//api/csr/users/mvno
CSRContent.factory('GetLoggedUserService', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/csr/users/mvno', { method: 'GET' });
});

//api/csr/users/selfroleupdated
CSRContent.factory('SelfUpdateService', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/csr/users/selfroleupdated?email=:email&orgid=:orgid', { method: 'GET' });
});

//customers/dealer/{dealerid}
CSRContent.factory('DealerMvnoDetailService', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/csr/customers/dealer/:dealerid', { method: 'GET' });
});

CSRContent.factory('GetUserDetail', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/csr/users/viewdetail?email=:email&orgid=:orgid', {}, {
        query: {
            method: 'GET'
        }
    });
});

CSRContent.factory('GetDepartmentbyUserDealerIdService', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/csr/troubleticket/department/getbymvno/:dealerId', {}, {
        query: {
            method: 'GET'
        }
    });
});

CSRContent.factory('ChangeUserDetail', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/csr/users/updatedetail', {}, {
        update: {
            method: 'PUT'
        }
    });
});

CSRContent.factory('ChangeUserEmail', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/csr/users/changeemail', {}, {
        update: {
            method: 'PUT'
        }
    });
});

CSRContent.factory('AssignRoleTreeService', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/authorization/userrole/createtree', {}, {
        save: {
            method: 'PUT'
        }
    });
});

//GET api/authorization/roles/get?UserAccountKey={UserAccountKey}&IsActive={IsActive}
CSRContent.factory('GetUserRolesService', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/authorization/roles/get?UserAccountKey=:UserAccountKey&IsActive=:IsActive', {}, {
        query: {
            method: 'GET',
            isArray: true
        }
    });
});

//GET api/csr/users/getdealer?mvnoid={mvnoid}
CSRContent.factory('GetDealerbyMvnoService', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/csr/users/getdealer?dealerid=:dealerid', {}, {
        query: {
            method: 'GET'
        }
    });
});

//put api/csr/users/assigndealer
CSRContent.factory('AssignDealerService', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/csr/users/assigndealer', {}, {
        update: {
            method: 'PUT'
        }
    });
});

//get api/authorization/mvno/getdetail?mvnoid={mvnoid}
CSRContent.factory('GetMvnoDetailService', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/authorization/mvno/getdetail?mvnoid=:mvnoid', {}, {
        query: {
            method: 'GET',
        }
    });
});
CSRContent.factory('UserDetailUtility', function () {
    var userName;
    var question;
    var confirmKey;
    var email;
    var mvno;
    var mvnoenum;
    var bool;
    var rolelist;

    var addRoleList = function (newObj) {
        rolelist = null;
        bool = newObj;
    };

    var getRoleList = function () {
        return rolelist;
    }

    var addBool = function (newObj) {
        bool = null;
        bool = newObj;
    };

    var getBool = function () {
        return bool;
    }

    var addMvnoEnum = function (newObj) {
        mvnoenum = null;
        mvnoenum = newObj;
    };

    var getMvnoEnum = function () {
        return mvnoenum;
    }

    var addMvno = function (newObj) {
        mvno = null;
        mvno = newObj;
    };

    var getMvno = function () {
        return mvno;
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
        AddRoleList: addRoleList,
        GetRoleList: getRoleList,
        AddBool: addBool,
        GetBool: getBool,
        AddMvno: addMvno,
        GetMvno: getMvno,
        AddMvnoEnum: addMvnoEnum,
        GetMvnoEnum: getMvnoEnum,
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

