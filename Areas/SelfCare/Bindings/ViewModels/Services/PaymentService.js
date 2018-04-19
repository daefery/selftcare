SelfCareContent.factory("PaymentService", function ($resource, ApiConnection) {
    return {
        AddCreditCard: $resource(ApiConnection + '/api/payment/paymentmean/add', {}, {}),
        CreditCardPayment: $resource(ApiConnection + '/api/payment/chargecreditcard', {}, {}),
        PayPalCreateCharge: $resource(ApiConnection + '/api/payment/createchargeaccount', {}, {}),
        PayPalExecuteCharge: $resource(ApiConnection + '/api/payment/executechargeaccount', {}, {}),

        PaymentRequest: $resource(ApiConnection + '/api/payment/createpaymentrequest', {}, {}),
        RegisterPayment: $resource(ApiConnection + '/api/payment/register', {}, {}),
        ValidatePayment: $resource(ApiConnection + '/api/payment/validatepayment', {}, {}),

        GetPaymentMaeanByMVNO: $resource(ApiConnection + '/api/payment/:mvnoid/PaymentMean', {}, {}),
        QueryCustomerPaymentMean: $resource(ApiConnection + '/api/common/customers/paymentmeans/:customerid', {}, {}),
        SetDefaultPayment: $resource(ApiConnection + '/api/common/customer/setdefaultpaymentmean', {}, {}),
        GetPaymentMeans: $resource(ApiConnection + '/api/common/customers/paymentmeans/:customerid', {}, {}),
    }
});