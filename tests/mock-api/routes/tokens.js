const tokens = require('../resources/tokens')

module.exports = app => {
  app.post('/tokens', (req, res) => {
    const body = req.body

    if (body.type === 'bank_account') {

      if (body.number) {
        return res.json(tokens.account)
      }
    } else if (req.body.type === 'credit_card') {
      res.json(tokens.card)
    }

    res.status(400).send()
  })
}
