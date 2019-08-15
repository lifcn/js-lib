const fs = require('fs')
const path = require('path')
const bodyParser = require('body-parser')
const app = require('express')()
const cors = require('cors')

app.options("/*", function(req, res, next){
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  res.send(200);
});

const PORT = 9000 || process.env.MOCK_API_PORT

app.use(bodyParser.json({
  type: ['application/vnd.eoneopay.v1+json', 'application/json'],
}))

app.use(cors({
  credentials: true,
}))

const server = app.listen(PORT, () => {
  console.warn(`\nMock api is running at http://localhost:${PORT}\n`)
})

fs.readdirSync(path.join(__dirname, 'routes')).forEach(routeFileName => {
  require(`./routes/${routeFileName}`)(app)
})

export default server
