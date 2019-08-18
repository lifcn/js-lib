import { EoneoExpiry, EoneoTokenType } from './server'
export interface EoneoPayConstructor {
  token: string
  url?: string
}
export interface EoneoTokenizeCardPayload {
  expiry: EoneoExpiry
  name: string
  number: string
  type?: EoneoTokenType
}
export interface EoneoTokenizeAccountPayload {
  name: string
  number: string
  prefix: string
  country?: String
  type?: EoneoTokenType
}
export interface EoneoError {
  name: string
  message: string
}
export declare type EoneoCallback<T> = (err: EoneoError | null, response?: T) => void
