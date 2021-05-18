using Generic.Ecom.Models;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Generic.Ecom.Components
{
    [ViewComponent(Name = "Generic.Ecom.AddToCart")]

    public class AddToCartViewComponent: ViewComponent
    {
        public async Task<IViewComponentResult> InvokeAsync(AddToCartViewModel model)
        {
            return View(EcommerceOptions.AddToCartView, model);
        }
    }
}
