const mysqlClient = require('mysql2');

const entryPath = process.cwd();
const config = require(`${process.env.corePath}/config.js`);
const {host, port, user, password, database} = config.mysql;

const connection = mysqlClient.createConnection({
  'host': process.env.DB_HOST ?? host, 
  'port': process.env.DB_PORT ?? port,
  'user': process.env.DB_USER ?? user, 
  'password': process.env.DB_PWD ?? password, 
  'database': process.env.DB_NAME ?? database, 
});

connection.connect((err) => {
  // console.log('mysql connect fail')
  if (err) { console.error('连接数据库失败:', err.stack); return; }
    // console.log('已连接到数据库');
    console.log('已连接到数据库: ' + connection.threadId);
})


// // 查询数据 
// connection.query('SELECT * FROM user', (error, results) => {
//   if (error) throw error; console.log('查询结果:', results); 
// }); 

module.exports = connection;
// connection.end()