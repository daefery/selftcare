//header module
var SelfCareHeader = angular.module("SelfHeader", ['common']);
//nav module
var SelfCareNav = angular.module("SelfNav", ['common', 'ng-breadcrumbs']);
//contetnt or main module
var SelfCareContent = angular.module("SelfContent", ['common', 'SelfHeader', 'SelfNav', 'SelfRegistration', 'ng-breadcrumbs', 'publicContent']);
//footer module
var SelfCareFooter = angular.module("SelfFooter", ['common']);
//Registration module
var SelfCareRegister = angular.module("SelfRegistration", ['common']);
//Public module for shopping cart
var publicContent = angular.module('publicContent', ['common']);
var wrapper;
var shopping;
