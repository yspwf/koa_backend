const { createLogger, format, transports } = require('winston');

const logger = createLogger({
  level: "info",
  format: format.json(),
  // defaultMeta 表示日志的元数据 例如 服务名称
  defaultMeta: {service: "app-service"},
  transports: [
    new transports.Console(),
    new transports.File({ filename: 'app.log' })
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
})

// 添加一些实用的日志方法
exports.logInfo = (message, meta = {}) => {
  logger.info(message, { timestamp: new Date().toISOString(), ...meta });
};
 
exports.logError = (message, error, meta = {}) => {
  const errorObj = error instanceof Error ? error : null;
  logger.error(message, {
    timestamp: new Date().toISOString(),
    message: errorObj ? errorObj.message : error.message,
    stack: errorObj ? errorObj.stack : error.message,
    ...meta,
  });
};
 
exports.logWarn = (message, meta = {}) => {
  logger.warn(message, { timestamp: new Date().toISOString(), ...meta });
};

