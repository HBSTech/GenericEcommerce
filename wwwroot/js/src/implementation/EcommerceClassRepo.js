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
export class EcommerceClassRepo {
    static tokenInput() {
        return "__RequestVerificationToken";
    }
    static showAlert(alert) {
        console.log(alert);
    }
    static showAlertEvent(message) {
        return new CustomEvent("show-alert", { detail: message });
    }
    static getJSON(dict) {
        return JSON.stringify(dict);
    }
    static getPostHeaders(name) {
        var elName = name ? name : this.tokenInput();
        var els = document.getElementsByName(elName);
        var token = els.length > 0 ? els[0].value : "";
        var tokenName = elName.replace("__", "");
        var dict = { 'Content-Type': 'application/json' };
        dict[tokenName] = token;
        return dict;
    }
    static closest(elem, selector) {
        for (; elem && elem.nodeName !== document.nodeName; elem = elem.parentNode) {
            if (elem.matches(selector))
                return elem;
        }
        return null;
    }
    static serializeForm(form) {
        var obj = {};
        var formData = new FormData(form);
        formData.forEach(function (value, key, parent) {
            obj[key] = value.valueOf();
        });
        return obj;
    }
    static replaceForm(event) {
        return __awaiter(this, void 0, void 0, function* () {
            event.preventDefault();
            var form = event.target;
            var response = yield fetch(form.action, {
                method: "POST",
                body: EcommerceClassRepo.getJSON(this.serializeForm(form)),
                headers: this.getPostHeaders()
            });
            if (response.ok) {
                var header = response.headers.get("content-type");
                if (header !== null && header.indexOf("application/json") !== -1) {
                    var json = yield response.json();
                    if (json.message) {
                        document.body.dispatchEvent(EcommerceClassRepo.showAlertEvent(json.message));
                    }
                }
                else {
                    var html = yield response.text();
                    if (html.length > 0) {
                        var domObj = new DOMParser();
                        var item = domObj.parseFromString(html, "text/html");
                        form.replaceWith(item);
                    }
                    else {
                        form.remove();
                    }
                }
            }
        });
    }
    static decodeHTML(encodedString) {
        var _a;
        var txt = document.createElement('textarea');
        txt.innerHTML = encodedString;
        var div = document.createElement('div');
        div.innerHTML = txt.value;
        return (_a = div.firstChild) === null || _a === void 0 ? void 0 : _a.getRootNode();
    }
    static applyDropdownList(selectId, list) {
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
    static bootstrapValidate(id) {
        var selector = document.querySelector(id);
        if (selector && !selector.classList.contains("was-validated")) {
            selector.classList.add("was-validated");
        }
    }
    static ajax(url, options, message) {
        return __awaiter(this, void 0, void 0, function* () {
            document.body.dispatchEvent(new CustomEvent("ajax-before", { detail: message }));
            var ajaxCall;
            if (options) {
                ajaxCall = fetch(url, options);
            }
            else {
                ajaxCall = fetch(url);
            }
            ajaxCall.then((response) => {
                document.body.dispatchEvent(new Event("ajax-after"));
                return response;
            });
            return ajaxCall;
        });
    }
}
