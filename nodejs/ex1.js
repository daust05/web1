let http = require('http');
let fs = require('fs').promises;
let url = require('url');
var qs = require('querystring');

function errorOnPage(message, response){
    console.log(message);
    response.writeHead(404);
    response.end('Not Found');
}

function makeFileList(files, type){
    let list = '';
    for(let i = 0; i < files.length; i++){
        if(files[i] == 'index.html')
            continue;
        list = list + `<li><a href="/?id=${files[i]}&type=${type}">${files[i]}</a></li>`
    }

    return list;
}

let app = http.createServer(function(request,response){
    let _url = request.url;
    var queryData = url.parse(_url, true).query;
    if(_url == '/'){
        // home: index로 지정
        _url = '/index.html';
        queryData.id = 'index';
        queryData.type = 'html';
    }
    else if(queryData.type == 'description'||
            queryData.id == 'description.html'){
        _url = '/description.html';
        queryData.type = 'description'
    }
    else if(queryData.type == 'html'){
        _url = '/' + queryData.id;
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
                response.writeHead(302,{Location: `/?id=${title}&type='description`});
                response.end();
            });
        });
    }
    _url = '/html' + _url;

    // 파일 읽어서 리스트 만들기
    if(queryData.type == 'html'){
        fs.readFile(__dirname+_url, 'utf8')
        .then((data)=>{
            //파일별 추가
            let fileName= String(queryData.id).replace('.html','');
            //list가 포함된 경우
            if(fileName == 'index'){
                fs.readdir('html')
                .then((files)=>{
                    let list = makeFileList(files, 'html');
                    data = data.replace('{list}',list);
                    response.writeHead(200, {'Content-Type':'text/html'});
                    response.end(data);
                })
                .catch((err)=>{
                    throw err;
                });
            }
            else {
                response.writeHead(200, {'Content-Type':'text/html'});
                response.end(data);
            }
        })
        .catch((err)=>{
            errorOnPage(`file loading error!\nrequest_url: ${_url}`,response);
        });
    }
    else if(queryData.type == 'description'){
        let data = fs.readFile(__dirname+_url,'utf8');
        let files = fs.readdir('data');
        if(queryData.id != 'description.html'){
            let path = `${__dirname}/data/${queryData.id}`;
            let description = fs.readFile(path,'utf8');
            
            Promise.all([data,files,description])
            .then(values=>{
                let html = values[0];
                let list = makeFileList(values[1],'description')
                let body = values[2];
                
                html = html.resplace('{list}',list);
                html = html.replace('{title}', queryData.id);
                html = html.replace('{body}', body);
    
                response.writeHead(200, {'Content-Type':'text/html'});
                response.end(html);
            })
            .catch(err=>{
                errorOnPage(`file loading error!\nrequest_url: ${_url}`,response);
            });
        }
        else{
            Promise.all([data,files])
            .then(values=>{
                let html = values[0];
                let list = makeFileList(values[1],'description')
                
                html = html.replace('{list}',list);
                html = html.replace('{title}','');
                html = html.replace('{body}','');
    
                response.writeHead(200, {'Content-Type':'text/html'});
                response.end(html);
            })
            .catch(err=>{
                errorOnPage(`file loading error!\nrequest_url: ${_url}`,response);
            });
        }
    }
})
.listen(3000);