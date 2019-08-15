# EoneoPay SDK v2.0

## Instantiate

```javascript
const eoneo = new EoneoPay('MN6FWJJ3P77WHAE6')
```

Alternative API endpoint

```javascript
const eoneo = new EoneoPay({
  token: 'MN6FWJJ3P77WHAE6',
  url: 'https://pay.eoneopay.com',
})
```

## Tokenise

### Tokenise card

Promise

```javascript
eoneo
  .tokeniseCard({
    expiry: {
      month: '11',
      year: '2099',
    },
    name: 'User Name',
    number: '5123450000000008',
  })
  .then(response => {
    console.log(response)
  })
  .catch(error => {
    console.error(error.message)
  })
```

Callback

```javascript
eoneo.tokeniseCard(
  {
    expiry: {
      month: '11',
      year: '2099',
    },
    name: 'User Name',
    number: '5123450000000008',
  },
  (err, response) => {
    if (err) throw err
    console.log(response)
  }
)
```

<CardForm />
### Tokenise bank account
```javascript
const eoneo = eoneo.tokeniseAccount({
  "name": "139281538940-arh29cscgqk2vic01ackiphugqe6m2lr",
  "number": "987654321",
  "prefix": "123456",
})
```
<AccountForm />

## Helpers

### Get card name

```javascript
eoneo.getCardNameBasedOnNumber('5123450000000008') // => 'mastercard'
eoneo.getCardNameBasedOnNumber('4560656891897152') // => 'visa'
```

### Bank account number validation

```javascript
eoneo.validateAccountNumber('021000021') // => true/false
```

### Card number validation

```javascript
eoneo.validateCardNumber('5123450000000008') // => true/false
```
