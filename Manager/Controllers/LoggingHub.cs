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


/// <summary>
/// Emits logging data to a SignalR hub.
/// </summary>
namespace Manager
{
    public class LoggingHub : Hub, IEventListener
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