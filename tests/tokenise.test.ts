import server from './mock-api'
import EoneoPay from '../src/eoneo-pay'

afterAll(() => {
  server.close()
})

describe('check eoneo tokenize methods', () => {
  let eoneo: EoneoPay

  beforeEach(() => {
    eoneo = new EoneoPay({
      token: 'MN6FWJJ3P77WHAE6',
      url: `http://localhost:${process.env.MOCK_API_PORT}`,
    })
  })

  test('return account response via promise', async () => {
    try {
      const response = await eoneo.tokenizeAccount({
        name: 'User Name',
        number: '987654321',
        prefix: '123456',
      })

      expect(response.country).toBe('AU')
    } catch (error) {
      expect(error).toBeFalsy()
    }
  })

  test('return account response via callback', done => {
    eoneo.tokenizeAccount({
      name: 'User Name',
      number: '987654321',
      prefix: '123-456',
    }, (error, response) => {
      expect(error).toBeFalsy()
      expect(response).toBeTruthy()
      expect(response.token).toBe('3T93F7TXCVGX4ZV7AFW2')
      done()
    })
  })

  test('return account error via promise', async () => {
    try {
      const response = await eoneo.tokenizeAccount({
        name: 'User Name',
        number: '987654321',
      })
      expect(response).toBeFalsy()
    } catch (error) {
      expect(error).toBeTruthy()
      expect(error.message).toBeTruthy()
    }
  })

  test('return account error via callback', done => {
    eoneo.tokenizeAccount({
      name: 'User Name',
      prefix: '123-456',
    }, error => {
      expect(error).toBeTruthy()
      expect(error.message).toBeTruthy()
      done()
    })
  })

  test('return card error via promise', async () => {
    try {
      const response = await eoneo.tokenizeCard({
        name: 'User Name',
        number: '5123450000000008',
      })
      expect(response).toBeFalsy()
    } catch (error) {
      expect(error).toBeTruthy()
      expect(error.message).toBeTruthy()
    }
  })

  test('return card error via callback', done => {
    eoneo.tokenizeCard({
      name: 'User Name',
      number: '5123450000000008',
    }, error => {
      expect(error).toBeTruthy()
      expect(error.message).toBeTruthy()
      done()
    })
  })

  test('return token info', async () => {
    try {
      const response = await eoneo.getTokenInfo('token')

      expect(response).toBeTruthy()
    } catch (error) {
      expect(error).toBeFalsy()
    }
  })

  test('return token info error', async () => {
    try {
      const response = await eoneo.getTokenInfo('')

      expect(response).toBeFalsy()
    } catch (error) {
      expect(error).toBeTruthy()
      expect(error.message).toBeTruthy()
    }
  })

  describe('if not support promise', () => {
    beforeAll(() => {
      // @ts-ignore
      window.Promise = null
    })

    test('should not return account response via promise', done => {
      const promise = eoneo.tokenizeAccount({
        name: 'User Name',
        number: '987654321',
        prefix: '123-456',
      }, (error, response) => {
        expect(error).toBeFalsy()
        expect(promise).toBeFalsy()
        expect(response).toBeTruthy()
        done()
      })
    })
  })
})
