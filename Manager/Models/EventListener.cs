using Manager.Models;
using Microsoft.AspNet.SignalR;
using Microsoft.ServiceBus.Messaging;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

/// <summary>
/// Listens for events from an Azure event hub.
/// </summary>
namespace Manager
{
    
    class EventListener : IEventProcessor
    {
        private Stopwatch checkpointStopWatch;


        async Task IEventProcessor.CloseAsync(PartitionContext context, CloseReason reason)
        {
            if (reason == CloseReason.Shutdown)
            {
                await context.CheckpointAsync();
            }
        }

        Task IEventProcessor.OpenAsync(PartitionContext context)
        {
            this.checkpointStopWatch = new Stopwatch();
            this.checkpointStopWatch.Start();
            return Task.FromResult<object>(null);
        }

        async Task IEventProcessor.ProcessEventsAsync(PartitionContext context, IEnumerable<EventData> messages)
        {
            foreach (EventData eventData in messages)
            {
                string data = Encoding.UTF8.GetString(eventData.GetBytes());
                EventBus.Instance.put(data);
                Trace.WriteLine(data);
            }

            if (this.checkpointStopWatch.Elapsed > TimeSpan.FromSeconds(30))
            {
                await context.CheckpointAsync();
                this.checkpointStopWatch.Restart();
            }
        }
    }
}
