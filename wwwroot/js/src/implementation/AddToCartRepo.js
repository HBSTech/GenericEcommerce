"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { EcommerceClassRepo } from "./EcommerceClassRepo";
export class AddToCartRepo {
    addItem(event) {
        return __awaiter(this, void 0, void 0, function* () {
            return EcommerceClassRepo.ajax("/ShoppingCart/Add", {
                method: "POST",
                body: EcommerceClassRepo.getJSON(event.detail),
                headers: EcommerceClassRepo.getPostHeaders()
            }).then((response) => {
                return response.json();
            }).then((json) => {
                if (json.message) {
                    document.body.dispatchEvent(EcommerceClassRepo.showAlertEvent(json.message));
                }
            }).catch((error) => {
                document.body.dispatchEvent(EcommerceClassRepo.showAlertEvent(error.message));
            });
        });
    }
    addToCartEvent(el) {
        var customFields = {};
        Object.keys(el.dataset).filter(function (f) { return /^customField/.test(f); }).forEach(function (key) {
            customFields[key] = el.dataset[key] || "";
        });
        var model = {
            "sKUGUID": el.dataset.sku,
            "quantity": el.dataset.quantity
        };
        if (Object.keys(customFields).length > 0) {
            model["customFields"] = customFields;
        }
        return new CustomEvent("add-to-cart", {
            detail: model
        });
    }
}
