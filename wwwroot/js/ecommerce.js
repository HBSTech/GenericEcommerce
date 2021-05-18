/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/implementation/AddToCartRepo.ts":
/*!*********************************************!*\
  !*** ./src/implementation/AddToCartRepo.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AddToCartRepo": () => (/* binding */ AddToCartRepo)
/* harmony export */ });
/* harmony import */ var _EcommerceClassRepo__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./EcommerceClassRepo */ "./src/implementation/EcommerceClassRepo.ts");

var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};

class AddToCartRepo {
    addItem(event) {
        return __awaiter(this, void 0, void 0, function* () {
            let response = yield _EcommerceClassRepo__WEBPACK_IMPORTED_MODULE_0__.EcommerceClassRepo.ajax("/ShoppingCart/Add", {
                method: "POST",
                body: _EcommerceClassRepo__WEBPACK_IMPORTED_MODULE_0__.EcommerceClassRepo.getJSON(event.detail),
                headers: _EcommerceClassRepo__WEBPACK_IMPORTED_MODULE_0__.EcommerceClassRepo.getPostHeaders()
            });
            if (response.ok) {
                var result = yield response.json();
                document.body.dispatchEvent(_EcommerceClassRepo__WEBPACK_IMPORTED_MODULE_0__.EcommerceClassRepo.showAlertEvent(result.message));
            }
        });
    }
    addToCartEvent(el) {
        var customFields = {};
        Object.keys(el.dataset).filter(function (f) { return /^customField/.test(f); }).forEach(function (key) {
            customFields[key] = el.dataset[key] || "";
        });
        var model = {
            "sKUGUID": el.dataset.sku,
            "quantity": el.dataset.quantity
        };
        if (Object.keys(customFields).length > 0) {
            model["customFields"] = customFields;
        }
        return new CustomEvent("add-to-cart", {
            detail: model
        });
    }
}


/***/ }),

/***/ "./src/implementation/CheckoutRepo.ts":
/*!********************************************!*\
  !*** ./src/implementation/CheckoutRepo.ts ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CheckoutRepo": () => (/* binding */ CheckoutRepo)
/* harmony export */ });
/* harmony import */ var _EcommerceClassRepo__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./EcommerceClassRepo */ "./src/implementation/EcommerceClassRepo.ts");

var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};

class CheckoutRepo {
    constructor() {
        this.paymentEvent = new Event("payment");
        this.orderGUID = "";
        this.createOrderEvent = new Event("create-order");
        this.updateOrderEvent = new Event("update-order");
        this.getCountriesEvent = new Event("get-countries");
        this.customerCreated = document.body.querySelector(".customer[data-customerexists]") != null;
        this.getAddressesEvent = new Event("get-addresses");
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
            var response = yield _EcommerceClassRepo__WEBPACK_IMPORTED_MODULE_0__.EcommerceClassRepo.ajax("/Checkout/GetOrder");
            if (response.ok) {
                return yield response.text();
            }
            else {
                return null;
            }
        });
    }
    getShippingOptions(selectId) {
        return __awaiter(this, void 0, void 0, function* () {
            var response = yield _EcommerceClassRepo__WEBPACK_IMPORTED_MODULE_0__.EcommerceClassRepo.ajax("/Checkout/GetShippingOptions");
            if (response.ok) {
                var options = yield response.json();
                _EcommerceClassRepo__WEBPACK_IMPORTED_MODULE_0__.EcommerceClassRepo.applyDropdownList(selectId, options);
            }
        });
    }
    getPaymentOptions() {
        return __awaiter(this, void 0, void 0, function* () {
            var response = yield _EcommerceClassRepo__WEBPACK_IMPORTED_MODULE_0__.EcommerceClassRepo.ajax("/Checkout/GetPaymentOptions");
            if (response.ok) {
                var options = yield response.json();
                return options;
            }
            else {
                return null;
            }
        });
    }
    getCountries(selectId) {
        return __awaiter(this, void 0, void 0, function* () {
            var response = yield _EcommerceClassRepo__WEBPACK_IMPORTED_MODULE_0__.EcommerceClassRepo.ajax("/Checkout/GetCountries");
            if (response.ok) {
                var options = yield response.json();
                _EcommerceClassRepo__WEBPACK_IMPORTED_MODULE_0__.EcommerceClassRepo.applyDropdownList(selectId, options);
            }
        });
    }
    getStates(selectId, countryId) {
        return __awaiter(this, void 0, void 0, function* () {
            var response = yield _EcommerceClassRepo__WEBPACK_IMPORTED_MODULE_0__.EcommerceClassRepo.ajax("/Checkout/GetStates", {
                method: "POST",
                body: _EcommerceClassRepo__WEBPACK_IMPORTED_MODULE_0__.EcommerceClassRepo.getJSON(countryId),
                headers: _EcommerceClassRepo__WEBPACK_IMPORTED_MODULE_0__.EcommerceClassRepo.getPostHeaders()
            });
            if (response.ok) {
                var options = yield response.json();
                _EcommerceClassRepo__WEBPACK_IMPORTED_MODULE_0__.EcommerceClassRepo.applyDropdownList(selectId, options);
            }
        });
    }
    getPaymentForm() {
        return __awaiter(this, void 0, void 0, function* () {
            var response = yield _EcommerceClassRepo__WEBPACK_IMPORTED_MODULE_0__.EcommerceClassRepo.ajax("/Payment/GetPaymentForm");
            if (response.ok) {
                return yield response.text();
            }
            else {
                return '';
            }
        });
    }
    createOrder() {
        return __awaiter(this, void 0, void 0, function* () {
            var response = yield _EcommerceClassRepo__WEBPACK_IMPORTED_MODULE_0__.EcommerceClassRepo.ajax("/Checkout/CreatOrder", {
                method: "POST",
                body: _EcommerceClassRepo__WEBPACK_IMPORTED_MODULE_0__.EcommerceClassRepo.getJSON({}),
                headers: _EcommerceClassRepo__WEBPACK_IMPORTED_MODULE_0__.EcommerceClassRepo.getPostHeaders()
            });
            if (response.ok) {
                var order = yield response.json();
                if (!order.orderFailed) {
                    this.orderGUID = order.orderGUID;
                    document.body.dispatchEvent(this.paymentEvent);
                }
                else {
                    document.body.dispatchEvent(_EcommerceClassRepo__WEBPACK_IMPORTED_MODULE_0__.EcommerceClassRepo.showAlertEvent(order.message));
                }
            }
        });
    }
    setCustomer(customer) {
        return __awaiter(this, void 0, void 0, function* () {
            var response = yield _EcommerceClassRepo__WEBPACK_IMPORTED_MODULE_0__.EcommerceClassRepo.ajax("/Checkout/SetCustomer", {
                method: "POST",
                body: _EcommerceClassRepo__WEBPACK_IMPORTED_MODULE_0__.EcommerceClassRepo.getJSON(customer),
                headers: _EcommerceClassRepo__WEBPACK_IMPORTED_MODULE_0__.EcommerceClassRepo.getPostHeaders()
            });
            if (response.ok) {
                var json = yield response.json();
                if (json.message) {
                    document.body.dispatchEvent(_EcommerceClassRepo__WEBPACK_IMPORTED_MODULE_0__.EcommerceClassRepo.showAlertEvent(json.message));
                }
                this.customerCreated = true;
            }
        });
    }
    setBillingAddress(address) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.customerCreated) {
                setTimeout(() => { this.setBillingAddress(address); }, 500);
                return;
            }
            var response = yield _EcommerceClassRepo__WEBPACK_IMPORTED_MODULE_0__.EcommerceClassRepo.ajax("/Checkout/SetBillingAddress", {
                method: "POST",
                body: _EcommerceClassRepo__WEBPACK_IMPORTED_MODULE_0__.EcommerceClassRepo.getJSON(address),
                headers: _EcommerceClassRepo__WEBPACK_IMPORTED_MODULE_0__.EcommerceClassRepo.getPostHeaders()
            });
            if (response.ok) {
                var json = yield response.json();
                if (json.message) {
                    document.body.dispatchEvent(_EcommerceClassRepo__WEBPACK_IMPORTED_MODULE_0__.EcommerceClassRepo.showAlertEvent(json.message));
                }
            }
        });
    }
    setShippingAddress(address) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.customerCreated) {
                setTimeout(() => { this.setShippingAddress(address); }, 500);
                return;
            }
            var response = yield _EcommerceClassRepo__WEBPACK_IMPORTED_MODULE_0__.EcommerceClassRepo.ajax("/Checkout/SetShippingAddress", {
                method: "POST",
                body: _EcommerceClassRepo__WEBPACK_IMPORTED_MODULE_0__.EcommerceClassRepo.getJSON(address),
                headers: _EcommerceClassRepo__WEBPACK_IMPORTED_MODULE_0__.EcommerceClassRepo.getPostHeaders()
            });
            if (response.ok) {
                var json = yield response.json();
                if (json.message) {
                    document.body.dispatchEvent(_EcommerceClassRepo__WEBPACK_IMPORTED_MODULE_0__.EcommerceClassRepo.showAlertEvent(json.message));
                }
            }
        });
    }
    setShippingOption(id) {
        return __awaiter(this, void 0, void 0, function* () {
            var response = yield _EcommerceClassRepo__WEBPACK_IMPORTED_MODULE_0__.EcommerceClassRepo.ajax("/Checkout/SetShippingOption", {
                method: "POST",
                body: _EcommerceClassRepo__WEBPACK_IMPORTED_MODULE_0__.EcommerceClassRepo.getJSON({ "optionID": id }),
                headers: _EcommerceClassRepo__WEBPACK_IMPORTED_MODULE_0__.EcommerceClassRepo.getPostHeaders()
            });
            if (response.ok) {
                var json = yield response.json();
                if (json.message) {
                    document.body.dispatchEvent(_EcommerceClassRepo__WEBPACK_IMPORTED_MODULE_0__.EcommerceClassRepo.showAlertEvent(json.message));
                }
            }
        });
    }
    setPaymentOption(id) {
        return __awaiter(this, void 0, void 0, function* () {
            var response = yield _EcommerceClassRepo__WEBPACK_IMPORTED_MODULE_0__.EcommerceClassRepo.ajax("/Checkout/SetPaymentOption", {
                method: "POST",
                body: _EcommerceClassRepo__WEBPACK_IMPORTED_MODULE_0__.EcommerceClassRepo.getJSON({ "optionID": id }),
                headers: _EcommerceClassRepo__WEBPACK_IMPORTED_MODULE_0__.EcommerceClassRepo.getPostHeaders()
            });
            if (response.ok) {
                var json = yield response.json();
                if (json.message) {
                    document.body.dispatchEvent(_EcommerceClassRepo__WEBPACK_IMPORTED_MODULE_0__.EcommerceClassRepo.showAlertEvent(json.message));
                }
            }
        });
    }
    redeemCoupon(coupon) {
        return __awaiter(this, void 0, void 0, function* () {
            var response = yield _EcommerceClassRepo__WEBPACK_IMPORTED_MODULE_0__.EcommerceClassRepo.ajax("/Checkout/AddCoupon", {
                method: "POST",
                body: _EcommerceClassRepo__WEBPACK_IMPORTED_MODULE_0__.EcommerceClassRepo.getJSON(coupon),
                headers: _EcommerceClassRepo__WEBPACK_IMPORTED_MODULE_0__.EcommerceClassRepo.getPostHeaders()
            });
            if (response.ok) {
                var json = yield response.json();
                if (json.message) {
                    document.body.dispatchEvent(_EcommerceClassRepo__WEBPACK_IMPORTED_MODULE_0__.EcommerceClassRepo.showAlertEvent(json.message));
                }
            }
        });
    }
    removeCoupon(coupon) {
        return __awaiter(this, void 0, void 0, function* () {
            var response = yield _EcommerceClassRepo__WEBPACK_IMPORTED_MODULE_0__.EcommerceClassRepo.ajax("/Checkout/RemoveCoupon", {
                method: "POST",
                body: _EcommerceClassRepo__WEBPACK_IMPORTED_MODULE_0__.EcommerceClassRepo.getJSON(coupon),
                headers: _EcommerceClassRepo__WEBPACK_IMPORTED_MODULE_0__.EcommerceClassRepo.getPostHeaders()
            });
            if (response.ok) {
                var json = yield response.json();
                if (json.message) {
                    document.body.dispatchEvent(_EcommerceClassRepo__WEBPACK_IMPORTED_MODULE_0__.EcommerceClassRepo.showAlertEvent(json.message));
                }
            }
        });
    }
    getAddresses(shippingID, billingID) {
        return __awaiter(this, void 0, void 0, function* () {
            var response = yield _EcommerceClassRepo__WEBPACK_IMPORTED_MODULE_0__.EcommerceClassRepo.ajax("/Checkout/GetAddresses");
            if (response.ok) {
                var options = (yield response.json());
                _EcommerceClassRepo__WEBPACK_IMPORTED_MODULE_0__.EcommerceClassRepo.applyDropdownList(billingID, options);
                _EcommerceClassRepo__WEBPACK_IMPORTED_MODULE_0__.EcommerceClassRepo.applyDropdownList(shippingID, options);
            }
        });
    }
    getAddress(addressID) {
        return __awaiter(this, void 0, void 0, function* () {
            var response = yield _EcommerceClassRepo__WEBPACK_IMPORTED_MODULE_0__.EcommerceClassRepo.ajax("/Checkout/GetAddress", {
                method: "POST",
                body: _EcommerceClassRepo__WEBPACK_IMPORTED_MODULE_0__.EcommerceClassRepo.getJSON(addressID),
                headers: _EcommerceClassRepo__WEBPACK_IMPORTED_MODULE_0__.EcommerceClassRepo.getPostHeaders()
            });
            if (response.ok) {
                return (yield response.json());
            }
            else {
                return null;
            }
        });
    }
}


/***/ }),

/***/ "./src/implementation/EcommerceClassRepo.ts":
/*!**************************************************!*\
  !*** ./src/implementation/EcommerceClassRepo.ts ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "EcommerceClassRepo": () => (/* binding */ EcommerceClassRepo)
/* harmony export */ });

var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class EcommerceClassRepo {
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


/***/ }),

/***/ "./src/implementation/ShoppingCartRepo.ts":
/*!************************************************!*\
  !*** ./src/implementation/ShoppingCartRepo.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ShoppingCartRepo": () => (/* binding */ ShoppingCartRepo)
/* harmony export */ });
/* harmony import */ var _EcommerceClassRepo__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./EcommerceClassRepo */ "./src/implementation/EcommerceClassRepo.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};

class ShoppingCartRepo {
    constructor() {
        this.returnShoppingEvent = new Event("return-shopping");
        this.updateTotalsEvent = new Event("update-cart");
    }
    updateTotals() {
        return __awaiter(this, void 0, void 0, function* () {
            var totalToFreeShipping = document.getElementById("free-shipping-promotion");
            var totals = document.getElementById("cart-totals");
            var response = yield _EcommerceClassRepo__WEBPACK_IMPORTED_MODULE_0__.EcommerceClassRepo.ajax("/ShoppingCart/GetTotals");
            if (response.ok) {
                var html = yield response.text();
                var item = _EcommerceClassRepo__WEBPACK_IMPORTED_MODULE_0__.EcommerceClassRepo.decodeHTML(html) || "";
                totals === null || totals === void 0 ? void 0 : totals.replaceWith(item);
            }
            response = yield _EcommerceClassRepo__WEBPACK_IMPORTED_MODULE_0__.EcommerceClassRepo.ajax("/ShoppingCart/GetTotalTillFreeShipping");
            if (response.ok) {
                var html = yield response.text();
                var item = _EcommerceClassRepo__WEBPACK_IMPORTED_MODULE_0__.EcommerceClassRepo.decodeHTML(html) || "";
                totalToFreeShipping === null || totalToFreeShipping === void 0 ? void 0 : totalToFreeShipping.replaceWith(item);
            }
        });
    }
    updateItem(event) {
        return __awaiter(this, void 0, void 0, function* () {
            var response = yield _EcommerceClassRepo__WEBPACK_IMPORTED_MODULE_0__.EcommerceClassRepo.ajax("/ShoppingCart/Update", {
                method: "POST",
                body: _EcommerceClassRepo__WEBPACK_IMPORTED_MODULE_0__.EcommerceClassRepo.getJSON(event.detail),
                headers: _EcommerceClassRepo__WEBPACK_IMPORTED_MODULE_0__.EcommerceClassRepo.getPostHeaders()
            });
            if (response.ok) {
                var json = yield response.json();
                if (!json.message && event.detail.priceEl != null) {
                    console.log(event.detail);
                    event.detail.priceEl.innerHTML = json.price;
                }
                else {
                    document.body.dispatchEvent(_EcommerceClassRepo__WEBPACK_IMPORTED_MODULE_0__.EcommerceClassRepo.showAlertEvent(json.message));
                }
                this.updateTotals();
            }
        });
    }
    removeItem(event) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            var parent = event.detail.parent;
            var id = (_b = (_a = parent.querySelector("input[name=ID]")) === null || _a === void 0 ? void 0 : _a.value) !== null && _b !== void 0 ? _b : 0;
            console.log(id);
            var response = yield _EcommerceClassRepo__WEBPACK_IMPORTED_MODULE_0__.EcommerceClassRepo.ajax("/ShoppingCart/RemoveItem", {
                method: "POST",
                body: id.toString(),
                headers: _EcommerceClassRepo__WEBPACK_IMPORTED_MODULE_0__.EcommerceClassRepo.getPostHeaders()
            });
            if (response.ok) {
                var json = yield response.json();
                if (!json.message) {
                    if (json.html) {
                        var cart = _EcommerceClassRepo__WEBPACK_IMPORTED_MODULE_0__.EcommerceClassRepo.closest(parent, ".cart-content");
                        var newNode = _EcommerceClassRepo__WEBPACK_IMPORTED_MODULE_0__.EcommerceClassRepo.decodeHTML(json.html) || document.createElement("span");
                        cart.insertBefore(newNode, parent);
                    }
                    parent.remove();
                }
                else {
                    document.body.dispatchEvent(_EcommerceClassRepo__WEBPACK_IMPORTED_MODULE_0__.EcommerceClassRepo.showAlertEvent(json.message));
                }
                this.updateTotals();
            }
        });
    }
    returnShopping() {
        history.back();
    }
    updateItemEvent(cartItem) {
        return new CustomEvent("update-cart-item", {
            detail: cartItem
        });
    }
    removeCartItemEvent(parent) {
        return new CustomEvent("remove-cart-item", {
            detail: {
                "parent": parent
            }
        });
    }
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "InitializeEcommerceService": () => (/* binding */ InitializeEcommerceService)
/* harmony export */ });
/* harmony import */ var _implementation_AddToCartRepo__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./implementation/AddToCartRepo */ "./src/implementation/AddToCartRepo.ts");
/* harmony import */ var _implementation_CheckoutRepo__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./implementation/CheckoutRepo */ "./src/implementation/CheckoutRepo.ts");
/* harmony import */ var _implementation_EcommerceClassRepo__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./implementation/EcommerceClassRepo */ "./src/implementation/EcommerceClassRepo.ts");
/* harmony import */ var _implementation_ShoppingCartRepo__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./implementation/ShoppingCartRepo */ "./src/implementation/ShoppingCartRepo.ts");




function InitializeEcommerceService(type) {
    var classObject;
    switch (type) {
        case "AddToCart":
            classObject = new _implementation_AddToCartRepo__WEBPACK_IMPORTED_MODULE_0__.AddToCartRepo();
            break;
        case "Checkout":
            classObject = new _implementation_CheckoutRepo__WEBPACK_IMPORTED_MODULE_1__.CheckoutRepo();
            break;
        case "EcommerceClass":
            classObject = _implementation_EcommerceClassRepo__WEBPACK_IMPORTED_MODULE_2__.EcommerceClassRepo;
            break;
        case "ShoppingCart":
            classObject = new _implementation_ShoppingCartRepo__WEBPACK_IMPORTED_MODULE_3__.ShoppingCartRepo();
            break;
    }
    return classObject;
}
window.InitializeEcommerceService = function (type) {
    return InitializeEcommerceService(type);
};

})();

/******/ })()
;
//# sourceMappingURL=ecommerce.js.map