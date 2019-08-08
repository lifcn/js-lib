import EoneoPay from '../src/eoneo-pay'

describe('eoneo-pay', () => {
  let eoneo: EoneoPay

  beforeEach(() => {
    eoneo = new EoneoPay('MN6FWJJ3P77WHAE6')
  })

  test('should return visa pay system', () => {
    const paySystem = eoneo.getPaySystem('4893470000000000')

    expect(paySystem).toBe('visa')
  })

  test('should return empty pay system', () => {
    const paySystem = eoneo.getPaySystem('00')

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
})
