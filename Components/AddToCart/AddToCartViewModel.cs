using System;
using System.Collections.Generic;
using System.Text;

namespace Generic.Ecom.Models
{
    public class AddToCartViewModel
    {
        public Guid SKUGUID { get; set; }
        public int Quantity { get; set; }
#nullable enable
        public Dictionary<string, object>? CustomFields { get; set; }
#nullable disable

    }
}
