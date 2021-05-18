using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace Generic.Ecom.Models
{
    public class CartItemUpdateModel
    {
        public int ID { get; set; }


        public int SKUID { get; set; }


        [Range(0, int.MaxValue, ErrorMessage = "Type a number greater than 0 to the Quantity field.")]
        public int Quantity { get; set; }
    }
}
