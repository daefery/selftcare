SelfCareContent.controller("AddCreditCardController", function ($scope, $location, $parse, PaymentService, Notification, CommonEnum, CustomerCache) {
    $scope.SubmitAddCreditCard = function (CreditCardInfo, isFormValid) {
        if (isFormValid == false) {
            notificationError('Your form still not valid, please fill all fields')
        } else {
            var CreditCard = {
                CardNumber: CreditCardInfo.Number,
                ExpirationDate: CreditCardInfo.ExpirationDate.month.name + " " + CreditCardInfo.ExpirationDate.year.value,
                StartDate: new Date(),
                CCV: CreditCardInfo.CSC,
                NameOnCard: CreditCardInfo.NameOnCard,
                CreditCardType: CreditCardInfo.CardType,
                //use the enum below to fill profiletype value
                //public enum PaymentProfileType : int {
                //    BankAccountProfile = 1,
                //    CustomerBalanceProfile = 2,
                //    CreditCardProfile =3,
                //    PaymentProviderProfile = 4
                //}
                profiletype: 3
            };
            var addCreditCardBody = {};
            addCreditCardBody.CustomerId = wrapper.customerInfo.CustomerID;
            // Revani Bagus Amrulloh
            // since response from http://10.4.2.13:25131/api/payment/900000/PaymentMean doesn't have any name and description on it so i pick dummy payment catalog id
            addCreditCardBody.PaymentCatalogId = 1020000001;
            addCreditCardBody.PaymentProfile = CreditCard;

            var ConnectionAPICreateCC = new PaymentService.AddCreditCard(addCreditCardBody);
            ConnectionAPICreateCC.$save(function (result) {
                if (result.ResultCode !== 0 || result.ResultType !== 0) {
                    notificationError(result.Messages[0]);
                }
                else {
                    Notification.success({
                        message: '<span>Your Credit Card Has Been Added To Your Account</span>',
                        positionY: 'top',
                        positionX: 'center'
                    });
                    $location.path("/SelfCare/Customer/App/ManageAutoPay")
                };
            });
        };
    };

    var notificationError = function (message) {
        Notification.error({
            message: '<span>' + message + '</span>',
            positionY: 'top',
            positionX: 'center'
        });
    }
});