using System.Web;
using System.Web.Optimization;

namespace console
{
    public class BundleConfig
    {
        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/jquery-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                        "~/Scripts/jquery.validate*"));

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at http://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                      "~/Scripts/bootstrap.js",
                      "~/Scripts/respond.js",
                      "~/Scripts/bootstrap-datepicker.js"
                      ));

            bundles.Add(new StyleBundle("~/Content/css").Include(
                      "~/Styles/bootstrap.css",
                      "~/Styles/datepicker.css",
                      "~/Styles/custom.css",
                      "~/Styles/angular-ui-notification.min.css",
                      "~/Styles/select.css",
                      "~/Styles/select-combo.css",
                      "~/Styles/select-bootstrap.css",
                      "~/Styles/prettify.css",
                      "~/Styles/textAngular.css"
                      ));
            bundles.Add(new ScriptBundle("~/bundles/angular_common").Include(
                    "~/Scripts/common/directives/EtakFormDirectives.js",
                    "~/Scripts/common/directives/EtakFormUtilityDirective.js",
                    "~/Scripts/common/directives/ErrorMessageDirectives.js",
                    "~/Scripts/common/directives/LoadingPageDirective.js",
                    "~/Scripts/common/directives/SetActiveLinkDirective.js",
                    "~/Scripts/common/directives/CarouselDirective.js",
                    "~/Scripts/common/services/EnumCodeServices.js", 
                    "~/Scripts/custom/angular-spinner.js",
                    "~/Scripts/dirPagination.js",
                    "~/Scripts/ng-breadcrumbs.min.js",
                    "~/Scripts/common/services/ErrorHandlingService.js",
                    "~/Scripts/common/routings/ErrorHandlerRouting.js",
                    "~/Scripts/common/services/StartingPageService.js",
                    "~/Scripts/common/services/AuthCommonService.js",
                    "~/Scripts/common/controller/AuthCommonController.js",
                    "~/Scripts/common/services/IdleHandlerService.js",
                    "~/Scripts/common/services/RefreshTokenService.js",
                    "~/Scripts/custom/angular-re-captcha.js",
                    "~/Scripts/custom/paginationServerSide.js",
                    "~/Scripts/common/services/AutoLoginService.js",
                    "~/Scripts/common/services/CaptchaVerificationService.js",
                    "~/Scripts/common/services/LocalStorageProvider.js",
                    "~/Scripts/custom/angular-tree-control.js",
                    "~/Scripts/custom/angular.treeview.js",
                    "~/Scripts/common/services/ShoppingCartService.js",
                    "~/Scripts/common/services/SideBarTreeService.js",
                    "~/Scripts/common/services/SelfcareMultisubscriptionCheckerService.js",
                    "~/Scripts/common/services/SendSMSService.js",
                    "~/Scripts/common/services/AddressValidatorService.js",
                    "~/Scripts/common/services/MultiSubscriptionService.js",
                    "~/Scripts/common/services/MultiSubscriptionCacheService.js"
                ));
            bundles.Add(new ScriptBundle("~/bundles/common_lib").Include(
                    "~/Scripts/angular.js",
                    "~/Scripts/angular-route.js",
                    "~/Scripts/angular-animate.js",
                    "~/Scripts/angular-ui/ui-bootstrap-tpls.js",
                    "~/Scripts/moment.js",
                    "~/Scripts/custom/angular-spinner.js",
                    "~/Scripts/custom/ng-iban.js",
                    "~/Scripts/angular-resource.js",
                    "~/Scripts/custom/bootstrap-combobox.js",
                    "~/Scripts/custom/spin.js",
                    "~/Scripts/custom/utility.js",
                    "~/Scripts/angular-sanitize.js",
                    "~/Scripts/custom/angular-ui-notification.min.js",
                    "~/Scripts/custom/select.js",
                    "~/Scripts/custom/jquery.bootstrap.wizard.js",
                    "~/Scripts/custom/prettify.js",
                    "~/Scripts/custom/modalpopup.js",
                    "~/Scripts/Chart.js",
                    "~/Scripts/slick.min.js",
                    "~/Scripts/jquery.nicescroll.min.js",
                    "~/Scripts/custom/angular-recaptcha.js"
                ));
            bundles.Add(new ScriptBundle("~/bundles/text_editor_component").Include(
                    "~/Scripts/bootstrap-wysiwyg.js",
                    "~/Scripts/jquery.hotkeys.js",
                    "~/Scripts/textangular/textAngular-rangy.min.js",
                    "~/Scripts/textangular/textAngular-sanitize.min.js",
                    "~/Scripts/textangular/textAngular.min.js"
                ));

            BundleTable.EnableOptimizations = false;
        }
    }
}
