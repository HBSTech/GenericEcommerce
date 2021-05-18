using CMS.Ecommerce;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.Mvc.Rendering;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace Generic.Ecom.Models
{
    public class PaymentMethodViewModel
    {
        [Required(ErrorMessage = "Select payment method")]
        [Display(Name = "How would you like to pay?")]
        public int PaymentMethodID { get; set; }

        public PaymentMethodViewModel()
        {
        }


        public PaymentMethodViewModel(PaymentOptionInfo paymentMethod)
        {
            if (paymentMethod != null)
            {
                PaymentMethodID = paymentMethod.PaymentOptionID;
            }
        }
    }
}
