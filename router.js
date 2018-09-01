'use strict'

const log4js = require('log4js');
const logger = log4js.getLogger();
const fs = require('fs');
const path = require('path');

logger.level = 'info';

const url = require('url');

const rules = [
    {
        pattern:/^\/$/,
        action:'static'
    },
    {
        pattern:/^\/.+\.(html|js|css|png|jpg|eot|svg|ttf|woff|woff2|otf)$/,
        action:'static'
    },
    {
        pattern:/^\/api\/blog/,
        action:'api'
    }
]

exports.router = function(req,res){

    let urlObj = url.parse(req.url);
    let pathname = urlObj.pathname;
    let action;

    logger.info(req.socket.remoteAddress + ' ' + req.method + ' ' + pathname);

    rules.forEach(rule=>{
        if(rule.pattern.test(pathname)){
            action = rule.action;
        }
    })

    if(action){
        require('./action/'+action)(req,res)
    }else{
        const staticPath = path.resolve(__dirname,'./static/404.html');
        res.writeHead(404, {'Content-Type': 'text/html'})
        fs.readFile(staticPath, (err, data) => {
          if(err) throw err;
          res.end(data)
        })
    }

}