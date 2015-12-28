using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Manager.Controllers
{
    [RequireHttps]
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            if (Request.LogonUserIdentity.IsAuthenticated)
                return View("Dashboard");
            else
                return View();
        }

      
        [Authorize]
        public ActionResult Dashboard()
        {
            return View();
        }
    }
}