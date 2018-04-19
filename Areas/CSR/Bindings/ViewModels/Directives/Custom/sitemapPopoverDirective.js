CSRContent.directive('sitemapPopover', function ($compile) {
    return {
        restrict: 'EAC',
        scope: {
            desc: '@',
            link: '@',
            useParam: '@'
        },
        link: function (scope, elements, attrs) {
            var html = '<div>' + scope.desc;
            if ((scope.useParam == "true") || (scope.link == "")) {
                html = html + '</div>';
            } else {
                html = html + ' <br/> <a href="#" ng-click="redirecttopath(\'' + scope.link + '\')">link</a> </div>';
            };
            $(elements).popover({
                'trigger': 'focus',
                'delay': { show: 200, hide: 0 },
                'html': true,
                'container': '.modal-body',
                'content': function () {
                    return $compile(html)(scope);
                }
            });

            scope.redirecttopath = function (path) {
                window.location.href = path;
            };

        }
    }
});
