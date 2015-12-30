using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Manager.Models
{
    public interface IEventListener
    {
        void Notify(string message);
    }
}
