import { EoneoPayConstructor, EoneoCallback, EoneoTokenizeCardPayload, EoneoTokenizeAccountPayload } from 'types/library'
import { EoneoAccount, EoneoCard, EoneoToken } from 'types/server'
import { CardType } from './card-types'
export default class EoneoPay {
  private params
  constructor(params: EoneoPayConstructor | string);
  readonly token: string
  readonly url: string
  private getCardTypeByNumber
  private luhnCheck
  private sendRequest
  getCardTypeByName(name?: string): CardType | undefined
  getPaymentSystem(cardNumber: string | number): string
  getCardNameBasedOnNumber(cardNumber: string | number): string
  validateAccountNumber(accountNumber: string | number): boolean
  validateAccountName(name: string): boolean
  validateCardNumber(_cardNumber: string | number): boolean
  tokeniseCard(data: EoneoTokenizeCardPayload, callback?: EoneoCallback<EoneoCard>): Promise<EoneoCard>
  tokenizeCard(data: EoneoTokenizeCardPayload, callback?: EoneoCallback<EoneoCard>): Promise<EoneoCard>
  tokeniseAccount(data: EoneoTokenizeAccountPayload, callback?: EoneoCallback<EoneoAccount>): Promise<EoneoAccount>
  tokenizeAccount(data: EoneoTokenizeAccountPayload, callback?: EoneoCallback<EoneoAccount>): Promise<EoneoAccount>
  getTokenInfo(token: string, callback?: EoneoCallback<EoneoToken>): Promise<EoneoToken>
}
