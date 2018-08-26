### 计划事项
> - [x] 服务器代码部署
> - [x] bin目录sh脚本：start.sh、stop.sh、update.sh、rollback.sh
> - [x] 记录日志输出：url路径、客户端IP
> - [x] 邮件监控告警：最多10分钟出发一次
> - [x] 单元测试用例：验证页面访问 test/test.js
> - [x] 压力测试：结果保存 test/stress-test-report.txt
> - [x] 数据库

### 总结
> 项目开始的时候对于linux的除接触，总有不少难解决的问题，也先后重装多次linux系统，也有不少新手问题如脚本的编写路径问题，数据库的md2html出现的字符集错误等。其中在做邮件告警监控中，最开始是使用cluster集群来frok子进程，由cluster负责触发邮件告警时间逻辑，因由worker来require（router），最终log4js无法正常输出url、ip，最终在这个问题上磕碰了两三天，目前也不懂其原因，求大佬解答，最后提前祝大佬们 中秋快乐 _(:з」∠)_
> 项目最后的访问地址 http://mmoo.fun/