const os = require('os');
// 获取当前Node内存堆栈情况
const { rss, heapUsed, heapTotal } = process.memoryUsage();
// 获取系统空闲内存
const sysFree = os.freemem();
// 获取系统总内存
const sysTotal = os.totalmem();

// module.exports = {
//   memory: () => {
//     return {
//       sys: 1 - sysFree / sysTotal,  // 系统内存占用率
//       heap: heapUsed / headTotal,   // Node堆内存占用率
//       node: rss / sysTotal,         // Node占用系统内存的比例
//     }
//   }
// }

const memory = () => {
    return {
      sys: 1 - sysFree / sysTotal,  // 系统内存占用率
      heap: heapUsed / heapTotal,   // Node堆内存占用率
      node: rss / sysTotal,         // Node占用系统内存的比例
    }
}

console.log(memory())



const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
 
class OSUtils {
  constructor() {
    this.cpuUsageMSDefault = 1000; // CPU 利用率默认时间段
  }
 
  /**
   * 获取某时间段 CPU 利用率
   * @param { Number } Options.ms [时间段，默认是 1000ms，即 1 秒钟]
   * @param { Boolean } Options.percentage [true（以百分比结果返回）|false] 
   * @returns { Promise }
   */
  async getCPUUsage(options={}) {
    const that = this;
    let { cpuUsageMS, percentage } = options;
    cpuUsageMS = cpuUsageMS || that.cpuUsageMSDefault;
    const t1 = that._getCPUInfo(); // t1 时间点 CPU 信息
 
    await sleep(cpuUsageMS);
 
    const t2 = that._getCPUInfo(); // t2 时间点 CPU 信息
    const idle = t2.idle - t1.idle;
    const total = t2.total - t1.total;
    let usage = 1 - idle / total;
 
    if (percentage) usage = (usage * 100.0).toFixed(2) + "%";
 
    return usage;
  }
 
  /**
   * 获取 CPU 信息
   * @returns { Object } CPU 信息
   */
  _getCPUInfo() {
    const cpus = os.cpus();
    let user = 0, nice = 0, sys = 0, idle = 0, irq = 0, total = 0;
 
    for (let cpu in cpus) {
      const times = cpus[cpu].times;
      user += times.user;
      nice += times.nice;
      sys += times.sys;
      idle += times.idle;
      irq += times.irq;
    }
 
    total += user + nice + sys + idle + irq;
 
    return {
      user,
      sys,
      idle,
      total,
    }
  }
}

(async () => {
  const osUtils = new OSUtils();
  const cpuUsage = await osUtils.getCPUUsage({ percentage: true });
  console.log('CPU 利用率：', cpuUsage) // CPU 利用率：13.72%
})()



 
// 获取 CPU 使用率的函数
function getCpuUsage() {
  return new Promise((resolve, reject) => {
    const startCpuInfo = os.cpus(); // 获取初始的 CPU 信息
 
    setTimeout(() => {
      const endCpuInfo = os.cpus(); // 获取采样后的 CPU 信息
 
      // 计算各个核心的使用率
      const cpuUsage = endCpuInfo.map((endCore, index) => {
        const startCore = startCpuInfo[index];
 
        // 计算起始和结束的时间差
        const startTotal = Object.values(startCore.times).reduce(
          (a, b) => a + b,
          0
        );
        const endTotal = Object.values(endCore.times).reduce(
          (a, b) => a + b,
          0
        );
 
        const idleDiff = endCore.times.idle - startCore.times.idle;
        const totalDiff = endTotal - startTotal;
 
        const usage = (1 - idleDiff / totalDiff) * 100;
        return {
          core: index,
          usage: usage.toFixed(2), // 保留两位小数
        };
      });
 
      resolve(cpuUsage);
    }, 100); // 延迟 100ms
  });
}

const load = os.loadavg();
console.log(`CPU 负载（1分钟平均值）：${load[0]}`);
console.log(`CPU 负载（5分钟平均值）：${load[1]}`);
console.log(`CPU 负载（15分钟平均值）：${load[2]}`);
 
// 调用获取 CPU 使用率的函数
getCpuUsage()
  .then((cpuUsage) => {
    console.log("CPU 使用率:");
    cpuUsage.forEach((core) => {
      console.log(`核心 ${core.core} 使用率: ${core.usage}%`);
    });
  })
  .catch((err) => {
    console.error("获取 CPU 使用率失败:", err);
  });



 
// 打印内存使用情况的函数
function printMemoryUsage() {
  const memoryUsage = process.memoryUsage();
 
  console.log("内存使用情况:");
  console.log(
    `RSS（常驻内存大小）：${(memoryUsage.rss / 1024 / 1024).toFixed(2)} MB`
  );
  console.log(
    `堆内存总量（heapTotal）：${(memoryUsage.heapTotal / 1024 / 1024).toFixed(
      2
    )} MB`
  );
  console.log(
    `已用堆内存（heapUsed）：${(memoryUsage.heapUsed / 1024 / 1024).toFixed(
      2
    )} MB`
  );
  console.log(
    `外部内存（external）：${(memoryUsage.external / 1024 / 1024).toFixed(
      2
    )} MB`
  );
  console.log(`系统可用内存：${(os.freemem() / 1024 / 1024).toFixed(2)} MB`);
  console.log(`系统总内存：${(os.totalmem() / 1024 / 1024).toFixed(2)} MB`);
}
 
// 模拟内存消耗的函数
function createLargeArray() {
  const largeArray = new Array(1e6).fill("Hello");
  console.log("创建了一个大型数组");
  printMemoryUsage();
}
 
printMemoryUsage(); // 初始内存使用情况
createLargeArray(); // 模拟内存使用




const { exec } = require("child_process");
 
function getDiskSpaceLinux() {
  exec("df -h /", (error, stdout, stderr) => {
    if (error) {
      console.error(`执行出错: ${error.message}`);
      return;
    }
 
    if (stderr) {
      console.error(`标准错误输出: ${stderr}`);
      return;
    }
 
    // 解析 df 命令输出
    const lines = stdout.trim().split("\n");
    const diskInfo = lines[1].split(/\s+/);
 
    console.log("磁盘空间使用情况:");
    console.log(`总空间: ${diskInfo[1]}`);
    console.log(`已用空间: ${diskInfo[2]}`);
    console.log(`可用空间: ${diskInfo[3]}`);
    console.log(`使用率: ${diskInfo[4]}`);
  });
}
 
getDiskSpaceLinux();



//在 Windows 系统上，可以使用 wmic logicaldisk 命令来获取磁盘空间信息。以下是 Node.js 中的实现
function getDiskSpaceWindows() {
  exec(
    "wmic logicaldisk get size,freespace,caption",
    (error, stdout, stderr) => {
      if (error) {
        console.error(`执行出错: ${error.message}`);
        return;
      }
 
      if (stderr) {
        console.error(`标准错误输出: ${stderr}`);
        return;
      }
 
      // 解析 wmic 命令输出
      const lines = stdout.trim().split("\n");
      lines.slice(1).forEach((line) => {
        const [drive, free, total] = line.trim().split(/\s+/);
        if (drive) {
          const used = total - free;
          const usage = ((used / total) * 100).toFixed(2);
 
          console.log(`磁盘分区: ${drive}`);
          console.log(`总空间: ${(total / 1024 / 1024 / 1024).toFixed(2)} GB`);
          console.log(`已用空间: ${(used / 1024 / 1024 / 1024).toFixed(2)} GB`);
          console.log(`可用空间: ${(free / 1024 / 1024 / 1024).toFixed(2)} GB`);
          console.log(`使用率: ${usage}%`);
          console.log("---");
        }
      });
    }
  );
}
 
getDiskSpaceWindows();




 
const getCPU = async () => {
  function cpuAverage() {
    // Initialise sum of idle and time of cores and fetch CPU info
    var totalIdle = 0, totalTick = 0;
    var cpus = os.cpus();
    // Loop through CPU cores
    for(var i = 0, len = cpus.length; i < len; i++) {
      // Select CPU core
      var cpu = cpus[i];
      // Total up the time in the cores tick
      for(const type in cpu.times) {
        totalTick += cpu.times[type];
     }     
      // Total up the idle time of the core
      totalIdle += cpu.times.idle;
    }
    // Return the average Idle and Tick times
    return { idle: totalIdle / cpus.length,  total: totalTick / cpus.length };
  }
 
  const startMeasure = cpuAverage();
  return new Promise((resolve) => {
    setTimeout(function() { 
      // Grab second Measure
      var endMeasure = cpuAverage(); 
      // Calculate the difference in idle and total time between the measures
      var idleDifference = endMeasure.idle - startMeasure.idle;
      var totalDifference = endMeasure.total - startMeasure.total;
      // Calculate the average percentage CPU usage
      var percentageCPU = 100 - ~~(100 * idleDifference / totalDifference);
      // Output the result
      resolve({ used: percentageCPU, name: os.cpus()[0].model, threadNumber: os.cpus().length });
    }, 100);
  });
}

(async ()=>{
  console.log(await getCPU())
})()


 
const getMem = async () => {
  return new Promise(async (resolve) => {
    // 初始化内存总量、空闲总量、使用总量与占用率
    let totalmem = 0,
      freemem = 0,
      usedmem = 0,
      usageRate = 0;
    
    // 判断操作系统
    if (os.type() === 'Linux') {
      // 执行系统命令，命令输出结果如下图
      const { stdout } = await exec('free -m');
      // 获取到输出数据后截取计算所需要的信息
      let str = stdout.split('\n')[1].split(' ').filter(item => item != '');
 
      totalmem = str[1];
      freemem = str[1] - str[2];
      usedmem = str[2];
      // 计算占用率
      usageRate = (usedmem / totalmem * 100).toFixed(2);
    } else {
      totalmem = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2);
      freemem = (os.freemem() / 1024 / 1024 / 1024).toFixed(2);
      usedmem = ((os.totalmem() - os.freemem()) / 1024 / 1024 / 1024).toFixed(2);
      usageRate = parseInt(usedmem / totalmem * 100);
    }
    // 返回计算结果
    resolve({ totalmem, freemem, usedmem, usageRate });
  })
}

(async ()=>{
  console.log("getMem", await getMem())
})()


 
const sys = async () => {
  let date = '',sys = '';
    
  // 获取系统运行时间
  const time = os.uptime();
  const day = Math.floor(time / 86400);
  const hour = Math.floor((time - day * 86400) / 3600);
  const minute = Math.floor((time - day * 86400 - hour * 3600) / 60);
  const second = Math.floor(time - day * 86400 - hour * 3600 - minute * 60);
  // 时间格式化
  date = formatStr('{0}天{1}时{2}分{3}秒', day, hour, minute, second);
 
  // 获取系统版本
  if (os.type() === 'Linux') {
    // 调用系统命令来获取系统的版本信息
    const { stdout } = await exec('cat /etc/redhat-release');
    sys = stdout.trim();
  } else if (os.type() === 'Darwin') {
    const { stdout } = await exec('sw_vers');
    stdout.split('\n').forEach(item => {
      sys += item.split(':')[1] ? item.split(':')[1] : '';
    })
    sys = sys.trim();
  } else if (os.type() === 'Windows_NT') {
    const { stdout } = await exec('ver');
    sys = stdout.trim();
  }
 
  // 获取系统负载
  const loadavg = os.loadavg();
  // 1分钟负载
  const loadavg1m = loadavg[0].toFixed(2);
  // 5分钟负载
  const loadavg5m = loadavg[1].toFixed(2);
  // 10分钟负载
  const loadavg12m = loadavg[2].toFixed(2);
 
  // 返回基本信息数据
  return Promise.resolve({ date, sys, loadavg1m, loadavg5m, loadavg12m });
}

// (async ()=>{
//   console.log("sys", await sys())
// })()


 
const getDisk = async () => {
  let total = 0,
    available = 0,
    used = 0,
    usageRate = 0;
  if (os.type() === 'Linux') {
    let { stdout } = await exec('df -hl /');
    stdout = stdout.split('\n')[1].split(' ').filter(item => item != '');
 
    total = stdout[1];
    available = stdout[3];
    used = parseFloat(stdout[1]) * (parseFloat(stdout[4]) / 100);
    usageRate = parseFloat(stdout[4]);
  }
 
  return Promise.resolve({ total, available, used, usageRate });
}

(async ()=>{
  console.log("getDisk", await getDisk())
})()