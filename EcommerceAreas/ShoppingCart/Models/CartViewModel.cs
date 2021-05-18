using CMS.Ecommerce;
using Kentico.Content.Web.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Generic.Ecom.Models
{
    public class CartViewModel
    {
        private readonly string currencyFormatString;

        public decimal SubTotal { get; set; }

        public decimal TotalTax { get; set; }

        public decimal TotalShipping { get; set; }

        public decimal GrandTotal { get; set; }

        public bool IsEmpty { get; set; }

        public decimal RemainingAmountForFreeShipping { get; set; }

        public bool IsShippingNeeded { get; set; }

        public ShoppingCartInfo ShoppingCart { get; }

        public Dictionary<string, decimal> AppliedItemDiscounts { get; set; }
        public Dictionary<string, decimal> AppliedOrderDiscounts { get; set; }
        public IEnumerable<string> CouponCodes { get; set; }

        public IEnumerable<CartItemViewModel> CartItems { get; set; }

        public CartViewModel(ShoppingCartInfo cart)
        {
            ShoppingCart = cart;
            SubTotal = cart.TotalItemsPrice;
            TotalTax = cart.TotalTax;
            TotalShipping = cart.TotalShipping;
            GrandTotal = cart.GrandTotal;
            currencyFormatString = cart.Currency.CurrencyFormatString;
            IsEmpty = cart.IsEmpty;
            RemainingAmountForFreeShipping = cart.CalculateRemainingAmountForFreeShipping();
            IsShippingNeeded = cart.IsShippingNeeded;

            AppliedItemDiscounts = new Dictionary<string, decimal>();
            AppliedOrderDiscounts = new Dictionary<string, decimal>();

            CouponCodes = cart.CouponCodes.AllAppliedCodes.Select(x=>x.Code);

            CartItems = cart.CartItems.Select((cartItemInfo) =>
            {
                return new CartItemViewModel(currencyFormatString)
                {
                    CartItemID = cartItemInfo.CartItemID,
                    CartItemUnits = cartItemInfo.CartItemUnits,
                    SKUID = cartItemInfo.SKUID,
                    SKUImagePath = string.IsNullOrEmpty(cartItemInfo.SKU.SKUImagePath) ? null : new FileUrl(cartItemInfo.SKU.SKUImagePath, true).WithSizeConstraint(SizeConstraint.MaxWidthOrHeight(70)).RelativePath,
                    SKUName = cartItemInfo.SKU.SKUName,
                    TotalPrice = cartItemInfo.TotalPrice,
                    CustomData = cartItemInfo.CartItemCustomData
                };
            });
        }

        public string FormatPrice(decimal price)
        {
            return string.Format(currencyFormatString, price);
        }
    }
}
