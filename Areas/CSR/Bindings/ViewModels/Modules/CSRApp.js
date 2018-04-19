//Agung meinastesi caesar
//22.09.2015 Created:Angular's module for customer dashboard
var CSRContent = angular.module('CSRContents',
    ['common', 'myAccount', 'CSRHeaders', 'publicContent', 'textAngularCustom']);
var myAccount = angular.module('myAccount', ['common']);

var CSRHeader = angular.module('CSRHeaders', ['common']);

var publicContent = angular.module('publicContent', ['common']);

var textAngularCustom = angular.module('textAngularCustom', ['textAngular'])
    .config(function ($provide) {
        // this demonstrates how to register a new tool and add it to the default toolbar
        $provide.decorator('taOptions', ['taRegisterTool', '$delegate', function (taRegisterTool, taOptions) { // $delegate is the taOptions we are decorating

            taOptions.toolbar = [
                ['p', 'pre', 'quote'],
                ['bold', 'italics', 'underline', 'strikeThrough', 'ul', 'ol', 'redo', 'undo', 'clear'],
                ['justifyLeft', 'justifyCenter', 'justifyRight', 'indent', 'outdent'],
                ['html', 'insertLink', 'wordcount', 'charcount']
            ];
            return taOptions;

        }]);
    });
