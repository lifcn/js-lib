import EoneoPay from '../src/eoneo-pay'

describe('check eoneo constructor', () => {
  let eoneo: EoneoPay

  beforeEach(() => {
    eoneo = new EoneoPay('MN6FWJJ3P77WHAE6')
  })

  test('pass token as string argument', async () => {
    eoneo = new EoneoPay('token')

    expect(eoneo.token).toBe('token')
  })

  test('pass token as object argument', async () => {
    eoneo = new EoneoPay({
      token: 'objecttoken'
    })

    expect(eoneo.token).toBe('objecttoken')
  })

  test('pass url', async () => {
    eoneo = new EoneoPay({
      token: 'token',
      url: 'urlparam'
    })

    expect(eoneo.url).toBe('urlparam')
  })
})
