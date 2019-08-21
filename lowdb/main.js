const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('db.json')
const db = low(adapter)
const shortid = require('shortid')

// Set some defaults (required if your JSON file is empty)
db.defaults({ topic: [], author:[] }).write()

// Add a post
// db.get('author')
//     .push({ id: 1, name:'umtaegyeong', profile: 'developer'})
//     .write()
// db.get('topic')
//     .push({id:1, title:'lowdb', description:'lowdb is...', author:1})
//     .write()
// db.get('topic')
//     .push({id:2, title:'MySQL', description:'MySQL is...', author:1})
//     .write()

// For performance, use .value() instead of .write() if you're only reading from db
// let k = db.get('topic')
//     .find({author:1})
//     .value()
// console.log(k)

// update 
// db.get('topic')
//   .find({id:1})
//   .assign({ title: 'MySQL & MariaDB'})
//   .write()

//Remove posts.
// db.get('topic')
//   .remove({ id:2 })
//   .write()

let sid = shortid.generate()
db.get('author')
    .push({
        id: sid,
        name: 'taeho',
        profile: 'data scientist'
    }).write()

db.get('topic')
    .push({
        id:shortid.generate(),
        title: 'PostgreSQL',
        description: 'PostgreSQL is..',
        author: sid
    }).write()