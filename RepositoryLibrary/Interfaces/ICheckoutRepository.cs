using CMS.Ecommerce;
using CMS.Globalization;
using Generic.Ecom.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Generic.Ecom.RepositoryLibrary
{
    public interface ICheckoutRepository
    {
        Task<AddressViewModel> GetAddress(int addressID);
        Task<IEnumerable<SelectListItem>> GetAddresses();
        Task<AddressViewModel> GetBillingAddress();
        Task<IEnumerable<SelectListItem>> GetCountries();
        Task<CustomerViewModel> GetCustomer();
        Task<OrderInfo> GetOrder(Guid orderGuid);
        Task<IEnumerable<SelectListItem>> GetPaymentOptions();
        Task<AddressViewModel> GetShippingAddress();
        Task<IEnumerable<SelectListItem>> GetShippingOptions();
        Task<IEnumerable<SelectListItem>> GetStates(int countryID);
        CheckoutViewModel PrepareCheckout();
    }
}