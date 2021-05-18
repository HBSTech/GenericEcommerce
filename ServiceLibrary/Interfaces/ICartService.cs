using Generic.Ecom.Models;
using CMS.Ecommerce;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Generic.Ecom.ServiceLibrary
{
    public interface ICartService
    {
        Task<ShoppingCartItemInfo> AddToCart(AddToCartViewModel cartViewModel);
        void RemoveItem(int itemID);
        Task<string> UpdateItemQuantity(int itemID, int itemQuantity);
    }
}