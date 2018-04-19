commonModule.directive("etbossform", function ($parse, $compile) {
    return { restrict: "E" }, function (scope, element, attrs) {
        element.ready(function () {
            var elm = "";
            var html = "";
            var component = "";
            var htmlvalidation = "";
            var tempvalidation = "";
            var require = "";
            var ngPattern = "";
            var complex = "";
            scope.name = attrs["name"];
            scope.controller = attrs["value"];
            scope.jdata = attrs["field"];
            scope.class = attrs["class"] != undefined ? attrs["class"] : "";
            scope.type = attrs["type"] != undefined ? attrs["type"] : "";
            var obj = jQuery.parseJSON(scope.jdata);
            $.each(obj.field, function (x, field_data) {
                var icon = field_data.icon != undefined ? "icon." + field_data.icon + " + " : "";
                if (field_data.type == "tab") {
                    var tabsitem = "";
                    var tmpl = "";
                    var tab_header = "";
                    var tab_body = "";
                    var tab_validation = "";
                    var tab_count = 1;
                    $.each(field_data.content, function (key, tabs) {
                        var valuecount = 1;
                        $.each(tabs.value, function (x, v_tab) {
                            var ng_hide = v_tab.nghide != undefined ? "ng-hide=\"" + v_tab.nghide + "\"" : "";
                            var tab_icon = v_tab.icon != undefined ? "icon." + v_tab.icon + " + " : "";

                            require = (!v_tab.required) ? "" : "required";
                            if (!v_tab.validation) {
                                tempvalidation = "";
                            } else {
                                ngPattern = "ng-pattern=\"" + generateRegex(v_tab) + "\"";

                                if (v_tab.validation != undefined) {
                                    htmlvalidation = generateValidation(v_tab, scope, "not");
                                    tempvalidation = htmlvalidation;
                                    if (valuecount == tabs.value.length) {
                                        tab_validation += generateValidation(v_tab, scope, "tab");

                                    } else {
                                        tab_validation += generateValidation(v_tab, scope, "tab") + " || ";

                                    }
                                }
                            }
                            tmpl = generateComponent(v_tab, ngPattern, require);
                            var label = "";
                            if (v_tab.text) {
                                label =
                                   "<label class=\"control-label col-md-" + (12 - v_tab.size) + "\" " +
                                    "for=\"" + v_tab.name + "\" " +
                                    "ng-bind=\"" + tab_icon + "lang." + v_tab.text + "\">" + v_tab.text +
                                    "</label>"
                                    ;
                            }
                            tabsitem += "<div class=\"form-group row\" " + ng_hide + " >" +
                                label +
                            "<div class=\"col-md-" + v_tab.size + "\">"
                            + tmpl +
                            tempvalidation +
                            "</div>" +
                            "</div>";
                            valuecount++;
                        });
                        var classtab = tab_count == 1 ? "active" : "";
                        tab_header += "<li role=\"presentation\" " +
                            "class=\"" + classtab + "\" " +
                            "ng-class=\"{'tab-error': " + scope.name + ".$submitted && (" + tab_validation + ") }\">" +
                            "<a href=\"\" " +
                            "id=\"" + scope.name + "_tablist_" + tab_count + "\" " +
                            "data-target=\"#" + scope.name + "_tabs_" + tab_count + "\" " +
                            "aria-controls=\"" + scope.name + "_tabs_" + tab_count + "\" " +
                            "role=\"tab\" " +
                            "data-toggle=\"tab\">" + tabs.name +
                            "</a>" +
                            "</li>";

                        tab_body += "<div role=\"tabpanel\" " +
                            "class=\"tab-pane fade in " + classtab + "\" " +
                            "id=\"" + scope.name + "_tabs_" + tab_count + "\">" +
                            "<div class=\"form-content " + scope.type + "\">" + tabsitem +
                            "</div>" +
                            "</div>";

                        tabsitem = "";
                        tab_validation = "";
                        tab_count++;
                    });

                    component = "<ul class=\"nav nav-tabs tab-form\" role=\"tablist\">" +
                        tab_header +
                        "</ul>" +
                        "<div class=\"tab-content\">" +
                        tab_body +
                        "</div>";

                    tmpl = "";
                    tab_header = "";
                } else {
                    require = (!field_data.required) ? "" : "required";
                    if (!field_data.validation) {
                        tempvalidation = "";
                    } else {
                        ngPattern = "ng-pattern=\"" + generateRegex(field_data) + "\"";

                        if (field_data.validation != undefined) {
                            htmlvalidation = generateValidation(field_data, scope, "form");
                            tempvalidation = htmlvalidation;
                        }
                    }
                    component = generateComponent(field_data, ngPattern, require);
                }

                var ng_hide = field_data.nghide != undefined ? "ng-hide=\"" + field_data.nghide + "\"" : "";
                if (field_data.type != "tab") {
                    if (scope.class != undefined && scope.class == "login-warp") {
                        var warp = "";
                        if (field_data.type == "logo") {
                            warp = "<div class=\"form-group center\">";
                        } else {
                            warp = "<div class=\"form-group\" " + ng_hide + " >";
                        }
                        complex = warp + component + tempvalidation + "</div>";
                    } else {
                        var label = "";
                        if (field_data.text) {
                            label =
                            "<label class=\"control-label col-md-" + (12 - field_data.size) + "\" " +
                            "for=\"" + field_data.name + "\" " +
                            "ng-bind-html=\"" + icon + "lang." + field_data.text + "\" >" + field_data.text +
                            "</label>";
                        }
                        complex = "<div class=\"form-group row\" " + ng_hide + " >" +
                            label +
                        "<div class=\"col-md-" + field_data.size + "\">"
                        + component +
                        tempvalidation +
                        "</div>" +
                        "</div>";
                    }

                } else {
                    complex = component;
                }

                html += complex;

                htmlvalidation = "";
                component = "";
                tempvalidation = "";
                ngPattern = "";
                complex = "";
            });



            if (scope.controller != undefined) {
                elm = "ng-controller=\"" + scope.controller + "\"";
            }
            var btn = "";
            var btn_header = "";
            var isDisabled = "";
            var no = 1;
            if (!obj.button) {

            } else {
                $.each(obj.button, function (x, y) {
                    isDisabled = y.disabled != undefined ? "ng-disabled=\"" + y.disabled + "\"" : "";
                    switch (y.type) {
                        case "submit":
                            if (scope.class != undefined && scope.class == 'login-warp') {
                                btn += "<div class=\"form-group center\">" +
                                    "<button type=\"submit\" " +
                                    "id=\"" + scope.name + "_btn_" + y.type + "_" + no + "\" " +
                                    "class=\"btn blue btn-primary\" " +
                                    "ng-click=\"" + scope.name + ".$valid && " + y.click + "\" " +
                                    "ng-bind=\"lang." + y.text + "\" " +
                                    "style=\"width:100%\">" + y.text +
                                    "</button>" +
                                    "</div>";
                            } else {
                                btn += "<button type=\"submit\" " +
                                    "id=\"" + scope.name + "_btn_" + y.type + "_" + no + "\" " +
                                    "class=\"btn btn-default\" " + isDisabled + " " +
                                    "ng-click=\"" + scope.name + ".$valid && " + y.click + "\" " +
                                    "ng-bind=\"lang." + y.text + "\">" + y.text +
                                    "</button>";
                            }
                            break;
                        case "cancel":
                            if (y.click == "modal") {
                                btn += "<button type=\"button\" " +
                                    "id=\"" + scope.name + "_btn_" + y.type + "_" + no + "\" " +
                                    "class=\"btn btn-danger\" " +
                                    "data-dismiss=\"modal\" ng-bind=\"lang." + y.text + "\">" + y.text +
                                    "</button>";
                            } else {
                                btn += "<a type=\"button\" " +
                                    "id=\"" + scope.name + "_btn_" + y.type + "_" + no + "\" " +
                                    "class=\"btn btn-danger\" " +
                                    "href=\"" + y.click + "\" " +
                                    "ng-bind=\"lang." + y.text + "\">" + y.text +
                                    "</a>";
                            }
                            break;
                        case "showmodal":
                            btn += "<a type=\"button\" " +
                                    "id=\"" + scope.name + "_btn_" + y.type + "_" + no + "\" " +
                                    "class=\"btn btn-danger\" " +
                                    "data-toggle=\"modal\" " +
                                    "data-target=\"" + y.click + "\" " +
                                    "ng-bind=\"lang." + y.text + "\">" + y.text +
                                    "</a>";
                            break;
                        case "reset":
                            btn += "<button type=\"reset\" " +
                                "ng-click=\"resetForm(" + y.model + ")\" " +
                                "id=\"" + scope.name + "_btn_" + y.type + "_" + no + "\" " +
                                "class=\"btn btn-danger\" " +
                                "ng-bind=\"lang." + y.text + "\">" + y.text +
                                "</button>";
                            break;
                        case "link":
                            btn += "<div class=\"form-group center\">" + y.item + "</div>";
                            break;
                        case "custom":
                            btn += y.item;
                            break;
                    }
                    no++;
                });
                if (scope.class != undefined && scope.class == "login-warp") {

                    btn_header = btn;
                } else {
                    btn_header = "<div class=\"form-bottom group clearfix\">" +
                        "<div class=\"btn-set\">" +
                        btn +
                        "</div></div>";
                }
            }


            var r_html = scope.class != undefined && scope.class != "login-warp" ? "<div class=\"form-content " + scope.type + "\">" + html + "</div>" : html;
            var mainhtml = "<form accessible_Form=\"accessibleForm\" " +
                "name=\"" + scope.name + "\" " +
                "class=\"etak-form form-horizontal " + scope.class + "\" " + elm + " novalidate>"
                + r_html +
                btn_header +
                "</form>";
            var e = $compile(mainhtml)(scope);
            setTimeout(function () {
                element.replaceWith(e);
                datepicker();
            }, 0);
        });

        function generateComponent(field_data, ngPattern, require) {
            var error = "error";


            switch (field_data.type) {
                case "captcha":
                    component = "<center><div vc-recaptcha " +
                    "key=\"model.key\"" +
                    "on-create=\"captchaProcess('create', widgetId)\"" +
                    "on-success=\"captchaProcess('success', response)\"" +
                    "on-expire=\"captchaProcess('expired', null)\"></div> <input type=\"hidden\" name=\"" + field_data.name + "\" ng-model=\"" + field_data.model + "\" required></center>";
                    //"<center><div re-captcha ng-model=\"" + field_data.model + "\"></div></center>";
                    break;
                case "label":
                    component = "<p id=\"" + scope.name + "_" + field_data.name + "\" " +
                        "class=\"form-control-static break-line\" " +
                        "for=\"" + field_data.name + "\" " +
                        "ng-bind=\"" + field_data.model + "\"></p>";
                    break;
                case "logo": component = field_data.item;
                    break;
                case "message":
                    component = "<div id=\"" + scope.name + "_errormessage\" " +
                        "ng-show=\"" + field_data.show + "\" " +
                        "class=\"aui-message error\">" +
                        "<p ng-bind-html=\"" + field_data.item + "\">{{" + field_data.item + "}}</p>" +
                        "</div>";
                    break;
                case "month_year":
                    component = "<div class=\"row\"><div class=\"col-lg-4\"><input " +
                        "name=\"" + field_data.name + "_month\" " +
                        "ng-class=\"{ " + error + ": " + scope.name + ".$submitted && " + scope.name + "." + field_data.name + "_month.$invalid }\" " +
                        "type=\"hidden\" " +
                        "ng-model=\"" + field_data.model + ".month.value\" " +
                        "id=\"" + scope.name + "_" + field_data.name + "_month\" " + require + ">" +
                        "<ui-select ng-model=\"" + field_data.model + ".month\" theme=\"select2\" class=\"form-control\">" +
                        "<ui-select-match id=\"" + scope.name + "." + field_data.name + "_month\" placeholder=\"Month\">{{$select.selected.name}}</ui-select-match>" +
                        "<ui-select-choices id=\"" + scope.name + "_" + field_data.name + "_month\" repeat=\"item in " + field_data.value_month + " | filter: $select.search\">" +
                        "<div ng-bind-html=\"item.name | highlight: $select.search\"></div>" +
                        "</ui-select-choices>" +
                        "</ui-select></div>" +
                        "<div class=\"col-lg-8\"><input " +
                        "name=\"" + field_data.name + "_year\" " +
                        "ng-class=\"{ " + error + ": " + scope.name + ".$submitted && " + scope.name + "." + field_data.name + "_year.$invalid }\" " +
                        "type=\"hidden\" " +
                        "ng-model=\"" + field_data.model + ".year.value\" " +
                        "id=\"" + scope.name + "_" + field_data.name + "_year\" " + require + ">" +
                        "<ui-select ng-model=\"" + field_data.model + ".year\" theme=\"select2\" class=\"form-control\">" +
                        "<ui-select-match id=\"" + scope.name + "." + field_data.name + "_year\" placeholder=\"Year\">{{$select.selected.name}}</ui-select-match>" +
                        "<ui-select-choices id=\"" + scope.name + "_" + field_data.name + "_year\" repeat=\"item in " + field_data.value_year + " | filter: $select.search\">" +
                        "<div ng-bind-html=\"item.name | highlight: $select.search\"></div>" +
                        "</ui-select-choices>" +
                        "</ui-select></div></div>" +
                        "<span id=\"" + scope.name + "_" + field_data.name + "_errormessage\" " +
                        "ng-bind-html=\"lang.validationmessage.mandatory\" " +
                        "class=\"help-block with-errors ng-binding ng-hide\" " +
                        "ng-show=\"" + scope.name + ".$submitted && (" + scope.name + "." + field_data.name + "_month.$error.required || " + scope.name + "." + field_data.name + "_year.$error.required)\">field is mandatory</span>";
                    break;
                case "csc":
                    var maxLength = field_data.maxlength != undefined ? "ng-maxlength=\"" + field_data.maxlength + "\"" : "";
                    component = "<div class=\"row\"><div class=\"col-lg-4\"><input " + maxLength + " type=\"text\" " +
                        "name=\"" + field_data.name + "\" " +
                        "id=\"" + scope.name + "_" + field_data.name + "\" " +
                        "class=\"form-control\" " +
                        "ng-class=\"{ " + error + ": " + scope.name + ".$submitted && " + scope.name + "." + field_data.name + ".$invalid }\" " +
                        "placeholder=\"{{lang." + field_data.text + "}}\" " +
                        "ng-model=\"" + field_data.model + "\" " + require + "></div>" +
                        "<div class=\"col-lg-8\"><span class=\"qs\" style=\"margin-top:5px; display:block\"><span class=\"fa fa-question\">" +
                        "</span> <span class=\"popover-rba\">" + field_data.info + "</span></span></div></div>";
                    break;
                case "text":
                    var maxLength = field_data.maxlength != undefined ? "ng-maxlength=\"" + field_data.maxlength + "\"" : "";
                    component = "<input " + maxLength + " " + " type=\"" + field_data.type + "\" " +
                        "name=\"" + field_data.name + "\" " +
                        "id=\"" + scope.name + "_" + field_data.name + "\" " +
                        "class=\"form-control\" " +
                        "ng-class=\"{ " + error + ": " + scope.name + ".$submitted && " + scope.name + "." + field_data.name + ".$invalid }\" " +
                        "placeholder=\"{{lang." + field_data.text + "}}\" " +
                        "ng-model=\"" + field_data.model + "\" " + ngPattern + " " + require + ">";
                    break;
                case "textarea":
                    var maxLength = field_data.maxlength != undefined ? "ng-maxlength=\"" + field_data.maxlength + "\"" : "";
                    component = "<textarea " + maxLength + " " +
                        "class=\"form-control\" " +
                        "ng-class=\"{ " + error + ": " + scope.name + ".$submitted && " + scope.name + "." + field_data.name + ".$invalid }\" " +
                        "name=\"" + field_data.name + "\" id=\"" + scope.name + "_" + field_data.name + "\" " +
                        "placeholder=\"{{lang." + field_data.text + "}}\" " +
                        "ng-model=\"" + field_data.model + "\" " + require + "></textarea>";
                    break;
                case "number":
                    component = "<input type=\"" + field_data.type + "\" " +
                        "name=\"" + field_data.name + "\" " +
                        "id=\"" + scope.name + "_" + field_data.name + "\" " +
                        "class=\"form-control\" " +
                        "ng-class=\"{ " + error + ": " + scope.name + ".$submitted && " + scope.name + "." + field_data.name + ".$invalid }\" " +
                        "placeholder=\"{{lang." + field_data.text + "}}\" " +
                        "ng-model=\"" + field_data.model + "\" " + ngPattern + " " + require + ">";
                    break;
                case "phone":
                    component = "<input type=\"text\" " +
                        "name=\"" + field_data.name + "\" " +
                        "id=\"" + scope.name + "_" + field_data.name + "\" " +
                        "class=\"form-control\" " +
                        "ng-class=\"{ " + error + ": " + scope.name + ".$submitted && " + scope.name + "." + field_data.name + ".$invalid }\" " +
                        "placeholder=\"{{lang." + field_data.text + "}}\" " +
                        "ng-model=\"" + field_data.model + "\" " + ngPattern + " " + require + ">";
                    break;
                case "password":
                    var keypress = field_data.keypress != undefined ? field_data.keypress : "";
                    component = "<input type=\"" + field_data.type + "\" " +
                        "ng-keypress=\"" + keypress + "\" " +
                        "name=\"" + field_data.name + "\" " +
                        "id=\"" + scope.name + "_" + field_data.name + "\" " +
                        "class=\"form-control\" " +
                        "ng-class=\"{ " + error + ": " + scope.name + ".$submitted && " + scope.name + "." + field_data.name + ".$invalid }\" " +
                        "placeholder=\"{{lang." + field_data.text + "}}\" " +
                        "ng-model=\"" + field_data.model + "\" " + ngPattern + " " + require + ">";
                    break;
                case "confirm_password":
                    component = "<input type=\"password\" " +
                        "name=\"" + field_data.name + "\" " +
                        "id=\"" + scope.name + "_" + field_data.name + "\" " +
                        "class=\"form-control\" " +
                        "ng-class=\"{ " + error + ": " + scope.name + ".$submitted && (" + scope.name + "." + field_data.name + ".$error.noMatch || " + scope.name + "." + field_data.name + ".$invalid) }\" " +
                        "placeholder=\"{{lang." + field_data.text + "}}\" " +
                        "ng-model=\"" + field_data.model + "\" " + ngPattern + " required " +
                        "data-password-verify=\"" + field_data.compareTo + "\">";
                    break
                case "email":
                    var maxLength = field_data.maxlength != undefined ? "ng-maxlength=\"" + field_data.maxlength + "\"" : "";
                    component = "<input " + maxLength + " " +
                        "type=\"" + field_data.type + "\" " +
                        "name=\"" + field_data.name + "\" " +
                        "id=\"" + scope.name + "_" + field_data.name + "\" " +
                        "class=\"form-control\" " +
                        "ng-class=\"{ " + error + ": " + scope.name + ".$submitted && " + scope.name + "." + field_data.name + ".$invalid }\" " +
                        "placeholder=\"{{lang." + field_data.text + "}}\" " +
                        "ng-model=\"" + field_data.model + "\" " + ngPattern + " " + require + ">";
                    break;
                case "iban":
                    /*to be done*/
                    //component = '<div class="row col-sm-4"><select class="form-control" id="' + field_data.name + '" name="' + field_data.name + '" ng-model="' + field_data.model + '" ' + require + '>' +
                    //            '<option>SELECT ONE</option>' +
                    //            '</select></div>' +
                    //            '<div class="row col-sm-9 pull-right"><input type="text" name="' + field_data.name + '" id="' + field_data.name + '" class="form-control" placeholder="' + field_data.text + '" ng-model="' + field_data.model + '" ' + ngPattern + ' ' + require + '></div>';
                    component = "<input " +
                        "type=\"text\" " +
                        "name=\"" + field_data.name + "\" " +
                        "id=\"" + scope.name + "_" + field_data.name + "\" " +
                        "class=\"form-control\" " +
                        "ng-class=\"{ " + error + ": " + scope.name + ".$submitted && " + scope.name + "." + field_data.name + ".$invalid }\" " +
                        "placeholder=\"{{lang." + field_data.text + "}}\" " +
                        "ng-model=\"" + field_data.model + "\" " + require + ">";
                    break;
                case "date":
                    component = "<div class=\"input-group date\">" +
                        "<input " +
                        "type=\"text\" " +
                        "name=\"" + field_data.name + "\" " +
                        "id=\"" + scope.name + "_" + field_data.name + "\" " +
                        "class=\"form-control\" " +
                        "ng-class=\"{ " + error + ": " + scope.name + ".$submitted && " + scope.name + "." + field_data.name + ".$invalid }\" " +
                        "placeholder=\"" + config.DateFormat + "\" " +
                        "ng-model=\"" + field_data.model + "\" " +
                        "readonly " + require + ">" +
                        "<span class=\"input-group-addon\"><i class=\"glyphicon glyphicon-th\"></i></span>" +
                        "</div>";
                    break;
                case "birthdate":
                    component = "<div class=\"input-group date\">" +
                        "<input birth-Date=\"" + scope.name + "\" " +
                        "type=\"text\" " +
                        "name=\"" + field_data.name + "\" " +
                        "id=\"" + scope.name + "_" + field_data.name + "\" " +
                        "class=\"form-control birthdate\" " +
                        "ng-class=\"{ " + error + ": (" + scope.name + ".$submitted && " + scope.name + "." + field_data.name + ".$invalid)}\" " +
                        "placeholder=\"" + config.DateFormat + "\" " +
                        "ng-model=\"" + field_data.model + "\" " +
                        "readonly " + require + ">" +
                        "<span class=\"input-group-addon\"><i class=\"glyphicon glyphicon-th\"></i></span>" +
                        "</div>" +
                        "<span id=\"" + scope.name + "_" + field_data.name + "_errormessage\" " +
                        "ng-bind-html=\"lang.validationmessage.birthdate\" " +
                        "class=\"help-block with-errors ng-binding ng-hide\" " +
                        ">error message</span>";
                    break;

                case "select":
                    component = "<input " +
                        "name=\"" + field_data.name + "\" " +
                        "ng-class=\"{ " + error + ": " + scope.name + ".$submitted && " + scope.name + "." + field_data.name + ".$invalid }\" " +
                        "type=\"hidden\" " +
                        "ng-model=\"" + field_data.model + ".value\" " +
                        "id=\"" + scope.name + "_" + field_data.name + "\" " + require + ">" +
                        "<ui-select ng-model=\"" + field_data.model + "\" theme=\"select2\" class=\"form-control\">" +
                        "<ui-select-match id=\"" + scope.name + "." + field_data.name + "\" placeholder=\"{{lang." + field_data.text + "}}\">{{$select.selected.name}}</ui-select-match>" +
                        "<ui-select-choices id=\"" + scope.name + "_" + field_data.name + "\" repeat=\"item in " + field_data.value + " | filter: $select.search\">" +
                        "<div ng-bind-html=\"item.name | highlight: $select.search\"></div>" +
                        "</ui-select-choices>" +
                        "</ui-select>";

                    break;
                case "selectcheckchange":
                    component = "<input " +
                        "name=\"" + field_data.name + "\" " +
                        "ng-class=\"{ " + error + ": " + scope.name + ".$submitted && " + scope.name + "." + field_data.name + ".$invalid }\" " +
                        "type=\"hidden\" " +
                        "ng-model=\"" + field_data.model + ".value\" " +
                        //"ng-change=\"" +field_data.ngchange+ "\""+
                        "id=\"" + scope.name + "_" + field_data.name + "\" " + require + ">" +
                        "<ui-select ng-model=\"" + field_data.model + "\" ng-change=\"" + field_data.ngchange + "\" theme=\"select2\" class=\"form-control\">" +
                        "<ui-select-match id=\"" + scope.name + "." + field_data.name + "\" placeholder=\"{{lang." + field_data.text + "}}\">{{$select.selected.name}}</ui-select-match>" +
                        "<ui-select-choices id=\"" + scope.name + "_" + field_data.name + "\" repeat=\"item in " + field_data.value + " | filter: $select.search\">" +
                        "<div ng-bind-html=\"item.name | highlight: $select.search\"></div>" +
                        "</ui-select-choices>" +
                        "</ui-select>";

                    break;
                case "radio":
                    var i = 1;
                    var radio = "";
                    var res = true;
                    $.each(field_data.content, function (x, y) {
                        if (field_data.style == "horizontal") {
                            radio += "<input " + require + " " +
                                "type=\"" + field_data.type + "\" " +
                                "id=\"" + scope.name + "_" + field_data.name + "_" + i + "\" " +
                                "value=\"" + y.value + "\" " +
                                "name=\"" + field_data.name + "\" " +
                                "ng-model=\"" + field_data.model + "\" />" +
                                "<label for=\"" + scope.name + "_" + field_data.name + "_" + i + "\"><span></span> " + y.text + "</label>";
                            res = false;
                        } else {
                            radio += "<div class=\"radio\">" +
                                "<input " + require + " " +
                                "type=\"" + field_data.type + "\" " +
                                "id=\"" + scope.name + "_" + field_data.name + "_" + i + "\" " +
                                "value=\"" + y.value + "\" " +
                                "name=\"" + field_data.name + "\" " +
                                "ng-model=\"" + field_data.model + "\" />" +
                                "<label for=\"" + scope.name + "_" + field_data.name + "_" + i + "\"><span></span> " + y.text + "</label>" +
                                "</div>";
                            res = true;
                        }
                        i++;
                    });
                    if (!res) {
                        component = " <div class=\"radio\">" + radio + "</div>";
                    } else {
                        component = radio;
                    }
                    break;
                case "checkbox":
                    var i = 1;
                    var check = "";
                    var res = true;
                    $.each(field_data.content, function (x, y) {
                        if (field_data.style == "horizontal") {
                            check += "<input " + require + " " +
                                "type=\"" + field_data.type + "\" " +
                                "id=\"" + scope.name + "_" + field_data.name + "_" + i + "\" " +
                                "value=\"" + y.value + "\" " +
                                "name=\"" + field_data.name + "_" + i + "\" " +
                                "ng-model=\"" + field_data.model + "_" + i + "\" />" +
                                "<label for=\"" + scope.name + "_" + field_data.name + "_" + i + "\"><span></span> " + y.text + "</label>";
                            res = false;
                        } else {
                            check += "<div class=\"checkbox\">" +
                                "<input " + require + " " +
                                "type=\"" + field_data.type + "\" " +
                                "id=\"" + scope.name + "_" + field_data.name + "_" + i + "\" " +
                                "value=\"" + y.value + "\" " +
                                "name=\"" + field_data.name + "_" + i + "\" " +
                                "ng-model=\"" + field_data.model + "\" />" +
                                "<label for=\"" + scope.name + "_" + field_data.name + "_" + i + "\"><span></span> " + y.text + "</label>" +
                                "</div>";
                            res = true;
                        }
                        i++;
                    });
                    if (!res) {
                        component = " <div class=\"checkbox\">" + check + "</div>";
                    } else {
                        component = check;
                    }
                    break;
            }
            return component;
        }

        function generateValidation(param, scope, formtype) {
            htmlvalidation = "";
            var jum = 1;
            $.each(param.validation, function (x, validation_data) {
                switch (validation_data.value) {
                    case "mandatory":
                        if (formtype == "tab") {
                            if (jum == param.validation.length) {
                                htmlvalidation += tabGenerateValidation(validation_data.value, param, scope);
                            } else {
                                htmlvalidation += tabGenerateValidation(validation_data.value, param, scope) + " || ";
                            }
                        } else {
                            htmlvalidation += generateHtml(validation_data.value, param, scope);
                        }
                        break;
                    case "maxlength":
                        if (formtype == "tab") {
                            if (jum == param.validation.length) {
                                htmlvalidation += tabGenerateValidation(validation_data.value, param, scope);
                            } else {
                                htmlvalidation += tabGenerateValidation(validation_data.value, param, scope) + " || ";
                            }
                        } else {
                            htmlvalidation += generateHtml(validation_data.value, param, scope);
                        }
                        break;
                    case "email":
                        if (formtype == "tab") {
                            if (jum == param.validation.length) {
                                htmlvalidation += tabGenerateValidation(validation_data.value, param, scope);
                            } else {
                                htmlvalidation += tabGenerateValidation(validation_data.value, param, scope) + " || ";
                            }
                        } else {
                            htmlvalidation += generateHtml(validation_data.value, param, scope);
                        }
                        break;
                    case "password":
                        if (formtype == "tab") {
                            if (jum == param.validation.length) {
                                htmlvalidation += tabGenerateValidation(validation_data.value, param, scope);
                            } else {
                                htmlvalidation += tabGenerateValidation(validation_data.value, param, scope) + " || ";
                            }
                        } else {
                            htmlvalidation += generateHtml(validation_data.value, param, scope);
                        }
                        break;
                    case "confirm_password":
                        if (formtype == "tab") {
                            if (jum == param.validation.length) {
                                htmlvalidation += tabGenerateValidation(validation_data.value, param, scope);
                            } else {
                                htmlvalidation += tabGenerateValidation(validation_data.value, param, scope) + " || ";
                            }
                        } else {
                            htmlvalidation += generateHtml(validation_data.value, param, scope);
                        }
                        break;
                    case "number":
                        if (formtype == "tab") {
                            if (jum == param.validation.length) {
                                htmlvalidation += tabGenerateValidation(validation_data.value, param, scope);
                            } else {
                                htmlvalidation += tabGenerateValidation(validation_data.value, param, scope) + " || ";
                            }
                        } else {
                            htmlvalidation += generateHtml(validation_data.value, param, scope);
                        }
                        break;
                        /*to be done*/
                        //case "iban": htmlvalidation += generateHtml(validation_data.value, param, scope);
                        //    break;
                    case "phone":
                        if (formtype == "tab") {
                            if (jum == param.validation.length) {
                                htmlvalidation += tabGenerateValidation(validation_data.value, param, scope);
                            } else {
                                htmlvalidation += tabGenerateValidation(validation_data.value, param, scope) + " || ";
                            }
                        } else {
                            htmlvalidation += generateHtml(validation_data.value, param, scope);
                        }
                        break;
                }
                jum++;
            });
            return htmlvalidation;
        }

        function generateRegex(param) {
            var regex = "";

            switch (param.type) {
                case "text": regex = /^(?!^\s)(.*)+\S$/;
                    break;
                case "string": regex = /^[A-z]+$/;
                    break;
                case "email": regex = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
                    break;
                case "password":

                    $.each(param.validation, function (x, y) {
                        if (y.value == "password") {
                            regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[&#33&#34&#35&#36&#37&#38&#39&#40&#41&#42&#43&#44&#45&#46&#47&#58&#59&#60&#61&#62&#63&#64&#91&#92&#93&#95&#96&#123&#124&#125&#126])[0-9a-zA-Z&#33&#34&#35&#36&#37&#38&#39&#40&#41&#42&#43&#44&#45&#46&#47&#58&#59&#60&#61&#62&#63&#64&#91&#92&#93&#95&#96&#123&#124&#125&#126]{6,20}$/;
                        }
                    });
                    break;
                case "number": regex = /^(?=.*\d)[0-9]+$/;
                    break;
                case "phone": regex = /^(?=.*\d)[0-9]{5,20}$/;
                    break;
                    /*to be done*/
                    //case "iban":
                    //    $.each(ngIbanCountries, function (x, y) {
                    //        if (x == param.country) {
                    //            regex = y.regex;
                    //        }
                    //    });
                    //    break;
            }
            return regex;
        }

        function generateHtml(param, data, scope) {
            var i = "";
            var message = "";
            var type = "";
            switch (param) {
                case "mandatory":
                    type = "required";
                    break;
                case "maxlength":
                    type = "maxlength";
                    break;
                case "password":
                    type = "pattern";
                    break;
                case "confirm_password":
                    type = "passwordVerify";
                    break;
                case "email":
                    type = "pattern || " + scope.name + "." + data.name + ".$error.email || maxlength";
                    break;
                case "number":
                    type = "number || " + scope.name + "." + data.name + ".$error.pattern";
                    break;
                    /*to be done*/
                    //case "iban": message = data.text + ' format is invalid';
                    //    type = "iban || " + scope.name + "." + data.name + ".$error.pattern";
                    //    break;
                case "phone":
                    type = "pattern";
                    break;
            }

            i = "<span " +
                "id=\"" + scope.name + "_" + data.name + "_errormessage\" " +
                "ng-bind-html=\"lang.validationmessage." + param + "\" " +
                "class=\"help-block with-errors\" " +
                "ng-show=\"" + scope.name + ".$submitted && (" + scope.name + "." + data.name + ".$error." + type + ")\">" +
                message +
                "</span>";
            return i;
        }

        function tabGenerateValidation(param, data, scope) {
            var i = "";
            var type = "";

            switch (param) {
                case "mandatory":
                    type = "required";
                    break;
                case "maxlength":
                    type = "maxlength";
                    break;
                case "password":
                    type = "pattern";
                    break;
                case "confirm_password":
                    type = "passwordVerify";
                    break;
                case "email":
                    type = "pattern || " + scope.name + "." + data.name + ".$error.email || maxlength";
                    break;
                case "number":
                    type = "number || " + scope.name + "." + data.name + ".$error.pattern";
                    break;
                case "phone":
                    type = "pattern";
                    break;
            }
            i = "(" + scope.name + "." + data.name + ".$error." + type + ")";
            return i;
        }



    };
});