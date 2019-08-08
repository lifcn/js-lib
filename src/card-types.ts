
export interface CardType {
  name: string
  patterns: RegExp
  length: RegExp
  format: RegExp
  cvcLength: RegExp
  luhn: boolean
}

export const CARD_TYPES: CardType[] = [
  {
    name: 'visaelectron',
    patterns: /^(4026|417500|4405|4508|4844|4913|4917)/,
    format: /(\d{1,4})/g,
    length: /^16$/,
    cvcLength: /^3$/,
    luhn: true
  },
  {
    name: 'maestro',
    patterns: /^(5018|502|503|56|58|639|6220|67)/,
    format: /(\d{1,4})/g,
    length: /^(12|13|14|15|16|17|18|19)/,
    cvcLength: /^3$/,
    luhn: true
  },
  {
    name: 'forbrugsforeningen',
    patterns: /^600/,
    format: /(\d{1,4})/g,
    length: /^16$/,
    cvcLength: /^3$/,
    luhn: true
  },
  {
    name: 'dankort',
    patterns: /^5019/,
    format: /(\d{1,4})/g,
    length: /^16$/,
    cvcLength: /^3$/,
    luhn: true
  },
  {
    name: 'visa',
    patterns: /^4/,
    format: /(\d{1,4})/g,
    length: /^(13|16)/,
    cvcLength: /^3$/,
    luhn: true
  },
  {
    name: 'mastercard',
    patterns: /^(51|52|53|54|55|22|23|24|25|26|27)/,
    format: /(\d{1,4})/g,
    length: /^(13|16)/,
    cvcLength: /^3$/,
    luhn: true
  },
  {
    name: 'amex',
    patterns: /^(34|37)/,
    format: /(\d{1,4})(\d{1,6})?(\d{1,5})?/,
    length: /^15$/,
    cvcLength: /^(3|4)/,
    luhn: true
  },
  {
    name: 'dinersclub',
    patterns: /^(30|36|38|39)/,
    format: /(\d{1,4})(\d{1,6})?(\d{1,4})?/,
    length: /^14$/,
    cvcLength: /^3$/,
    luhn: true
  },
  {
    name: 'discover',
    patterns: /^(60|64|65|622)/,
    format: /(\d{1,4})/g,
    length: /^16$/,
    cvcLength: /^3$/,
    luhn: true,
  },
  {
    name: 'unionpay',
    patterns: /^(62|88)/,
    format: /(\d{1,4})/g,
    length: /^(16|17|18|19)/,
    cvcLength: /^3$/,
    luhn: false,
  },
  {
    name: 'jcb',
    patterns: /^35/,
    format: /(\d{1,4})/g,
    length: /^16$/,
    cvcLength: /^3$/,
    luhn: true,
  }
]
