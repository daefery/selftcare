using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace console.Areas.SelfCare
{
    public class SelfCareRegistration : AreaRegistration
    {

        public override string AreaName
        {
            get
            {
                return "SelfCare";
            }
        }

        public override void RegisterArea(AreaRegistrationContext context)
        {
            context.MapRoute(
                "SelfCare_default",
                "SelfCare/{controller}/{action}/{id}",
                new { action = "Index", id = UrlParameter.Optional }
            );
        }
    }
}