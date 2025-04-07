// import os from 'os'
// const os = require('os');
// // 获取本机的所有网络接口
// const networkInterfaces = os.networkInterfaces();
// ​console.log(networkInterfaces);


const os = require('os');
// 获取所有的网卡信息
const list = os.networkInterfaces();
 
// 过滤掉mac值全为0的地址即可
// 如果有多个不为0的地址，一般正确且唯一的物理地址是en0中的值
 
// console.log(list)


// 遍历网络接口，获取有效的 IPv4 地址
module.exports = () => {
  for (let interfaceName in list) {
    for (let interfaceDetails of list[interfaceName]) {
      // 检查是否为 IPv4 地址，并且是局域网地址
      if (interfaceDetails.family === 'IPv4' && !interfaceDetails.internal) {
        return interfaceDetails.address;
      }
    }
  }
  return null;  // 如果没有找到合适的 IP 地址
}


