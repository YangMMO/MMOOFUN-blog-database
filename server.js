'use strict'

const cluster = require('cluster');
const cpuNum = require('os').cpus().length;

//创建cluster集群
if (cluster.isMaster) {
  //轮叫调度
  cluster.schedulingPolicy = cluster.SCHED_RR;

  let workers = {};
  let errDate = new Date().getTime();

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
        console.info(`worker[${worker.process.pid}] suicide`);
        cluster.fork();
      }
      if (info.err) {
        let date = new Date.getTime()
        if (date < errDate + 10000) return;
        errDate = date;
        console.log('err: ' + errDate)
        // mail.send('[服务器异常]' + err.toString(), err.stack)
      }
    });
    console.info(`worker[${worker.process.pid}] fork success`);
  });
} else {
  require('./worker.js');
}
