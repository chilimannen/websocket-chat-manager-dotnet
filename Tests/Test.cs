using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Manager.Models;
using System.Threading.Tasks;
using System.Threading;
using Manager;

namespace Tests
{
    [TestClass]
    public class Test : IEventListener
    {
        private string data = null;

        [TestMethod]
        public void ShouldReceiveMessageFromHub()
        {
            new MvcApplication().StartEventListener();
            EventBus.Instance.subscribe(this);
            Thread.Sleep(3000);
            Assert.AreNotEqual(data, null);
        }

        public void Notify(string message)
        {
            data = message;
        }
    }
}
