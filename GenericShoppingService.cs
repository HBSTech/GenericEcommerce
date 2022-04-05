using Generic.Ecom;
using CMS;
using CMS.DataEngine;
using CMS.Ecommerce;
using CMS.Globalization;
using CMS.SiteProvider;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using CMS.Helpers;
using System.Text.Json;

[assembly: RegisterImplementation(typeof(IShoppingService), typeof(GenericShoppingService), Priority = CMS.Core.RegistrationPriority.SystemDefault)]

namespace Generic.Ecom
{
    public class GenericShoppingService : ShoppingService
    {
        private readonly ICartItemChecker cartItemChecker;

        public IEcommerceServiceOptions EcommerceServiceOptions { get; }

        public GenericShoppingService(IEcommerceActivityLogger ecommerceActivityLogger, ICartItemChecker cartItemChecker, ICurrentShoppingCartService currentShoppingCartService, ICustomerShoppingService customerShoppingService, IShoppingCartAdapterService shoppingCartAdapterService, IShippingPriceService shippingPriceService, IAddressInfoProvider addressInfoProvider, ICustomerInfoProvider customerInfoProvider, IPaymentOptionInfoProvider paymentOptionInfoProvider, IShippingOptionInfoProvider shippingOptionInfoProvider, IShoppingCartInfoProvider shoppingCartInfoProvider, IShoppingCartItemInfoProvider shoppingCartItemInfoProvider, ISKUInfoProvider skuInfoProvider, ICountryInfoProvider countryInfoProvider, IStateInfoProvider stateInfoProvider, IEcommerceServiceOptions ecommerceServiceOptions)

			: base(ecommerceActivityLogger, cartItemChecker, currentShoppingCartService, customerShoppingService, shoppingCartAdapterService, shippingPriceService, addressInfoProvider, customerInfoProvider, paymentOptionInfoProvider, shippingOptionInfoProvider, shoppingCartInfoProvider, shoppingCartItemInfoProvider, skuInfoProvider, countryInfoProvider, stateInfoProvider)
        {
            this.cartItemChecker = cartItemChecker;
            EcommerceServiceOptions = ecommerceServiceOptions;
        }

        public override ShoppingCartItemInfo AddItemToCart(ShoppingCartItemParameters itemParameters)
        {
			if (itemParameters == null)
			{
				throw new ArgumentNullException("itemParameters");
			}
			if (itemParameters.Quantity <= 0)
			{
				return null;
			}
			ShoppingCartInfo currentShoppingCart = GetCurrentShoppingCart();
			ValidateAddItemToCart(currentShoppingCart, itemParameters);
			if (!cartItemChecker.CheckNewItem(itemParameters, currentShoppingCart))
			{
				return null;
			}
			if (currentShoppingCart.ShoppingCartID == 0)
			{
				SaveCart();
			}

            var useCustomOptions = EcommerceServiceOptions.UseCustomProductFields(itemParameters);
            ShoppingCartItemInfo shoppingCartItemInfo;
            if (!useCustomOptions)
            {
                shoppingCartItemInfo = ShoppingCartInfoProvider.SetShoppingCartItem(currentShoppingCart, itemParameters);
            }
            else
            {
                shoppingCartItemInfo = GetShoppingCartItem(currentShoppingCart, itemParameters);
                if (shoppingCartItemInfo != null)
                {
                    UpdateShoppingCartItem(shoppingCartItemInfo, itemParameters);
                }
                else
                {
                    shoppingCartItemInfo = AddShoppingCartItem(currentShoppingCart, itemParameters);
                }
            }

			shoppingCartItemInfo.CartItemAutoAddedUnits = 0;
			SetCartItem(shoppingCartItemInfo);
			currentShoppingCart.Evaluate();
			LogProductAddedToCartActivity(shoppingCartItemInfo);
			EcommerceEvents.ProductAddedToShoppingCart.StartEvent(shoppingCartItemInfo);

			return shoppingCartItemInfo;
        }

        #region PrivateFunctions

        /// <summary>
        /// Returns specified shopping cart item from the given shopping cart object. If such item is not found, null is returned.
        /// By default shopping cart item is searched according to the product SKUID and SKUIDs of its product options.
        /// </summary>
        /// <param name="cart">Shopping cart</param>
        /// <param name="itemParams">Parameters of the shopping cart item which should be used to perform the search.</param>
        protected virtual ShoppingCartItemInfo GetShoppingCartItem(ShoppingCartInfo cart, ShoppingCartItemParameters itemParams)
        {
            foreach (ShoppingCartItemInfo cartItem in cart.CartContentItems)
            {
                // Shopping cart item with specified SKUID found, skip bundle item
                if (cartItem.SKUID == itemParams.SKUID)
                {

                    int CustomParamCount = itemParams.CustomParameters?.Count ?? 0;
                    int CartParamCount = cartItem.CartItemCustomData?.ColumnNames.Count ?? 0;
                    if (CustomParamCount != CartParamCount)
                    {
                        continue;
                    }
                    if (CustomParamCount > 0) {
                        if (itemParams.CustomParameters.Keys.Cast<object>().Select(x => x.ToString()).Intersect(cartItem.CartItemCustomData.ColumnNames, StringComparer.InvariantCultureIgnoreCase).Count() != itemParams.CustomParameters.Keys.Count)
                        {
                            continue;
                        }
                        // Same keys
                        var different = 0;
                        foreach (var key in itemParams.CustomParameters.Keys)
                        {
                            string objValue = itemParams.CustomParameters[key].ToString();
                            string firstObj = cartItem.CartItemCustomData.GetValue(key?.ToString()).ToString();
                            if (!firstObj.Equals(objValue))
                            {
                                different++;
                            }
                        }
                        if (different > 0)
                        {
                            continue;
                        }
                    }

                    // Looking for product with product options
                    if (itemParams.ProductOptions.Count > 0)
                    {
                        int optionCount = 0;
                        int foundOptionCount = 0;

                        foreach (ShoppingCartItemParameters option in itemParams.ProductOptions)
                        {
                            int optionSKUId = option.SKUID;

                            if (optionSKUId > 0)
                            {
                                optionCount++;

                                // Try to find product options
                                foreach (ShoppingCartItemInfo cartOption in cartItem.ProductOptions)
                                {
                                    if ((cartOption.SKUID == optionSKUId) && ((cartOption.SKU.SKUProductType != SKUProductTypeEnum.Text) || (cartOption.CartItemText == option.Text)))
                                    {
                                        foundOptionCount++;
                                        break;
                                    }
                                }
                            }
                        }

                        // Product with such product options found
                        if ((optionCount == foundOptionCount) && (cartItem.ProductOptions.Count == foundOptionCount))
                        {
                            return cartItem;
                        }
                    }
                    // Looking for product without product options
                    else if (cartItem.ProductOptions.Count == 0)
                    {
                        // Product without product options found
                        return cartItem;
                    }
                }
            }

            return null;
        }

        /// <summary>
        /// Updates shopping cart item in the specified shopping cart object. By default only units of the specified shopping cart item and units of its product options are updated.
        /// </summary>
        /// <param name="item">Shopping cart item to be updated.</param>
        /// <param name="itemParams">Parameters of the shopping cart item which should be used to perform the update.
        /// By default only Quantity parameter is used.</param>
        protected virtual void UpdateShoppingCartItem(ShoppingCartItemInfo item, ShoppingCartItemParameters itemParams)
        {
            if (item == null)
            {
                return;
            }
            int quantity = itemParams.Quantity;
            if (999999999 - item.CartItemUnits < quantity)
            {
                return;
            }
            item.CartItemUnits += quantity;
            foreach (ShoppingCartItemInfo productOption in item.ProductOptions)
            {
                productOption.CartItemUnits += quantity;
            }
            foreach (ShoppingCartItemInfo bundleItem in item.BundleItems)
            {
                bundleItem.CartItemUnits += quantity;
            }
        }

        /// <summary>
        /// Adds new item to the shopping cart object and returns its object.
        /// </summary>
        /// <param name="cart">Shopping cart</param>
        /// <param name="itemParams">Parameters from which the new shopping cart item is initialized.</param>
        protected virtual ShoppingCartItemInfo AddShoppingCartItem(ShoppingCartInfo cart, ShoppingCartItemParameters itemParams)
        {
            if (cart == null)
            {
                return null;
            }
            ShoppingCartItemInfo shoppingCartItemInfo = new ShoppingCartItemInfo();
            shoppingCartItemInfo.SKUID = itemParams.SKUID;
            shoppingCartItemInfo.CartItemUnits = itemParams.Quantity;
            shoppingCartItemInfo.CartItemText = itemParams.Text;
            shoppingCartItemInfo.ShoppingCart = cart;
            foreach(var itemKey in itemParams.CustomParameters.Keys)
            {
                shoppingCartItemInfo.CartItemCustomData.SetValue(itemKey?.ToString(), itemParams.CustomParameters[itemKey]);
            }
            if (shoppingCartItemInfo.SKU == null)
            {
                return null;
            }
            ShoppingCartInfoProvider.AddShoppingCartItem(cart, shoppingCartItemInfo);
            foreach (ShoppingCartItemParameters productOption in itemParams.ProductOptions)
            {
                if (productOption.SKUID > 0)
                {
                    ShoppingCartItemInfo item = new ShoppingCartItemInfo
                    {
                        SKUID = productOption.SKUID,
                        CartItemUnits = itemParams.Quantity,
                        CartItemParentGUID = shoppingCartItemInfo.CartItemGUID,
                        CartItemText = productOption.Text
                    };
                    shoppingCartItemInfo.ProductOptions.Add(item);
                    ShoppingCartInfoProvider.AddShoppingCartItem(cart, item);
                }
            }
            foreach (SKUInfo item3 in SKUInfoProvider.GetBundleItems(itemParams.SKUID).OrderBy("SKUID"))
            {
                ShoppingCartItemInfo item2 = new ShoppingCartItemInfo
                {
                    SKU = item3,
                    SKUID = item3.SKUID,
                    CartItemUnits = itemParams.Quantity,
                    CartItemBundleGUID = shoppingCartItemInfo.CartItemGUID
                };
                shoppingCartItemInfo.BundleItems.Add(item2);
                ShoppingCartInfoProvider.AddShoppingCartItem(cart, item2);
            }
            return shoppingCartItemInfo;
        }
    }
    #endregion
}
