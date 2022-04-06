// Imports
const addToCart = InitializeEcommerceService("AddToCart");
const checkout = InitializeEcommerceService("Checkout");
const shoppingCart = InitializeEcommerceService("ShoppingCart");
const ecommerceClass = InitializeEcommerceService("EcommerceClass");

const ecommerceCustomClass = (function () {
    function customClass() {
        var self = this;
        this.createBillingAddressObject = function () {
            var address = document.body.querySelector("#billingAddress.form-control");
            var address2 = document.body.querySelector("#billingAddress2.form-control");
            var city = document.body.querySelector("#billingCity.form-control");
            var country = document.body.querySelector("#billingCountry");
            var state = document.body.querySelector("#billingState");
            var zip = document.body.querySelector("#billingZip.form-control");
            if ((address?.value ?? "") != "" && (country?.value ?? "") != "" && (city?.value ?? "") != "" && (zip?.value ?? "") != "" && (country?.value == "USA" ? (state?.value ?? "") != "" : true)) {
                var billingAddressObject = { addressLine1: address.value, addressLine2: address2?.value, addressCity: city.value, addressCountryID: country.value, addressStateID: state.value, addressPostalCode: zip.value };
                var addressID = document.body.querySelector("select#billingAddresses");
                if (addressID && addressID.value != "") {
                    billingAddressObject.addressID = addressID.value;
                }
                return billingAddressObject;
            }
            return null;
        }

        this.setBillingAddress = function (event) {
            ecommerceClass.bootstrapValidate(".customer");
            var addressObject = self.createBillingAddressObject();
            if (addressObject != null) {
                document.body.dispatchEvent(checkout.setBillingAddressEvent(addressObject));
                ecommerceClass.bootstrapValidate(".billing-address");
            }
        }
        this.clearShippingAddress = function (event) {
            ecommerceClass.bootstrapValidate(".customer");
            var addressObject = self.createBillingAddressObject();
            if (addressObject != null) {
                document.body.dispatchEvent(checkout.setShippingAddressEvent(addressObject));
                ecommerceClass.bootstrapValidate(".billing-address");
            }
        }
    }
    return new customClass();
})();

/* Event dispatch */
document.body.addEventListener("click", function (ev) {
    if (ev.target.classList.contains("add-to-cart")) {
        ev.preventDefault();
        document.body.dispatchEvent(addToCart.addToCartEvent(ev.target));
    }

    if (ev.target.parentElement.classList.contains("cart-item-remove-btn") || ev.target.classList.contains("cart-item-remove-btn")) {
        ev.preventDefault();
        var parent = event.target.closest(".cart-item");
        document.body.dispatchEvent(shoppingCart.removeCartItemEvent(parent.querySelector("[name='ID']")?.value));
    }

    if (ev.target.classList.contains("previous-url")) {
        ev.preventDefault();
        document.body.dispatchEvent(shoppingCart.returnShoppingEvent);
    }

    if (ev.target.classList.contains("redeem-coupon")) {
        ev.preventDefault();
        var code = document.body.querySelector("input.coupon-code");
        if (code) {
            document.body.dispatchEvent(checkout.redeemCouponEvent(code.value));
        }
    }

    if (ev.target.classList.contains("remove-coupon")) {
        ev.preventDefault();
        var code = ev.target.parentElement.querySelector(".coupon");
        if (code) {
            document.body.dispatchEvent(checkout.removeCouponEvent(code.innerText));
        }
    }
});

document.body.addEventListener("change", function (ev) {
    if (ev.target.classList.contains("cart-item-units")) {
        var parent = event.target.closest(".cart-item");
        var idSelector = parent.querySelector("input[name=ID]");
        var skuidSelector = parent.querySelector("input[name=SKUID]");
        var quantitySelector = parent.querySelector("input[name=Units]");
        var priceSelector = parent.querySelector(".cart-item-subtotal span");
        var id = idSelector.value;
        var skuid = skuidSelector.value;
        var quantity = quantitySelector.value;

        var cartItem = {
            "ID": id,
            "SKUID": skuid,
            "Quantity": quantity,
            "priceEl": priceSelector
        }
        document.body.dispatchEvent(shoppingCart.updateItemEvent(cartItem));
    }

    if (ev.target.classList.contains("billing-address-select")) {
        document.body.dispatchEvent(checkout.getAddressEvent(ev.target.value, 1));
    }
    if (ev.target.classList.contains("shipping-address-select")) {
        document.body.dispatchEvent(checkout.getAddressEvent(ev.target.value, 2));
    }
    if (ev.target.id == "differentAddress") {
        if (ev.target.checked == false) {
            ecommerceCustomClass.clearShippingAddress(event);
        }
    }
    if (ev.target.classList.contains("order-note")) {
        document.body.dispatchEvent(checkout.setOrderNoteEvent(ev.target.value));
    }
});

/* Consume Events */
document.body.addEventListener("ajax-before", function (ev) {
    ecommerceClass.showAlert(ev.detail);
});
document.body.addEventListener("add-to-cart", function (ev) {
    addToCart.addItem(ev);
});
document.body.addEventListener("remove-cart-item", function (ev) {
    shoppingCart.removeItem(ev).then((html) => {
        var item = document.body.querySelector(".cart-item input[name=ID][value='" + ev.detail.ID + "']")
        if (item) {
            var parent = item.closest(".cart-item");
            if (parent) {
                if (html) {
                    var cart = parent.closest(".cart-content");
                    var newNode = ecommerceClass.decodeHTML(html) || document.createElement("span");
                    cart.insertBefore(newNode, parent);
                }
                parent.remove();
            }
        }
        document.body.dispatchEvent(shoppingCart.updateTotalsEvent);
    });
});
document.body.addEventListener("update-cart-item", function (ev) {
    if (ev.detail.Quantity != "0") {
        shoppingCart.updateItem(ev).then(() => {
            document.body.dispatchEvent(shoppingCart.updateTotalsEvent);
        });
    } else {
        document.body.dispatchEvent(shoppingCart.removeCartItemEvent(ev.detail.ID));
    }
});
document.body.addEventListener("return-shopping", function (ev) {
    shoppingCart.returnShopping();
});
document.body.addEventListener("update-cart", function (ev) {
    shoppingCart.updateTotals();
});

document.body.addEventListener("show-alert", function (ev) {
    ecommerceClass.showAlert(ev.detail);
});

//Checkout Events.
document.body.addEventListener("get-address", function (ev) {
    checkout.getAddress(ev.detail.addressID).then((addressInfo) => {
        var mainID = "";
        if (ev.detail.addressType == 1) {
            mainID = "billing";
        } else if (ev.detail.addressType == 2) {
            mainID = "shipping";
        }
        var element = document.body.querySelector("#" + mainID + "Address.form-control");
        if (element) {
            element.value = addressInfo.addressLine1;
        }
        element = document.body.querySelector("#" + mainID + "Address2.form-control");
        if (element) {
            element.value = addressInfo.addressLine2;
        }
        element = document.body.querySelector("#" + mainID + "City.form-control");
        if (element) {
            element.value = addressInfo.addressCity;
        }
        element = document.body.querySelector("#" + mainID + "Country");
        if (element) {
            element.value = addressInfo.addressCountryID;
        }
        element = document.body.querySelector("#" + mainID + "State");
        if (element) {
            element.value = addressInfo.addressStateID;
        }
        element = document.body.querySelector("#" + mainID + "Zip.form-control");
        if (element) {
            element.value = addressInfo.addressPostalCode;
        }
        var triggerAddress = document.body.querySelector("." + mainID + "-address");
        if (triggerAddress) {
            triggerAddress.dispatchEvent(new Event("change"));
        }

    });
});
document.body.addEventListener("get-states", function (ev) {
    checkout.getStates(ev.detail.selectId, ev.detail.countryId).then(() => {
        var stateEl = document.body.querySelector(ev.detail.selectId);
        var defaultID = stateEl.dataset.default;
        if (defaultID && defaultID != "") {
            stateEl.value = defaultID
        }
    });
});
document.body.addEventListener("set-customer", function (ev) {
    checkout.setCustomer(ev.detail);
});

document.body.addEventListener("set-shipping-address", function (ev) {
    checkout.setShippingAddress(ev.detail).then(() => {
        document.body.dispatchEvent(checkout.updateOrderEvent);
    });
});

document.body.addEventListener("set-billing-address", function (ev) {
    checkout.setBillingAddress(ev.detail).then(() => {
        document.body.dispatchEvent(checkout.updateOrderEvent);
    });
});

document.body.addEventListener("set-shipping-option", function (ev) {
    checkout.setShippingOption(ev.detail).then(() => {
        document.body.dispatchEvent(checkout.updateOrderEvent);
    });
});

document.body.addEventListener("set-payment-option", function (ev) {
    checkout.setPaymentOption(ev.detail).then(() => { 
        var paymentForm = document.body.querySelector("#paymentForm");
        if (paymentForm) {
            checkout.getPaymentForm().then((form) => {
                paymentForm.innerHTML = form;
                var js = paymentForm.querySelectorAll("script[data-initialize]");
                if (js) {
                    Array.prototype.slice.call(js).forEach((element) => {
                        eval(element.innerText);
                    });
                }
            });
        }
    });
});

document.body.addEventListener("redeem-coupon", function (ev) {
    checkout.redeemCoupon(ev.detail).then(() => {
        var couponInput = document.body.querySelector("input.coupon-code");
        if (couponInput) {
            couponInput.value = "";
        }
        document.body.dispatchEvent(checkout.updateOrderEvent);
    });
});


document.body.addEventListener("remove-coupon", function (ev) {
    checkout.removeCoupon(ev.detail).then(() => {
        document.body.dispatchEvent(checkout.updateOrderEvent);
    });
});

document.body.addEventListener("set-order-note", function (ev) {
    checkout.setOrderNote(ev.detail);
});

document.body.addEventListener("create-order", function (ev) {
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var needsValidation = document.querySelectorAll('.needs-validation')

    // Loop over them and prevent submission
    var totalFailed = 0;
    Array.prototype.slice.call(needsValidation)
        .filter(el => !el.classList.contains("shipping-address") || document.body.querySelector("#differentAddress")?.checked)
        .forEach(function (element) {
            var inputs = element.querySelectorAll("input, select");
            Array.prototype.slice.call(inputs).forEach((childElement) => {
                if (!childElement.checkValidity()) {
                    totalFailed++;
                }
            });
            element.classList.add('was-validated')
        });
    if (totalFailed == 0) {
        checkout.createOrder();
    }
});

document.body.addEventListener("payment", function (ev) {
    if (checkout.orderGUID != "" && checkout.payment) {
        checkout.payment(ev);
    }
});

document.body.addEventListener("update-order", function (ev) {
    checkout.getOrder().then((html) => { 
        var checkoutTotals = document.querySelector("#checkout-cart");
        if (checkoutTotals) {
            checkoutTotals.innerHTML = html;
        }
    });
});

document.body.addEventListener("payment-result", function (ev) {
    if (ev.detail.paymentSuccessful) {
        var url = document.body.querySelector("#checkout-cart");
        if (url) {
            checkout.redirectToThankYouUrl(url.dataset.thankyouurl);
        }
    } else if (ev.detail.message) {
        document.body.dispatchEvent(ecommerceClass.showAlertEvent(ev.detail.message));
    }
});

document.body.addEventListener("get-addresses", (ev) => {
    checkout.getAddresses("#shippingAddresses", "#billingAddresses").then(() => {
        var shippingAddresses = document.querySelector("#shippingAddresses");
        if (shippingAddresses && shippingAddresses.childElementCount == 0) {
            shippingAddresses.parentElement.classList.add("d-none");
        } else if (shippingAddresses) {
            var defaultID = shippingAddresses.dataset.default;
            if (defaultID && defaultID != "") {
                shippingAddresses.value = defaultID;
            }
        }
        var billingAddresses = document.querySelector("#billingAddresses");
        if (billingAddresses && billingAddresses.childElementCount == 0) {
            billingAddresses.parentElement.classList.add("d-none");
        } else if (billingAddresses) {
            var defaultID = billingAddresses.dataset.default;
            if (defaultID && defaultID != "") {
                billingAddresses.value = defaultID;
            }
        }
    });
});

//Document DOMContentLoaded

document.addEventListener("DOMContentLoaded", (event) => {
    // Grab change events
    var billingCountry = document.body.querySelector("#billingCountry");
    if (billingCountry) {
        billingCountry.addEventListener("change", (event) => {
            var billingState = document.body.querySelector("#billingState");
            if (billingState) {
                document.body.dispatchEvent(checkout.getStatesEvent("#billingState", billingCountry.value));
            }
        });
        checkout.getCountries("#billingCountry").then(() => {
            var defaultID = billingCountry.dataset.default;
            if (defaultID && defaultID != "") {
                billingCountry.value = defaultID
            }
            billingCountry.dispatchEvent(new Event("change"));
        });
    }
    var shippingCountry = document.body.querySelector("#shippingCountry");
    if (shippingCountry) {
        shippingCountry.addEventListener("change", (event) => {
            var shippingState = document.body.querySelector("#shippingState");
            if (shippingState) {
                document.body.dispatchEvent(checkout.getStatesEvent("#shippingState", shippingCountry.value));
            }
        });
        checkout.getCountries("#shippingCountry").then(() => {
            var defaultID = shippingCountry.dataset.default;
            if (defaultID && defaultID != "") {
                shippingCountry.value = defaultID
            }
            shippingCountry.dispatchEvent(new Event("change"));
        });
    }
    var customer = document.body.querySelector(".customer");
    if (customer) {
        customer.addEventListener("change", (event) => {
            var firstName = document.body.querySelector("#firstName.form-control");
            var lastName = document.body.querySelector("#lastName.form-control");
            var email = document.body.querySelector("#email.form-control");
            if ((firstName?.value ?? "") != "" && (lastName?.value ?? "") != "" && (email?.value ?? "") != "") {
                var customerObject = { firstName: firstName.value, lastName: lastName.value, email: email.value };
                document.body.dispatchEvent(checkout.setCustomerEvent(customerObject));
                customer.classList.add("was-validated");
                ecommerceClass.bootstrapValidate(".customer");  
            }
        });
    }

    var billingAddress = document.body.querySelector(".billing-address");
    if (billingAddress) {
        billingAddress.addEventListener("change", (event) => {
            ecommerceCustomClass.setBillingAddress(event);
        });
    }

    var shippingAddress = document.body.querySelector(".shipping-address");
    if (shippingAddress) {
        shippingAddress.addEventListener("change", (event) => {
            ecommerceClass.bootstrapValidate(".customer");
            ecommerceClass.bootstrapValidate(".billing-address");
            var useShippingAddress = document.body.querySelector("#differentAddress");
            if (useShippingAddress?.checked) {
                var address = document.body.querySelector("#shippingAddress.form-control");
                var address2 = document.body.querySelector("#shippingAddress2.form-control");
                var city = document.body.querySelector("#shippingCity.form-control");
                var country = document.body.querySelector("#shippingCountry");
                var state = document.body.querySelector("#shippingState");
                var zip = document.body.querySelector("#shippingZip.form-control");
                if ((address?.value ?? "") != "" && (city?.value ?? "") != "" && (country?.value ?? "") != "" && (zip?.value ?? "") != "" && (country?.value == "USA" ? (state?.value ?? "") != "" : true)) {
                    var shippingAddressObject = { addressLine1: address.value, addressLine2: address2?.value, addressCity: city.value, addressCountryID: country.value, addressStateID: state.value, addressPostalCode: zip.value };
                    var addressID = document.body.querySelector("select#shippingAddresses");
                    if (addressID && addressID.value != "") {
                        shippingAddressObject.addressID = addressID.value;
                    }
                    document.body.dispatchEvent(checkout.setShippingAddressEvent(shippingAddressObject));
                    ecommerceClass.bootstrapValidate(".shipping-address");
                }
            }
        });
    }

    var shippingOption = document.body.querySelector("#shippingOption");
    if (shippingOption) {
        checkout.getShippingOptions("#shippingOption");
        shippingOption.addEventListener("change", (event) => {
            document.body.dispatchEvent(checkout.setShippingOptionEvent(shippingOption.value));
            ecommerceClass.bootstrapValidate(".shipping-option");
        });
    }

    var paymentMethodsCont = document.body.querySelector("#paymentMethods");
    if (paymentMethodsCont) {
        checkout.getPaymentOptions().then((options) => {
            var paymentOptionHtml = "";
            for (var i = 0; i < options.length; i++) {
                var option = options[i];
                paymentOptionHtml += '<div class="custom-control custom-radio"><input id="paymentMethod_' + i + '" name="paymentMethod" value="' + option.value + '" type="radio" class="custom-control-input" ' + (option.selected ? 'checked=""' : "") + ' required=""><label class="custom-control-label" for="paymentMethod_' + i + '">' + option.text + '</label></div>';
            }
            paymentMethodsCont.innerHTML = paymentOptionHtml;

            var paymentMethods = document.body.querySelectorAll("[name=paymentMethod]");
            if (paymentMethods && paymentMethods.length > 0) {
                for (var i = 0; i < paymentMethods.length; i++) {
                    paymentMethods[i].addEventListener("change", (event) => {
                        paymentMethod = document.body.querySelector("[name=paymentMethod]:checked");
                        if (paymentMethod) {
                            document.body.dispatchEvent(checkout.setPaymentOptionEvent(paymentMethod.value));
                        }
                        ecommerceClass.bootstrapValidate("#paymentMethods");
                    });
                }
                var paymentMethod = document.body.querySelector("[name=paymentMethod]:checked");
                if (paymentMethod) {
                    document.body.dispatchEvent(checkout.setPaymentOptionEvent(paymentMethod.value));
                }
                ecommerceClass.bootstrapValidate("#paymentMethods");
            }
        });     
    }

    var differentAddress = document.body.querySelector("#differentAddress");
    if (differentAddress) {
        differentAddress.addEventListener("change", (event) => {
            var shippingAddress = document.querySelector(".shipping-address");
            if (shippingAddress) {
                if (differentAddress.checked) {
                    shippingAddress.classList.remove("d-none");
                } else {
                    shippingAddress.classList.add("d-none");
                }
            }
        });
    }

    var addresses = document.body.querySelectorAll("#billingAddresses, #shippingAddresses");
    if (addresses.length > 0) {
        document.body.dispatchEvent(checkout.getAddressesEvent);
    }
});