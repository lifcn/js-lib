'use strict';

var CARD_TYPES = [
    {
        name: 'visaelectron',
        patterns: /^(4026|417500|4405|4508|4844|4913|4917)/,
        format: /(\d{1,4})/g,
        length: /^16$/,
        cvcLength: /^3$/,
        luhn: true
    },
    {
        name: 'maestro',
        patterns: /^(5018|502|503|56|58|639|6220|67)/,
        format: /(\d{1,4})/g,
        length: /^(12|13|14|15|16|17|18|19)/,
        cvcLength: /^3$/,
        luhn: true
    },
    {
        name: 'forbrugsforeningen',
        patterns: /^600/,
        format: /(\d{1,4})/g,
        length: /^16$/,
        cvcLength: /^3$/,
        luhn: true
    },
    {
        name: 'dankort',
        patterns: /^5019/,
        format: /(\d{1,4})/g,
        length: /^16$/,
        cvcLength: /^3$/,
        luhn: true
    },
    {
        name: 'visa',
        patterns: /^4/,
        format: /(\d{1,4})/g,
        length: /^(13|16)/,
        cvcLength: /^3$/,
        luhn: true
    },
    {
        name: 'mastercard',
        patterns: /^(51|52|53|54|55|22|23|24|25|26|27)/,
        format: /(\d{1,4})/g,
        length: /^(13|16)/,
        cvcLength: /^3$/,
        luhn: true
    },
    {
        name: 'amex',
        patterns: /^(34|37)/,
        format: /(\d{1,4})(\d{1,6})?(\d{1,5})?/,
        length: /^15$/,
        cvcLength: /^(3|4)/,
        luhn: true
    },
    {
        name: 'dinersclub',
        patterns: /^(30|36|38|39)/,
        format: /(\d{1,4})(\d{1,6})?(\d{1,4})?/,
        length: /^14$/,
        cvcLength: /^3$/,
        luhn: true
    },
    {
        name: 'discover',
        patterns: /^(60|64|65|622)/,
        format: /(\d{1,4})/g,
        length: /^16$/,
        cvcLength: /^3$/,
        luhn: true,
    },
    {
        name: 'unionpay',
        patterns: /^(62|88)/,
        format: /(\d{1,4})/g,
        length: /^(16|17|18|19)/,
        cvcLength: /^3$/,
        luhn: false,
    },
    {
        name: 'jcb',
        patterns: /^35/,
        format: /(\d{1,4})/g,
        length: /^16$/,
        cvcLength: /^3$/,
        luhn: true,
    }
];

var EoneoPay = /** @class */ (function () {
    function EoneoPay(token, apiUrl) {
        if (apiUrl === void 0) { apiUrl = 'https://pay.eoneopay.com'; }
        this.token = token;
        this.apiUrl = apiUrl;
        if (!token) {
            throw new Error('token is required');
        }
    }
    EoneoPay.prototype.getCardTypeByNumber = function (cardNumber) {
        if (cardNumber === void 0) { cardNumber = ''; }
        return CARD_TYPES.find(function (cardType) {
            return cardType.patterns.test(cardNumber);
        });
    };
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
    EoneoPay.prototype.sendRequest = function (type, endpoint, data) {
        if (type === void 0) { type = 'POST'; }
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
        xhr.responseType = 'json';
        xhr.open(type, this.apiUrl + endpoint, true);
        xhr.setRequestHeader('Authorization', 'Basic ' + btoa(this.token + ':'));
        xhr.setRequestHeader('Content-type', 'application/vnd.eoneopay.v1+json');
        xhr.setRequestHeader('Accept', 'application/json');
        return new Promise(function (resolve, reject) {
            xhr.onload = function () {
                resolve(xhr.response);
            };
            xhr.onerror = function () {
                var message = 'unsuccessful request';
                if (xhr.status === 401) {
                    message = 'user is not authorized';
                }
                reject({
                    message: message,
                    name: 'eoneo-exception',
                });
            };
            xhr.send(data);
        });
    };
    EoneoPay.prototype.getCardTypeByName = function (name) {
        if (name === void 0) { name = ''; }
        return CARD_TYPES.find(function (cardType) {
            return cardType.name === name;
        });
    };
    EoneoPay.prototype.getPaySystem = function (cardNumber) {
        var cardType = this.getCardTypeByNumber(String(cardNumber));
        return cardType ? cardType.name : '';
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
    EoneoPay.prototype.tokeniseCard = function (data) {
        data.type = 'credit_card';
        return this.sendRequest('POST', '/tokens', JSON.stringify(data));
    };
    EoneoPay.prototype.tokeniseAccount = function (data) {
        data.country = 'AU';
        data.type = 'bank_account';
        return this.sendRequest('POST', '/tokens', JSON.stringify(data));
    };
    EoneoPay.prototype.getTokenInfo = function (token) {
        return this.sendRequest('GET', '/tokens/' + token);
    };
    return EoneoPay;
}());

module.exports = EoneoPay;
