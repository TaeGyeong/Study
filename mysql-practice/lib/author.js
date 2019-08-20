var db = require('./db');
var template = require('./template');
var qs = require('querystring');
var url = require('url');
var sanitizeHTML = require('sanitize-html');
exports.home = function(request, response){
    db.query('SELECT * FROM topic', function(err, topics, fields){
        db.query('SELECT * FROM author', function(err, authors, fields){
            var tag = template.authorTable(authors);            
            var title = 'author';
            var list = template.list(topics);
            var html = template.HTML(title, list, 
                `
                <form action="/author/create_process" method="post">
                    <p>
                        <input type="text" name="name" placeholder="name"></input>
                    </p>
                    <p>
                        <textarea name="profile" placeholder="profile"></textarea>
                    </p>    
                    <p>
                        <input type="submit"></input>
                    </p>
                    
                </form>
                `,
                `
                <br><br>
                <table>
                    ${tag}
                </table>
                <style>
                    table {
                        border-collapse: collapse;
                    }
                    td {
                        border: 1px solid black;
                    }
                </style>
                `
            );
            response.writeHead(200);
            response.end(html);
        });
    });
};

exports.create_process = function(request, response){
    var body = '';
    request.on('data', function(data){
        body = body + data;
    });
    request.on('end', function(){
        var post = qs.parse(body);
        db.query(`
          INSERT INTO author (name, profile)
            VALUES(?, ?)`,
          [post.name, post.profile],
          function(error) {
            if(error){
              throw error;
            }
            response.writeHead(302, {Location: `/author`});
            response.end(); 
          }
        );
    });
};

exports.update = function(request, response){
    db.query('SELECT * FROM topic', function(err, topics, fields){
        db.query('SELECT * FROM author', function(err, authors, fields){
            var _url = request.url;
            var queryData = url.parse(_url, true).query;
            db.query('SELECT * FROM author WHERE id = ?', [queryData.id], function(err, author, fields){                   
                var title = 'author';
                var list = template.list(topics);
                var tag = template.authorTable(authors);            
                var html = template.HTML(title, list,
                    `
                    <form action="/author/update_process" method="post">
                        <p><input type="hidden" name="id" value=${sanitizeHTML(queryData.id)}></input><p>
                        <p>
                            <input type="text" name="name" value=${sanitizeHTML(author[0].name)} placeholder="name"></input>
                        </p>
                        <p>
                            <textarea name="profile" placeholder="profile">${sanitizeHTML(author[0].profile)}</textarea>
                        </p>    
                        <p>
                            <input type="submit" value="update"></input>
                        </p>
                        
                    </form>
                    `,
                    `
                    <br><br>
                    <table>
                        ${tag}
                    </table>
                    <style>
                        table {
                            border-collapse: collapse;
                        }
                        td {
                            border: 1px solid black;
                        }
                    </style>
                    `
                );
                response.writeHead(200);
                response.end(html);
            });
        });
    });
};

exports.update_process = function(request, response){
    var body = '';
    request.on('data', function(data){
        body = body + data;
    });
    request.on('end', function(){
        var post = qs.parse(body);
        db.query(`
          UPDATE author SET name=?, profile=? WHERE id=?`,
          [post.name, post.profile, post.id],
          function(error) {
            if(error){
              throw error;
            }
            response.writeHead(302, {Location: `/author`});
            response.end(); 
          }
        );
    });
};

exports.delete_process = function(request, response){
    var body = '';
      request.on('data', function(data){
          body = body + data;
      });
      request.on('end', function(){
          var post = qs.parse(body);
          db.query(`DELETE FROM topic WHERE author_id=?`, [post.id], function(err1){
            if(err1) throw err1;
            db.query(`DELETE FROM author WHERE id=?`, [post.id], function(err2, result) {
                if(err2) throw err2;
                response.writeHead(302, {Location: `/author`});
                response.end();
              });
          });
      });
};