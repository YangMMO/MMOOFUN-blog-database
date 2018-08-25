// WEB服务测试
const assert = require('assert');
const request = require('request');

describe('WEB服务测试', () => {
  it('主页正常访问', (done) => {
    request.get('http://mmoo.fun/', (err, res, body) => {
      assert.equal(200, res.statusCode);
      assert.notEqual(-1, body.indexOf('<html'));
      assert(body.indexOf('Nodejs实战课程') >= 0);
      done();
    })
  });

  it('about页面返回码404', (done) => {
    request.get('http://mmoo.fun/about', (err, res, body) => {
      assert.equal(404, res.statusCode);
      done();
    })
  });
});
