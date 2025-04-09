const { createLogger, format, transports } = require('winston');

const initLogger = (type) => {
  const logger = createLogger({
    level: "info",
    // format: format.json(),
    format: format.combine(
      format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
      }),
      format.errors({ stack: true }),
      format.splat(),
      format.json()
    ),
    // defaultMeta: { error:"error" },
    // defaultMeta 表示日志的元数据 例如 服务名称
    defaultMeta: {service: type},
    transports: [
      new transports.Console(),
      // new transports.File({ filename: 'app.log' }),
      new transports.File({
        maxSize: '20m',
        maxFiles: '14d',
        level: 'error',
        filename: 'logs/app.log',
        format: format.combine(
          format.simple()
        )
      })
      // new transports.Stream({
      //   stream: rfs.createStream('web-log.log', {
      //     path: '',                // 文件存储地址
      //     size: '1M',          // 单个文件最大 1MB
      //     maxFiles: 10,        // 最多保留 10 个文件
      //     compress: false,
      //     rotate: 10           // 保留文件数
      //   })
      // })
    ]
  });
  return logger;
}


// logger.add(new transports.File({
//   maxSize: '20m',
//   maxFiles: '14d',
//   level: 'error',
//   filename: 'logs/%DATE%.log',
//   format: format.combine(
//     format.simple()
//   )
// }));


// let type = errType === 'system' ? '系统错误' : '接口错误'
// logger.log({
//   level: 'error',
//   message: type,
// });

// 添加一些实用的日志方法
exports.logInfo = (message, meta = {}, errType) => {
  const type = errType === 'system' ? '系统错误' : '接口错误';
  const logger = initLogger(type);
  // logger.add({
  //   defaultMeta: {"errorType": type}
  // })
  // logger.info(message, {timestamp: new Date().toISOString(), ...meta });
  logger.info(message, {timestamp: new Date().toLocaleString(), ...meta });
};
 
exports.logError = (message, error, meta = {}, errType) => {
  const errorObj = error instanceof Error ? error : null;
  const type = errType === 'system' ? '系统错误' : '接口错误';
  const logger = initLogger(type);
  logger.error(message, {
    // timestamp: new Date().toISOString(),
    timestamp: new Date().toLocaleString(),
    message: errorObj ? errorObj.message : error.message,
    stack: errorObj ? errorObj.stack : error.message,
    ...meta,
  });
};
 
exports.logWarn = (message, meta = {}, errType) => {
  const type = errType === 'system' ? '系统错误' : '接口错误';
  const logger = initLogger(type);
  // logger.warn(message, { timestamp: new Date().toISOString(), ...meta });
  logger.warn(message, { timestamp: new Date().toLocaleString(), ...meta });
};



// const { createLogger, format, transports } = require('winston');

// function loggers(errMsg, errType) {
//   const logger = createLogger({
//     level: 'error',
//     format: format.combine(
//       format.timestamp({
//         format: 'YYYY-MM-DD HH:mm:ss'
//       }),
//       format.errors({ stack: true }),
//       format.splat(),
//       format.json()
//     ),
//     defaultMeta: { errMsg }
//   });

//   logger.add(new transports.File({
//     maxSize: '20m',
//     maxFiles: '14d',
//     level: 'error',
//     filename: 'logs/%DATE%.log',
//     format: format.combine(
//       format.simple()
//     )
//   }));
//   // 以json格式logging
//   let type = errType === 'system' ? '系统错误' : '接口错误'
//   logger.log({
//     level: 'error',
//     message: type,
//   });
// }


