using System;
using System.Collections.Generic;
using System.IdentityModel.Claims;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Helpers;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;
using console.Controllers;

namespace console
{
    public class MvcApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            AntiForgeryConfig.UniqueClaimTypeIdentifier = ClaimTypes.NameIdentifier;
            AreaRegistration.RegisterAllAreas();
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);
        }

        /// <summary>
        /// This void is used to handle global exception 
        /// </summary>
        protected void Application_Error()
        {
            var exception = Server.GetLastError();

            Response.Clear();
            Server.ClearError();

            var httpException = exception as HttpException;

            var routeData = new RouteData();
            routeData.Values["controller"] = "Error";
            routeData.Values["action"] = "Index";
            Response.StatusCode = (int)HttpStatusCode.InternalServerError;

            // create error site flag
            var requestUrl = Request.RawUrl;
            var urlArr = requestUrl.Split('/');

            // check whether error not come from SelfCare or CSR site
            if (!urlArr[1].Equals("SelfCare") && !urlArr[1].Equals("CSR"))
            {
                Response.StatusCode = (int)HttpStatusCode.NotFound;
                Response.RedirectToRoute("ErrorNotFound");
                return;
            }

            if (httpException != null)
            {
                switch (httpException.GetHttpCode())
                {
                    case (int)HttpStatusCode.NotFound:
                        Response.StatusCode = (int)HttpStatusCode.NotFound;
                        Response.RedirectToRoute(urlArr[1].Equals("SelfCare") ? "SelfCareErrorNotFound" : "CSRErrorNotFound");
                        return;
                    case (int)HttpStatusCode.Forbidden:
                        Response.StatusCode = (int)HttpStatusCode.Forbidden;
                        Response.RedirectToRoute(urlArr[1].Equals("SelfCare") ? "SelfCareErrorNotFound" : "CSRErrorNotFound");
                        return;
                    case (int)HttpStatusCode.BadRequest:
                        Response.StatusCode = (int)HttpStatusCode.BadRequest;
                        Response.RedirectToRoute(urlArr[1].Equals("SelfCare") ? "SelfCareErrorBadRequest" : "CSRErrorBadRequest");
                        return;
                    case (int)HttpStatusCode.InternalServerError:
                        Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                        Response.RedirectToRoute(urlArr[1].Equals("SelfCare") ? "SelfCareErrorInternalServerError" : "CSRErrorInternalServerError");
                        return;
                }
            }

            // Avoid IIS getting in the middle
            Response.TrySkipIisCustomErrors = true;
            Response.ContentType = "text/html";
            IController errorsController = new ErrorController();
            var rc = new RequestContext(new HttpContextWrapper(Context), routeData);
            errorsController.Execute(rc);
        }
    }
}
