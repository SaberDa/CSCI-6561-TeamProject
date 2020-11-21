require('module-alias/register');

const Koa = require('koa');
const app = new Koa();
const json = require('koa-json');
const onerror = require('koa-onerror');
const koaBody = require('koa-body');
const static = require('koa-static');
const logger = require('koa-logger');
const requireDirectory = require('require-directory');
var path = require('path');
var fs = require('fs');

const config = require('./config');

const ENV = process.env.NODE_ENV;

// error handler
onerror(app);

// middlewares
app.use(koaBody({
  multipart: true,  // 支持表单上传
  formidable: {
    maxFileSize: 10 * 1024 * 1024, // 修改文件大小限制，默认位2M
  }
}));
app.use(json());
app.use(static(path.join(__dirname, '../public')));

// 日志
const logFileName = path.join(__dirname, '../logs', 'access.log');
app.use(logger((logWord, args) => {
  if (ENV !== 'production') {
    // 开发环境/测试环境
    console.log(logWord);
  } else {
    // 生产环境
    if(!args[3]) return;
    const word = `${args[1]} ${args[2]} ${args[3]} ${args[4]} ${args[5]}`;
    const wstream = fs.createWriteStream(logFileName, { flags: 'a' });
    wstream.on('open', () => {
      wstream.write(word + '\n');
      wstream.end();
    });
  }
}));

// 错误捕捉
app.use(async(ctx, next) => {
  try {
    ctx.error = (code, message) => {
      if (typeof code === 'string') {
        message = code;
        code = 500;
      }
      ctx.throw(code || 500, message || '服务器错误');
    };
    await next();
  } catch (e) {
    const status = e.status || 500;
    const msg = e.message || '服务器错误';
    ctx.status = status;
    ctx.body = { status, msg };
    if(ENV === 'production') {
      const wstream = fs.createWriteStream(logFileName, { flags: 'a' });
      wstream.on('open', () => {
        wstream.write(e + '\n');
        wstream.end();
      });
    }
  }
});

// 路由
const routesDir = path.join(__dirname, 'routes');
requireDirectory(module, routesDir, {
  visit: (route) => {
    if(route.routes) {
      app.use(route.routes()).use(route.allowedMethods());
    }
  }
});

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx.status);
});

// config
global.config = config;

module.exports = app;
