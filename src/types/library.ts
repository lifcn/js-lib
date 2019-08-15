import { EoneoExpiry, EoneoTokenType } from './server'

export interface EoneoPayConstructor {
  token: string
  url?: string
}

export interface EoneoTokeniseCardPayload {
  expiry: EoneoExpiry,
  name: string
  number: string
  type?: EoneoTokenType
}

export interface EoneoTokeniseAccountPayload {
  name: string
  number: string
  prefix: string
  country?: String,
  type?: EoneoTokenType
}

export interface EoneoError {
  name: string
  message: string
}

export type EoneoCallback<T> = (err: EoneoError | null, response?: T) => void
