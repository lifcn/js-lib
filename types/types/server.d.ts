export declare type EoneoToken = EoneoCard | EoneoAccount
export declare type EoneoTokenType = 'bank_account' | 'credit_card' | 'ewallet'
export interface EoneoCardBin {
  bin: string
  category: string
  country: string
  created_at: string
  funding_source: string
  issuer: string
  prepaid: string
  scheme: string
  updated_at: string
}
export interface EoneoExpiry {
  month: string
  year: string
}
export interface EoneoCard {
  bin: EoneoCardBin
  created_at: string
  expiry: EoneoExpiry
  facility: string
  id: string
  name: string
  pan: string
  token: string
  type: string
  updated_at: string
}
export interface EoneoAccount {
  country: string
  created_at: string
  currency: string
  id: string
  name: string
  number: string
  pan: string
  prefix: string
  token: string
  type: string
  updated_at: string
}
