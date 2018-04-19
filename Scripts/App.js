
var commonModule = angular.module('common', ['ngRoute', 'ui.bootstrap', 'ngResource', 'angularSpinner', 'angularUtils.directives.dirPagination', 'ng-breadcrumbs', 'pascalprecht.translate', 'mm.iban', 'ErrorHandler', 'ui-notification', 'ngSanitize', 'ui.select',
'reCAPTCHA', 'modalPopUp', 'serverSidePaginationFrameWorkModule', 'angularTreeview', 'treeControl', 'vcRecaptcha']);

var ErrorHandler = angular.module("ErrorHandler", []);

commonModule.constant('ApiConnection', 'http://localhost:25131');
commonModule.constant('CaptchaKey', '6Ldumg8TAAAAAGxeNbKgfPU7kf3JFNBJOcJ_51Cu');

var IDLE_OBSERVER; // Idle observer container
var config; //config web
var datepicker;//for datepicker format
