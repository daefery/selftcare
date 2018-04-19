using System.Web;
using System.Web.Mvc;

namespace console
{
    public class FilterConfig
    {
        public static void RegisterGlobalFilters(GlobalFilterCollection filters)
        {
            filters.Add(new MyErrorFilter());
        }
    }

    public class MyErrorFilter : IExceptionFilter
    {
        public void OnException(ExceptionContext filterContext)
        {
            // TO DO: Investigate this class, there's conflict exception handler
            //filterContext.ExceptionHandled = true;
            //var vr = new ViewResult
            //{
            //    ViewName = "Error"
            //};
            //vr.ViewData.Model = filterContext.Exception;
            //filterContext.Result = vr;
        }
    }
}
