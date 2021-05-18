import { AddToCartRepo } from "./implementation/AddToCartRepo";
import { CheckoutRepo } from "./implementation/CheckoutRepo";
import { EcommerceClassRepo } from "./implementation/EcommerceClassRepo";
import { ShoppingCartRepo } from "./implementation/ShoppingCartRepo";
export function InitializeEcommerceService(type) {
    var classObject;
    switch (type) {
        case "AddToCart":
            classObject = new AddToCartRepo();
            break;
        case "Checkout":
            classObject = new CheckoutRepo();
            break;
        case "EcommerceClass":
            classObject = EcommerceClassRepo;
            break;
        case "ShoppingCart":
            classObject = new ShoppingCartRepo();
            break;
    }
    return classObject;
}
window.InitializeEcommerceService = function (type) {
    return InitializeEcommerceService(type);
};
