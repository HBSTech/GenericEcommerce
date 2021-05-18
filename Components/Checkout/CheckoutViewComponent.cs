using Generic.Ecom.RepositoryLibrary;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Generic.Ecom.Components
{
    [ViewComponent(Name = "Generic.Ecom.Checkout")]

    public class CheckoutViewComponent : ViewComponent
    {
        public ICheckoutRepository CheckoutRepository { get; }

        public CheckoutViewComponent(ICheckoutRepository checkoutRepository)
        {
            CheckoutRepository = checkoutRepository;
        }

        public async Task<IViewComponentResult> InvokeAsync()
        {
            return View(EcommerceOptions.CheckoutView, CheckoutRepository.PrepareCheckout());
        }

    }
}
