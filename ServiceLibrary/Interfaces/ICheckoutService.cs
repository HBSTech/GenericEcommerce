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
        AddressInfo SetBillingAddress(int? addressID, AddressViewModel address);
        Task<CustomerInfo> SetCustomer(CustomerViewModel customer, bool userAuthenticated);
        void SetPaymentOption(int paymentOptionID);
        AddressInfo SetShippingAddress(int? addressID, AddressViewModel address);
        void SetShippingOption(int shippingOptionID);
    }
}