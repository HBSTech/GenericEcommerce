using Generic.Ecom.RepositoryLibrary;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Generic.Ecom.Components
{
    [ViewComponent(Name = "Generic.Ecom.ShoppingCart")]

    public class ShoppingCartViewComponent : ViewComponent
    {
        public ICartRepository CartRepository { get; }
        public ShoppingCartViewComponent(ICartRepository cartRepository)
        {
            CartRepository = cartRepository;
        }

        public async Task<IViewComponentResult> InvokeAsync()
        {
            return View(EcommerceOptions.CartView, CartRepository.GetCartViewModel(false));
        }
    }
}
