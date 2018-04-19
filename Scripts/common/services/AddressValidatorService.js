commonModule.factory('AddressValidatorService', function($q,$resource, ApiConnection, addressRecord) {
    return{
        IsAddressValid: function (address) {
            var deferred = $q.defer();
            addressRecord.save(address, function (addressResponse) {
                var Response = {
                    isValidAddress: false,
                    message:"",
                    response: {}
                };
                if (addressResponse.Score >= 1) {
                    Response.isValidAddress = true;
                    Response.response = addressResponse;
                    Response.message = "valid";
                    deferred.resolve(Response);
                } else if (addressResponse.score == 0) {
                    Response.isValidAddress = false;
                    Response.response = addressResponse;
                    Response.message = "We could not validate your inputted address this time, Please try again in a few moment!";
                    deferred.resolve(Response);
                } else {
                    Response.isValidAddress = false;
                    Response.response = addressResponse;
                    Response.message = "Address is not valid, please enter another valid address!";
                    deferred.resolve(Response);
                }
                
            });
            return deferred.promise;
        }
    }
});