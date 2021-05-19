using CMS.Ecommerce;

namespace Generic.Ecom
{
    public interface IEcommerceServiceOptions
    {
        bool UseCustomProductFields(ShoppingCartItemParameters itemParameters);

        int CacheMinutes();
        string CheckoutUrl();
        string ThankYouUrl();
    }
}