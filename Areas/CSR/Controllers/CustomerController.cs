using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace console.Areas.CSR.Controllers
{
    public class CustomerController : Controller
    {
        //
        // GET: /CSR/View/
               
        /// <summary>
        /// Critique:
        /// 1. You do not need to specify file location within your view using directory location
        /// If you every need to specify a view simply return View("Action" , "Controller" , new { area = "AREANAME"});
        /// this is much cleaner syntax than return View("~/Areas/CSR/Views/.....")
        /// 2. I have removed the nested folders within your view directory. MVC does a great job of seperating your
        /// views when adding a new View no need to create additional folders unless you are working with shared views or
        /// layouts.
        /// 3. Naming conventions for instance you named your controller initially "View" so the folder structure MVC has
        /// Models, Views and Controllers you created a vague distinction with your controller name Views/View/Index.cshtml
        /// 4. 
        /// </summary>
        /// <returns></returns>

        public ActionResult App() { return View("/Areas/CSR/Views/Customer/App.cshtml"); }
	}
}