////Refactor by: Revani Bagus Amrulloh
////Date: 30 September 2015
////Code Owner: Mahdi Badari
////Code commented because it will give you alot of error. but i comment it if someday the owner of the code need this code

'use strict';



CSRContent.controller("MyAccountSideBarController", function ($scope) {
    $("#myAccOverview").addClass("active");
    $("#myAccCredential").removeClass("active");
    $("#myAccRolePermission").removeClass("active");
    $("#myAccPersonalSetting").removeClass("active");
});

CSRContent.controller("CredentialForm", function ($scope, $parse) {


    $scope.datas = {
        field: [
            {
                type: "password",
                name: "oldpassword",
                size: 6,
                text: "Old_Password",
                model: "credential.OldPassword",
                required: true,
                validation: [{ value: "mandatory" }, { value: "password" }]
            },
            {
                type: "password",
                name: "newpassword",
                size: 6,
                text: "New_Password",
                model: "credential.NewPassword",
                required: true,
                validation: [{ value: "mandatory" }, { value: "password" }]
            },
            {
                type: "confirm_password",
                name: "retypenwpassword",
                size: 6,
                text: "Confirm_New_Password",
                model: "credential.RetypeNewPassword",
                compareTo: "credential.NewPassword",
                required: true,
                validation: [{ value: "mandatory" }, { value: "confirm_password" }]
            }],
        button: [
            {
                name: "Submit",
                type: "submit",
                text: "Submit",
                click: "saveChangesPassword(credential)"
            },
            {
                name: "Reset",
                type: "reset",
                text: "Reset_Form",
                model:"credential"
            }
            //{
            //    type: "cancel",
            //    text: "Cancel",
            //    click: "/CSR/Customer/App/MyAccount/Credential"
            //}            
        ]
    };

});

CSRContent.controller("OverviewForm", function ($scope, $parse) {
    $scope.datas = {
        field: [
            {
                type: "textarea",
                name: "address",
                size: 6,
                text: "Address",
                //model: "updateinfo.Address",
                model: "modalfield.Address",
                required: true,
                maxlength: 150,
                validation: [{ value: "mandatory" }, { value: "maxlength" }, {value: "textarea"}]
            },
            //{
            //    type: "text",
            //    name: "email",
            //    size: 6,
            //    text: "Email Address",
            //    model: "user.Email",
            //    required: true,
            //    validation: [{ value: "mandatory" }]
            //},
            {
                type: "phone",
                name: "phonenumber",
                size: 6,
                text: "Phone_Number",
                //model: "updateinfo.MobilePhoneNumber",
                model: "modalfield.PhoneNumber",
                required: true,
                validation: [{ value: "mandatory" }, {value: "phone"}]
            }],
            button: [
                {
                    name: "Submit",
                    type: "submit",
                    text: "Submit",
                    click: "changeDetail(modalfield)"
                },
                //{
                //    type: "cancel",
                //    text: "Cancel",
                //    click: "modal"
                //}
                {
                    name: "Cancel",
                    type: "cancel",
                    text: "Cancel",
                    //click: "return()"
                    click: "modal"
                }
            ]
    }
});

CSRContent.controller("UpdateUserDetailController", function ($scope, $route, $http, $window, $location, ChangeUserPropertiesService, GetUserPropertiesService) {
    / End of Change Password Validation /    
        var notvalid = "";
        $scope.orig = angular.copy($scope.data);
        $scope.return = function () {
            window.location.href = '/CSR/Customer/App/MyAccount';
        }
        $scope.changeDetail = function (products) {
            var updateInfoData = {
                phonenumber: String(products.PhoneNumber),
                address: products.Address,
            };
            //$scope.updateinfo = formData;
            if (updateInfoData.address != notvalid && updateInfoData.phonenumber != notvalid) {
                ChangeUserPropertiesService.update(updateInfoData, function (result) {
                    if (result.$status = 200) {
                        GetUserPropertiesService.get(function (data) {
                            CSRCache.put('accountOverview', data);
                        });
                        Notification.success({
                            message: '<strong>Success!</strong> <span>Your details has been updated</span>',
                            positionY: 'top',
                            positionX: 'center'
                        });
                    }
                    else {
                        Notification.error({
                            message: '<strong>Failed!</strong> <span>' + result.Messages + '.</span>',
                            positionY: 'top',
                            positionX: 'center'
                        });
                    }
                });
                window.location.href = '/CSR/Customer/App/MyAccount';
                return true;
            } else {
                //$("#modal_btn_pass_error").trigger("click");
                return false;
            }
        };
});

CSRContent.controller("UpdatePasswordUserController", function ($scope, $http, $window, $location, ChangeUserPasswordService, Notification) {
    / End of Change Password Validation /    
    /*end of to be removed*/
    var notvalid = "";
    //$scope.credential = {};
        $scope.resetForm = function () {
            //$scope.person = angular.copy(oriPerson);
            $scope.credentialform.$setPristine();
        };
        $scope.saveChangesPassword = function (data) {
            var formData = {
                OldPassword: data.OldPassword,
                NewPassword: data.NewPassword
        };
        if (formData.OldPassword != notvalid && formData.NewPassword != notvalid) {
            ChangeUserPasswordService.update(formData, function (result) {
                if (result.$status = 200) {
                    Notification.success({
                        message: '<strong>Success!</strong> <span>Your credential has been updated, <br />You will be redirect to login page in 10 second and please re-login using a new password </span>',
                        positionY: 'top',
                        positionX: 'center'
                    });
                    ClearCommonSession();
                    setTimeout(function () {
                        window.location.assign('/Authorization/Login');
                    }, 10000);
                }
                else
                {
                    Notification.error({
                        message: '<strong>Failed!</strong> <span>' + result.Messages + '.</span>',
                        positionY: 'top',
                        positionX: 'center'
                    });
                }
            })
        } else {
            Notification.error({
                message: '<strong>Failed!</strong> <span>' + 'Invalid Password' + '.</span>',
                positionY: 'top',
                positionX: 'center'
            });
            return false;
        }
    }
});

CSRContent.controller("CredentialController", function ($scope, $http, ApiConnection, breadcrumbs, CacheMyAccount, CSRCache, GetUserCredentialService) {

    //CacheMyAccount.getAccountCredential().then(function (result) {
    //    $("#myAccOverview").removeClass("active");
    //    $("#myAccCredential").addClass("active");
    //    $("#myAccRolePermission").removeClass("active");
    //    $("#myAccPersonalSetting").removeClass("active");
    //    dataCredential = angular.copy(result);
    //    $scope.credential = dataCredential;
    //});

});

CSRContent.controller("OverviewController", function ($scope, $http, ApiConnection, breadcrumbs, CacheMyAccount, CSRCache, GetUserPropertiesService, GetUserDeptbyIdService, Notification) {

    $scope.resetForm = function(parameters) {
        parameters = {};
    }
    $("#myAccOverview").addClass("active");
    $("#myAccCredential").removeClass("active");
    $("#myAccRolePermission").removeClass("active");
    $("#myAccPersonalSetting").removeClass("active");

    CacheMyAccount.getAccountProperties().then(function (result) {
        $scope.temp = result;
        $scope.products = result;
        $scope.modalfield = angular.copy($scope.products);
        var temp = (result.DateofBirth);
        if ((temp === null) || (temp === undefined)) {
                $scope.products.DateofBirth = "";
            } else {
            $scope.products.DateofBirth = moment(temp).format(config.DateFormatMoment);
        }
        GetUserDeptbyIdService.get({ userId: result.UserId }, function (result) {
            if (result.$status == 200)
            {
                $scope.accdprt = result.TTSimpleDepartment;
            }
            else
            {
                Notification.success({
                    message: '<strong>Empty data!</strong> <span>Your profile has no designated department</span>',
                    positionY: 'top',
                    positionX: 'center'
                });
            }
        })
    });

    $scope.resetOverForm = function () {
        $scope.modalfield = angular.copy($scope.temp);
    }

});

CSRContent.controller("RolePermissionController", function ($scope, $location, breadcrumbs) {

    $scope.$on('$viewContentLoaded', function () {
        $location.replace(); //clear last history route
    });

    $("#myAccOverview").removeClass("active");
    $("#myAccCredential").removeClass("active");
    $("#myAccRolePermission").addClass("active");
    $("#myAccPersonalSetting").removeClass("active");

    breadcrumbs.generateBreadcrumbs();
    $scope.breadcrumbs = breadcrumbs;
});

CSRContent.controller("PersonalSettingController", function ($scope, $location, breadcrumbs) {

    $scope.$on('$viewContentLoaded', function () {
        $location.replace(); //clear last history route
    });

    $("#myAccOverview").removeClass("active");
    $("#myAccCredential").removeClass("active");
    $("#myAccRolePermission").removeClass("active");
    $("#myAccPersonalSetting").addClass("active");

    breadcrumbs.generateBreadcrumbs();
    $scope.breadcrumbs = breadcrumbs;
});

$(document).on('click', '#myAccCredentials', function ($scope) {
});

CSRContent.controller("MyAccountController", function ($scope, $location, breadcrumbs) {

    $scope.$on('$viewContentLoaded', function () {
        $location.replace(); //clear last history route
    });


    $("#myAccOverview").removeClass("active");
    $("#myAccCredential").addClass("active");
    $("#myAccRolePermission").removeClass("active");
    $("#myAccPersonalSetting").removeClass("active");

    breadcrumbs.generateBreadcrumbs();
    $scope.breadcrumbs = breadcrumbs;

});