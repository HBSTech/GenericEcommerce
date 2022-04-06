"use strict"
import { EcommerceClassRepo } from "./EcommerceClassRepo";

import { AddToCartModel } from "./AddToCartModel";


export class AddToCartRepo {
    addedToCart: Event;
    constructor() {
        this.addedToCart = new Event("added-to-cart");
    }
    async addItem(event: CustomEvent<{ [key: string]: any }>): Promise<void> {
        return EcommerceClassRepo.ajax("/ShoppingCart/Add", {
            method: "POST",
            body: EcommerceClassRepo.getJSON(event.detail),
            headers: EcommerceClassRepo.getPostHeaders()
        }).then((response) => {
            return response.json();
        }).then((json) => {
            if (json.alert) {
                document.body.dispatchEvent(EcommerceClassRepo.showAlertEvent(json.alert));
            }
            document.body.dispatchEvent(this.addedToCart);
        }).catch((error) => {
            document.body.dispatchEvent(EcommerceClassRepo.showAlertEvent(error.alert));
        })
    }

    addToCartEvent(el: HTMLElement): CustomEvent<{ [key: string]: AddToCartModel }> {
        var customFields = {} as { [key: string]: string };
        Object.keys(el.dataset).filter(function (f) { return /^customField/.test(f); }).forEach(function (key) {
            customFields[key] = el.dataset[key] || "";
        });
        var model = {
            "sKUGUID": el.dataset.sku,
            "quantity": el.dataset.quantity
        }
        if (Object.keys(customFields).length > 0){
            model["customFields"] = customFields;
        }
        return new CustomEvent<{[key: string]: any}>("add-to-cart", {
            detail: model
        });
    }
}