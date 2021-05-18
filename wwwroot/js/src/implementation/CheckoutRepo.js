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
export class CheckoutRepo {
    constructor() {
        this.paymentEvent = new Event("payment");
        this.orderGUID = "";
        this.createOrderEvent = new Event("create-order");
        this.updateOrderEvent = new Event("update-order");
        this.getCountriesEvent = new Event("get-countries");
        this.customerCreated = document.body.querySelector(".customer[data-customerexists]") != null;
        this.getAddressesEvent = new Event("get-addresses");
    }
    redeemCouponEvent(coupon) {
        return new CustomEvent("redeem-coupon", { detail: coupon });
    }
    removeCouponEvent(coupon) {
        return new CustomEvent("remove-coupon", { detail: coupon });
    }
    getStatesEvent(selectId, countryId) {
        return new CustomEvent("get-states", { detail: { "selectId": selectId, "countryId": countryId } });
    }
    getAddressEvent(addressID, addressType) {
        return new CustomEvent("get-address", {
            detail: {
                "addressID": addressID,
                "addressType": addressType
            }
        });
    }
    paymentResultEvent(result) {
        return new CustomEvent("payment-result", { detail: result });
    }
    setCustomerEvent(result) {
        return new CustomEvent("set-customer", { detail: result });
    }
    setBillingAddressEvent(result) {
        return new CustomEvent("set-billing-address", { detail: result });
    }
    setShippingAddressEvent(result) {
        return new CustomEvent("set-shipping-address", { detail: result });
    }
    setShippingOptionEvent(result) {
        return new CustomEvent("set-shipping-option", { detail: result });
    }
    setPaymentOptionEvent(result) {
        return new CustomEvent("set-payment-option", { detail: result });
    }
    getOrder() {
        return __awaiter(this, void 0, void 0, function* () {
            var response = yield EcommerceClassRepo.ajax("/Checkout/GetOrder");
            if (response.ok) {
                return yield response.text();
            }
            else {
                return null;
            }
        });
    }
    getShippingOptions(selectId) {
        return __awaiter(this, void 0, void 0, function* () {
            var response = yield EcommerceClassRepo.ajax("/Checkout/GetShippingOptions");
            if (response.ok) {
                var options = yield response.json();
                EcommerceClassRepo.applyDropdownList(selectId, options);
            }
        });
    }
    getPaymentOptions() {
        return __awaiter(this, void 0, void 0, function* () {
            var response = yield EcommerceClassRepo.ajax("/Checkout/GetPaymentOptions");
            if (response.ok) {
                var options = yield response.json();
                return options;
            }
            else {
                return null;
            }
        });
    }
    getCountries(selectId) {
        return __awaiter(this, void 0, void 0, function* () {
            var response = yield EcommerceClassRepo.ajax("/Checkout/GetCountries");
            if (response.ok) {
                var options = yield response.json();
                EcommerceClassRepo.applyDropdownList(selectId, options);
            }
        });
    }
    getStates(selectId, countryId) {
        return __awaiter(this, void 0, void 0, function* () {
            var response = yield EcommerceClassRepo.ajax("/Checkout/GetStates", {
                method: "POST",
                body: EcommerceClassRepo.getJSON(countryId),
                headers: EcommerceClassRepo.getPostHeaders()
            });
            if (response.ok) {
                var options = yield response.json();
                EcommerceClassRepo.applyDropdownList(selectId, options);
            }
        });
    }
    getPaymentForm() {
        return __awaiter(this, void 0, void 0, function* () {
            var response = yield EcommerceClassRepo.ajax("/Payment/GetPaymentForm");
            if (response.ok) {
                return yield response.text();
            }
            else {
                return '';
            }
        });
    }
    createOrder() {
        return __awaiter(this, void 0, void 0, function* () {
            var response = yield EcommerceClassRepo.ajax("/Checkout/CreatOrder", {
                method: "POST",
                body: EcommerceClassRepo.getJSON({}),
                headers: EcommerceClassRepo.getPostHeaders()
            });
            if (response.ok) {
                var order = yield response.json();
                if (!order.orderFailed) {
                    this.orderGUID = order.orderGUID;
                    document.body.dispatchEvent(this.paymentEvent);
                }
                else {
                    document.body.dispatchEvent(EcommerceClassRepo.showAlertEvent(order.message));
                }
            }
        });
    }
    setCustomer(customer) {
        return __awaiter(this, void 0, void 0, function* () {
            var response = yield EcommerceClassRepo.ajax("/Checkout/SetCustomer", {
                method: "POST",
                body: EcommerceClassRepo.getJSON(customer),
                headers: EcommerceClassRepo.getPostHeaders()
            });
            if (response.ok) {
                var json = yield response.json();
                if (json.message) {
                    document.body.dispatchEvent(EcommerceClassRepo.showAlertEvent(json.message));
                }
                this.customerCreated = true;
            }
        });
    }
    setBillingAddress(address) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.customerCreated) {
                setTimeout(() => { this.setBillingAddress(address); }, 500);
                return;
            }
            var response = yield EcommerceClassRepo.ajax("/Checkout/SetBillingAddress", {
                method: "POST",
                body: EcommerceClassRepo.getJSON(address),
                headers: EcommerceClassRepo.getPostHeaders()
            });
            if (response.ok) {
                var json = yield response.json();
                if (json.message) {
                    document.body.dispatchEvent(EcommerceClassRepo.showAlertEvent(json.message));
                }
            }
        });
    }
    setShippingAddress(address) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.customerCreated) {
                setTimeout(() => { this.setShippingAddress(address); }, 500);
                return;
            }
            var response = yield EcommerceClassRepo.ajax("/Checkout/SetShippingAddress", {
                method: "POST",
                body: EcommerceClassRepo.getJSON(address),
                headers: EcommerceClassRepo.getPostHeaders()
            });
            if (response.ok) {
                var json = yield response.json();
                if (json.message) {
                    document.body.dispatchEvent(EcommerceClassRepo.showAlertEvent(json.message));
                }
            }
        });
    }
    setShippingOption(id) {
        return __awaiter(this, void 0, void 0, function* () {
            var response = yield EcommerceClassRepo.ajax("/Checkout/SetShippingOption", {
                method: "POST",
                body: EcommerceClassRepo.getJSON({ "optionID": id }),
                headers: EcommerceClassRepo.getPostHeaders()
            });
            if (response.ok) {
                var json = yield response.json();
                if (json.message) {
                    document.body.dispatchEvent(EcommerceClassRepo.showAlertEvent(json.message));
                }
            }
        });
    }
    setPaymentOption(id) {
        return __awaiter(this, void 0, void 0, function* () {
            var response = yield EcommerceClassRepo.ajax("/Checkout/SetPaymentOption", {
                method: "POST",
                body: EcommerceClassRepo.getJSON({ "optionID": id }),
                headers: EcommerceClassRepo.getPostHeaders()
            });
            if (response.ok) {
                var json = yield response.json();
                if (json.message) {
                    document.body.dispatchEvent(EcommerceClassRepo.showAlertEvent(json.message));
                }
            }
        });
    }
    redeemCoupon(coupon) {
        return __awaiter(this, void 0, void 0, function* () {
            var response = yield EcommerceClassRepo.ajax("/Checkout/AddCoupon", {
                method: "POST",
                body: EcommerceClassRepo.getJSON(coupon),
                headers: EcommerceClassRepo.getPostHeaders()
            });
            if (response.ok) {
                var json = yield response.json();
                if (json.message) {
                    document.body.dispatchEvent(EcommerceClassRepo.showAlertEvent(json.message));
                }
            }
        });
    }
    removeCoupon(coupon) {
        return __awaiter(this, void 0, void 0, function* () {
            var response = yield EcommerceClassRepo.ajax("/Checkout/RemoveCoupon", {
                method: "POST",
                body: EcommerceClassRepo.getJSON(coupon),
                headers: EcommerceClassRepo.getPostHeaders()
            });
            if (response.ok) {
                var json = yield response.json();
                if (json.message) {
                    document.body.dispatchEvent(EcommerceClassRepo.showAlertEvent(json.message));
                }
            }
        });
    }
    getAddresses(shippingID, billingID) {
        return __awaiter(this, void 0, void 0, function* () {
            var response = yield EcommerceClassRepo.ajax("/Checkout/GetAddresses");
            if (response.ok) {
                var options = (yield response.json());
                EcommerceClassRepo.applyDropdownList(billingID, options);
                EcommerceClassRepo.applyDropdownList(shippingID, options);
            }
        });
    }
    getAddress(addressID) {
        return __awaiter(this, void 0, void 0, function* () {
            var response = yield EcommerceClassRepo.ajax("/Checkout/GetAddress", {
                method: "POST",
                body: EcommerceClassRepo.getJSON(addressID),
                headers: EcommerceClassRepo.getPostHeaders()
            });
            if (response.ok) {
                return (yield response.json());
            }
            else {
                return null;
            }
        });
    }
}
