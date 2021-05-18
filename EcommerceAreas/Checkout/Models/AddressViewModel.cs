using CMS.Ecommerce;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace Generic.Ecom.Models
{
    public class AddressViewModel
    {
        [Required]
        [Display(Name = "Address line")]
        [MaxLength(100, ErrorMessage = "Maximum allowed length of the input text is {1}")]
        public string AddressLine1 { get; set; }



        [Display(Name = "Address line 2")]
        [MaxLength(100, ErrorMessage = "Maximum allowed length of the input text is {1}")]
        public string AddressLine2 { get; set; }


        [Required]
        [Display(Name = "City")]
        [MaxLength(100, ErrorMessage = "Maximum allowed length of the input text is {1}")]
        public string AddressCity { get; set; }


        [Required]
        [Display(Name = "Postal code")]
        [MaxLength(20, ErrorMessage = "Maximum allowed length of the input text is {1}")]
        public string AddressPostalCode { get; set; }


        public int AddressStateID { get; set; }


        public int AddressCountryID { get; set; }

        public int? AddressID { get; set; }


        public AddressViewModel()
        {
        }

        public AddressViewModel(AddressInfo address)
        {
            if (address != null)
            {
                AddressLine1 = address.AddressLine1;
                AddressLine2 = address.AddressLine2;
                AddressCity = address.AddressCity;
                AddressPostalCode = address.AddressZip;
                AddressStateID = address.AddressStateID;
                AddressCountryID = address.AddressCountryID;
                AddressID = address.AddressID;
            }
        }


        public void ApplyTo(AddressInfo address)
        {
            address.AddressLine1 = AddressLine1;
            address.AddressLine2 = AddressLine2;
            address.AddressCity = AddressCity;
            address.AddressZip = AddressPostalCode;
            address.AddressCountryID = AddressCountryID;
            address.AddressStateID = AddressStateID;
        }
    }
}
