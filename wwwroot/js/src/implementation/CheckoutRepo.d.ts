import { Address } from "./Address";
import { Customer } from "./Customer";
import { ListItem } from "./ListItem";
export declare class CheckoutRepo {
    paymentEvent: Event;
    createOrderEvent: Event;
    updateOrderEvent: Event;
    getCountriesEvent: Event;
    orderGUID: string;
    getAddressesEvent: Event;
    customerCreated: boolean;
    constructor();
    redeemCouponEvent(coupon: string): CustomEvent<string>;
    removeCouponEvent(coupon: string): CustomEvent<string>;
    getStatesEvent(selectId: string, countryId: Number): CustomEvent<{
        [key: string]: any;
    }>;
    getAddressEvent(addressID: Number, addressType: Number): CustomEvent<{
        [key: string]: Number;
    }>;
    paymentResultEvent(result: object): CustomEvent<object>;
    setCustomerEvent(result: Customer): CustomEvent<Customer>;
    setBillingAddressEvent(result: Address): CustomEvent<Address>;
    setShippingAddressEvent(result: Address): CustomEvent<Address>;
    setShippingOptionEvent(result: number): CustomEvent<number>;
    setPaymentOptionEvent(result: number): CustomEvent<number>;
    getOrder(): Promise<string>;
    getShippingOptions(selectId: string): Promise<void>;
    getPaymentOptions(): Promise<ListItem[]>;
    getCountries(selectId: string): Promise<void>;
    getStates(selectId: string, countryId: Number): Promise<void>;
    getPaymentForm(): Promise<string>;
    createOrder(): Promise<void>;
    setCustomer(customer: Customer): Promise<void>;
    setBillingAddress(address: Address): Promise<void>;
    setShippingAddress(address: Address): Promise<void>;
    setShippingOption(id: number): Promise<void>;
    setPaymentOption(id: number): Promise<void>;
    redeemCoupon(coupon: string): Promise<void>;
    removeCoupon(coupon: string): Promise<void>;
    getAddresses(shippingID: string, billingID: string): Promise<void>;
    getAddress(addressID: any): Promise<Address>;
}
