'use strict';

var CARD_TYPES = [
    {
        type: 'visaelectron',
        patterns: /^(4026|417500|4405|4508|4844|4913|4917)/,
        format: /(\d{1,4})/g,
        length: /^16$/,
        cvcLength: /^3$/,
        luhn: true
    },
    {
        type: 'maestro',
        patterns: /^(5018|502|503|56|58|639|6220|67)/,
        format: /(\d{1,4})/g,
        length: /^(12|13|14|15|16|17|18|19)/,
        cvcLength: /^3$/,
        luhn: true
    },
    {
        type: 'forbrugsforeningen',
        patterns: /^600/,
        format: /(\d{1,4})/g,
        length: /^16$/,
        cvcLength: /^3$/,
        luhn: true
    },
    {
        type: 'dankort',
        patterns: /^5019/,
        format: /(\d{1,4})/g,
        length: /^16$/,
        cvcLength: /^3$/,
        luhn: true
    },
    {
        type: 'visa',
        patterns: /^4/,
        format: /(\d{1,4})/g,
        length: /^(13|16)/,
        cvcLength: /^3$/,
        luhn: true
    },
    {
        type: 'mastercard',
        patterns: /^(51|52|53|54|55|22|23|24|25|26|27)/,
        format: /(\d{1,4})/g,
        length: /^(13|16)/,
        cvcLength: /^3$/,
        luhn: true
    },
    {
        type: 'amex',
        patterns: /^(34|37)/,
        format: /(\d{1,4})(\d{1,6})?(\d{1,5})?/,
        length: /^15$/,
        cvcLength: /^(3|4)/,
        luhn: true
    },
    {
        type: 'dinersclub',
        patterns: /^(30|36|38|39)/,
        format: /(\d{1,4})(\d{1,6})?(\d{1,4})?/,
        length: /^14$/,
        cvcLength: /^3$/,
        luhn: true
    },
    {
        type: 'discover',
        patterns: /^(60|64|65|622)/,
        format: /(\d{1,4})/g,
        length: /^16$/,
        cvcLength: /^3$/,
        luhn: true,
    },
    {
        type: 'unionpay',
        patterns: /^(62|88)/,
        format: /(\d{1,4})/g,
        length: /^(16|17|18|19)/,
        cvcLength: /^3$/,
        luhn: false,
    },
    {
        type: 'jcb',
        patterns: /^35/,
        format: /(\d{1,4})/g,
        length: /^16$/,
        cvcLength: /^3$/,
        luhn: true,
    }
];

var msg = {
    invalidCardNumber: 'invalid card number',
    invalidCardName: 'invalid card name',
    invalidAccountName: 'invalid account name',
    invalidAccountNumber: 'invalid account number',
    expiryRequired: 'expiry.month and expiry.year is required',
    accountPrefixRequired: 'account prefix is required',
    expiryMonthLength: 'expiry month has to consist of 2 symbols',
    expiryYearLength: 'expiry year has to consist of 4 symbols',
    tokenRequired: 'token is required',
    unauthorized: 'user is not authorized',
    requestError: 'unsuccessful request',
};

function createError(message) {
    return {
        name: 'eoneo-exception',
        message: message,
    };
}
function emitError(message, callback) {
    var msg = message;
    if (msg instanceof Array) {
        msg = msg.join(', ');
    }
    var error = createError(msg);
    if (typeof callback === 'function') {
        callback(error);
    }
    else if (Promise) {
        return Promise.reject(error);
    }
    else {
        return error;
    }
}

var EoneoPay = /** @class */ (function () {
    function EoneoPay(params) {
        this.params = params;
        if (!params || (typeof params === 'object' && !params.token)) {
            throw new Error('token is required');
        }
    }
    Object.defineProperty(EoneoPay.prototype, "token", {
        get: function () {
            var params = this.params;
            return typeof params === 'string' ? params : params.token;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EoneoPay.prototype, "url", {
        get: function () {
            var params = this.params;
            if (typeof params === 'object' && params.url) {
                return params.url;
            }
            return 'https://pay.eoneopay.com';
        },
        enumerable: true,
        configurable: true
    });
    EoneoPay.prototype.luhnCheck = function (cardNumber) {
        var arr = [0, 2, 4, 6, 8, 1, 3, 5, 7, 9];
        var len = cardNumber.length;
        var bit = 1;
        var sum = 0;
        var val;
        while (len) {
            val = parseInt(cardNumber.charAt(--len), 10);
            bit ^= 1;
            sum += bit ? arr[val] : val;
        }
        return !!sum && sum % 10 === 0;
    };
    EoneoPay.prototype.sendRequest = function (params) {
        var xhr;
        if (XMLHttpRequest) {
            xhr = new XMLHttpRequest();
        }
        else {
            try {
                xhr = new ActiveXObject('MSXML2.XMLHTTP.3.0');
            }
            catch (e) {
                throw new Error('current platform does not support XMLHttpRequest');
            }
        }
        var callback = params.callback;
        var url = this.url + params.endpoint;
        xhr.responseType = 'json';
        xhr.open(params.type, url, true);
        xhr.setRequestHeader('Authorization', 'Basic ' + btoa(this.token + ':'));
        xhr.setRequestHeader('Content-type', 'application/vnd.eoneopay.v1+json');
        xhr.setRequestHeader('Accept', 'application/json');
        var catchError = function (msg, reject) {
            var error = createError(msg);
            if (typeof callback === 'function') {
                callback(error);
            }
            else if (typeof reject === 'function') {
                reject(error);
            }
        };
        var body = params.data ? JSON.stringify(params.data) : null;
        var wrapper = function (resolve, reject) {
            xhr.onerror = function () {
                catchError(msg.requestError, reject);
            };
            xhr.onload = function () {
                var status = String(xhr.status);
                var response = xhr.response || {};
                if (/^2/.test(status)) {
                    if (typeof callback === 'function') {
                        callback(null, xhr.response);
                    }
                    if (typeof resolve === 'function') {
                        resolve(xhr.response);
                    }
                }
                else if (/401/.test(status)) {
                    catchError(msg.unauthorized, reject);
                }
                else {
                    catchError(response.message || xhr.statusText, reject);
                }
            };
            xhr.send(body);
        };
        if (Promise && !callback) {
            return new Promise(wrapper);
        }
        else {
            wrapper();
        }
    };
    EoneoPay.prototype.cardTypeForNumber = function (cardNumber) {
        if (cardNumber === void 0) { cardNumber = ''; }
        return this.getCardTypeByNumber(cardNumber);
    };
    EoneoPay.prototype.getCardTypeByNumber = function (cardNumber) {
        if (cardNumber === void 0) { cardNumber = ''; }
        return CARD_TYPES.find(function (cardType) {
            return cardType.patterns.test(cardNumber);
        });
    };
    EoneoPay.prototype.getCardTypeByName = function (type) {
        if (type === void 0) { type = ''; }
        return CARD_TYPES.find(function (cardType) {
            return cardType.type === type;
        });
    };
    EoneoPay.prototype.getPaymentSystem = function (cardNumber) {
        var cardType = this.getCardTypeByNumber(String(cardNumber));
        return cardType ? cardType.type : '';
    };
    EoneoPay.prototype.getCardNameBasedOnNumber = function (cardNumber) {
        return this.getPaymentSystem(cardNumber);
    };
    EoneoPay.prototype.cardNameForNumber = function (cardNumber) {
        return this.getPaymentSystem(cardNumber);
    };
    EoneoPay.prototype.validateAccountNumber = function (accountNumber) {
        return /^[0-9]{6,9}$/.test(String(accountNumber));
    };
    EoneoPay.prototype.validateAccountName = function (name) {
        return /^.{6,100}$/.test(name);
    };
    EoneoPay.prototype.validateCardNumber = function (_cardNumber) {
        var cardNumber = String(_cardNumber);
        var cardType = this.getCardTypeByNumber(cardNumber);
        if (!cardType)
            return false;
        var lengthValid = cardType.length.test(String(cardNumber.length));
        var luhnValid = this.luhnCheck(cardNumber);
        return lengthValid && luhnValid;
    };
    EoneoPay.prototype.tokeniseCard = function (data, callback) {
        return this.tokenizeCard(data, callback);
    };
    EoneoPay.prototype.tokenizeCard = function (data, callback) {
        var errors = [];
        if (!this.validateCardNumber(data.number)) {
            errors.push(msg.invalidCardNumber);
        }
        if (!this.validateAccountName(data.name)) {
            errors.push(msg.invalidCardName);
        }
        if (!data.expiry) {
            errors.push(msg.expiryRequired);
        }
        else if (data.expiry.month.length !== 2) {
            errors.push(msg.expiryMonthLength);
        }
        else if (!/^(.{2}|.{4})$/.test(data.expiry.year)) {
            errors.push(msg.expiryYearLength);
        }
        if (errors.length) {
            // @ts-ignore
            return emitError(errors, callback);
        }
        data.type = 'credit_card';
        return this.sendRequest({
            type: 'POST',
            endpoint: '/tokens',
            data: data,
            callback: callback,
        });
    };
    EoneoPay.prototype.tokeniseAccount = function (data, callback) {
        return this.tokenizeAccount(data, callback);
    };
    EoneoPay.prototype.tokenizeAccount = function (data, callback) {
        var errors = [];
        if (!this.validateAccountNumber(data.number)) {
            errors.push(msg.invalidAccountNumber);
        }
        if (!this.validateAccountName(data.name)) {
            errors.push(msg.invalidAccountName);
        }
        if (!data.prefix) {
            errors.push(msg.accountPrefixRequired);
        }
        if (errors.length) {
            // @ts-ignore
            return emitError(errors, callback);
        }
        data.country = 'AU';
        data.type = 'bank_account';
        return this.sendRequest({
            type: 'POST',
            endpoint: '/tokens',
            data: data,
            callback: callback,
        });
    };
    EoneoPay.prototype.retrieveToken = function (data, resolve, reject) {
        this.tokeniseCard(data, function (error, response) {
            if (error)
                reject(error);
            else
                resolve(response);
        });
    };
    EoneoPay.prototype.getTokenInfo = function (token, callback) {
        if (!token) {
            // @ts-ignore
            return emitError(msg.tokenRequired, callback);
        }
        return this.sendRequest({
            type: 'GET',
            endpoint: "/tokens/" + token,
            callback: callback,
        });
    };
    return EoneoPay;
}());

module.exports = EoneoPay;
