const connection = require('./mysql');
const debug = true;


/**
 * 执行 SQL 语句
 * @param {String} sql
 * @param {*} params
 * @returns {Array}
 */
exports.execute = (sql, params)=> {
  return new Promise((resolve, reject) => {
    if(!connection) reject(`数据库连接未创建，请配置 useDB、dbName 属性...`);
    debug && console.debug("[SQL]", sql, "[PARAMS]", Array.isArray(params)? params : (params||"（无）"))
    connection.execute(sql, Array.isArray(params) && params.length >0 ? [...params] : [], (err, results, fields) => {
      if (err) {
        reject(err);
        debug && console.debug('[SELECT ERROR] - ', err.message);
        return;
      }
      resolve(results);
    })
    // connection.end();
})


/**
 * 按 ID 查询数据（单条）
 * @param {String} id
 * @param {String} table
 * @param {String} idField - ID字段名，默认 id
 * @returns {Object}
 */
exports.findById= async (id, table, idField="id")=>{
  let [ results ] = await query(`SELECT * FROM ${table} WHERE ${idField}=? LIMIT 1`, id)
  return results[0]
}

  // if(!connection)  throw Error(`数据库连接未创建，请配置 useDB、dbName 属性...`)
  // debug && console.debug("[SQL]", sql, "[PARAMS]",Array.isArray(params)?params[0]:(params||"（无）"))
  // // return connection.query(sql, params)
  // connect.execute('SELECT * FROM user', [], (err, results, fields) => {
  //   if (err) {
  //     console.log('[SELECT ERROR] - ', err.message);
  //     return;
  //   }
  //   // console.log(results);
  //   // console.log(fields);
  //   ctx.body = results;
  // })
}

