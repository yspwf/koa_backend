const mysqlClient = require('mysql2');

const entryPath = process.cwd();
const config = require(`${entryPath}/config.js`);
const {mysql} = config;

const connection = mysqlClient.createConnection(mysql);
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