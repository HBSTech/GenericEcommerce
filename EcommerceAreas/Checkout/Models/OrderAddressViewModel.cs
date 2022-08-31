using CMS.Ecommerce;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace Generic.Ecom.Models
{
    public class OrderAddressViewModel
    {
       public Guid OrderGuid { get; set; }
        public AddressViewModel Address { get; set; }  
    }
}
