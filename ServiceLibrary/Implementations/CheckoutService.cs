using CMS.Core;
using CMS.Ecommerce;
using CMS.Globalization;
using Generic.Ecom.Models;
using Generic.Ecom.RepositoryLibrary;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Generic.Ecom.ServiceLibrary
{
    public class CheckoutService : ICheckoutService
    {
        public IShoppingService ShoppingService { get; }
        public IAddressInfoProvider AddressInfoProvider { get; }
        public ICartRepository CartRepository { get; }
        public ISKUInfoProvider SKUInfoProvider { get; }
        public ICountryInfoProvider CountryInfoProvider { get; }
        public IStateInfoProvider StateInfoProvider { get; }
        public ICustomerInfoProvider CustomerInfoProvider { get; }
        public IShoppingCartInfoProvider ShoppingCartInfoProvider { get; }
        public ICheckoutRepository CheckoutRepository { get; }
        public IAddressConverter AddressConverter { get; }

        public CheckoutService(IShoppingService shoppingService, IAddressInfoProvider addressInfoProvider, ICartRepository cartRepository, ISKUInfoProvider sKUInfoProvider, ICountryInfoProvider countryInfoProvider, IStateInfoProvider stateInfoProvider, ICustomerInfoProvider customerInfoProvider, IShoppingCartInfoProvider shoppingCartInfoProvider, ICheckoutRepository checkoutRepository, IAddressConverter addressConverter)
        {
            ShoppingService = shoppingService;
            AddressInfoProvider = addressInfoProvider;
            CartRepository = cartRepository;
            SKUInfoProvider = sKUInfoProvider;
            CountryInfoProvider = countryInfoProvider;
            StateInfoProvider = stateInfoProvider;
            CustomerInfoProvider = customerInfoProvider;
            ShoppingCartInfoProvider = shoppingCartInfoProvider;
            CheckoutRepository = checkoutRepository;
            AddressConverter = addressConverter;
        }

        public async Task<AddressInfo> SetBillingAddress(int? addressID, AddressViewModel address)
        {
            AddressInfo addressInfo = null;

            var customer = ShoppingService.GetCurrentCustomer();
            if(customer != null && addressID == null)
            {
                addressInfo = (await AddressInfoProvider.GetByCustomer(customer.CustomerID)
                    .WhereEquals(nameof(AddressInfo.AddressLine1), address.AddressLine1)
                    .WhereEqualsOrNull(nameof(AddressInfo.AddressLine2), address.AddressLine2)
                    .WhereEquals(nameof(AddressInfo.AddressCity), address.AddressCity)
                    .WhereEquals(nameof(AddressInfo.AddressStateID), address.AddressStateID)
                    .WhereEquals(nameof(AddressInfo.AddressCountryID), address.AddressCountryID)
                    .WhereEquals(nameof(AddressInfo.AddressZip), address.AddressPostalCode)
                    .GetEnumerableTypedResultAsync())
                    .FirstOrDefault();
            }

            addressInfo = addressInfo != null? addressInfo : addressID != null ? AddressInfoProvider.Get(addressID ?? 0) : AddressInfo.New();
            address.ApplyTo(addressInfo);
            ShoppingService.SetBillingAddress(addressInfo);
            return addressInfo;
        }

        public async Task<AddressInfo> SetOrderBillingAddress(Guid OrderGuid, int? addressID, AddressViewModel address)
        {
            AddressInfo addressInfo = null;

            var customer = ShoppingService.GetCurrentCustomer();
            if (customer != null && addressID == null)
            {
                addressInfo = (await AddressInfoProvider.GetByCustomer(customer.CustomerID)
                    .WhereEquals(nameof(AddressInfo.AddressLine1), address.AddressLine1)
                    .WhereEqualsOrNull(nameof(AddressInfo.AddressLine2), address.AddressLine2)
                    .WhereEquals(nameof(AddressInfo.AddressCity), address.AddressCity)
                    .WhereEquals(nameof(AddressInfo.AddressStateID), address.AddressStateID)
                    .WhereEquals(nameof(AddressInfo.AddressCountryID), address.AddressCountryID)
                    .WhereEquals(nameof(AddressInfo.AddressZip), address.AddressPostalCode)
                    .GetEnumerableTypedResultAsync())
                    .FirstOrDefault();
            }

            addressInfo = addressInfo != null ? addressInfo : addressID != null ? AddressInfoProvider.Get(addressID ?? 0) : null;
            if(addressInfo != null)
            {
                var order = await CheckoutRepository.GetOrder(OrderGuid);
                if(order != null)
                {
                    address.ApplyTo(order.OrderBillingAddress);
                    Service.Resolve<IOrderAddressInfoProvider>().Set(order.OrderBillingAddress);
                }
            }
            return addressInfo;
        }

        public async Task<AddressInfo> SetShippingAddress(int? addressID, AddressViewModel address)
        {
            AddressInfo addressInfo = null;

            var customer = ShoppingService.GetCurrentCustomer();
            if (customer != null && addressID == null)
            {
                addressInfo = (await AddressInfoProvider.GetByCustomer(customer.CustomerID)
                    .WhereEquals(nameof(AddressInfo.AddressLine1), address.AddressLine1)
                    .WhereEqualsOrNull(nameof(AddressInfo.AddressLine2), address.AddressLine2)
                    .WhereEquals(nameof(AddressInfo.AddressCity), address.AddressCity)
                    .WhereEquals(nameof(AddressInfo.AddressStateID), address.AddressStateID)
                    .WhereEquals(nameof(AddressInfo.AddressCountryID), address.AddressCountryID)
                    .WhereEquals(nameof(AddressInfo.AddressZip), address.AddressPostalCode)
                    .GetEnumerableTypedResultAsync())
                    .FirstOrDefault();
            }

            addressInfo = addressInfo != null ? addressInfo : addressID != null ? AddressInfoProvider.Get(addressID ?? 0) : new AddressInfo();
            address.ApplyTo(addressInfo);
            ShoppingService.SetShippingAddress(addressInfo);
            return addressInfo;
        }

        public async Task<CustomerInfo> SetCustomer(CustomerViewModel customer, bool userAuthenticated)
        {
            var customerInfo = await GetCustomerOrCreateFromAuthenticatedUser(customer.Email);
            bool emailCanBeChanged = !userAuthenticated || string.IsNullOrWhiteSpace(customerInfo.CustomerEmail);
            customer.ApplyToCustomer(customerInfo, emailCanBeChanged);
            ShoppingService.SetCustomer(customerInfo);
            return customerInfo;
        }

        public void SetShippingOption(int shippingOptionID)
        {
            ShoppingService.SetShippingOption(shippingOptionID);
        }

        public void SetPaymentOption(int paymentOptionID)
        {
            ShoppingService.SetPaymentOption(paymentOptionID);
        }


        private async Task<CustomerInfo> GetCustomerOrCreateFromAuthenticatedUser(string customerEmail)
        {
            var cart = CartRepository.GetCart();
            var customer = cart.Customer;

            if (customer != null)
            {
                return customer;
            }

            var user = cart.User;

            customer = user != null ? CustomerHelper.MapToCustomer(user) : null;

            if (customer != null)
            {
                return customer;
            }

            customer = (await CustomerInfoProvider.Get().WhereEquals(nameof(CustomerInfo.CustomerEmail), customerEmail).GetEnumerableTypedResultAsync()).FirstOrDefault();

            if (customer != null)
            {
                return customer;
            }

            return new CustomerInfo();
        }

        public bool AddCouponCode(string couponCode)
        {
            return ShoppingService.AddCouponCode(couponCode);
        }

        public Guid CreateOrder()
        {
            var cart = CartRepository.GetCart();
            var validator = new CreateOrderValidator(cart, SKUInfoProvider, CountryInfoProvider, StateInfoProvider);
            if (validator.Validate())
            {
                return ShoppingService.CreateOrder()?.OrderGUID ?? Guid.Empty;
            }
            else
            {
                return Guid.Empty;
            }
        }

        public void SetOrderNote(string note)
        {
            var cart = CartRepository.GetCart();
            cart.ShoppingCartNote = note;
            ShoppingCartInfoProvider.Set(cart);
        }
    }
}
