# EoneoPay SDK v2.0

## Instantiate

You can create **EoneoPay** instance with one token argument.

<EoneoInitiation :additional='false' />

Also, you can pass an object with parameters.

<EoneoInitiation :additional='true' />

## Tokenize

### Tokenize card

#### Tokenize card with promise

```javascript
try {
  const response = await eoneo.tokenizeCard({
    expiry: {
      month: '11',
      year: '2099',
    },
    name: 'User Name',
    number: '5123450000000008',
  })
  // use response
} catch (error) {
  console.error(error.message)
}
```

#### Tokenize card with callback

```javascript
eoneo.tokenizeCard(
  {
    expiry: {
      month: '11',
      year: '2099',
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

#### Tokenize card response example

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
    "month": "05",
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

#### Try to tokenize card

<TokenizeCardForm />

### Tokenize bank account

#### Tokenize bank account with promise

```javascript
try {
  const response = eoneo.tokenizeAccount({
    name: '139281538940-arh29cscgqk2vic01ackiphugqe6m2lr',
    number: '987654321',
    prefix: '123456',
  })
  // use response
} catch (error) {
  console.error(error.message)
}
```

#### Tokenize bank account with callback

```javascript
eoneo.tokenizeAccount({
  name: "139281538940-arh29cscgqk2vic01ackiphugqe6m2lr",
  number: "987654321",
  prefix: "123456",
}), (error, response) => {
  if (error) {
    console.error(error.message)
  } else {
    // use response
  }
})
```

#### Tokenize bank account response example

```json
{
  "country": "AU",
  "created_at": "2019-08-09T06:25:27Z",
  "currency": "AUD",
  "id": "937d87ac905a6e007dd1d17fde08747c",
  "name": "0xc6626f3ab01acf1e0240dd08dcf64b8b2d706ff8e9ef5e",
  "number": "254280294",
  "one_time": false,
  "pan": "111-066...0294",
  "prefix": "111-066",
  "token": "7J8DCM8EAFFMEWGDXZM2",
  "type": "bank_account",
  "updated_at": "2019-08-09T06:25:27Z"
}
```

#### Try to tokenize bank account

<TokenizeAccountForm />

### Get token info

#### Get token info with promise

```javascript
try {
  const response = await eoneo.getTokenInfo('7J8DCM8EAFFMEWGDXZM2')
  // use response
} catch (error) {
  console.error(error.message)
}
```

#### Get token info with callback

```javascript
eoneo.getTokenInfo('7J8DCM8EAFFMEWGDXZM2', (error, response) => {
  if (error) {
    console.error(error.message)
  } else {
    // use response
  }
})
```

#### Token info response example

See [bank account response](#tokenize-bank-account-response-example) or [card response](#tokenize-card-response-example)

#### Try to get token info

<TokenInfoForm />

## Helpers

### Get payment system

```javascript
eoneo.getPaymentSystem('5123450000000008') // => 'mastercard'
eoneo.getPaymentSystem('4560656891897152') // => 'visa'
```

### Bank account number validation

```javascript
eoneo.validateAccountNumber('021000021') // => true/false
```

### Card number validation

```javascript
eoneo.validateCardNumber('5123450000000008') // => true/false
```
