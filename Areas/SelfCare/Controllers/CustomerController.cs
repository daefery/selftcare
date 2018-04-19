using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace console.Areas.SelfCare.Controllers
{
    public class CustomerController : Controller
    {
        //
        // GET: /SelfCare/Customer/
        public ActionResult App()
        {
            return View("/Areas/SelfCare/Views/Customer/App.cshtml");
        }
        public ActionResult Registration()
        {
            return View();
        }
        public ActionResult Confirmation()
        {
            return View();
        }
	}
}