window.onload = function MalformedURLHandler() {
    var url = window.location.href;
    try {
        decodeURIComponent(url);
    } catch (e) {
        location.href = Console.rootPath + 'Error/BadRequest';
    }
}

function CheckingLoginStateGlobal() {
    var url = window.location.href;
    var regex = new RegExp(/Authorization\/Login/ig);
    var res = regex.test(url);
    if (!res)
    {
        // checking local storage
        if (localStorage.AuthData != null)
        {
            var obj = JSON.parse(localStorage.AuthData);
            var site = GetSite();
            if (obj.accessToken != null)
            {
                if (obj.userType.toLowerCase() === site.toLowerCase())
                {
                    var now = new Date().getTime();
                    // checking local storage expiration
                    if (obj.sessionExpires === undefined || obj.sessionExpires == null || now > obj.sessionExpires) {
                        ClearCommonSession();
                        location.href = Console.rootPath + 'Authorization/Login';
                    }
                    return;
                }
                else
                {
                    location.href = Console.rootPath + 'Templates/ErrorPage/NotFound.html';
                }
            }
            else {
                ClearCommonSession();
                location.href = Console.rootPath + 'Authorization/Login';
            }
        } else {
            ClearCommonSession();
            location.href = Console.rootPath + 'Authorization/Login';
        }
    } 
}

function ClearCommonSession() {
    localStorage.removeItem("AuthData");
    localStorage.removeItem("self_scope");
    localStorage.removeItem("shoppingcart");
}

function GetSessionExpiresTime(secondExpires) {
    return new Date(new Date().getTime() + (secondExpires * 1000)).getTime();
}

function GetSite() {
    var url = window.location.href;
    var regex = new RegExp(/selfcare/ig);
    var isSelf = regex.test(url);
    if (isSelf) {
        return "selfcare";
    } else {
        var secondRegex = new RegExp(/csr/ig);
        var isCsr = secondRegex.test(url);
        if (isCsr) {
            return "csr";
        } else {
            return "unknown";
        }
    }
}

function HasInternetConnection() {
    var hasConnection = false;
    $.ajax({
        url: "https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js",
        crossDomain: true,
        async: false,
        type: "GET",
        success: function () {
            hasConnection = true;
        },
        error: function (XMLHttpRequest) {
            if (XMLHttpRequest.status < 200 || XMLHttpRequest.status >= 400) {
                hasConnection = false;
            }
        }
    });
    return hasConnection;
}

function GenerateGuid() {
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
}

function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
}