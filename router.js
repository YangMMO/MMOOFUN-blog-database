'use strict'

const log4js = require('log4js');
let logger = log4js.getLogger();
log4js.configure({
  appenders: { cheese: { type: 'file', filename: 'logs/access.log' } },
  categories: { default: { appenders: ['cheese'], level: 'info' } }
})

// logger.level = 'info';

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
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/plain');
        res.end();
    }

}