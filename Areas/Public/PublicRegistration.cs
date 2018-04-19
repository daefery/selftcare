using System.Web.Mvc;

namespace console.Areas.Public
{
    public class PublicRegistration: AreaRegistration
    {
        public override string AreaName
        {
            get
            {
                return "public";
            }
        }

        public override void RegisterArea(AreaRegistrationContext context)
        {
            context.MapRoute(
                "public_default",
                "public/{controller}/{action}/{id}",
                new { action = "Index", id = UrlParameter.Optional }
            );
        }
    }
}