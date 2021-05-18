import { ListItem } from "./ListItem";
export declare class EcommerceClassRepo {
    static tokenInput(): string;
    static showAlert(alert: string): void;
    static showAlertEvent(message: string): CustomEvent;
    static getJSON(dict: any): string;
    static getPostHeaders(name?: string): {
        [key: string]: string;
    };
    static closest(elem: HTMLElement, selector: string): HTMLElement;
    static serializeForm(form: HTMLFormElement): {
        [key: string]: any;
    };
    static replaceForm(event: Event): Promise<void>;
    static decodeHTML(encodedString: string): Node | undefined;
    static applyDropdownList(selectId: string, list: ListItem[]): void;
    static bootstrapValidate(id: string): void;
    static ajax(url: string, options?: {
        [key: string]: any;
    }, message?: any): Promise<Response>;
}
