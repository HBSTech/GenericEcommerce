using Generic.Ecom.Models;
using CMS.Ecommerce;
using CMS.Helpers;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Generic.Ecom.RepositoryLibrary;
using System.Linq;

namespace Generic.Ecom.ServiceLibrary
{
    public class CartService : ICartService
    {
        public IShoppingService ShoppingService { get; }
        public ICartRepository CartRepository { get; }
        public ISKUInfoProvider SKUInfoProvider { get; }
        public IShoppingCartItemInfoProvider ShoppingCartItemInfoProvider { get; }
        public IProgressiveCache ProgressiveCache { get; }

        public CartService(IShoppingService shoppingService, ICartRepository cartRepository, ISKUInfoProvider sKUInfoProvider, IShoppingCartItemInfoProvider shoppingCartItemInfoProvider, IProgressiveCache progressiveCache)
        {
            ShoppingService = shoppingService;
            CartRepository = cartRepository;
            SKUInfoProvider = sKUInfoProvider;
            ShoppingCartItemInfoProvider = shoppingCartItemInfoProvider;
            ProgressiveCache = progressiveCache;
        }

        public async Task<ShoppingCartItemInfo> AddToCart(AddToCartViewModel cartViewModel)
        {

            var sku = await ProgressiveCache.LoadAsync(async (cs) =>
            {
                var item = await SKUInfoProvider.GetAsync(cartViewModel.SKUGUID);
                return item;
            }, new CacheSettings(30, "AddToCart", cartViewModel.SKUGUID));

            var shoppingCartItem = new ShoppingCartItemParameters(sku.SKUID, cartViewModel.Quantity);
            if (cartViewModel.CustomFields != null)
            {
                foreach(KeyValuePair<string, object> item in cartViewModel.CustomFields)
                {
                    shoppingCartItem.CustomParameters.Add(item.Key.Replace("customField", "").ToLowerInvariant(), item.Value);
                }
            }

            return ShoppingService.AddItemToCart(shoppingCartItem);
        }

        public async Task<string> UpdateItemQuantity(int itemID, int itemQuantity)
        {
            ShoppingService.UpdateItemQuantity(itemID, itemQuantity);

            var cart = CartRepository.GetCart();

            var item = cart.CartItems.Where(x=>x.CartItemID == itemID).FirstOrDefault();

            var currency = cart.Currency.CurrencyFormatString;

            return string.Format(currency, item?.TotalPrice);
        }

        public void RemoveItem(int itemID)
        {
            ShoppingService.RemoveItemFromCart(itemID);
        }
    }
}
