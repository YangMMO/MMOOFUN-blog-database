'use strict';

const nodemailer = require('nodemailer');

// 开启一个SMTP 连接
let transporter = nodemailer.createTransport({
  host: 'smtp.qq.com',
  port: 465,
  secureConnection: true,
  secure: true,
  auth: {
    user: '11436052@qq.com',
    pass: 'evufifbmxsgpcahi' //QQ邮箱需要使用授权码
  }
})

// 填写邮件信息
let mailOptions = {
  from: 'MMO <11436052@qq.com>',  // 发件人
  to: '11436052@qq.com',  // 收件人
  subject: '',  // 标题
  test: '',  // 文本格式的内容
  html: '' // HTML格式的内容
};
 
// 使用前面创建的传输器来发送邮件
exports.send = function (subject, content) {
  if(subject && content) {
    mailOptions.subject = subject;
    mailOptions.text = content;
    // 使用此方法将邮件发送出去
    transporter.sendMail(mailOptions, (error, info) => {
    console.log(`Message: ${info.messageId}`);
    console.log(`sent: ${info.response}`);
    });
  }
}