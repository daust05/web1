let http = require('http');
let fs = require('fs');
let url = require('url');
var qs = require('querystring');

function errorOnPage(message, response){
    console.log(message);
    response.writeHead(404);
    response.end('Not Found');
}

function makeFileList(files){
    let list = '<ul>';

    for(let i = 0; i < files.length; i++){
        if(files[i] == 'index.html')
            continue;
        list = list + `<li><a href="/?id=${files[i]}&type=html">${files[i]}</a></li>`
    }

    list = list+'</ul>';
    return list;
}

let app = http.createServer(function(request,response){
    let _url = request.url;
    var queryData = url.parse(_url, true).query;
    console.log(queryData);
    if(_url == '/'){
        // home: index로 지정
        _url = '/index.html';
        queryData.type = 'html';
    }
    else if(queryData.type == 'html'){
        _url = '/' + queryData.id;
    }
    else if(queryData.type == 'description'){
        _url = '/description.html';
    }
    else if(queryData.type == 'passing'){
        let body = '';
        request.on('data',(data)=>{
            body = body + data;
        });
        request.on('end',()=>{
            let post = qs.parse(body);
            let title = post.title;
            let description = post.description;
            fs.writeFile(`data/${title}`, description, 'utf8',(err)=>{
                if(err){
                    errorOnPage("File Creating Error",response);
                }
                response.writeHead(302,{Location: `/?id=${title}`});
                response.end('success');
            });
        });
    }
    _url = '/html' + _url;

    // 파일 읽어서 리스트 만들기
    if(queryData.type == 'html'){
        fs.readdir('html',(err, files)=>{
            if(err){
                errorOnPage("Connection Failed",response);
            }
            let list = makeFileList(files);
    
            fs.readFile(__dirname+_url, 'utf8',function(err,data){
                if(err){
                    errorOnPage(`file loading error!\nrequest_url: ${_url}`,response);
                }
                data = data.replace('{list}',list);
                response.writeHead(200, {'Content-Type':'text/html'});
                response.end(data);
            });
        });
    }
})
.listen(3000);