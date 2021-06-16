using CMS.Ecommerce;
using CMS.Helpers;
using Generic.Ecom.Models;
using Generic.Ecom.ServiceLibrary;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Generic.Ecom.RepositoryLibrary
{
    public class CartRepository : ICartRepository
    {
        public IShoppingService ShoppingService { get; }
        public IShoppingCartItemInfoProvider ShoppingCartItemInfoProvider { get; }
        public IEcommerceServiceOptions EcommerceServiceOptions { get; }

        public CartRepository(IShoppingService shoppingService, IShoppingCartItemInfoProvider shoppingCartItemInfoProvider, IEcommerceServiceOptions ecommerceServiceOptions)
        {
            ShoppingService = shoppingService;
            ShoppingCartItemInfoProvider = shoppingCartItemInfoProvider;
            EcommerceServiceOptions = ecommerceServiceOptions;
        }

        public async Task<ShoppingCartItemInfo> GetItem(int itemID)
        {
            return await ShoppingCartItemInfoProvider.GetAsync(itemID);
        }

        public string GetCurrencyString()
        {
            var cart = GetCart();
            var currecyCode = cart.Currency.CurrencyFormatString;
            return currecyCode;
        }

        public ShoppingCartInfo GetCart()
        {
            return ShoppingService.GetCurrentShoppingCart();
        }

        public CartViewModel GetCartViewModel(bool includeDiscounts)
        {
            var cart = GetCart(); 

            var model = new CartViewModel(cart);
            model.ThankYouUrl = EcommerceServiceOptions.ThankYouUrl();

            if (includeDiscounts && !cart.IsEmpty)
            {
                ApplyItemDiscounts(model, includeDiscounts);
                ApplyOrderDiscounts(model, includeDiscounts);
            }
            return model;
        }

        public bool CartIsEmpty()
        {
            return GetCart().IsEmpty;
        }

        public int CartQuantity()
        {
            return GetCart().TotalUnits;
        }

        public void ApplyItemDiscounts(CartViewModel model, bool includeDiscounts)
        {
            var cart = model.ShoppingCart;
            if (includeDiscounts)
            {
                var totalDiscounts = new List<KeyValuePair<string, decimal>>();
                var unitDiscounts = cart.CartItems.SelectMany(x => x.UnitDiscountSummary.Select(u => new KeyValuePair<string, decimal>(u.Name, u.Value)));
                var discountSummary = cart.CartItems.SelectMany(x => x.DiscountSummary.Select(u => new KeyValuePair<string, decimal>(u.Name, u.Value)));

                totalDiscounts.AddRange(unitDiscounts);
                totalDiscounts.AddRange(discountSummary);

                model.AppliedItemDiscounts = totalDiscounts.GroupBy(x => x.Key).ToDictionary(x => x.Key, y => y.Sum(s => s.Value));
            }
            else
            {
                model.AppliedOrderDiscounts = new Dictionary<string, decimal>();
            }
}

        public void ApplyOrderDiscounts(CartViewModel model, bool includeDiscounts)
        {
            var cart = model.ShoppingCart;
            if (includeDiscounts)
            {
                var totalDiscounts = new List<KeyValuePair<string, decimal>>();
                var paymentSummary = cart.OtherPaymentsSummary.Select(x => new KeyValuePair<string, decimal>(x.Name, x.Value));
                var orderDiscountSummary = cart.OrderDiscountSummary.Select(x => new KeyValuePair<string, decimal>(x.Name, x.Value));
                totalDiscounts.AddRange(orderDiscountSummary);
                totalDiscounts.AddRange(paymentSummary);

                model.AppliedOrderDiscounts = totalDiscounts.GroupBy(x => x.Key).ToDictionary(x => x.Key, y => y.Sum(s => s.Value));
            }
            else
            {
                model.AppliedOrderDiscounts = new Dictionary<string, decimal>();
            }
        }
    }
}
