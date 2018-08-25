'use strict'

const cluster = require('cluster');
const cpuNum = require('os').cpus().length;
const mail = require('./mail.js');
const http = require('http');

//创建cluster集群
if (cluster.isMaster) {
  //轮叫调度
  cluster.schedulingPolicy = cluster.SCHED_RR;

  let workers = {};
  let prevDate = new Date().getTime();

  // 创建工作进程
  for (let i = 0; i < cpuNum; i++) {
    cluster.fork();    
  }

  // exit事件
  cluster.on('exit', (worker, code) => {
    console.info(`worker[${worker.process.pid}] exit, code: ${code}`)
    delete workers[worker.process.pid];
  })

  // fork事件
  cluster.on('fork', worker => {
    workers[worker.process.pid] = worker;

    // 进程通信
    worker.on('message', info => {
      if (info.act === 'suicide') {
        let err = info.error;

        console.info(`worker[${worker.process.pid}] suicide`);
        cluster.fork();

        if (err.date > prevDate + 600000) {
          prevDate = err.date;
          mail.send('[服务器异常]' + err.title, err.content)
        }
      }
    });
    console.info(`worker[${worker.process.pid}] fork success`);
  });
} else {
  require('./worker.js');
}



















// const http = require('http');

// const port = 80;

// const server = http.createServer((req, res) => {

// 	for(var key in require.cache){
// 		if(!key.includes('node_modules')){
// 			delete require.cache[key];
// 		}
// 	}
// 	require('./router').router(req,res);
// });

// server.listen(port, () => {
// 	console.log(`Server running`);
// });