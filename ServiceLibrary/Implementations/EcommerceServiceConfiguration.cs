namespace Generic.Ecom
{
    public class EcommerceServiceConfiguration
    {
        /// <summary>
        /// If set to true, then cart items with custom data will be considered unique items.  
        /// Default (false) will increment quantity even if custom data fields are different.
        /// </summary>
        public bool UseCustomProductFields { get; set; } = false;

        /// <summary>
        /// Specify the minutes to store the ecommerce cached items.
        /// </summary>
        public int CacheMinutes { get; set; } = 30;

        public string CheckoutUrl { get; set; } = "/Checkout";

    }
}