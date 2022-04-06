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
            document.body.dispatchEvent(EcommerceClassRepo.showAlertEvent(error.alert));
        });
        EcommerceClassRepo.ajax("/ShoppingCart/GetTotalTillFreeShipping").then((response) => {
            return response.text();
        }).then((html) => {
            var item = EcommerceClassRepo.decodeHTML(html) || "";
            totalToFreeShipping?.replaceWith(item);
        }).catch((error) => {
            document.body.dispatchEvent(EcommerceClassRepo.showAlertEvent(error.alert));
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
            if (!json.alert && event.detail.priceEl != null) {
                console.log(event.detail);
                (event.detail.priceEl as HTMLSpanElement).innerHTML = json.price;
            } else {
                document.body.dispatchEvent(EcommerceClassRepo.showAlertEvent(json.alert));
            }
        }).catch((error) => {
            document.body.dispatchEvent(EcommerceClassRepo.showAlertEvent(error.alert));
        });
    }

    async removeItem(event: CustomEvent): Promise<void> {
        return EcommerceClassRepo.ajax("/ShoppingCart/RemoveItem", {
            method: "POST",
            body: event.detail.ID.toString(),
            headers: EcommerceClassRepo.getPostHeaders()
        }).then((response) => {
            return response.json();
        }).then((json) => {
            if (json.alert) {
                document.body.dispatchEvent(EcommerceClassRepo.showAlertEvent(json.alert));
            }
            return json.html;
        }).catch((error) => {
            document.body.dispatchEvent(EcommerceClassRepo.showAlertEvent(error.alert));
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

    removeCartItemEvent(ID: number): CustomEvent<{ [key: string]: any }> {
        return new CustomEvent("remove-cart-item", {
            detail: {
                "ID": ID
            }
        });
    }
}