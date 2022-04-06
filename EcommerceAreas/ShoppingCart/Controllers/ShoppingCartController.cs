using Generic.Ecom.Models;
using Generic.Ecom.ServiceLibrary;
using CMS.Ecommerce;
using Kentico.PageBuilder.Web.Mvc.PageTemplates;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Generic.Ecom.RepositoryLibrary;
using Microsoft.Extensions.Localization;
using Microsoft.AspNetCore.Mvc.Rendering;
using Generic.Ecom.Components;
using Generic.Ecom.Resources;

[assembly: RegisterPageTemplate("Generic.Ecom.ShoppingCart", "Shopping Cart Page Template", customViewName: "~/EcommerceAreas/Shared/PageTemplates/ShoppingCart.cshtml")]

namespace Generic.Ecom.Controllers
{
    public class ShoppingCartController : Controller
    {
        public ICartService CartService { get; }
        public ICartRepository CartRepository { get; }
        public ISKURepository SKURepository { get; }

        public ShoppingCartController(ICartService cartService, ICartRepository cartRepository, ISKURepository sKURepository)
        {
            CartService = cartService;
            CartRepository = cartRepository;
            SKURepository = sKURepository;
        }
        public IActionResult Index()
        {
            return View("~/EcommerceAreas/Shared/PageTemplates/ShoppingCart.cshtml");
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Add([FromBody] AddToCartViewModel cartItem, [FromServices] IStringLocalizer<SharedResources> localizer)
        {
            _ = await CartService.AddToCart(cartItem);
            return new JsonResult(new { Alert = new Alert(localizer["Item added successfully."] ) });
        }


        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Update([FromBody] CartItemUpdateModel cartItem, [FromServices] IStringLocalizer<SharedResources> localizer)
        {
            if (ModelState.IsValid)
            {
                string Price = await CartService.UpdateItemQuantity(cartItem.ID, cartItem.Quantity);

                return new JsonResult(new { Price });
            }
            return new JsonResult(new { Alert = new Alert(localizer["Cart item update failed.  Please refresh page."], AlertType.Error) });
        }


        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> RemoveItem([FromBody] int id, [FromServices] IStringLocalizer<SharedResources> localizer)
        {
            if (ModelState.IsValid)
            {
                CartService.RemoveItem(id);
                if (CartRepository.CartIsEmpty())
                {
                    return new JsonResult(new { Remove = true, Html = $"<span>{localizer["Shopping cart is empty"]}</span>" });
                }
                else
                {
                    return new JsonResult(new { Remove = true });
                }
            }
            return new JsonResult(new { Alert = new Alert(localizer["Cart item deletion failed.  Please refresh page."], AlertType.Error) });
        }

        //Finish
        [HttpGet]
        public async Task<IActionResult> FindProduct(int skuId)
        {
            var url = await SKURepository.GetProductAlias(skuId, null);
            return Redirect(url);
        }

        [HttpGet]
        public async Task<IActionResult> GetTotals()
        {
            var cart = CartRepository.GetCartViewModel(false);

            return PartialView(EcommerceOptions.CartTotalsPartialView, cart);
        }



        [HttpGet]
        public async Task<IActionResult> GetTotalTillFreeShipping()
        {
            var cart = CartRepository.GetCartViewModel(false);

            return PartialView(EcommerceOptions.CartTillFreeShippingPartialView, cart);
        }


        [HttpGet]
        public async Task<IActionResult> GetQuantity()
        {
            return Content(CartRepository.CartQuantity().ToString());
        }
    }
}
