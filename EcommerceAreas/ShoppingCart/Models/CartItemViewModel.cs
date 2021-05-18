using CMS.Ecommerce;
using CMS.Helpers;
using Kentico.Content.Web.Mvc;
using System;
using System.Collections.Generic;
using System.Text;

namespace Generic.Ecom.Models
{
    public class CartItemViewModel
    {
        public CartItemViewModel()
        {

        }
        public CartItemViewModel(string currencyFormatString)
        {
            CurrencyFormatString = currencyFormatString;
        }
        public int SKUID { get; set; }

        public string SKUImagePath { get; set; }

        public string SKUName { get; set; }

        public string SKUNumber { get; set; }

        public int CartItemID { get; set; }

        public int CartItemUnits { get; set; }

        public decimal TotalPrice { get; set; }

        public string FormattedPrice { get { return FormatPrice(TotalPrice); } }

        public Dictionary<string, string> CustomOptions { get { return GetCustomOptions(); } }

        public ContainerCustomData CustomData { get; set; }
        private string CurrencyFormatString { get; }

        public CartItemViewModel(ShoppingCartItemInfo shoppingCartItem, string currencyFormatString)
        {
            CartItemID = shoppingCartItem.CartItemID;
            CartItemUnits = shoppingCartItem.CartItemUnits;
            SKUID = shoppingCartItem.SKUID;
            SKUImagePath = string.IsNullOrEmpty(shoppingCartItem.SKU.SKUImagePath) ? null : new FileUrl(shoppingCartItem.SKU.SKUImagePath, true).WithSizeConstraint(SizeConstraint.MaxWidthOrHeight(70)).RelativePath;
            SKUName = shoppingCartItem.SKU.SKUName;
            SKUNumber = shoppingCartItem.SKU.SKUNumber;
            TotalPrice = shoppingCartItem.TotalPrice;
            CustomData = shoppingCartItem.CartItemCustomData;
            CurrencyFormatString = currencyFormatString;
        }

        private string FormatPrice(decimal price)
        {
            return string.Format(CurrencyFormatString, price);
        }

        private Dictionary<string, string> GetCustomOptions()
        {
            Dictionary<string, string> list = new Dictionary<string, string>();
            for(var i = 0; i < CustomData.ColumnNames.Count; i++)
            {
                var column = CustomData.ColumnNames[i];
                list.Add(column.Replace("customField", ""), CustomData.GetValue(column)?.ToString());

            }
            return list;
        }
    }
}
