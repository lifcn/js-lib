import EoneoPay from '../src/eoneo-pay'

describe('check eoneo helpers', () => {
  let eoneo: EoneoPay

  beforeEach(() => {
    eoneo = new EoneoPay('MN6FWJJ3P77WHAE6')
  })

  test('should return visa pay system', () => {
    const paySystem = eoneo.getPaymentSystem('4893470000000000')

    expect(paySystem).toBe('visa')
  })

  test('should return empty pay system', () => {
    const paySystem = eoneo.getPaymentSystem('00')

    expect(paySystem).toBe('')
  })

  test('should validate card number', () => {
    const isValid = eoneo.validateCardNumber('5123450000000008')

    expect(isValid).toBe(true)
  })

  test('should not validate card number', () => {
    const isValid = eoneo.validateCardNumber('4893470000000000')

    expect(isValid).toBe(false)
  })

  test('should validate account name', () => {
    const isValid = eoneo.validateAccountName('User Name')

    expect(isValid).toBe(true)
  })

  test('should not validate account name', () => {
    const short = eoneo.validateAccountName('u')
    const empty = eoneo.validateAccountName('')

    expect(short).toBe(false)
    expect(empty).toBe(false)
  })

  test('should validate account number', () => {
    const six = eoneo.validateAccountNumber('123456')
    const seven = eoneo.validateAccountNumber('1234567')
    const eight = eoneo.validateAccountNumber('12345678')
    const nine = eoneo.validateAccountNumber('123456789')

    expect(six).toBe(true)
    expect(seven).toBe(true)
    expect(eight).toBe(true)
    expect(nine).toBe(true)
  })

  test('should not validate account number', () => {
    const empty = eoneo.validateAccountNumber('')
    const short = eoneo.validateAccountNumber('12')

    expect(empty).toBe(false)
    expect(short).toBe(false)
  })
})
