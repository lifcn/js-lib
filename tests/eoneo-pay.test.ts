import server from './mock-api'
import EoneoPay from '../src/eoneo-pay'

afterAll(() => {
  server.close()
})

describe('eoneo-pay', () => {
  let eoneo: EoneoPay

  beforeEach(() => {
    eoneo = new EoneoPay('MN6FWJJ3P77WHAE6')
  })

  describe('should correctly pass constructor parameters', () => {
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

  describe('validation methods', () => {
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

  describe('tokenise methods', () => {

    beforeEach(() => {
      eoneo = new EoneoPay({
        token: 'MN6FWJJ3P77WHAE6',
        url: `http://localhost:${process.env.MOCK_API_PORT}`,
      })
    })

    test('return account response via promise', async () => {
      const response = await eoneo.tokeniseAccount({
        name: 'User Name',
        number: '987654321',
        prefix: '123-456',
        type: 'bank_account',
      })

      expect(response.country).toBe('AU')
    })

    test('return account response via callback', done => {
      eoneo.tokeniseAccount({
        name: 'User Name',
        number: '987654321',
        prefix: '123-456',
        type: 'bank_account',
      }, (error, response) => {
        expect(error).toBe(null)
        expect(response && response.token).toBe('3T93F7TXCVGX4ZV7AFW2')
        done()
      })
    })

    test('return account error via promise', async () => {
      try {
        await eoneo.tokeniseAccount({
          name: 'User Name',
          number: '987654321',
          prefix: '123-456',
          type: 'bank_account',
        })
      } catch (error) {
        expect(error.name).toBe('eoneo-exception')
      }
    })
  })

  describe('not support promise', () => {
    beforeAll(() => {
      // @ts-ignore
      window.Promise = null
    })

    test('should not return account response via promise', () => {
      const response = eoneo.tokeniseAccount({
        name: 'User Name',
        number: '987654321',
        prefix: '123-456',
        type: 'bank_account',
      })

      expect(response).toBe(undefined)
    })
  })
})
