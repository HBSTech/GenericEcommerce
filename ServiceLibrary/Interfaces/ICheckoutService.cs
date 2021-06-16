using CMS.Ecommerce;
using Generic.Ecom.Models;
using System;
using System.Threading.Tasks;

namespace Generic.Ecom.ServiceLibrary
{
    public interface ICheckoutService
    {
        bool AddCouponCode(string couponCode);
        Guid CreateOrder();
        Task<AddressInfo> SetBillingAddress(int? addressID, AddressViewModel address);
        Task<CustomerInfo> SetCustomer(CustomerViewModel customer, bool userAuthenticated);
        void SetOrderNote(string note);
        void SetPaymentOption(int paymentOptionID);
        Task<AddressInfo> SetShippingAddress(int? addressID, AddressViewModel address);
        void SetShippingOption(int shippingOptionID);
    }
}