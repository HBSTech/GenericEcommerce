using Generic.Ecom.Models;
using Generic.Ecom.RepositoryLibrary;
using System;
using System.Collections.Generic;
using System.Text;

namespace Generic.Ecom.Models
{
    public class CheckoutViewModel
    {
        public CustomerViewModel Customer { get; }
        public AddressViewModel ShippingAddress { get; }
        public AddressViewModel BillingAddress { get; }
        public CartViewModel ShoppingCart { get; }

        public CheckoutViewModel()
        {
        }
        public CheckoutViewModel(CartViewModel shoppingCart)
        {
            if (shoppingCart.ShoppingCart.Customer != null) {
                Customer = new CustomerViewModel(shoppingCart.ShoppingCart.Customer);

                ShippingAddress = shoppingCart.ShoppingCart.ShoppingCartShippingAddress != null ? new AddressViewModel(shoppingCart.ShoppingCart.ShoppingCartShippingAddress) : null;

                BillingAddress = shoppingCart.ShoppingCart.ShoppingCartBillingAddress != null ? new AddressViewModel(shoppingCart.ShoppingCart.ShoppingCartBillingAddress) : null;
            }

            ShoppingCart = shoppingCart;
        }
    }
}
