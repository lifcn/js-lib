# SDK Reference

## Introduction

Loyalty&nbsp;Corp's **EoneoPay JavaScript SDK v2** provides a JavaScript library with methods for generating **tokens** for credit cards and bank accounts via Loyalty&nbsp;Corp's Payments API. A token is a unique 20 character string representing a credit card or bank account which can be used instead of storing sensitive details such as credit card numbers.

The library also provides helper methods for validating credit card numbers and bank account numbers, and querying a credit card's payment system (e.g. Mastercard or Visa).

All library functionality is accessed via the **EoneoPay** object.

::: tip Note

All references to _credit cards_ in this document include _debit cards_.

:::

### Payments API key

In order to use the EoneoPay JavaScript SDK v2, you will require an **EoneoPay Payments API key**. If you do not have a Payments API key, please contact Loyalty&nbsp;Corp to request one.

::: warning Warning

Make sure you do not reveal your Payments API key to third parties. An API key that has been compromised can be revoked by contacting Loyalty&nbsp;Corp.

:::

#### Set your Payments API key

You can set your own Payments API key for the try-it-yourself examples in this document:

<TokenForm />

### Conventions

#### Currencies

Currencies are defined using the three-letter [ISO 4217](https://en.wikipedia.org/wiki/ISO_4217) currency code, e.g. `AUD` for Australian dollars.

#### Country codes

The country of origin for bank accounts and credit cards is defined using the two-letter [ISO 3166-1 alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) country code, e.g. `AU` for Australia.

#### Timestamps

Timestamps are defined using the combined date and time representation defined in [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601), using UTC (Coordinated Universal Time), also known as Zulu time.

Timestamps are formatted as follows:

`{YYYY}-{MM}-{DD}T{hh}:{mm}:{ss}Z`

where:

- `YYYY` is the four-digit year
- `MM` is the two-digit month (01–12)
- `DD` is the two-digit day (01–31)
- `hh` is the two-digit hour (00–23)
- `mm` is the two-digit minute (00–59)
- `ss` is the two-digit second (00–59)

## Including the SDK

To use the EoneoPay JavaScript SDK v2 in the browser, add the following script tag to your page:

```html
<script src="https://pay.eoneopay.com/eoneo-pay.js"></script>
```

::: warning TBC

The above is to be confirmed.

:::

## Instantiating the EoneoPay object

There are two ways of instantiating the EoneoPay object. In each case, your Payments API key must be provided.

You can instantiate the EoneoPay object by providing the API key directly as a string. For example:

<EoneoInitiation :additional='false' />

Alternatively, you can pass an object with the following properties:

| Name      | Type   | Required | Description            |
| --------- | ------ | -------- | ---------------------- |
| **token** | String | Yes      | Your Payments API key. |
| **url**   | String | Yes      | The Payments API URL.  |

For example: <EoneoInitiation :additional='true' />

## Methods

The EoneoPay object provides the following methods:

- [Tokenise bank account](#tokenise-bank-account)
- [Tokenise credit card](#tokenise-credit-card)
- [Get token info](#get-token-info)
- [Get payment system](#get-payment-system)
- [Validate bank account number](#validate-bank-account-number)
- [Validate credit card number](#validate-credit-card-number)

### Tokenise bank account

The `tokeniseAccount()` method creates a token from the provided bank account information.

The method takes an object with the following properties:

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| **name** | String | No | Bank account holder's name (may range from 6 to 50 characters). |
| **number** | String | Yes | Bank account number (may range from 6 to 9 digits). |
| **prefix** | String | Yes | BSB (Bank State Branch) number (6 digits). |

The method can be called as a promise or with a callback:

- [Tokenise bank account with promise](#tokenise-bank-account-with-promise)
- [Tokenise bank account with callback](#tokenise-bank-account-with-callback)

::: tip Note

A new token will always be generated even if the bank account details provided to the method are exactly the same as a previous call.

:::

#### Tokenise bank account with promise

The following example calls `tokeniseAccount()` as a promise using `await`:

```javascript
try {
  const response = await eoneo.tokeniseAccount({
    name: 'User Name',
    number: '987654321',
    prefix: '123456',
  })
  // use response
} catch (error) {
  console.error(error.message)
}
```

#### Tokenise bank account with callback

To use a callback function with `tokeniseAccount()`, provide a function with error and response parameters. For example:

```javascript
eoneo.tokeniseAccount(
  {
    name: 'User Name',
    number: '987654321',
    prefix: '123456',
  },
  (error, response) => {
    if (error) {
      console.error(error.message)
    } else {
      // use response
    }
  }
)
```

#### Tokenise bank account response

The `tokeniseAccount()` method will return a JSON object with the following fields:

| Name | Type | Description |
| --- | --- | --- |
| **country** | String | [Country](#country-codes) of origin for the bank account. |
| **created_at** | String | [Timestamp](#timestamps) of the bank account token creation time. |
| **currency** | String | [Currency](#currencies) for the bank account. |
| **id** | String | Secure representation of the bank account information, allowing you to determine if the new token is a duplicate of an existing token. |
| **name** | String | Bank account holder's name. |
| **number** | String | Bank account number. |
| **one_time** | Boolean | Whether the bank account is for one-time use (`true`) or not (`false`). A one-time use bank account is not associated with a user. |
| **pan** | String | Masked PAN (Primary Account Number) of the bank account number (including the prefix). |
| **prefix** | String | BSB number. |
| **token** | String | Generated bank account token. |
| **type** | String | Type of payment method (i.e. `bank_account`). |
| **updated_at** | String | [Timestamp](#timestamps) of the most recent bank account token update time. |

For example:

```json
{
  "country": "AU",
  "created_at": "2019-08-09T06:25:27Z",
  "currency": "AUD",
  "id": "937d87ac905a6e007dd1d17fde08747c",
  "name": "User Name",
  "number": "254280294",
  "one_time": false,
  "pan": "111-066...0294",
  "prefix": "111-066",
  "token": "7J8DCM8EAFFMEWGDXZM2",
  "type": "bank_account",
  "updated_at": "2019-08-09T06:25:27Z"
}
```

#### Try it yourself

<TokenizeAccountForm />

### Tokenise credit card

The `tokeniseCard()` method creates a token from the provided credit card information.

The method takes an object with the following properties:

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| **expiry** | Object | Yes | Object containing credit card expiry details. |
| expiry.**month** | String | Yes | Credit card expiry month in MM format. |
| expiry.**year** | String | Yes | Credit card expiry year in YY or YYYY format. |
| **name** | String | Yes | Credit card holder's name (may range from 6 to 50 characters). |
| **number** | String | Yes | Full credit card number. |

The method can be called as a promise or with a callback:

- [Tokenise credit card with promise](#tokenise-credit-card-with-promise)
- [Tokenise credit card with callback](#tokenise-credit-card-with-callback)

::: tip Note

A new token will always be generated even if the credit card details provided to the method are exactly the same as a previous call.

:::

#### Tokenise credit card with promise

The following example calls `tokeniseCard()` as a promise using `await`:

```javascript
try {
  const response = await eoneo.tokeniseCard({
    expiry: {
      month: '01',
      year: '2021',
    },
    name: 'User Name',
    number: '5123450000000008',
  })
  // use response
} catch (error) {
  console.error(error.message)
}
```

#### Tokenise credit card with callback

To use a callback function with `tokeniseCard()`, provide a function with error and response parameters. For example:

```javascript
eoneo.tokeniseCard(
  {
    expiry: {
      month: '01',
      year: '2021',
    },
    name: 'User Name',
    number: '5123450000000008',
  },
  (error, response) => {
    if (error) {
      console.error(error.message)
    } else {
      // use response
    }
  }
)
```

#### Backward compatibility support

In order to support backward compatibility with the EoneoPay JavaScript SDK v1, the library also provides the `retrieveToken()` method which tokenises a credit card in the same way as the `tokeniseCard()` method.

The `retrieveToken()` method takes an object with credit card details (like `tokeniseCard()` above), as well as two callback functions, the first for a valid response, and the second for an error response. For example:

```javascript
eoneo.retrieveToken(
  {
    expiry: {
      month: '01',
      year: '2021',
    },
    name: 'User Name',
    number: '5123450000000008',
  },
  response => {
    // use response
  },
  error => {
    // handle exception
  }
)
```

#### Tokenise credit card response

The `tokeniseCard()` and `retrieveToken()` methods will return a JSON object with the following fields:

| Name | Type | Description |
| --- | --- | --- |
| **bin** | Object | Object containing BIN (Bank Identification Number) information for the credit card, retrieved from the acquiring bank. |
| bin.**bin** | String | Credit card BIN (first six digits of credit card number). |
| bin.**category** | String | Category of credit card, which usually indicates the credit card level, e.g. `Standard` or `Platinum`. |
| bin.**country** | String | [Country](#country-codes) of issue for the credit card. |
| bin.**created_at** | String | [Timestamp](#timestamps) of the BIN object creation time. |
| bin.**funding_source** | String | Credit card funding source, i.e. `CREDIT` or `DEBIT`. |
| bin.**issuer** | String | Banking institution that issued the credit card. |
| bin.**prepaid** | Boolean | Whether the credit card is prepaid (`true`) or not (`false` or `null`). |
| bin.**scheme** | String | Credit card scheme, which is usually one of `MASTERCARD`, `VISA` or `AMERICAN EXPRESS`, but may be something else such as the name of the issuing bank. |
| bin.**updated_at** | String | [Timestamp](#timestamps) of the most recent BIN object update time. |
| **created_at** | String | [Timestamp](#timestamps) of the credit card token creation time. |
| **expiry** | Object | Object containing credit card expiry details. |
| expiry.**month** | String | Credit card expiry month in MM format. |
| expiry.**year** | String | Credit card expiry year in YY or YYYY format. |
| **facility** | String | Credit card facility, which may be one of `American Express`, `Diners Club`, `Discover`, `JCB`, `Mastercard`, `UnionPay`, `Visa`. |
| **id** | String | Secure representation of the credit card information, allowing you to determine if the credit card is a duplicate of an existing credit card. |
| **name** | String | Credit card holder's name. |
| **one_time** | Boolean | Whether the credit card is for one-time use (`true`) or not (`false`). A one-time use credit card is not associated with a user. |
| **pan** | String | Masked PAN (Primary Account Number) of the credit card number. |
| **token** | String | Generated credit card token. |
| **type** | String | Type of payment method (i.e. `credit_card`). |
| **updated_at** | String | [Timestamp](#timestamps) of the most recent credit card token update time. |

::: tip Note

The method returns a masked card number but does not return the full credit card number.

:::

For example:

```json
{
  "bin": {
    "bin": "512345",
    "category": "Standard",
    "country": "EC",
    "created_at": "2019-07-11T05:47:10Z",
    "funding_source": "CREDIT",
    "issuer": "BANCO DEL PICHINCHA, C.A.",
    "prepaid": null,
    "scheme": "MASTERCARD",
    "updated_at": "2019-07-11T05:47:10Z"
  },
  "created_at": "2019-08-06T01:26:50Z",
  "expiry": {
    "month": "01",
    "year": "2021"
  },
  "facility": "Mastercard",
  "id": "8cb95e7ad1b2e10e75724c56a5793acb",
  "name": "User Name",
  "one_time": false,
  "pan": "512345...0008",
  "token": "V3ZJ3D732UY97A3RZGU9",
  "type": "credit_card",
  "updated_at": "2019-08-06T01:26:51Z"
}
```

#### Try it yourself

<TokenizeCardForm />

### Get token info

The `getTokenInfo()` method retrieves information about the provided bak account or credit card token. The method takes a string parameter representing the token.

The method can be called as a promise or with a callback:

- [Get token info with promise](#get-token-info-with-promise)
- [Get token info with callback](#get-token-info-with-callback)

#### Get token info with promise

The following example calls `getTokenInfo()` as a promise using `await`:

```javascript
try {
  const response = await eoneo.getTokenInfo('7J8DCM8EAFFMEWGDXZM2')
  // use response
} catch (error) {
  console.error(error.message)
}
```

#### Get token info with callback

To use a callback function with `getTokenInfo()`, provide a function with error and response parameters. For example:

```javascript
eoneo.getTokenInfo('7J8DCM8EAFFMEWGDXZM2', (error, response) => {
  if (error) {
    console.error(error.message)
  } else {
    // use response
  }
})
```

#### Get token info response

The `getTokenInfo()` method will return a JSON object with information about the provided token. The object returned depends on whether the token is for a bank account (see [Tokenise bank account response](#tokenise-bank-account-response)) or a credit card (see [Tokenise credit card response](#tokenise-credit-card-response)).

#### Try it yourself

<TokenInfoForm />

### Get payment system

The `getPaymentSystem()` method returns the payment system (e.g. Mastercard) for the provided credit card number. The method takes a string parameter representing the credit card number and returns a string indicating the payment system, which may be one of the following:

- `amex` – American Express
- `dankort` – Dankort
- `dinersclub` – Diners Club
- `discover` – Discover Card
- `forbrugsforeningen` – Forbrugsforeningen
- `jcb` – JCB
- `maestro` – Maestro
- `mastercard` – Mastercard
- `unionpay` – UnionPay
- `visa` – Visa
- `visaelectron` – Visa Electron

```javascript
eoneo.getPaymentSystem('5123450000000008') // => 'mastercard'
eoneo.getPaymentSystem('4560656891897152') // => 'visa'
```

#### Try it yourself

The following example works for Mastercard and Visa cards:

<Helpers :getPaymentSystem="true" />

### Validate bank account number

The `validateAccountNumber()` method validates the provided bank account number. The method takes a string parameter representing the bank account number and returns a boolean indicating whether the provided number is a valid bank account number (`true`) or not (`false`).

```javascript
eoneo.validateAccountNumber('021000021') // => true/false
```

### Validate credit card number

The `validateCardNumber()` method validates the provided credit card number. The method takes a string parameter representing the credit card number and returns a boolean indicating whether the provided number is a valid credit card number (`true`) or not (`false`).

```javascript
eoneo.validateCardNumber('5123450000000008') // => true/false
```
