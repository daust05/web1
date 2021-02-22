/*  
npm -g (글로벌 옵션): 시스템 디렉토리에 설치
글로벌 옵션 선택시 npm link (패키지명)을 해줘야 require로 사용 가능
*/
var http = require('http');

http.createServer(function(request, response){
    /*  
        HTTP 헤더 전송
        HTTP Status: 200 : OK
        Content Type: text/plain
    */
    response.writeHead(200, {'Content-Type':'text/plain'});

    /*
        Response Body 를 "Hello World" 로 설정
    */
    response.end('hello world');

}).listen(8081);

