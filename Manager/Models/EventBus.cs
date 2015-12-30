using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

/// <summary>
/// Handles the transfer of logging data from the consumer
/// to client websockets.
/// </summary>
namespace Manager.Models
{
    public class EventBus
    {
        private static readonly EventBus instance = new EventBus();
        private static IEventListener listener = null;

        private EventBus() { }

        public static EventBus Instance
        {
            get
            {
                return instance;
            }
        }

        public void subscribe(IEventListener subscriber)
        {
            EventBus.listener = subscriber;
        }

        public void put(String message)
        {
            if (EventBus.listener != null)
                EventBus.listener.Notify(message);
        }
    }
}