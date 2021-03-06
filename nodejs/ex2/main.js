let fs = require('fs').promises;
let http = require('http');
let url = require('url');

function Template(title='title'){
    this.head= `<meta charset="utf-8"><title>${title}</title>`;
    this.body= `
    <h1><a href = '/'>Home</a></h1>
    `;
}
Template.prototype.getHead = function(){
    return `<head>${this.head}</head>`;
}
Template.prototype.getBody = function(){
    return `<body>${this.body}</body>`;
}
Template.prototype.getHTML = function(new_head=undefined, new_body=undefined){
    let html_head, html_body;

    if(new_head)
        html_head = new_head;
    else
        html_head = this.getHead();
    
    if(new_body)
        html_body = new_body;
    else
        html_body = this.getBody();

    let HTML =  `
    <!DOCTYPE HTML>
    <html>
        ${html_head}
        ${html_body}
    </html>
    `;
    return HTML;
}

function Page(){
    this.template = new Template();
}
Page.prototype.getPage =async function(name,data=undefined){
    let new_head;
    let new_body;
    try{
        switch(name){
            case '/':
                new_body = this.template.getBody();
                let files = await fs.readdir('./data');
                console.log(files);
                return this.template.getHTML();
            default:
                return this.template.getHTML();
        }
    }
    catch(err){
        console.log(err);
    }
}

let page = new Page();
const server = http.createServer((request,response)=>{
    _url = request.url;
    queryData = url.parse(_url,true).query;
    response.writeHead(200,{'content-type':'text/html'});
    page.getPage(_url)
    .then(_page => response.end(_page));
});

server.listen(3000);