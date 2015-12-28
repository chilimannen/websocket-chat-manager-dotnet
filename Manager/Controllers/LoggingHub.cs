using Manager.Models;
using Microsoft.AspNet.SignalR;
using Microsoft.ServiceBus.Messaging;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Dynamic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Web;

namespace Manager
{
    public class LoggingHub : Hub
    {
        public LoggingHub()
        {
            EventBus.Instance.subscribe(this);
        }
        
        public void Notify(String message)
        {
            Clients.All.notify(message);
        }
    }
}