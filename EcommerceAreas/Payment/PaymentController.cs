using CMS.Ecommerce;
using Generic.Ecom.RepositoryLibrary;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Localization;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Generic.Ecom.EcommerceAreas.Payment
{
    public class PaymentController : Controller
    {
        public PaymentController(IShoppingService shoppingService, IPaymentOptionInfoProvider paymentOptionInfoProvider, ICartRepository cartRepository)
        {
            ShoppingService = shoppingService;
            PaymentOptionInfoProvider = paymentOptionInfoProvider;
            CartRepository = cartRepository;
        }

        public IShoppingService ShoppingService { get; }
        public IPaymentOptionInfoProvider PaymentOptionInfoProvider { get; }
        public ICartRepository CartRepository { get; }

        public async Task<IActionResult> GetPaymentForm([FromServices] IStringLocalizer<SharedResources> localizer)
        {
            if (!CartRepository.CartIsEmpty())
            {
                try
                {
                    var paymentOption = ShoppingService.GetPaymentOption();
                    var option = await PaymentOptionInfoProvider.GetAsync(paymentOption);
                    return ViewComponent($"{nameof(Generic)}.{nameof(Ecom)}.{option.PaymentOptionName}");
                }
                catch (Exception ex)
                {
                    return Content(localizer["Payment Form Failed to Load</br>Error: "] + ex.ToString());
                }
            }
            else
            {
                return Content(localizer["Shopping Cart Is Empty"]);
            }
        }
    }
}
