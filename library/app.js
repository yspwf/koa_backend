const Koa = require('koa');
const app = new Koa();
const { koaBody } = require('koa-body');
// app.use(koaBody({
//   multipart: true,
//   formidable: {
//     // 上传目录
//     uploadDir: __dirname + '/public/upload',
//     // 是否保留上传文件名后缀
//     keepExtensions: true
//   }
// }));
const path = require('node:path');

const helmet = require('koa-helmet');

app.use(helmet())

app.use(
  koaBody({
    multipart: true, // 支持文件上传（会挂载ctx.request.files）
    // 文件上传配置
    formidable: {
      uploadDir: path.join(__dirname, "../upload"), // 上传目录（不能使用相对路径，不会相对于当前路径，而是process.cwd()的执行路径）
      keepExtensions: true, // 保留文件扩展名
    },
    parsedMethods: ["POST", "PUT", "PATCH", "DELETE"], // 只解析这些方法的body
  })
);



// app.use(async (ctx, next) => {
//   console.log(`${ctx.request.method} ${ctx.request.url}`); // 打印URL
//   await next(); // 调用下一个middleware
// });

// app.use(async (ctx, next) => {
//   const start = new Date().getTime(); // 当前时间
//   await next(); // 调用下一个middleware
//   const ms = new Date().getTime() - start; // 耗费时间
//   console.log(`Time: ${ms}ms`); // 打印耗费时间
// });



app.use(async (ctx, next)=>{
  try{
    await next();
  }catch(error){
    console.log('error.stack',error.stack)
  }
})

// app.on('error', (error) => {
//   console.log(error);
// })

app.on('error', (err, ctx) => {
  console.error('server error', err);
  ctx.body = { message: err.message };
});

module.exports = app;