CSRContent.directive('popOver', function ($compile) {
    var getTemplate = function (size, name) {
        var size = (parseFloat(size) / 1024).toFixed(2);
        var sizeName = isNaN(size) ? '' : size + 'KB';
        var template =
            '<p style="direction: ltr; text-align: left; unicode-bidi: bidi-override;">' +
            sizeName +
            '<button type="button" class="close" ng-click="onDelete(' + name + ')"><i class="glyphicon glyphicon-trash"></i></button>' +
            '</p>';
        return template;
    }
    var getTemplateForDownload = function (param) {
        var template =
            '<p style="direction: ltr; text-align: left; unicode-bidi: bidi-override;">' +
            '<button type="button" class="close" ng-click="onDelete({object : param})"><i class="glyphicon glyphicon-trash"></i></button>' +
            '<a id="downloadatt_' + param.Id + '" ng-click="onDownload({object : param})">Download</a>' +
            '<a id="att_' + param.Id + '" style="display: none;">Download</a>' +
            '</p>';
        return template;
    }
    return {
        restrict: "A",
        transclude: true,
        template: "<span ng-transclude></span>",
        link: function (scope, element, attrs) {
            var popOverContent;
            var html = '';
            if (scope.kind == 'download') {
                html = getTemplateForDownload(scope.param);
            }
            else {
                html = getTemplate(scope.size, scope.poptitle);
            }
            popOverContent = $compile(html)(scope);
            var popovercontent = {
                content: popOverContent,
                placement: "top",
                html: true,
                title: scope.poptitle
            };
            var tooltipcontent = {
                placement: "bottom",
                title: scope.poptitle
            }
            $(element).popover(popovercontent);
            $(element).tooltip(tooltipcontent);

        },
        scope: {
            poptitle: '@',
            size: '@',
            kind: '@',
            param: '=',
            onDelete: '&',
            onDownload: '&',
        }
    };
})