import { AddToCartModel } from "./AddToCartModel";
export declare class AddToCartRepo {
    addItem(event: CustomEvent<{
        [key: string]: any;
    }>): Promise<void>;
    addToCartEvent(el: HTMLElement): CustomEvent<{
        [key: string]: AddToCartModel;
    }>;
}
