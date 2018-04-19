using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace console.Areas.Authorization.Controllers
{
    public class RecoverPasswordController : Controller
    {
        // GET: Authorization/RecoverPassword
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Confirmation()
        {
            return View();
        }
    }
}