export declare class ShoppingCartRepo {
    returnShoppingEvent: Event;
    updateTotalsEvent: Event;
    constructor();
    updateTotals(): Promise<void>;
    updateItem(event: CustomEvent<{
        [key: string]: any;
    }>): Promise<void>;
    removeItem(event: CustomEvent): Promise<void>;
    returnShopping(): void;
    updateItemEvent(cartItem: {
        [key: string]: any;
    }): CustomEvent<{
        [key: string]: any;
    }>;
    removeCartItemEvent(parent: HTMLElement): CustomEvent<{
        [key: string]: any;
    }>;
}
