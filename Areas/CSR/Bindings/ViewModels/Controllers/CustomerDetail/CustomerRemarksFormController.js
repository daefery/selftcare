'use strict'

/* EditCustomerRemarks Form */
CSRContent.controller("EditCustomerRemarksController", function ($scope, $rootScope, CommonEnum, $route, $timeout, UpdateCustomerRemarks, Notification, SearchCustomerDetailService, SearchPageService, CSRCache, CacheSearch) {
    /*update customer data form*/

    $scope.createUpdateRemarkReq = function(data) {
        var jsondata = {
            "CustomerId": data.CustomerID,
            "Remark": data.CustomerData.Remark
        };
        return jsondata;
    };
    $scope.modifyRemark = function (data) {
        var request = $scope.createUpdateRemarkReq(data);
        UpdateCustomerRemarks.update(request, function (response) {
            if (response.ResultType != 0) {
                Notification.error({
                    message: '<strong>Failed!</strong> <span>' + response.Messages + '.</span>',
                    positionY: 'top',
                    positionX: 'center'
                });
                return false;
            } else {
                Notification.success({
                    message: '<strong>Success!</strong> <span>Customer Remark Is Successfully Updated.</span>',
                    positionY: 'top',
                    positionX: 'center'
                });
                angular.element('#editCustRemarksModal').modal('hide');
                SearchCustomerDetailService.get({ customerIdtemp: localStorage.CustomerID }, function (data) {
                    var updatesDetail = angular.copy(data);
                    CSRCache.put('updateCustDetail', data);
                    $rootScope.remark = updatesDetail.CustomerData.Remark;
                });
                $timeout(function () {
                    angular.element('#btnCancelEditCustRemarks').trigger('click');
                }, 100);
            }
        });
    }

    $scope.removeRemark = function (data) {
        data.CustomerData.Remark = "";
        var removeReq = $scope.createUpdateRemarkReq(data);
        UpdateCustomerRemarks.update(removeReq, function (response) {
            if (response.ResultType != 0) {
                Notification.error({
                    message: '<strong>Failed!</strong> <span>' + response.Messages + '.</span>',
                    positionY: 'top',
                    positionX: 'center'
                });
                return false;
            } else {
                Notification.success({
                    message: '<strong>Success!</strong> <span>Customer Remark Is Successfully Removed.</span>',
                    positionY: 'top',
                    positionX: 'center'
                });
                SearchCustomerDetailService.get({ customerIdtemp: localStorage.CustomerID }, function (data) {
                    var updatesDetail = angular.copy(data);
                    CSRCache.put('updateCustDetail', data);
                    $rootScope.remark = updatesDetail.CustomerData.Remark;
                });
                $timeout(function () {
                    angular.element('#btnCancelDeleteCustRemarks').trigger('click');
                }, 100);

            }
        });
    }

    $scope.datas = {

        field: [
            {
                type: "textarea",
                name: "textRemarks",
                size: 6,
                text: "Remarks",
                model: "update.CustomerData.Remark",
                required: false,
                maxlength: 2000,
                validation: [{ value: "maxlength" }]
            }
        ],
        button: [
            {
                name: "btnSubmitCustRemarks",
                type: "submit",
                text: "Submit",
                click: "modifyRemark(update)"
            },
            {
                name: "Cancel",
                type: "cancel",
                text: "Cancel",
                click: "modal"
            }
        ]
    }
    /*end of form content*/
});
