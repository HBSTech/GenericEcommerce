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
    setOrderNoteEvent(note) {
        return new CustomEvent("set-order-note", { detail: note });
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
            return EcommerceClassRepo.ajax("/Checkout/GetOrder").then((response) => {
                return response.text();
            }).then((html) => {
                return html;
            }).catch((error) => {
                document.body.dispatchEvent(EcommerceClassRepo.showAlertEvent(error.message));
                return null;
            });
        });
    }
    getShippingOptions(selectId) {
        return __awaiter(this, void 0, void 0, function* () {
            return EcommerceClassRepo.ajax("/Checkout/GetShippingOptions").then((response) => {
                return response.json();
            }).then((options) => {
                EcommerceClassRepo.applyDropdownList(selectId, options);
            }).catch((error) => {
                document.body.dispatchEvent(EcommerceClassRepo.showAlertEvent(error.message));
            });
        });
    }
    getPaymentOptions() {
        return __awaiter(this, void 0, void 0, function* () {
            return EcommerceClassRepo.ajax("/Checkout/GetPaymentOptions")
                .then((response) => {
                return response.json();
            })
                .then((options) => {
                return options;
            }).catch((error) => {
                document.body.dispatchEvent(EcommerceClassRepo.showAlertEvent(error.message));
                return null;
            });
        });
    }
    getCountries(selectId) {
        return __awaiter(this, void 0, void 0, function* () {
            return EcommerceClassRepo.ajax("/Checkout/GetCountries")
                .then((response) => {
                return response.json();
            })
                .then((options) => {
                EcommerceClassRepo.applyDropdownList(selectId, options);
            })
                .catch((error) => {
                document.body.dispatchEvent(EcommerceClassRepo.showAlertEvent(error.message));
            });
        });
    }
    getStates(selectId, countryId) {
        return __awaiter(this, void 0, void 0, function* () {
            return EcommerceClassRepo.ajax("/Checkout/GetStates", {
                method: "POST",
                body: EcommerceClassRepo.getJSON(countryId),
                headers: EcommerceClassRepo.getPostHeaders()
            }).then((response) => {
                return response.json();
            }).then((options) => {
                EcommerceClassRepo.applyDropdownList(selectId, options);
            }).catch((error) => {
                document.body.dispatchEvent(EcommerceClassRepo.showAlertEvent(error.message));
            });
        });
    }
    getPaymentForm() {
        return __awaiter(this, void 0, void 0, function* () {
            return EcommerceClassRepo.ajax("/Payment/GetPaymentForm").then((response) => {
                return response.text();
            }).then((html) => {
                return html;
            }).catch((error) => {
                document.body.dispatchEvent(EcommerceClassRepo.showAlertEvent(error.message));
                return null;
            });
        });
    }
    createOrder() {
        return __awaiter(this, void 0, void 0, function* () {
            return EcommerceClassRepo.ajax("/Checkout/CreatOrder", {
                method: "POST",
                body: EcommerceClassRepo.getJSON({}),
                headers: EcommerceClassRepo.getPostHeaders()
            }).then((response) => {
                return response.json();
            }).then((order) => {
                if (!order.orderFailed) {
                    this.orderGUID = order.orderGUID;
                    document.body.dispatchEvent(this.paymentEvent);
                }
                else {
                    document.body.dispatchEvent(EcommerceClassRepo.showAlertEvent(order.message));
                }
            }).catch((error) => {
                document.body.dispatchEvent(EcommerceClassRepo.showAlertEvent(error.message));
            });
        });
    }
    setCustomer(customer) {
        return __awaiter(this, void 0, void 0, function* () {
            return EcommerceClassRepo.ajax("/Checkout/SetCustomer", {
                method: "POST",
                body: EcommerceClassRepo.getJSON(customer),
                headers: EcommerceClassRepo.getPostHeaders()
            }).then((response) => {
                return response.json();
            }).then((json) => {
                if (json.message) {
                    document.body.dispatchEvent(EcommerceClassRepo.showAlertEvent(json.message));
                }
                this.customerCreated = true;
            }).catch((error) => {
                document.body.dispatchEvent(EcommerceClassRepo.showAlertEvent(error.message));
                this.customerCreated = false;
            });
        });
    }
    setBillingAddress(address) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.customerCreated) {
                setTimeout(() => { this.setBillingAddress(address); }, 500);
                return;
            }
            return EcommerceClassRepo.ajax("/Checkout/SetBillingAddress", {
                method: "POST",
                body: EcommerceClassRepo.getJSON(address),
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
    setShippingAddress(address) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.customerCreated) {
                setTimeout(() => { this.setShippingAddress(address); }, 500);
                return;
            }
            return EcommerceClassRepo.ajax("/Checkout/SetShippingAddress", {
                method: "POST",
                body: EcommerceClassRepo.getJSON(address),
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
    setShippingOption(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return EcommerceClassRepo.ajax("/Checkout/SetShippingOption", {
                method: "POST",
                body: EcommerceClassRepo.getJSON({ "optionID": id }),
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
    setPaymentOption(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return EcommerceClassRepo.ajax("/Checkout/SetPaymentOption", {
                method: "POST",
                body: EcommerceClassRepo.getJSON({ "optionID": id }),
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
    redeemCoupon(coupon) {
        return __awaiter(this, void 0, void 0, function* () {
            return EcommerceClassRepo.ajax("/Checkout/AddCoupon", {
                method: "POST",
                body: EcommerceClassRepo.getJSON(coupon),
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
    removeCoupon(coupon) {
        return __awaiter(this, void 0, void 0, function* () {
            return EcommerceClassRepo.ajax("/Checkout/RemoveCoupon", {
                method: "POST",
                body: EcommerceClassRepo.getJSON(coupon),
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
    getAddresses(shippingID, billingID) {
        return __awaiter(this, void 0, void 0, function* () {
            return EcommerceClassRepo.ajax("/Checkout/GetAddresses").then((response) => {
                return response.json();
            }).then((options) => {
                EcommerceClassRepo.applyDropdownList(billingID, options);
                EcommerceClassRepo.applyDropdownList(shippingID, options);
            }).catch((error) => {
                document.body.dispatchEvent(EcommerceClassRepo.showAlertEvent(error.message));
            });
        });
    }
    getAddress(addressID) {
        return __awaiter(this, void 0, void 0, function* () {
            return EcommerceClassRepo.ajax("/Checkout/GetAddress", {
                method: "POST",
                body: EcommerceClassRepo.getJSON(addressID),
                headers: EcommerceClassRepo.getPostHeaders()
            }).then((response) => {
                return response.json();
            }).then((address) => {
                return address;
            }).catch((error) => {
                document.body.dispatchEvent(EcommerceClassRepo.showAlertEvent(error.message));
                return null;
            });
        });
    }
    setOrderNote(note) {
        return __awaiter(this, void 0, void 0, function* () {
            EcommerceClassRepo.ajax("/Checkout/SetOrderNote", {
                method: "POST",
                body: EcommerceClassRepo.getJSON(note),
                headers: EcommerceClassRepo.getPostHeaders()
            }).then((response) => {
                return response.json();
            }).then((j) => {
                if (j.message) {
                    document.body.dispatchEvent(EcommerceClassRepo.showAlertEvent(j.message));
                }
            }).catch((m) => {
                document.body.dispatchEvent(EcommerceClassRepo.showAlertEvent(m.message));
            });
        });
    }
    redirectToThankYouUrl(url) {
        window.location.href = url + (this.orderGUID ? (url.includes("?") ? "&" : "?") + "o=" + this.orderGUID : "");
    }
}
