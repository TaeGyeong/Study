const express = require('express')
const fs = require('fs')
const app = express()
const port = 3000
const bodyParser = require('body-parser')
const compression = require('compression')
const topicRouter = require('./routes/topic')
const indexRouter = require('./routes/index')
const helmet = require('helmet')

app.use(helmet())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended:false}))
app.use(compression())
app.get('*', (request, response, next) => {
  fs.readdir('./data', (err, filelist) => {
    request.list = filelist
    next()
  }) 
})

app.use('/', indexRouter)
app.use('/topic', topicRouter)

// middleware is launched orderly. 404 page is behind other router.
app.use((req, res, next) => {
  res.status(404).send('Sorry Cant find that!')
})

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Something Broke!')
})

app.listen(port, () => {})
