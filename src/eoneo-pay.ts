import { CARD_TYPES, CardType } from './card-types'
import {
  EoneoPayConstructor,
  EoneoCallback,
  EoneoTokeniseCardPayload,
  EoneoTokeniseAccountPayload,
} from 'types/library'
import {
  EoneoAccount,
  EoneoCard,
  EoneoToken,
} from 'types/server'

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

  private getCardTypeByNumber(cardNumber: string = ''): CardType | undefined {
    return CARD_TYPES.find(cardType => {
      return cardType.patterns.test(cardNumber)
    })
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
    xhr.open('POST', url, true)
    xhr.setRequestHeader('Authorization', 'Basic ' + btoa(this.token + ':'))
    xhr.setRequestHeader('Content-type', 'application/vnd.eoneopay.v1+json')
    xhr.setRequestHeader('Accept', 'application/json')

    const catchSuccess = (resolve?: Function) => {
      xhr.onload = () => {
        if (typeof callback === 'function') {
          callback(null, xhr.response)
        }

        if (typeof resolve === 'function') {
          resolve(xhr.response)
        }
      }
    }

    const catchError = (reject?: Function) => {
      xhr.onerror = () => {
        let message = 'unsuccessful request'

        if (xhr.status === 401) {
          message = 'user is not authorized'
        }

        const error = {
          message,
          name: 'eoneo-exception',
        }

        if (typeof callback === 'function') {
          callback(error)
        }

        if (typeof reject === 'function') {
          reject(error)
        }
      }
    }

    const body = params.data ? JSON.stringify(params.data) : null

    if (Promise) {
      return new Promise((resolve, reject) => {
        catchSuccess(resolve)
        catchError(reject)
        xhr.send(body)
      })
    } else {
      catchSuccess()
      catchError()
      xhr.send(body)
    }
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

  tokeniseCard(
    data: EoneoTokeniseCardPayload,
    callback?: EoneoCallback<EoneoCard>
  ): Promise<EoneoCard> {
    data.type = 'credit_card'

    return this.sendRequest({
      type: 'POST',
      endpoint: '/tokens',
      data,
      callback,
    })
  }

  tokeniseAccount(
    data: EoneoTokeniseAccountPayload,
    callback?: EoneoCallback<EoneoAccount>
  ): Promise<EoneoAccount> {
    data.country = 'AU'
    data.type = 'bank_account'

    return this.sendRequest({
      type: 'POST',
      endpoint: '/tokens',
      data,
      callback,
    })
  }

  getTokenInfo(
    token: string,
    callback?: EoneoCallback<EoneoToken>
  ): Promise<EoneoToken> {
    return this.sendRequest({
      endpoint: `/tokens/${token}`,
      type: 'GET',
      callback,
    })
  }
}
