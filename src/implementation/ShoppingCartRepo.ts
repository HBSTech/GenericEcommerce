import { EcommerceClassRepo } from "./EcommerceClassRepo";

export class ShoppingCartRepo {
    returnShoppingEvent: Event;
    updateTotalsEvent: Event;
    constructor() {
        this.returnShoppingEvent = new Event("return-shopping");
        this.updateTotalsEvent = new Event("update-cart");
    }
    async updateTotals(): Promise<void> {
        var totalToFreeShipping = document.getElementById("free-shipping-promotion");
        var totals = document.getElementById("cart-totals");
        EcommerceClassRepo.ajax("/ShoppingCart/GetTotals").then((response) => {
            return response.text();
        }).then((html) => {
            var item = EcommerceClassRepo.decodeHTML(html) || "";
            totals?.replaceWith(item);
        }).catch((error) => {
            document.body.dispatchEvent(EcommerceClassRepo.showAlertEvent(error.message));
        });
        EcommerceClassRepo.ajax("/ShoppingCart/GetTotalTillFreeShipping").then((response) => {
            return response.text();
        }).then((html) => {
            var item = EcommerceClassRepo.decodeHTML(html) || "";
            totalToFreeShipping?.replaceWith(item);
        }).catch((error) => {
            document.body.dispatchEvent(EcommerceClassRepo.showAlertEvent(error.message));
        });
    }

    async updateItem(event: CustomEvent<{ [key: string]: any }>): Promise<void> {
        return EcommerceClassRepo.ajax("/ShoppingCart/Update", {
            method: "POST",
            body: EcommerceClassRepo.getJSON(event.detail),
            headers: EcommerceClassRepo.getPostHeaders()
        }).then((response) => {
            return response.json();
        }).then((json) => {
            if (!json.message && event.detail.priceEl != null) {
                console.log(event.detail);
                (event.detail.priceEl as HTMLSpanElement).innerHTML = json.price;
            } else {
                document.body.dispatchEvent(EcommerceClassRepo.showAlertEvent(json.message));
            }
        }).catch((error) => {
            document.body.dispatchEvent(EcommerceClassRepo.showAlertEvent(error.message));
        });
    }

    async removeItem(event: CustomEvent): Promise<void> {
        var parent = event.detail.parent as HTMLElement;
        var id = (parent.querySelector("input[name=ID]") as HTMLInputElement | null)?.value ?? 0;
        return EcommerceClassRepo.ajax("/ShoppingCart/RemoveItem", {
            method: "POST",
            body: id.toString(),
            headers: EcommerceClassRepo.getPostHeaders()
        }).then((response) => {
            return response.json();
        }).then((json) => {
            if (!json.message) {
                if (json.html) {
                    var cart = EcommerceClassRepo.closest(parent, ".cart-content");
                    var newNode = EcommerceClassRepo.decodeHTML(json.html) || document.createElement("span");
                    cart.insertBefore(newNode, parent);
                }
                parent.remove();
            } else {
                document.body.dispatchEvent(EcommerceClassRepo.showAlertEvent(json.message));
            }
        }).catch((error) => {
            document.body.dispatchEvent(EcommerceClassRepo.showAlertEvent(error.message));
        });
    }

    returnShopping(): void {
        history.back();
    }

    updateItemEvent(cartItem: { [key: string]: any }): CustomEvent<{[key: string]: any}> {
        return new CustomEvent("update-cart-item", {
            detail: cartItem
        });
    }

    removeCartItemEvent(parent: HTMLElement): CustomEvent<{ [key: string]: any }> {
        return new CustomEvent("remove-cart-item", {
            detail: {
                "parent": parent
            }
        });
    }
}