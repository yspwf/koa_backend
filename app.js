const {bootstrap, register, use} = require('./library');
register('./src/product');
register('./promotion');

const { logInfo, logError } = require("./library/log");

const HttpException = require('./httpError');
const getLocalIp = require('./localIp');

const dotenv = require("dotenv");
console.log(process.env.NODE_ENV)
dotenv.config({ path: `.env.${process.env.NODE_ENV}`.replace(/\s/g, "") });

console.log(process.env.SERVER_PORT ) // 8880

const cors = require('@koa/cors');
use(cors({
  origin: function (ctx) {
      if (ctx.url === '/test') {
          return "*"; // 允许来自所有域名请求
      }
      return 'http://localhost:8080'; // 这样就能只允许 http://localhost:8080 这个域名的请求了
  },
  exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
  maxAge: 5, //本次预检请求有效期，单位秒
  credentials: true, //是否也许发送cookie
  allowMethods: ['GET', 'POST', 'DELETE', 'PUT', 'OPTIONS'], //http请求
  allowHeaders: ['Content-Type', 'Authorization', 'Accept'], //服务支持的头信息字段
}))


use(
  async (ctx, next)=>{
    try{
      await next()
    }catch(error){
      // logError("错误", {
      //   stack: JSON.stringify(error.stack),
      //   msg: JSON.stringify(error.msg),
      // });

      logError("请求异常", error, {
        localIp: getLocalIp(),
        method: ctx.method,
        url: ctx.url,
        status: ctx.status || 500,
        body: ctx.request.body,
        code: error.code,
        errorCode: error.errorCode,
        msg: error.msg
      })

      if (error instanceof HttpException) {
        ctx.body = {
          code: error.errorCode,
          msg: error.message,
          url: `${ctx.method}  ${ctx.path}`
        };
        // ctx.status = error.status;
        ctx.status = error.statusCode || error.status || 500;
      } else {
        ctx.body = {
          code: 9999,
          msg: "服务器发生错误",
          url: `${ctx.method}  ${ctx.path}`
        };
        ctx.status = 500;
      };

      //生产环境抛出错误
      if (process.env.NODE_ENV === "dev") {
        console.error(error);
      };

      // if(error instanceof HttpException){
      //   // ctx.body = error.msg
      //   ctx.app.emit('error', error, ctx); // 触发应用级别的错误事件
      // }else{
      //   ctx.status = error.statusCode || error.status || 500;  // 对 status的处理
        
      //   // error.status = error.status || 500; // 设置响应状态码
      //   // ctx.status = error.status;
      //   // ctx.body = {
      //   //   code: error.errorCode,
      //   //   msg: error.message,
      //   //   url: error.requestUrl
      //   // };
      //   ctx.app.emit('error', error, ctx); // 触发应用级别的错误事件
      // }
      

      // if(error){
      //   ctx.body = "系统异常"
      // }
    }
  }
)

use(async (ctx, next) => {
  const token = ctx.request.headers["x-request-id"] || Date.now().toString(36);

    logInfo("请求开始", {
      token,
      method: ctx.method,
      url: ctx.url,
      query: ctx.query,
      body: ctx.request.body,
      ip: ctx.ip,
      userAgent: ctx.headers["user-agent"] ?? "12313",
    });
    await next();
})

const session = require('./session');

use(
 async (ctx, next) => {
    // ctx.log = log;
    await session.runPromise(async () => {
      // 获取 requestId
      // const requestId = ctx.header['trace-id'] || '-'
      const requestId = Math.random();
      console.log(`requestId:${requestId}`) 
      ctx.res.setHeader('trace-id', requestId)
      // CLS 中设置 requestId
      session.set('requestId', requestId)
	  // 也可以去掉async,这里直接返回next()
    })
    await next();
    // try {
    //   await next();
    // } catch (e) {
    //   console.log(e.stack);
    //   // ctx.log.error(e.message);
    // }
  }
)

use(
  async (ctx, next) => {
    console.log(`${ctx.request.method} ${ctx.request.url}`); // 打印URL
    await next(); // 调用下一个middleware
  }
)

const res = bootstrap(()=>{
  require('./router');
  require('./user');

  process.on('uncaughtException', (err, origin) => {
    console.error('捕获到一个未处理的异常：', err);
    console.error('异常发生在一个未被try-catch捕获的异步函数中。');
    console.error('异常原始来源：', origin);
  });

})();
