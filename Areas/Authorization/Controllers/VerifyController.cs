using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace console.Areas.Authorization.Controllers
{
    public class VerifyController : Controller
    {
        //
        // GET: /Authorization/Verify/
        public ActionResult VerifyCode()
        {
            return View();
        }

        public ActionResult SetPassword()
        {
            return View();
        }
	}
}