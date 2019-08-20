export interface CardType {
  type: string
  patterns: RegExp
  length: RegExp
  format: RegExp
  cvcLength: RegExp
  luhn: boolean
}
export declare const CARD_TYPES: CardType[]
