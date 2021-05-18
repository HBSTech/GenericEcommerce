using CMS.Ecommerce;
using Generic.Ecom.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Generic.Ecom.RepositoryLibrary
{
    public interface ICartRepository
    {
        bool CartIsEmpty();
        ShoppingCartInfo GetCart();
        CartViewModel GetCartViewModel(bool includeDiscounts);
        string GetCurrencyString();
        Task<ShoppingCartItemInfo> GetItem(int itemID);
    }
}