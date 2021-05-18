"use strict"

import { Address } from "./Address";
import { Customer } from "./Customer";
import { EcommerceClassRepo } from "./EcommerceClassRepo";
import { ListItem } from "./ListItem";

export class CheckoutRepo {
    paymentEvent: Event

    createOrderEvent: Event 

    updateOrderEvent: Event

    getCountriesEvent: Event

    orderGUID: string

    getAddressesEvent: Event

    customerCreated: boolean

    constructor() {
        this.paymentEvent = new Event("payment");
        this.orderGUID = "";
        this.createOrderEvent = new Event("create-order");
        this.updateOrderEvent = new Event("update-order");
        this.getCountriesEvent = new Event("get-countries");
        this.customerCreated = document.body.querySelector(".customer[data-customerexists]") != null;
        this.getAddressesEvent = new Event("get-addresses");
    }

    redeemCouponEvent(coupon: string): CustomEvent<string> {
        return new CustomEvent("redeem-coupon", { detail: coupon });
    }

    removeCouponEvent(coupon: string): CustomEvent<string> {
        return new CustomEvent("remove-coupon", { detail: coupon });
    }

    getStatesEvent(selectId: string, countryId: Number): CustomEvent<{ [key: string]: any}> {
        return new CustomEvent("get-states", { detail: { "selectId": selectId, "countryId": countryId } });
    }

    getAddressEvent(addressID: Number, addressType: Number): CustomEvent<{[key: string]: Number}> {
        return new CustomEvent("get-address", {
            detail: {
                "addressID": addressID,
                "addressType": addressType
            }
        });
    }

    paymentResultEvent(result: object): CustomEvent<object> {
        return new CustomEvent("payment-result", { detail: result });
    }

    setCustomerEvent(result: Customer): CustomEvent<Customer> {
        return new CustomEvent("set-customer", { detail: result });
    }


    setBillingAddressEvent(result: Address): CustomEvent<Address> {
        return new CustomEvent("set-billing-address", { detail: result });
    }


    setShippingAddressEvent(result: Address): CustomEvent<Address> {
        return new CustomEvent("set-shipping-address", { detail: result });
    }


    setShippingOptionEvent(result: number): CustomEvent<number> {
        return new CustomEvent("set-shipping-option", { detail: result });
    }


    setPaymentOptionEvent(result: number): CustomEvent<number> {
        return new CustomEvent("set-payment-option", { detail: result });
    }

    async getOrder(): Promise<string> {
        var response = await EcommerceClassRepo.ajax("/Checkout/GetOrder");
        if (response.ok) {
            return await response.text();
        } else {
            return null as any;
        }
    }

    async getShippingOptions(selectId: string): Promise<void> {
        var response = await EcommerceClassRepo.ajax("/Checkout/GetShippingOptions");
        if (response.ok) {
            var options = await response.json() as ListItem[];
            EcommerceClassRepo.applyDropdownList(selectId, options);
        }
    }

    async getPaymentOptions(): Promise<ListItem[]> {
        var response = await EcommerceClassRepo.ajax("/Checkout/GetPaymentOptions");
        if (response.ok) {
            var options = await response.json() as ListItem[];
            return options;

        }
        else { return null as any; }
    }

    async getCountries(selectId: string): Promise<void> {
        var response = await EcommerceClassRepo.ajax("/Checkout/GetCountries");
        if (response.ok) {
            var options = await response.json() as ListItem[];
            EcommerceClassRepo.applyDropdownList(selectId, options);
        }
    }

    async getStates(selectId: string, countryId: Number): Promise<void> {
        var response = await EcommerceClassRepo.ajax("/Checkout/GetStates", {
            method: "POST",
            body: EcommerceClassRepo.getJSON(countryId),
            headers: EcommerceClassRepo.getPostHeaders()
        });
        if (response.ok) {
            var options = await response.json() as ListItem[];
            EcommerceClassRepo.applyDropdownList(selectId, options);
        }
    }

    async getPaymentForm(): Promise<string> {
        var response = await EcommerceClassRepo.ajax("/Payment/GetPaymentForm");
        if (response.ok) {
            return await response.text();
        }
        else { return ''; }
    }

    async createOrder(): Promise<void> {
        var response = await EcommerceClassRepo.ajax("/Checkout/CreatOrder", {
            method: "POST",
            body: EcommerceClassRepo.getJSON({}),
            headers: EcommerceClassRepo.getPostHeaders()
        });
        if (response.ok) {
            var order = await response.json();
            if (!order.orderFailed) {
                this.orderGUID = order.orderGUID;
                document.body.dispatchEvent(this.paymentEvent);
            } else {
                document.body.dispatchEvent(EcommerceClassRepo.showAlertEvent(order.message));
            }
        }
    }

    async setCustomer(customer: Customer): Promise<void> {
        var response = await EcommerceClassRepo.ajax("/Checkout/SetCustomer", {
            method: "POST",
            body: EcommerceClassRepo.getJSON(customer),
            headers: EcommerceClassRepo.getPostHeaders()
        });
        if (response.ok) {
            var json = await response.json();
            if (json.message) {
                document.body.dispatchEvent(EcommerceClassRepo.showAlertEvent(json.message));
            }
            this.customerCreated = true;
        }
    }

    async setBillingAddress(address: Address): Promise<void> {
        if (!this.customerCreated) {
            setTimeout(() => { this.setBillingAddress(address) }, 500);
            return;
        }
        var response = await EcommerceClassRepo.ajax("/Checkout/SetBillingAddress", {
            method: "POST",
            body: EcommerceClassRepo.getJSON(address),
            headers: EcommerceClassRepo.getPostHeaders()
        });
        if (response.ok) {
            var json = await response.json();
            if (json.message) {
                document.body.dispatchEvent(EcommerceClassRepo.showAlertEvent(json.message));
            }
        }
    }

    async setShippingAddress(address: Address): Promise<void> {
        if (!this.customerCreated) {
            setTimeout(() => { this.setShippingAddress(address) }, 500);
            return;
        }
        var response = await EcommerceClassRepo.ajax("/Checkout/SetShippingAddress", {
            method: "POST",
            body: EcommerceClassRepo.getJSON(address),
            headers: EcommerceClassRepo.getPostHeaders()
        });
        if (response.ok) {
            var json = await response.json();
            if (json.message) {
                document.body.dispatchEvent(EcommerceClassRepo.showAlertEvent(json.message));
            }
        }
    }

    async setShippingOption(id: number): Promise<void> {
        var response = await EcommerceClassRepo.ajax("/Checkout/SetShippingOption", {
            method: "POST",
            body: EcommerceClassRepo.getJSON({ "optionID": id }),
            headers: EcommerceClassRepo.getPostHeaders()
        });
        if (response.ok) {
            var json = await response.json();
            if (json.message) {
                document.body.dispatchEvent(EcommerceClassRepo.showAlertEvent(json.message));
            }
        }
    }

    async setPaymentOption(id: number): Promise<void> {
        var response = await EcommerceClassRepo.ajax("/Checkout/SetPaymentOption", {
            method: "POST",
            body: EcommerceClassRepo.getJSON({ "optionID": id }),
            headers: EcommerceClassRepo.getPostHeaders()
        });
        if (response.ok) {
            var json = await response.json();
            if (json.message) {
                document.body.dispatchEvent(EcommerceClassRepo.showAlertEvent(json.message));
            }
        }
    }

    async redeemCoupon(coupon: string): Promise<void> {
        var response = await EcommerceClassRepo.ajax("/Checkout/AddCoupon", {
            method: "POST",
            body: EcommerceClassRepo.getJSON(coupon),
            headers: EcommerceClassRepo.getPostHeaders()
        });
        if (response.ok) {
            var json = await response.json();
            if (json.message) {
                document.body.dispatchEvent(EcommerceClassRepo.showAlertEvent(json.message));
            }
        }
    }

    async removeCoupon(coupon: string): Promise<void> {
        var response = await EcommerceClassRepo.ajax("/Checkout/RemoveCoupon", {
            method: "POST",
            body: EcommerceClassRepo.getJSON(coupon),
            headers: EcommerceClassRepo.getPostHeaders()
        });
        if (response.ok) {
            var json = await response.json();
            if (json.message) {
                document.body.dispatchEvent(EcommerceClassRepo.showAlertEvent(json.message));
            }
        }
    }

    async getAddresses(shippingID: string, billingID: string): Promise<void> {
        var response = await EcommerceClassRepo.ajax("/Checkout/GetAddresses");
        if (response.ok) {
            var options = (await response.json()) as ListItem[];
            EcommerceClassRepo.applyDropdownList(billingID, options);
            EcommerceClassRepo.applyDropdownList(shippingID, options);
        }
    }

    async getAddress(addressID): Promise<Address> {
        var response = await EcommerceClassRepo.ajax("/Checkout/GetAddress", {
            method: "POST",
            body: EcommerceClassRepo.getJSON(addressID),
            headers: EcommerceClassRepo.getPostHeaders()
        });
        if (response.ok) {
            return (await response.json());
        } else {
            return null as any;
        }
    }
}