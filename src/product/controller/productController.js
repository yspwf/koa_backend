const { Server } = require('../../../library/server');

const session = require('../../../session');
const HttpException = require('../../../httpError');
const { logInfo } = require("../../../library/log");
// console.log(new HttpException())

module.exports = class productController {
  

  home(ctx){
    // throw new Error('An error occurred'); // 抛出错误
    // ctx.throw(500);
    setTimeout(() => {
      throw new Error('突发错误！');
    }, 1000);
    ctx.body = 'product controller';
  }

  homelist(ctx){
    console.log("===========homelist=========")
    const a = b;
    ctx.body = 'product controller';
  }


  getProduct(ctx){
    // throw error;
    console.log(ctx.params)
    // try{
      throw new HttpException('登录错误', 10000, 500);
    // }catch(error){
    //   console.log("error1111", error)
    // }
    
   

    const requestId = session.get('requestId')
    setTimeout(() => {
      console.log(`requestId:${requestId}`) 
    }, 1000)
    
    ctx.body = Server.productServer.getProductById(ctx.params.id)
  }
}


// const createNamespace = require('cls-hooked').createNamespace;

// const session = createNamespace('shanyue case')

// session.run(() => {  
//   session.set('a', 3)  
//   setTimeout(() => {    // 获取值    
//     session.get('a')  
//   }, 1000)}
// )





// function session (ctx: KoaContext, next: any) {  
//   await session.runPromise(() => {    
//     // 获取 requestId    
//     const requestId = ctx.header['x-request-id'] || uuid()    
//     const userId = await getUserIdByCtx()    
//     ctx.res.setHeader('X-Request-ID', requestId)    // CLS 中设置 requestId/userId    
//     session.set('requestId', requestId)    
//     session.set('userId', userId)    
//     return next()  
//   })
// }
