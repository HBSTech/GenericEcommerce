using Generic.Ecom;
using Generic.Ecom.Components;
using Generic.Ecom.EcommerceAreas.Checkout.Controllers;
using Generic.Ecom.Models;
using Generic.Ecom.RepositoryLibrary;
using Generic.Ecom.ServiceLibrary;
using Kentico.PageBuilder.Web.Mvc.PageTemplates;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Localization;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

[assembly: RegisterPageTemplate("Generic.Ecom.Checkout", "Checkout Page Template", customViewName: "~/EcommerceAreas/Shared/PageTemplates/Checkout.cshtml")]

namespace Generic.Ecom.EcommerceAreas.Checkout.Controllers
{
    public class CheckoutController : PageTemplateController
    {
        public ICheckoutRepository CheckoutRepository { get; }
        public ICheckoutService CheckoutService { get; }
        public ICartRepository CartRepository { get; }

        public CheckoutController(ICheckoutRepository checkoutRepository, ICheckoutService checkoutService, ICartRepository cartRepository)
        {
            CheckoutRepository = checkoutRepository;
            CheckoutService = checkoutService;
            CartRepository = cartRepository;
        }

        public IActionResult Index()
        {
            return View("~/EcommerceAreas/Shared/PageTemplates/Checkout.cshtml");
        }

        [HttpGet]
        public async Task<IActionResult> GetAddresses()
        {
            return new JsonResult(await CheckoutRepository.GetAddresses());
        }

        [HttpGet]
        public async Task<IActionResult> GetBillingAddress()
        {
            return new JsonResult(await CheckoutRepository.GetBillingAddress());
        }

        [HttpGet]
        public async Task<IActionResult> GetShippingAddress()
        {
            return new JsonResult(await CheckoutRepository.GetShippingAddress());
        }

        [HttpGet]
        public async Task<IActionResult> GetCountries()
        {
            return new JsonResult(await CheckoutRepository.GetCountries());
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> GetAddress([FromBody] int addressID)
        {
            return new JsonResult(await CheckoutRepository.GetAddress(addressID));
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> GetStates([FromBody] int countryID)
        {
            return new JsonResult(await CheckoutRepository.GetStates(countryID));
        }

        [HttpGet]
        public async Task<IActionResult> GetCustomer()
        {
            return new JsonResult(await CheckoutRepository.GetCustomer());
        }

        [HttpGet]
        public async Task<IActionResult> GetShippingOptions()
        {
            return new JsonResult(await CheckoutRepository.GetShippingOptions());
        }

        [HttpGet]
        public async Task<IActionResult> GetPaymentOptions()
        {
            return new JsonResult(await CheckoutRepository.GetPaymentOptions());
        }

        [HttpGet]
        public async Task<IActionResult> GetOrder()
        {
            var cart = CartRepository.GetCartViewModel(true);
            return PartialView(EcommerceOptions.CheckoutCartPartialView, cart);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> SetBillingAddress([FromBody] AddressViewModel model, [FromServices] IStringLocalizer<SharedResources> localizer)
        {
            if (!ModelState.IsValid)
            {
                var Errors = ModelState.Select(x => new { Name = x.Key, Errors = x.Value.Errors.Select(x => x.ErrorMessage) });
                return new JsonResult(new { Errors });
            }

            _ = await CheckoutService.SetBillingAddress(model.AddressID, model);

            return new JsonResult(new { Message = localizer["Billing address saved."] });
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> SetShippingAddress([FromBody] AddressViewModel model, [FromServices] IStringLocalizer<SharedResources> localizer)
        {
            if (!ModelState.IsValid)
            {
                var Errors = ModelState.Select(x => new { Name = x.Key, Errors = x.Value.Errors.Select(x => x.ErrorMessage) });
                return new JsonResult(new { Errors });
            }

            _ = await CheckoutService.SetShippingAddress(model.AddressID, model);

            return new JsonResult(new { Message = localizer["Shipping address saved."] });
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> SetCustomer([FromBody] CustomerViewModel model, [FromServices] IStringLocalizer<SharedResources> localizer)
        {
            if (!ModelState.IsValid)
            {
                var Errors = ModelState.Select(x => new { Name = x.Key, Errors = x.Value.Errors.Select(x => x.ErrorMessage) });
                return new JsonResult(new { Errors });
            }

            await CheckoutService.SetCustomer(model, User.Identity.IsAuthenticated);

            return new JsonResult(new { Message = localizer["Customer saved."] });
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> SetShippingOption([FromBody] int optionID, [FromServices] IStringLocalizer<SharedResources> localizer)
        {
            CheckoutService.SetShippingOption(optionID);
            return new JsonResult(new { Message = localizer["Shipping option selected."] });
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> SetPaymentOption([FromBody] int optionID, [FromServices] IStringLocalizer<SharedResources> localizer)
        {
            CheckoutService.SetPaymentOption(optionID);
            return new JsonResult(new { Message = localizer["Payment option selected."] });
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> AddCoupon([FromBody] string coupon, [FromServices] IStringLocalizer<SharedResources> localizer)
        {
            if (CheckoutService.AddCouponCode(coupon))
            {
                return new JsonResult(new { Message = localizer["Coupon added successfully."] });
            }
            else
            {
                return new JsonResult(new { Message = localizer["Coupon invalid."] });
            }
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> RemoveCoupon([FromBody] string coupon, [FromServices] IStringLocalizer<SharedResources> localizer)
        {
            var cart = CartRepository.GetCart();
            cart.RemoveCouponCode(coupon);
            return new JsonResult(new { Message = localizer["Coupon removed successfully."] });
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> CreatOrder()
        {
            var orderGUID = CheckoutService.CreateOrder();
            if(orderGUID != Guid.Empty)
            {
                return new JsonResult(new { OrderGUID = orderGUID.ToString() });
            } 
            else
            {
                return new JsonResult(new { Message = "Create Order Failed", OrderFailed = true });
            }
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> SetOrderNote([FromBody] string note)
        {
            CheckoutService.SetOrderNote(note);
            return Json("");
        }
    }
}
