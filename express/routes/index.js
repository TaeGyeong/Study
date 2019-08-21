const express = require('express')
const router = express.Router()
const template = require('../lib/template')
// routing section
router.get('/', (request, response) => {
    let title = 'Welcome'
    let description = 'Hello, Node.js'
    let list = template.list(request.list)
    let html = template.HTML(title, list,
        `<h2>${title}</h2>${description}
        <img src='/image/hello.jpg' style='width:300px; display:block; margin-top:10px;'></img>
        `,
        `<a href="/topic/create">create</a>`
    )
    response.send(html)
})

module.exports = router