import { CARD_TYPES, CardType } from './card-types'

export default class EoneoPay {
  private apiUrl: string = 'https://pay.eoneopay.com'

  constructor(public token: string) {
    if (!token) {
      throw new Error('token is required')
    }
  }

  private getCardTypeByNumber(cardNumber: string = ''): CardType | undefined {
    return CARD_TYPES.find(cardType => {
      return cardType.patterns.test(cardNumber)
    })
  }

  getCardTypeByName(name: string = ''): CardType | undefined {
    return CARD_TYPES.find(cardType => {
      return cardType.name === name
    })
  }

  getPaySystem(cardNumber: string | number): string {
    const cardType = this.getCardTypeByNumber(String(cardNumber))

    return cardType ? cardType.name : ''
  }

  validateAccountNumber(accountNumber: string | number): boolean {
    return /^[0-9]{6,9}$/.test(String(accountNumber))
  }

  validateAccountName(name: string): boolean {
    return /^.{6,100}$/.test(name)
  }

  validateCardNumber(_cardNumber: string | number): boolean {
    const cardNumber = String(_cardNumber)
    const cardType = this.getCardTypeByNumber(cardNumber)

    if (!cardType) return false

    const lengthValid = cardType.length.test(String(cardNumber.length))
    const luhnValid = this.luhnCheck(cardNumber)

    return lengthValid && luhnValid
  }

  luhnCheck(cardNumber: string): boolean {
    const arr = [0, 2, 4, 6, 8, 1, 3, 5, 7, 9]
    let len = cardNumber.length
    let bit = 1
    let sum = 0
    let val

    while (len) {
      val = parseInt(cardNumber.charAt(--len), 10)
      bit ^= 1
      sum += bit ? arr[val] : val
    }

    return !!sum && sum % 10 === 0
  }

  sendRequest(type = 'POST', endpoint: string, data?: any) {
    let xhr: XMLHttpRequest

    if (XMLHttpRequest) {
      xhr = new XMLHttpRequest()
    } else {
      try {
        xhr = new ActiveXObject('MSXML2.XMLHTTP.3.0')
      } catch (e) {
        throw new Error('current platform does not support XMLHttpRequest')
      }
    }

    xhr.open(type, this.apiUrl + endpoint, true)
    xhr.setRequestHeader('Authorization', 'Basic ' + btoa(this.token + ':'))
    xhr.setRequestHeader('Content-type', 'application/vnd.eoneopay.v1+json')
    xhr.setRequestHeader('Accept', 'application/json')

    return new Promise((resolve, reject) => {
      xhr.onload = () => {
        resolve({
          status: xhr.status,
          statusText: xhr.statusText,
          response: xhr.response
        })
      }

      xhr.onerror = () => {
        let message = 'unsuccessful request'
        if (xhr.status === 401) {
          message = 'user is not authorized'
        }

        reject({
          message,
          name: 'eoneo-exception',
        })
      }

      xhr.send(data)
    })
  }

  tokeniseCard(data: any) {
    data.type = 'credit_card'
    return this.sendRequest('POST', '/tokens', JSON.stringify(data))
  }

  tokeniseAccount(data: any) {
    data.country = 'AU'
    data.type = 'bank_account'
    return this.sendRequest('POST', '/tokens', JSON.stringify(data))
  }

  getTokenInfo(token: string) {
    return this.sendRequest('GET', '/tokens/' + token)
  }
}
