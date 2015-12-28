using Microsoft.ServiceBus.Messaging;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading;
using System.Web;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;

namespace Manager
{
    public class MvcApplication : System.Web.HttpApplication
    {

        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);
            StartEventListener();
        }

        private void StartEventListener()
        {
            Trace.WriteLine("INIT");
            string eventHubConnectionString = "Endpoint=sb://websock.servicebus.windows.net/;SharedAccessKeyName=LogReader;SharedAccessKey=zGAx5SuwRsXh0Hw0AIrK1AXsJtzfw6tEMcDPHnd435E=";
            string eventHubName = "logging";
            string storageAccountName = "websockmanager";
            string storageAccountKey = "IK1Z+EAm6JjzVFph5l39w1UNb/iupbr6iVxDd4GaQPaZ/0DQsBaoBxNzSShnb7Kw7SpB+R8cLlg/ChaQwUMn1g==";
            string storageConnectionString = string.Format("DefaultEndpointsProtocol=https;AccountName={0};AccountKey={1}", storageAccountName, storageAccountKey);

            string eventProcessorHostName = Guid.NewGuid().ToString();
            EventProcessorHost processor = new EventProcessorHost(eventProcessorHostName, eventHubName, EventHubConsumerGroup.DefaultGroupName, eventHubConnectionString, storageConnectionString);
            processor.RegisterEventProcessorAsync<EventListener>().Wait();
        }
    }
}
