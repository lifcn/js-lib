"use strict";
var scripts = document.getElementsByTagName("script")
  , index = scripts.length - 1
  , myScript = scripts[index]
  , EoneoPay = createInstance;

function createInstance(apiToken) {
  var privateScope = {
    mApiUri: "https://pay.eoneopay.com",
    mToken: apiToken,
    mCardTypes: [
      {
        type: "visaelectron",
        patterns: [4026, 417500, 4405, 4508, 4844, 4913, 4917],
        format: /(\d{1,4})/g,
        length: [16],
        cvcLength: [3],
        luhn: !0
      }, {
        type: "maestro",
        patterns: [5018, 502, 503, 56, 58, 639, 6220, 67],
        format: /(\d{1,4})/g,
        length: [12, 13, 14, 15, 16, 17, 18, 19],
        cvcLength: [3],
        luhn: !0
      }, {
        type: "forbrugsforeningen",
        patterns: [600],
        format: /(\d{1,4})/g,
        length: [16],
        cvcLength: [3],
        luhn: !0
      }, {
        type: "dankort",
        patterns: [5019],
        format: /(\d{1,4})/g,
        length: [16],
        cvcLength: [3],
        luhn: !0
      }, {
        type: "visa",
        patterns: [4],
        format: /(\d{1,4})/g,
        length: [13, 16],
        cvcLength: [3],
        luhn: !0
      }, {
        type: "mastercard",
        patterns: [51, 52, 53, 54, 55, 22, 23, 24, 25, 26, 27],
        format: /(\d{1,4})/g,
        length: [16],
        cvcLength: [3],
        luhn: !0
      }, {
        type: "amex",
        patterns: [34, 37],
        format: /(\d{1,4})(\d{1,6})?(\d{1,5})?/,
        length: [15],
        cvcLength: [3, 4],
        luhn: !0
      }, {
        type: "dinersclub",
        patterns: [30, 36, 38, 39],
        format: /(\d{1,4})(\d{1,6})?(\d{1,4})?/,
        length: [14],
        cvcLength: [3],
        luhn: !0
      }, {
        type: "discover",
        patterns: [60, 64, 65, 622],
        format: /(\d{1,4})/g,
        length: [16],
        cvcLength: [3],
        luhn: !0
      }, {
        type: "unionpay",
        patterns: [62, 88],
        format: /(\d{1,4})/g,
        length: [16, 17, 18, 19],
        cvcLength: [3],
        luhn: !1
      }, {
        type: "jcb",
        patterns: [35],
        format: /(\d{1,4})/g,
        length: [16],
        cvcLength: [3],
        luhn: !0
      }
    ],
    getCardNameBasedOnNumber: function(number) {
      var card = privateScope.getCardBasedOnNumber(String(number));
      return card ? card.type : 'unknown';
    },
    validateAccountNumber: function(number) {
      return /^[0-9]{6,9}$/.test(String(number))
    },
    validateCardNumber: function(number) {
      var numberString = String(number), card = privateScope.getCardBasedOnNumber(numberString);
      return card ? -1 == card.length.indexOf(numberString.length) ? !1 : privateScope.luhnCheck(numberString) : !1
    },
    validateAccountName: function(name) {
      return /^.{6,50}$/.test(String(name))
    },
    getCardBasedOnNumber: function(e) {
      for (var t = 0; t < privateScope.mCardTypes.length; t++)
        for (var r = 0; r < privateScope.mCardTypes[t].patterns.length; r++) {
          var n = "" + privateScope.mCardTypes[t].patterns[r];
          if (e.substring(0, n.length) == n)
            return privateScope.mCardTypes[t]
        }
    },
    getCardBasedOnType: function(e) {
      for (var t = 0; t < privateScope.mCardTypes.length; t++)
        if (privateScope.mCardTypes[t].type == e)
          return privateScope.mCardTypes[t]
    },
    luhnCheck: function(e) {
      return function(t) {
        for (var r, n = t.length, a = 1, i = 0; n; )
          r = parseInt(t.charAt(--n), 10),
            i += (a ^= 1) ? e[r] : r;
        return i && i % 10 === 0
      }
    }([0, 2, 4, 6, 8, 1, 3, 5, 7, 9]),
    ajaxSuccess: function(resolve, reject, xhr) {
      return function() {
        var response = JSON.parse(xhr.response)

        if (xhr.status == 401) {
          reject(privateScope.eoneoException('Eoneo: User is not authorized'))
        }

        if (xhr.status == 400) {
          return reject(response)
        } else {
          resolve(response)
        }
      }
    },
    ajaxFailure: function(reject, xhr) {
      return function() {
        reject(privateScope.eoneoException('Eoneo: Unsuccessful request'))
      }
    },
    getHttpRequest: function() {
      if (window && window.XMLHttpRequest)
        return new window.XMLHttpRequest;
      try {
        return new ActiveXObject("MSXML2.XMLHTTP.3.0");
      } catch (e) {
        return null
      }
    },
    xhrRequest: function(type, endpoint, data) {
      return new Promise(function (resolve, reject) {
        var
          xhr = privateScope.getHttpRequest(),
          uri = privateScope.mApiUri + endpoint;

        if (!xhr) {
          throw privateScope.eoneoException('Eoneo: Current platform is not supporting XMLHttpRequest');
        }

        xhr.open(type || 'POST', uri, true);
        xhr.setRequestHeader('Authorization', 'Basic ' + btoa(privateScope.mToken + ':'));
        xhr.setRequestHeader('Content-type', 'application/vnd.eoneopay.v1+json');
        xhr.setRequestHeader('Accept', 'application/json');
        xhr.onload = privateScope.ajaxSuccess(resolve, reject, xhr);
        xhr.onerror = privateScope.ajaxFailure(reject, xhr);
        xhr.send(data);
      })
    },
    eoneoException: function (message) {
      return {
        message: message,
        name: 'eoneo-exception',
      }
    }
  }

  return apiToken ?  {
    tokeniseCard: function(data) {
      data.type = 'credit_card'
      return privateScope.xhrRequest('POST', '/tokens', JSON.stringify(data))
    },
    tokeniseAccount: function(data) {
      data.country = 'AU';
      data.type = 'bank_account';
      return privateScope.xhrRequest('POST', '/tokens', JSON.stringify(data))
    },
    getTokenInformation: function(token) {
      return privateScope.xhrRequest('GET', '/tokens/' + token)
    },
    getCardNameBasedOnNumber: function(number) {
      return privateScope.getCardNameBasedOnNumber(number)
    },
    validateAccountNumber: function(number) {
      return privateScope.validateAccountNumber(number)
    },
    validateAccountName: function(name) {
      return privateScope.validateAccountName(name)
    },
    validateCardNumber: function(number) {
      return privateScope.validateCardNumber(number)
    },
  } : {}
};