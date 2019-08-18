import fs from 'fs'
import path from 'path'
import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'

const app = express()

app.options('/*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
  res.header(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, Content-Length, X-Requested-With'
  )
  res.send(200)
})

const PORT = 9000 || process.env.MOCK_API_PORT

app.use(bodyParser.json({
  type: ['application/vnd.eoneopay.v1+json', 'application/json'],
}))

app.use(cors())

const server = app.listen(PORT)

fs.readdirSync(path.join(__dirname, 'routes'))
  .forEach(name => {
    const route = require(`./routes/${name}`).default

    route(app)
  })

export default server
