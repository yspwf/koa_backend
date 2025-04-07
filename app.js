const {bootstrap, register, use} = require('./library');
register('./src/product');
register('./promotion');

const { logInfo, logError } = require("./library/log");

const HttpException = require('./httpError');
const getLocalIp = require('./localIp');

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

      if(error instanceof HttpException){
        ctx.body = error.msg
      }
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
bootstrap(()=>{
  require('./router');
})
