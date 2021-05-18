"use strict"

import { ListItem } from "./ListItem";

export class EcommerceClassRepo {
    static tokenInput(): string {
        return "__RequestVerificationToken";
    }

    static showAlert(alert: string): void {
        console.log(alert);
    }

    static showAlertEvent(message: string): CustomEvent {
        return new CustomEvent("show-alert", { detail: message });
    }

    static getJSON(dict: any): string {
        return JSON.stringify(dict);
    }

    static getPostHeaders(name?: string): { [key: string]: string } {
        var elName = name ? name : this.tokenInput();
        var els = document.getElementsByName(elName);
        var token = els.length > 0 ? (els[0] as HTMLInputElement).value : "";
        var tokenName = elName.replace("__", "");
        var dict = { 'Content-Type': 'application/json' }
        dict[tokenName] = token;
        return dict;
    }

    static closest(elem: HTMLElement, selector: string): HTMLElement {
        for (; elem && elem.nodeName !== document.nodeName; elem = elem.parentNode as HTMLElement) {
            if (elem.matches(selector)) return elem;
        }
        return null as unknown as HTMLElement;
    }

    static serializeForm(form: HTMLFormElement): { [key: string]: any } {
        var obj = {} as { [key: string]: any };
        var formData = new FormData(form);
        formData.forEach(function (value, key, parent) {
            obj[key] = value.valueOf();
        });
        return obj;
    }

    static async replaceForm(event: Event): Promise<void> {
        event.preventDefault();
        var form = event.target as HTMLFormElement;

        var response = await fetch(form.action, {
            method: "POST",
            body: EcommerceClassRepo.getJSON(this.serializeForm(form)),
            headers: this.getPostHeaders()
        });
        if (response.ok) {
            var header = response.headers.get("content-type");
            if (header !== null && header.indexOf("application/json") !== -1) {
                var json = await response.json();
                if (json.message) {
                    document.body.dispatchEvent(EcommerceClassRepo.showAlertEvent(json.message));
                }
            } else {
                var html = await response.text();
                if (html.length > 0) {
                    var domObj = new DOMParser();
                    var item = domObj.parseFromString(html, "text/html");
                    form.replaceWith(item);
                } else {
                    form.remove();
                }
            }
        }
    }

    static decodeHTML(encodedString: string): Node | undefined {
        var txt = document.createElement('textarea');
        txt.innerHTML = encodedString;
        var div = document.createElement('div');
        div.innerHTML = txt.value;
        return div.firstChild?.getRootNode();
    }

    static applyDropdownList(selectId: string, list: ListItem[]): void {
        var select = document.body.querySelector(selectId);
        if (select) {
            var optionHtml = "";
            if (list) {
                for (var i = 0; i < list.length; i++) {
                    var item = list[i];
                    optionHtml += '<option value="' + item.value + '"' + (item.selected ? ' selected="true"' : '') + '>' + item.text + "</option>";
                }
            }
            select.innerHTML = optionHtml;
        }
    }

    static bootstrapValidate(id: string): void {
        var selector = document.querySelector(id);
        if (selector && !selector.classList.contains("was-validated")) {
            selector.classList.add("was-validated");
        }
    }

    static async ajax(url: string, options?: { [key: string]: any }, message?:any): Promise<Response> {
        document.body.dispatchEvent(new CustomEvent("ajax-before", { detail: message }));
        var ajaxCall: Promise<Response>;
        if (options) {
            ajaxCall = fetch(url, options);
        } else {
            ajaxCall = fetch(url);
        }
        ajaxCall.then((response) => {
            document.body.dispatchEvent(new Event("ajax-after"));
            return response;
        });
        return ajaxCall;
    }
}