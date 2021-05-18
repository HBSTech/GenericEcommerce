using CMS.Ecommerce;
using CMS.Globalization;
using CMS.Helpers;
using CMS.SiteProvider;
using Generic.Ecom.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Generic.Ecom.RepositoryLibrary
{
    public class CheckoutRepository : ICheckoutRepository
    {
        public ICountryInfoProvider CountryInfoProvider { get; }
        public IStateInfoProvider StateInfoProvider { get; }
        public IShippingOptionInfoProvider ShippingOptionInfoProvider { get; }
        public IPaymentOptionInfoProvider PaymentOptionInfoProvider { get; }
        public ICartRepository CartRepository { get; }
        public IEcommerceServiceOptions EcommerceServiceOptions { get; }
        public IShoppingService ShoppingService { get; }
        public IAddressInfoProvider AddressInfoProvider { get; }

        public CheckoutRepository(IShoppingService shoppingService, IAddressInfoProvider addressInfoProvider, ICountryInfoProvider countryInfoProvider, IStateInfoProvider stateInfoProvider, IShippingOptionInfoProvider shippingOptionInfoProvider, IPaymentOptionInfoProvider paymentOptionInfoProvider, ICartRepository cartRepository, IEcommerceServiceOptions ecommerceServiceOptions)
        {
            CountryInfoProvider = countryInfoProvider;
            StateInfoProvider = stateInfoProvider;
            ShippingOptionInfoProvider = shippingOptionInfoProvider;
            PaymentOptionInfoProvider = paymentOptionInfoProvider;
            CartRepository = cartRepository;
            EcommerceServiceOptions = ecommerceServiceOptions;
            ShoppingService = shoppingService;
            AddressInfoProvider = addressInfoProvider;
        }

        public CheckoutViewModel PrepareCheckout()
        {
            var cart = CartRepository.GetCartViewModel(true);
            return new CheckoutViewModel(cart);
        }

        public async Task<IEnumerable<SelectListItem>> GetCountries()
        {
            var countries = await CacheHelper.Cache(async () =>
            {
                return await CountryInfoProvider.Get().GetEnumerableTypedResultAsync();
            }, new CacheSettings(EcommerceServiceOptions.CacheMinutes(), nameof(GetCountries)));

            return countries.OrderByDescending(x => x.CountryDisplayName == "USA").Select(x => new SelectListItem(x.CountryDisplayName, x.CountryID.ToString()));
        }
        public async Task<IEnumerable<SelectListItem>> GetStates(int countryID)
        {
            var states = await CacheHelper.Cache(async () =>
            {
                return await StateInfoProvider.Get()
                .WhereEquals(nameof(StateInfo.CountryID), countryID)
                .GetEnumerableTypedResultAsync();
            }, new CacheSettings(EcommerceServiceOptions.CacheMinutes(), nameof(GetStates), countryID));

            return states.Select(x => new SelectListItem(x.StateDisplayName, x.StateID.ToString()));
        }

        public async Task<IEnumerable<SelectListItem>> GetAddresses()
        {
            var customer = ShoppingService.GetCurrentCustomer();
            if (customer != null)
            {
                var addresses = await CacheHelper.Cache(async (cs) =>
                {
                    return await AddressInfoProvider.Get()
                    .WhereEquals(nameof(AddressInfo.AddressCustomerID), customer.CustomerID)
                    .GetEnumerableTypedResultAsync();
                }, new CacheSettings(EcommerceServiceOptions.CacheMinutes(), nameof(GetAddresses), customer.CustomerID));
                var addressList = addresses.Select(x => new SelectListItem(x.AddressName, x.AddressID.ToString())).ToList();
                if (addressList.Count > 0)
                {
                    addressList.Insert(0, new SelectListItem("(New Address)", ""));
                }
                return addressList;
            }
            else
            {
                return null;
            }
        }

        public async Task<IEnumerable<SelectListItem>> GetShippingOptions()
        {
            var current = ShoppingService.GetShippingOption();
            var options = await CacheHelper.Cache(async () =>
            {
                return await ShippingOptionInfoProvider.GetBySite(SiteContext.CurrentSiteID, true).GetEnumerableTypedResultAsync();
            }, new CacheSettings(EcommerceServiceOptions.CacheMinutes(), nameof(GetShippingOptions), SiteContext.CurrentSiteID));

            return options.Select(x => new SelectListItem(x.ShippingOptionDisplayName, x.ShippingOptionID.ToString(), x.ShippingOptionID == current));
        }

        public async Task<IEnumerable<SelectListItem>> GetPaymentOptions()
        {
            var cart = CartRepository.GetCart();
            var current = cart.ShoppingCartPaymentOptionID;
            var options = await CacheHelper.Cache(async () =>
            {
                return await PaymentOptionInfoProvider.GetBySite(SiteContext.CurrentSiteID, true).GetEnumerableTypedResultAsync();
            }, new CacheSettings(EcommerceServiceOptions.CacheMinutes(), nameof(GetPaymentOptions), SiteContext.CurrentSiteID));

            var applicable = options.Where(x => CMS.Ecommerce.PaymentOptionInfoProvider.IsPaymentOptionApplicable(cart, x));

            return applicable.Select(x => new SelectListItem(x.PaymentOptionDisplayName, x.PaymentOptionID.ToString(), x.PaymentOptionID == current));
        }

        public async Task<AddressViewModel> GetAddress(int addressID)
        {
            var address = await AddressInfoProvider.GetAsync(addressID);
            return new AddressViewModel(address);
        }

        public async Task<AddressViewModel> GetBillingAddress()
        {
            var address = ShoppingService.GetBillingAddress();
            return new AddressViewModel(address);
        }

        public async Task<AddressViewModel> GetShippingAddress()
        {
            var address = ShoppingService.GetShippingAddress();
            return new AddressViewModel(address);
        }

        public async Task<CustomerViewModel> GetCustomer()
        {
            return new CustomerViewModel(ShoppingService.GetCurrentCustomer());
        }
    }
}
