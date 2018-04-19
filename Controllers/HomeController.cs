using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace console.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            //for demo
            //return RedirectToAction("app", "customer", new { area = "public" });
            return RedirectToAction("Index", "Login", new { area = "Authorization" });
        }
    }
}