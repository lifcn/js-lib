import {
  EoneoPayConstructor,
  EoneoCallback,
  EoneoTokenizeCardPayload,
  EoneoTokenizeAccountPayload,
} from 'types/library'
import {
  EoneoAccount,
  EoneoCard,
  EoneoToken,
} from 'types/server'
import { CARD_TYPES, CardType } from './card-types'
import msg from './messages'
import { emitError, createError } from './utils'

export default class EoneoPay {

  constructor(private params: EoneoPayConstructor | string) {
    if (!params || (typeof params === 'object' && !params.token)) {
      throw new Error('token is required')
    }
  }

  get token(): string {
    const { params } = this

    return typeof params === 'string' ? params : params.token
  }

  get url(): string {
    const { params } = this

    if (typeof params === 'object' && params.url) {
      return params.url
    }

    return 'https://pay.eoneopay.com'
  }

  private luhnCheck(cardNumber: string): boolean {
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

  private sendRequest(params: {
    endpoint: string
    type: 'POST' | 'GET'
    data?: any
    callback?: EoneoCallback<any>
  }): any {
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

    const { callback } = params
    const url = this.url + params.endpoint

    xhr.responseType = 'json'
    xhr.open(params.type, url, true)
    xhr.setRequestHeader('Authorization', 'Basic ' + btoa(this.token + ':'))
    xhr.setRequestHeader('Content-type', 'application/vnd.eoneopay.v1+json')
    xhr.setRequestHeader('Accept', 'application/json')

    const catchError = (
      msg: string,
      reject?: Function
    ) => {
      const error = createError(msg)

      if (typeof callback === 'function') {
        callback(error)
      } else if (typeof reject === 'function') {
        reject(error)
      }
    }

    const body = params.data ? JSON.stringify(params.data) : null
    const wrapper = (resolve?: Function, reject?: Function) => {
      xhr.onerror = () => {
        catchError(msg.requestError, reject)
      }

      xhr.onload = () => {
        const status = String(xhr.status)
        const response = xhr.response || {}

        if (/^2/.test(status)) {
          if (typeof callback === 'function') {
            callback(null, xhr.response)
          }

          if (typeof resolve === 'function') {
            resolve(xhr.response)
          }
        } else if (/401/.test(status)) {
          catchError(msg.unauthorized, reject)
        } else {
          catchError(response.message || xhr.statusText, reject)
        }
      }

      xhr.send(body)
    }

    if (Promise && !callback) {
      return new Promise(wrapper)
    } else {
      wrapper()
    }
  }

  cardTypeForNumber(cardNumber: string = ''): CardType | undefined {
    return this.getCardTypeByNumber(cardNumber)
  }

  getCardTypeByNumber(cardNumber: string = ''): CardType | undefined {
    return CARD_TYPES.find(cardType => {
      return cardType.patterns.test(cardNumber)
    })
  }

  getCardTypeByName(type: string = ''): CardType | undefined {
    return CARD_TYPES.find(cardType => {
      return cardType.type === type
    })
  }

  getPaymentSystem(cardNumber: string | number): string {
    const cardType = this.getCardTypeByNumber(String(cardNumber))

    return cardType ? cardType.type : ''
  }

  getCardNameBasedOnNumber(cardNumber: string | number): string {
    return this.getPaymentSystem(cardNumber)
  }

  cardNameForNumber(cardNumber: string | number): string {
    return this.getPaymentSystem(cardNumber)
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

  tokeniseCard(
    data: EoneoTokenizeCardPayload,
    callback?: EoneoCallback<EoneoCard>
  ): Promise<EoneoCard> {
    return this.tokenizeCard(data, callback)
  }

  tokenizeCard(
    data: EoneoTokenizeCardPayload,
    callback?: EoneoCallback<EoneoCard>
  ): Promise<EoneoCard> {
    const errors = []

    if (!this.validateCardNumber(data.number)) {
      errors.push(msg.invalidCardNumber)
    }

    if (!this.validateAccountName(data.name)) {
      errors.push(msg.invalidCardName)
    }

    if (!data.expiry) {
      errors.push(msg.expiryRequired)
    } else if (data.expiry.month.length !== 2) {
      errors.push(msg.expiryMonthLength)
    } else if (!/^(.{2}|.{4})$/.test(data.expiry.year)) {
      errors.push(msg.expiryYearLength)
    }

    if (errors.length) {
      // @ts-ignore
      return emitError(errors, callback)
    }

    data.type = 'credit_card'

    return this.sendRequest({
      type: 'POST',
      endpoint: '/tokens',
      data,
      callback,
    })
  }

  tokeniseAccount(
    data: EoneoTokenizeAccountPayload,
    callback?: EoneoCallback<EoneoAccount>
  ): Promise<EoneoAccount> {
    return this.tokenizeAccount(data, callback)
  }

  tokenizeAccount(
    data: EoneoTokenizeAccountPayload,
    callback?: EoneoCallback<EoneoAccount>
  ): Promise<EoneoAccount> {
    const errors = []

    if (!this.validateAccountNumber(data.number)) {
      errors.push(msg.invalidAccountNumber)
    }

    if (!this.validateAccountName(data.name)) {
      errors.push(msg.invalidAccountName)
    }

    if (!data.prefix) {
      errors.push(msg.accountPrefixRequired)
    }

    if (errors.length) {
      // @ts-ignore
      return emitError(errors, callback)
    }

    data.country = 'AU'
    data.type = 'bank_account'

    return this.sendRequest({
      type: 'POST',
      endpoint: '/tokens',
      data,
      callback,
    })
  }

  retrieveToken(data: EoneoTokenizeCardPayload, resolve: any, reject: any) {
    this.tokeniseCard(data, (error, response) => {
      if (error) reject(error)
      else resolve(response)
    })
  }

  getTokenInfo(
    token: string,
    callback?: EoneoCallback<EoneoToken>
  ): Promise<EoneoToken> {
    if (!token) {
      // @ts-ignore
      return emitError(msg.tokenRequired, callback)
    }

    return this.sendRequest({
      type: 'GET',
      endpoint: `/tokens/${token}`,
      callback,
    })
  }
}
