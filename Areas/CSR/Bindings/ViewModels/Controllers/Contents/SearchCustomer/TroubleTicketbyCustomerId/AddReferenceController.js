CSRContent.controller('AddReferenceTroubleTicketController', function ($scope, DetailCustomer, AddReferenceTroubleTicketService, Notification,
    TicketDetail, $rootScope, LocalStorageProvider) {

    $scope.isETAKUser = false;
    $scope.isETAKUser = LocalStorageProvider.isETAKUser();

    var customerDetail, mvnoId, phone, customerId;
    var getDetail = TicketDetail.getDetail(),
        ticketNumber = getDetail.TicketNumber,
        closeAddReferenceForm = angular.element('#AddReferenceTT');

    customerDetail = DetailCustomer.getDetail();
    mvnoId = customerDetail.MVNOId;
    phone = customerDetail.MSISDN;
    customerId = customerDetail.CustomerId;

    $scope.$on('reset-add_reference-value', function (event, args) {
        $scope.Reference = {};
    });

    $scope.Reference = {};
    $scope.CustomerDetailforTT = {
        MVNOName: customerDetail.MVNOName,
        MVNO: mvnoId,
        PhoneNumber: phone,
        CustomerId: customerId
    };

    $scope.SubmitAddReference = function () {
        var reference = $scope.Reference
        var UrlValidationContent = '';
        var httpUrlValidation;
        var httpsUrlValidation;
        var errorCounter = 0;
        var validate = angular.copy($scope.Reference.Refurl);
        var UrlValidationContentError = 0;

        if (!validate) {
            notificationError('The URL can not be empty')
        }else{

            reference.TicketNumber = ticketNumber;
            httpUrlValidation = validate.substring(0, 7);
            httpsUrlValidation = validate.substring(0, 8);
            var validationMessage = 'The URL should have prefix http:// or https://';
            if (httpUrlValidation !== 'http://') {
                errorCounter += 1
            } else {
                if (validate.length === 7) {
                    UrlValidationContentError = 1;
                } else {
                    UrlValidationContent = validate.substring(8, validate.length - 1);
                }
            };

            if (httpsUrlValidation !== 'https://') {
                errorCounter += 1
            } else {
                if (validate.length === 8) {
                    UrlValidationContentError = 1;
                } else {
                    UrlValidationContent = validate.substring(9, validate.length - 1);
                }
            };

            if (errorCounter === 2) {
                notificationError(validationMessage)
            } else if (!UrlValidationContent || UrlValidationContentError === 1) {
                notificationError('The URL can not be just http:// or https://')
            } else if (reference.Refurl.length > 1024) {
                notificationError('The URL can not be more than 1024 character, your current length is ' + reference.Refurl.length)
            } else if (!reference.RefDescription) {
                notificationError('URL description can not be empty')
            }  else if (reference.RefDescription.length > 1024) {
                notificationError('URL description can not be more than 1024 character, your current length is ' + reference.RefDescription.length)
            }  else {
                var PostAddReference = new AddReferenceTroubleTicketService(reference);
                PostAddReference.$save(function (result) {
                    if (result.ResultCode === 0) {
                        Notification.success({
                            message: '<span>Success adding the reference</span>',
                            positionY: 'top',
                            positionX: 'center'
                        });
                        $rootScope.$broadcast('add-reference-success');
                    }
                    else {
                        notificationError(result.Messages)
                    };
                    closeAddReferenceForm.modal('hide');
                });
            }
        }
    };

    var notificationError = function (message) {
        Notification.error({
            message: '<span>' + message + '</span>',
            positionY: 'top',
            positionX: 'center'
        });
    };
})
