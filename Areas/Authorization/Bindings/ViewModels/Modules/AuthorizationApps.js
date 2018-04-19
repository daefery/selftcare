var authorizationRoot = angular.module('authorizationRoot', ['authorization', 'recoverPassword', 'CSRVerification', 'resendKey', 'AccountConfirmation']);

var authorization = angular.module('authorization', ['common']);

var recoverPassword = angular.module('recoverPassword', ['common']);

var CSRVerification = angular.module("CSRVerification", ['common']);

var resendKey = angular.module("resendKey", ['common']);

var accountConfirm = angular.module("AccountConfirmation", ['common']);
