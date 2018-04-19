commonModule.provider('LocalStorageProvider', function () {
    var mvnoid;
    var dealerid;
    var templatecode;
    var umvnoid;
    var dateFormatMoment;
    return {
        $get: function () {
            return {
                getMvnoid: function () {
                    if (JSON.stringify(sessionStorage.webConfig) != undefined) {
                        mvnoid = JSON.parse(sessionStorage.webConfig) != undefined ? JSON.parse(sessionStorage.webConfig).MvnoId : null;
                    } else {
                        mvnoid = null;
                    }
                    return mvnoid;
                },
                getDealerId: function () {
                    if (JSON.stringify(sessionStorage.webConfig) != undefined) {
                        dealerid = JSON.parse(sessionStorage.webConfig) != undefined ? JSON.parse(sessionStorage.webConfig).DealerId : null;
                    } else {
                        dealerid = null;
                    }
                    return dealerid;
                },
                getTemplateCode: function () {
                    if (JSON.stringify(sessionStorage.webConfig) != undefined) {
                        templatecode = JSON.parse(sessionStorage.webConfig) != undefined ? JSON.parse(sessionStorage.webConfig).TemplateCode : null;
                    } else {
                        templatecode = null;
                    }
                    return templatecode;
                },
                getuMvnoid: function () {
                    if (JSON.stringify(localStorage.AuthData) != undefined) {
                        umvnoid = JSON.parse(localStorage.AuthData) != undefined ? JSON.parse(localStorage.AuthData).uMvnoId : null;
                    } else {
                        umvnoid = null;
                    }
                    return umvnoid;
                },
                isETAKUser: function () {
                    this.getuMvnoid();
                    var isETAKUser = false;
                    if (umvnoid == config.ETOrgId) {
                        isETAKUser = true;
                    } else {
                        isETAKUser = false;
                    }
                    return isETAKUser;
                },
                getLangCode: function () {
                    return localStorage.langCode != undefined ? localStorage.langCode : 'en';
                },
                getDateFormatMoment: function () {
                    if (JSON.stringify(sessionStorage.webConfig) != undefined) {
                        dateFormatMoment = JSON.parse(sessionStorage.webConfig) != undefined ? JSON.parse(sessionStorage.webConfig).DateFormatMoment : null;
                    } else {
                        dateFormatMoment = 'yyyy/mm/dd';
                    }
                    return dateFormatMoment;
                },
            }
        }
    }
});