using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace console.Areas.Public.Controllers
{
    public class customerController : Controller
    {
        //
        // GET: /Public/customer/
        public ActionResult app()
        {
           return View("/Areas/Public/Views/customer/app.cshtml");
        }
	}
}