# GenericEcommerce
Add Ecommerce to your Kentico Xperience MVC.Net Core Application.  ready to use out of box, but can be fully customizable.

# Basic Setup

## Startup.cs
Add to your services

`services.RegisterEcommerceServices(new EcommerceServiceConfiguration() { CheckoutUrl = "/Store/Checkout", ThankYouUrl = "/Store/Thank-You" });`

Available Settings for the EcommerceServiceConfiguration.  With defaults in place.
``` csharp
/// <summary> 
/// If set to true, then cart items with custom data will be considered unique items.  
/// Default (false) will increment quantity even if custom data fields are different.
/// </summary>
public bool UseCustomProductFields { get; set; } = false;

/// <summary>
/// Specify the minutes to store the ecommerce cached items.
/// </summary>
public int CacheMinutes { get; set; } = 30;

public string CheckoutUrl { get; set; } = "/Checkout";

public string ThankYouUrl { get; set; } = "/ThankYou";
```

In order to use a custom url, create a page type by the name of `Generic.Ecommerce` and set it to either the checkout or the shopping cart url.  Make sure that the url path matches what you have set in the configuration.  `Generic.Ecommerce` is just the page name that has the Ecommerce page templates automatically filtered.  you may use any page type and add your own filters.

## _Layout.cshtml
Add to the bottom
``` html
<script src="~/hbscommerce/js/ecommerce.min.js"></script>
<script src="~/hbscommerce/js/ecommerceEvents.js"></script>
```

## Adding an Add to Cart

You can add the "Add to Cart" through the below View Component:

``` csharp
@*This is an example that will add a sku with a custom field of a color to the cart.  In order to just use as normal, remove the CustomerFields property from the AddToCartViewModel.*@ 

@await Component.InvokeAsync("Generic.Ecom.AddToCart", new AddToCartViewModel() { Quantity = 1, SKUGUID = Model.Page.SKUProduct.SKUGUID, CustomFields = new Dictionary<string, object>() { { "color", "red" } } } )
```

Advanced setup and use comming.
