import { AddToCartModel } from "./AddToCartModel";
export declare class AddToCartRepo {
    addedToCart: Event;
    constructor();
    addItem(event: CustomEvent<{
        [key: string]: any;
    }>): Promise<void>;
    addToCartEvent(el: HTMLElement): CustomEvent<{
        [key: string]: AddToCartModel;
    }>;
}
