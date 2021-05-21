using Generic.Ecom.RepositoryLibrary;
using Generic.Ecom.ServiceLibrary;
using Kentico.Content.Web.Mvc;
using Kentico.PageBuilder.Web.Mvc;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Razor;
using Microsoft.AspNetCore.Routing;
using Microsoft.AspNetCore.Routing.Constraints;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Security.Cryptography;
using System.Text;

namespace Generic.Ecom
{
    public static class EcommerceOptions
    {
        public static string AddToCartView = "~/Components/AddToCart/AddToCart.cshtml";

        public static string CartView = "~/EcommerceAreas/ShoppingCart/Views/Index.cshtml";

        public static string CartItemPartialView = "~/EcommerceAreas/ShoppingCart/Views/_CartItem.cshtml";

        public static string CartTotalsPartialView = "~/EcommerceAreas/ShoppingCart/Views/_CartTotals.cshtml";

        public static string CartTillFreeShippingPartialView = "~/EcommerceAreas/ShoppingCart/Views/_TotalTillFreeShipping.cshtml";

        public static string CheckoutView = "~/EcommerceAreas/Checkout/Views/Index.cshtml";

        public static string CheckoutCartPartialView = "~/EcommerceAreas/Checkout/Views/_CheckoutCart.cshtml";

        public static string PaymentGatewayView = "~/EcommerceAreas/Checkout/Views/_{0}.cshtml";

        public static string EccommerceMasterPage = "~/Views/Shared/_layout.cshtml";

        private const string CONSTRAINT_FOR_CHECKOUT_PAGE_CONTROLLERS = "Checkout";

        private const string CONSTRAINT_FOR_SHOPPING_CART_PAGE_CONTROLLERS = "ShoppingCart";

        private const string DEFAULT_WITHOUT_LANGUAGE_PREFIX_ROUTE_NAME = "DefaultEcommerceWithoutLanguagePrefix";

        public static IEndpointRouteBuilder AddEcommerceEndPoints(this IEndpointRouteBuilder endpoints)
        {
            endpoints.MapControllerRoute(
               name: "ecommerce_areas",
               pattern: $"{{area:exists}}/{{culture}}/{{controller}}/{{action}}",
               constraints: new
               {
                   culture = new SiteCultureConstraint { HideLanguagePrefixForDefaultCulture = true },
                   controller = new RegexRouteConstraint($"^({CONSTRAINT_FOR_CHECKOUT_PAGE_CONTROLLERS}|{CONSTRAINT_FOR_SHOPPING_CART_PAGE_CONTROLLERS})+$")
               }
            );

            endpoints.MapControllerRoute(
                name: DEFAULT_WITHOUT_LANGUAGE_PREFIX_ROUTE_NAME + "_areas",
                pattern: "{area:exists}/{controller}/{action}",
                constraints: new
                {
                    controller = new RegexRouteConstraint($"^({CONSTRAINT_FOR_CHECKOUT_PAGE_CONTROLLERS}|{CONSTRAINT_FOR_SHOPPING_CART_PAGE_CONTROLLERS})+$")
                }
            );

            return endpoints;
        }

        public static IServiceCollection RegisterEcommerceServices(this IServiceCollection services, EcommerceServiceConfiguration options)
        {
            PageBuilderFilters.PageTemplates.Add(new EcommercePageTemplateFilters());

            services.AddScoped<ICartRepository, CartRepository>();
            services.AddScoped<ICheckoutRepository, CheckoutRepository>();
            services.AddScoped<ISKURepository, SKURepository>();

            services.AddScoped<ICartService, CartService>();
            services.AddScoped<ICheckoutService, CheckoutService>();

            services.AddSingleton<IEcommerceServiceOptions>(new EcommerceServiceOptions(options));
            return services;
        }
    }
}
