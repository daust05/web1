let http = require('http');
let fs = require('fs');
let url = require('url');

function errorOnPage(message, response){
    console.log(message);
    response.writeHead(404);
    response.end('Not Found');
}

let app = http.createServer(function(request,response){
    let _url = request.url;
    let status;
    // home: index로 지정
    if(_url == '/'){
        status = 'index';
    }
    else {
        let query = url.parse(_url, true).query;
        status = query.id;
    }
    status += '.html';

    // 파일 포함 여부 확인
    fs.readdir('html',(err, files)=>{
        if(err){
            errorOnPage("Connection Failed",response);
        }

        if(files.indexOf(status)<0){
            errorOnPage("No Existing File",response);
        }
    })

    _url = `/html/${status}`;
    fs.readFile(__dirname+_url, function(err,data){
        if(err){
            errorOnPage("file loading error",response);
        }
        else{
            response.writeHead(200, {'Content-Type':'text/html'});
            response.end(data);
        }
    });
})
.listen(3000);