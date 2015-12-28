using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Manager.Models
{
    public class EventBus
    {
        private static readonly EventBus instance = new EventBus();
        private static LoggingHub hub = null;

        private EventBus() { }

        public static EventBus Instance
        {
            get
            {
                return instance;
            }
        }

        public void subscribe(LoggingHub subscriber)
        {
            EventBus.hub = subscriber;
        }

        public void put(String message)
        {
            if (EventBus.hub != null)
                EventBus.hub.Notify(message);
        }
    }
}