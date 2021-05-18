export interface AddToCartModel {
    sKUGUID: string;
    quantity: number;
    customFields?: { [key: string]: any; } | null;
}