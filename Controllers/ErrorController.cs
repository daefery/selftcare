using System.Web.Mvc;

namespace console.Controllers
{
    /// <summary>
    /// This class is used to handle errors
    /// </summary>
    public class ErrorController : Controller
    {
        /// <summary>
        /// This method is used to handle errors that come from Application_Error in global asax when session state is unreacheable
        /// </summary>
        /// <returns>ActionResult</returns>
        public ActionResult Index()
        {
            return Redirect("~/Templates/ErrorPage/InternalServerError.html");
        }

        /// <summary>
        /// This method is used to handle http errors 400 in global asax when session state is unreacheable
        /// </summary>
        /// <returns>ActionResult</returns>
        public ActionResult BadRequest()
        {
            return Redirect("~/Templates/ErrorPage/BadRequest.html");
        }

        /// <summary>
        /// This method is used to handle http errors 404 in global asax when session state is unreacheable
        /// </summary>
        /// <returns>ActionResult</returns>
        public ActionResult NotFound()
        {
            return Redirect("~/Templates/ErrorPage/NotFound.html");
        }
    }
}