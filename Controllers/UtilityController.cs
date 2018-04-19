using System;
using System.Globalization;
using System.Web.Mvc;

namespace console.Controllers
{
    public class UtilityController : Controller
    {
        /// <summary>
        /// This method is used to generates the SessionID
        /// </summary>
        /// <returns>JSON</returns>
        [HttpGet]
        public ActionResult GetSessionId()
        {
            // generate session id
            return Json(new
            {
                SessionId = Guid.NewGuid(),
                CreationDate = DateTime.UtcNow.ToString(CultureInfo.CreateSpecificCulture("en-US"))
            }, JsonRequestBehavior.AllowGet);
        }
    }
}