var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');

function templateHTML(title, list, body, control){
  return `
  <!doctype html>
  <html>
  <head>
    <title>WEB1 - ${title}</title>
    <meta charset="utf-8">
  </head>
  <body>
    <h1><a href="/">WEB</a></h1>
    ${list}
    ${control}
    ${body}
  </body>
  </html> 
  `;
}

function templateList(filelist) {
  var list = '<ul>';
    var i = 0;
    while (i < filelist.length){
      list += `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
      i = i + 1;
    }
    list = list + '</ul>';
    return list;
}
 
var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
    var title = queryData.id;

    if(pathname === '/'){
      if(queryData.id === undefined) {

        fs.readdir('data', function(err, filelist){
          var title = '==Node JS Class==';
          var description = 'Hello, Node.js';
          
          var list = templateList(filelist);
          var template = templateHTML(title, list, 
            `<h2>${title}</h2>${description}`,
            `<a href='/create'>CREATE</a>`);
          response.writeHead(200);
          response.end(template);
        }); 

      } else {
        fs.readdir('data', function(err, filelist){
          var list = templateList(filelist);
          fs.readFile(`data/${queryData.id}`, 'utf8', function(err, description){
            title = queryData.id;
            var template = templateHTML(title, list, 
              `<h2>${title}</h2>${description}`,
              `<a href='/create'>CREATE</a>
              <br>
              <a href='/update?id=${title}'>UPDATE</a>
              <br>
              <form action='/delete_process' method='post'>
                <input type="hidden" name="id" value="${title}">
                <input type="submit" value='delete'>
              </form>
              <br>
              `);
            response.writeHead(200);
            response.end(template);
          });
        });
      }
    } else if (pathname === '/create') {
      fs.readdir('data', function(err, filelist){
        var title = 'WEB- CREATE';
        var list = templateList(filelist);
        var template = templateHTML(title, list, 
          `<form action='http://localhost:3000/create_process' method='post'>
          <p><input type='text' name='title' placeholder='title'></input></p>
          <p>
              <textarea name='description' placeholder='description'></textarea>
          </p>
          <p>
              <input type='submit'>
          </p>
          </form>`, 
          ''
        );
        response.writeHead(200);
        response.end(template);
      }); 
    } else if (pathname === '/create_process') {
      var body = '';
      request.on('data', function (data) { 
        // In post method, if many data is included in stream, callback is called.
        body += data;
      });
      request.on('end', function(){
        var post = qs.parse(body);
        var title = post.title;
        var description = post.description;
        fs.writeFile(`data/${title}`, description, 'utf8', function(err){
          response.writeHead(302, {Location: `/?id=${title}`});
          response.end();
        });
      });
    } else if (pathname === '/update') {
      fs.readdir('./data', function(err, filelist){
        fs.readFile(`./data/${queryData.id}`, 'utf8', function(err, description){
          var title = queryData.id;
          var list = templateList(filelist);
          var template = templateHTML(title, list, `
            <form action='/update_process' method='post'>
              <input type='hidden' name='id' value='${title}'>
              <p><input type='text' name='title' value=${title}></input></p>
              <p>
                  <textarea name='description' placeholder='description'>${description}</textarea>
              </p>
              <p>
                  <input type='submit'>
              </p>
            </form>
            `, 
            ''
          );
          response.writeHead(200);
          response.end(template);
        });
      });
    } else if (pathname === '/update_process') {
      var body2 = '';
      request.on('data', function (data) { 
        // In post method, if many data is included in stream, callback is called.
        body2 += data;
      });
      request.on('end', function(){
        var post = qs.parse(body2 );
        var id = post.id;
        var title = post.title;
        var description = post.description;
        fs.rename(`data/${id}`, `data/${title}`, function(err) {
          fs.writeFile(`data/${title}`, description, 'utf8', function(err){
            response.writeHead(302, {Location: `/?id=${title}`});
            response.end();
          });  
        });
      });
    } else if (pathname === '/delete_process') {
      var body3 = '';
      request.on('data', function (data) { 
        // In post method, if many data is included in stream, callback is called.
        body3 += data;
      });
      request.on('end', function(){
        var post = qs.parse(body3);
        var id = post.id;
        fs.unlink(`./data/${id}`, function(err) {
          response.writeHead(302, {Location: '/'});
          response.end();
        });
      });
    } else {
      response.writeHead(404);
      response.end('Not found');
    }
 
});
app.listen(3000);