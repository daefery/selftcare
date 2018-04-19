using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace console
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            routes.MapRoute(
                name: "Default",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "Home", action = "Index", id = UrlParameter.Optional }
            );

            routes.MapRoute(
               name: "CSR",
               url: "CSR/{controller}/{action}/{id}/{id2}",
               defaults: new { controller = "Customer", action = "App", id = UrlParameter.Optional, id2 = UrlParameter.Optional },
               namespaces: new[] { "console.Areas.CSR.Controllers" }
           );
            routes.MapRoute(
               name: "SelfCare",
               url: "SelfCare/{controller}/{action}/{id}/{id2}/{id3}",
               defaults: new { controller = "Customer", action = "App", id = UrlParameter.Optional, id2 = UrlParameter.Optional, id3=UrlParameter.Optional },
               namespaces: new[] { "console.Areas.SelfCare.Controllers" }
           );
            routes.MapRoute(
               name: "Public",
               url: "public/{controller}/{action}/{id}/{id2}",
               defaults: new { controller = "customer", action = "app", id = UrlParameter.Optional, id2 = UrlParameter.Optional },
               namespaces: new[] { "console.Areas.Public.Controllers" }
            );

            routes.MapRoute("SelfCareErrorNotFound", "SelfCare/Customer/App/NotFound",
                new { controller = "Customer", action = "App", id = UrlParameter.Optional }
            );

            routes.MapRoute("SelfCareErrorInternalServerError", "SelfCare/Customer/App/InternalServerError",
                new { controller = "Customer", action = "App", id = UrlParameter.Optional }
            );

            routes.MapRoute("SelfCareErrorBadRequest", "SelfCare/Customer/App/BadRequest",
                new { controller = "Customer", action = "App", id = UrlParameter.Optional }
            );

            routes.MapRoute("CSRErrorNotFound", "CSR/Customer/App/NotFound",
                new { controller = "Customer", action = "App", id = UrlParameter.Optional }
            );

            routes.MapRoute("CSRErrorInternalServerError", "CSR/Customer/App/InternalServerError",
                new { controller = "Customer", action = "App", id = UrlParameter.Optional }
            );

            routes.MapRoute("CSRErrorBadRequest", "CSR/Customer/App/BadRequest",
                new { controller = "Customer", action = "App", id = UrlParameter.Optional }
            );

            routes.MapRoute("BadRequest", "Error/BadRequest",
                new { controller = "Error", action = "BadRequest", id = UrlParameter.Optional }
            );

            routes.MapRoute("Error", "Error/Index",
                new { controller = "Error", action = "Index", id = UrlParameter.Optional }
            );

            routes.MapRoute("ErrorNotFound", "Error/NotFound",
                new { controller = "Error", action = "NotFound", id = UrlParameter.Optional }
            );
            routes.MapRoute("GetSessioId", "{controller}/{action}",
                new { controller = "Utility", action = "GetSessionId", id = UrlParameter.Optional }
            );

        }
    }
}
