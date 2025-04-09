const path = require('node:path');
const corePath = path.join(__dirname, '.');
process.env.corePath = path.join(__dirname, '.');
const entryPath = process.cwd();

const app = require(`${corePath}/app`);

const router = require(`${corePath}/router`);
exports.router = router;

console.log(`${corePath}/config`)
const config = require(`${corePath}/config.js`);
const { defatutPort } = config;
// const port = process.env.SERVER_PORT;
// console.log(port);


const { readDir, loaderFile} = require(`${corePath}/loaderUtile`);


const { useObject, use} = require(`${corePath}/middleware`);
exports.use = use;

const {moduleObject, register} = require(`${corePath}/module`);
exports.register = register;

const { EachController } = require('./controller')
const { EachServer } = require('./server')

// process.nextTick()
process.nextTick(function(){
 

  moduleArr = moduleObject.getAll();
  moduleArr.forEach(modulItem => {
      const ctrFiles = readDir(`${modulItem}/controller`);
      const ctlResult = EachController(`${modulItem}/controller`, ctrFiles);
  })

  moduleArr.forEach(modulItem => {
    const serverFiles = readDir(`${modulItem}/server`);
    const serverResult = EachServer(`${modulItem}/server`, serverFiles);
  })
})

const HttpException = require('../httpError');

const bootstrap = (fn) => {
  process.nextTick(()=>{
    useMiddlewareResult = useObject.getAll();
    // console.log(useMiddlewareResult);
    useMiddlewareResult.forEach(item => {
      // console.log(item())
      app.use(item);
    });

// app.use(
//   async (ctx, next)=>{
//     try{
//         await next()
//         console.log('error', '1231321')
//     }catch(error){
//       console.log('error', error)
//         if(error instanceof HttpException){
//           ctx.body = error.msg
//         }
//     }
//   }
// )


    fn && fn();
    app.use(router.routes()).use(router.allowedMethods());
  })

  return (port) => {

    const server = app.listen(8096, () => {
      console.log(`server is starting with port: ${port || defatutPort}`)
    })

    process.on('SIGINT', async () => {
      console.log('Received SIGINT. Gracefully shutting down all components...');
      server.close(() => {
        console.log('Product Service stopped');
        process.exit(0);
      });
      // process.exit(0);
    });

    process.on('SIGTERM', async () => {
      console.log('Received SIGTERM. Gracefully shutting down all components...');
      server.close(() => {
        console.log('Product Service stopped');
        process.exit(0);
      });
      // process.exit(0);
    })
  }
}

exports.bootstrap = bootstrap;
