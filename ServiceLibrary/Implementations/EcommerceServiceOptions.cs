using CMS.Ecommerce;
using System;
using System.Collections.Generic;
using System.Text;

namespace Generic.Ecom
{
    public class EcommerceServiceOptions : IEcommerceServiceOptions
    {
        public EcommerceServiceOptions(EcommerceServiceConfiguration configuration)
        {
            Configuration = configuration;
        }

        private EcommerceServiceConfiguration Configuration { get; }

        public int CacheMinutes()
        {
            return Configuration.CacheMinutes;
        }

        public bool UseCustomProductFields(ShoppingCartItemParameters itemParameters)
        {
            return Configuration.UseCustomProductFields;
        }

        public string CheckoutUrl()
        {
            return Configuration.CheckoutUrl;
        }
    }
}
