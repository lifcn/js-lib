# EoneoPay SDK v2.0

## Instanciate

```javascript
const eoneo = EoneoPay('MN6FWJJ3P77WHAE6')
```

## Tokenise

### Tokenise card

```javascript
const eoneo = eoneo.tokeniseCard({
  expiry: {
    month: '11',
    year: '2099',
  },
  name: 'User Name',
  number: '5123450000000008',
})
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
