using Manager.Models;
using Microsoft.Owin;
using Microsoft.ServiceBus.Messaging;
using Owin;
using System;
using System.Diagnostics;

[assembly: OwinStartupAttribute(typeof(Manager.Startup))]
namespace Manager
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
            app.MapSignalR();
        }

    }
}
