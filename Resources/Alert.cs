using System;
using System.Collections.Generic;
using System.Text;

namespace Generic.Ecom.Resources
{
    public class Alert
    {
        public Alert(string message, AlertType type = AlertType.Success)
        {
            Message = message;
            Type = type;
        }
        public Alert(IEnumerable<string> messages, AlertType type = AlertType.Success)
        {
            Message = string.Join(", ", messages);
            Type = type;
        }

        public string Message { get; }
        public AlertType Type { get; }
    }
    public enum AlertType
    {
        Success,
        Error
    }
}
