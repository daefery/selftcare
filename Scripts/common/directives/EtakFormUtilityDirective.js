commonModule.directive('accessibleForm', function () {
    return {
        restrict: 'A',
        link: function (scope, elem) {

            // set up event handler on the form element
            elem.on('submit', function () {

                // find the first invalid element
                var firstInvalid = elem[0].querySelector('.ng-invalid');
                var secondInvalid = elem[0].querySelector('.error');

                // if we find one, set focus
                if (firstInvalid) {
                    firstInvalid.focus();
                }
                if (secondInvalid) {
                    secondInvalid.focus();
                }
            });
        }
    };
});
commonModule.directive("passwordVerify", function () {
    return {
        require: "ngModel",
        scope: {
            passwordVerify: '='
        },
        link: function (scope, element, attrs, ctrl) {
            scope.$watch(function () {
                var combined;

                if (scope.passwordVerify || ctrl.$viewValue) {
                    combined = scope.passwordVerify + '_' + ctrl.$viewValue;
                }
                return combined;
            }, function (value) {
                if (value) {
                    ctrl.$parsers.unshift(function (viewValue) {
                        var origin = scope.passwordVerify;
                        if (origin !== viewValue) {
                            ctrl.$setValidity("passwordVerify", false);
                            return undefined;
                        } else {
                            ctrl.$setValidity("passwordVerify", true);
                            return viewValue;
                        }
                    });
                }
            });
        }
    };
});

commonModule.directive("birthDate", function () {
    return {
        restrict: 'AE',
        require: "ngModel",
        scope: { },
        link: function (scope, element, attrs, ngModel) {
            var idMessage = "#" + attrs.birthDate + "_" + attrs.name + "_errormessage";
            var idForm = "#" + attrs.birthDate + "_" + attrs.name;
            ngModel.$viewChangeListeners.push(function () {
                var rawDate = ngModel.$viewValue;

                var dateNowMoment = moment(new Date()).format('YYYY-MM-DD');
                var datePickerMoment = moment(rawDate).format('YYYY-MM-DD');
                if (datePickerMoment > dateNowMoment || datePickerMoment == dateNowMoment) {
                    $(idMessage).removeClass('ng-hide');
                    $(idMessage).addClass('error');
                    $(idForm).addClass('error');
                    ngModel.$setValidity(attrs.name, false);
                } else {
                    $(idMessage).addClass('ng-hide');
                    $(idForm).removeClass('error');
                    ngModel.$setValidity(attrs.name, true);
                }
            });
        }
    }
});