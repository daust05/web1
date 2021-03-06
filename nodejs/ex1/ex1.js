let http = require('http');
let fs = require('fs').promises;
let url = require('url');
var qs = require('querystring');

function errorOnPage(message, response){
    console.log(message);
    response.writeHead(404);
    response.end('Not Found');
}

function makeFileList(files, type,context = undefined){
    let list = '';
    if(type == 'html'){
        for(let i = 0; i < files.length; i++){
            if(files[i] == 'index.html')
                continue;
            else{
                list = list + `<li><a href="/?id=${files[i]}&type=${type}">${files[i]}</a></li>`
            }
        }
    }
    else if(type = 'description'){
        for(let i = 0; i < context.length; i++){
            list = list + `<li><a href="/?id=description.html&type=${type}&context=${context[i]}">${context[i]}</a></li>`
        }
    }

    return list;
}


http.createServer(function(request,response){
    let _url = request.url;
    var queryData = url.parse(_url, true).query;
    console.log(queryData)
    if(_url == '/'){
        // home: index로 지정
        _url = '/index.html';
        queryData.id = 'index';
        queryData.type = 'html';
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
            fs.writeFile(`data/${title}`, description, 'utf8')
            .then(()=>{
                response.writeHead(302,{Location: `/?id=description.html&type=description&context=${title}`});
                response.end();
            })
            .catch((err)=>{
                console.log('file creating error')
            });
        });
    }
    else{
        _url = '/' + queryData.id;
    }
    _url = '/html' + _url;

    // 파일 읽어서 리스트 만들기
    if(queryData.type != 'passing'){
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
            else if(fileName == 'description'){
                let files = fs.readdir('data')
                if(queryData.context != undefined){
                    let path = `${__dirname}/data/${queryData.context}`;
                    let description = fs.readFile(path,'utf8');
                    Promise.all([files,description])
                    .then(values=>{
                        let list = makeFileList('description.html','description',values[0])
                        let body = values[1];
                        
                        data = data.replace('{list}',list);
                        data = data.replace('{title}', queryData.context);
                        data = data.replace('{body}', body);
            
                        response.writeHead(200, {'Content-Type':'text/html'});
                        response.end(data);
                    })
                    .catch(err=>{
                        errorOnPage(`file loading error!\nrequest_url: ${_url}`,response);
                    });
                }
                else{
                    files
                    .then(ls=>{
                        let list = makeFileList('description.html','description',ls)
                        
                        data = data.replace('{list}',list);
                        data = data.replace('{title}','');
                        data = data.replace('{body}','');
            
                        response.writeHead(200, {'Content-Type':'text/html'});
                        response.end(data);
                    })
                    .catch(err=>{
                        errorOnPage(`file loading error!\nrequest_url: ${_url}`,response);
                    });
                }
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
})
.listen(3000);