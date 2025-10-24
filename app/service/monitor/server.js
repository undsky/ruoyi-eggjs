/*
 * @Description: 服务监控服务层
 * @Author: AI Assistant
 * @Date: 2025-10-24
 */

const Service = require('egg').Service;
const os = require('os');
const fs = require('fs');
const path = require('path');

class ServerService extends Service {

  /**
   * 获取服务器信息
   * @return {object} 服务器信息
   */
  async getServerInfo() {
    const cpu = this.getCpuInfo();
    const mem = this.getMemInfo();
    const sys = this.getSysInfo();
    const node = this.getNodeInfo();
    const disk = await this.getDiskInfo();
    
    return {
      cpu,
      mem,
      sys,
      node,
      disk
    };
  }

  /**
   * 获取 CPU 信息
   * @return {object} CPU 信息
   */
  getCpuInfo() {
    const cpus = os.cpus();
    
    if (!cpus || cpus.length === 0) {
      return {
        cpuNum: 0,
        total: 0,
        sys: 0,
        used: 0,
        wait: 0,
        free: 0
      };
    }
    
    // 计算 CPU 使用率
    let user = 0;
    let nice = 0;
    let sys = 0;
    let idle = 0;
    let irq = 0;
    
    cpus.forEach(cpu => {
      user += cpu.times.user;
      nice += cpu.times.nice;
      sys += cpu.times.sys;
      idle += cpu.times.idle;
      irq += cpu.times.irq;
    });
    
    const total = user + nice + sys + idle + irq;
    const used = user + nice + sys + irq;
    const free = idle;
    
    return {
      cpuNum: cpus.length,
      total: 100,
      sys: ((sys / total) * 100).toFixed(2),
      used: ((used / total) * 100).toFixed(2),
      wait: 0,
      free: ((free / total) * 100).toFixed(2)
    };
  }

  /**
   * 获取内存信息
   * @return {object} 内存信息
   */
  getMemInfo() {
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;
    
    return {
      total: (totalMem / 1024 / 1024 / 1024).toFixed(2),  // GB
      used: (usedMem / 1024 / 1024 / 1024).toFixed(2),    // GB
      free: (freeMem / 1024 / 1024 / 1024).toFixed(2),    // GB
      usage: ((usedMem / totalMem) * 100).toFixed(2)      // 使用率
    };
  }

  /**
   * 获取系统信息
   * @return {object} 系统信息
   */
  getSysInfo() {
    return {
      computerName: os.hostname(),
      computerIp: this.getLocalIP(),
      osName: os.type(),
      osArch: os.arch(),
      userDir: process.cwd()
    };
  }

  /**
   * 获取 Node.js 进程信息
   * @return {object} Node.js 进程信息
   */
  getNodeInfo() {
    const memUsage = process.memoryUsage();
    const uptime = process.uptime();
    
    return {
      version: process.version,
      home: process.execPath,
      total: (memUsage.heapTotal / 1024 / 1024).toFixed(2),  // MB
      max: (memUsage.heapTotal / 1024 / 1024).toFixed(2),    // MB
      used: (memUsage.heapUsed / 1024 / 1024).toFixed(2),    // MB
      free: ((memUsage.heapTotal - memUsage.heapUsed) / 1024 / 1024).toFixed(2),  // MB
      usage: ((memUsage.heapUsed / memUsage.heapTotal) * 100).toFixed(2),  // 使用率
      name: 'Node.js',
      startTime: new Date(Date.now() - uptime * 1000).toISOString(),
      runTime: this.formatUptime(uptime),
      inputArgs: process.execArgv.join(' ')
    };
  }

  /**
   * 获取磁盘信息
   * @return {array} 磁盘信息列表
   */
  async getDiskInfo() {
    const disks = [];
    
    try {
      // Windows 系统
      if (os.platform() === 'win32') {
        const drives = ['C:', 'D:', 'E:', 'F:'];
        
        for (const drive of drives) {
          try {
            const stats = fs.statSync(drive + '\\');
            // Windows 下获取磁盘空间比较复杂，这里简化处理
            disks.push({
              dirName: drive,
              sysTypeName: 'NTFS',
              typeName: drive,
              total: '-',
              free: '-',
              used: '-',
              usage: '-'
            });
          } catch (err) {
            // 驱动器不存在，跳过
          }
        }
      } else {
        // Linux/Mac 系统
        disks.push({
          dirName: '/',
          sysTypeName: 'ext4',
          typeName: '/',
          total: '-',
          free: '-',
          used: '-',
          usage: '-'
        });
      }
    } catch (err) {
      // 获取磁盘信息失败
    }
    
    return disks;
  }

  /**
   * 获取本地 IP 地址
   * @return {string} IP 地址
   */
  getLocalIP() {
    const interfaces = os.networkInterfaces();
    
    for (const name of Object.keys(interfaces)) {
      for (const iface of interfaces[name]) {
        // 跳过内部和非 IPv4 地址
        if (iface.family === 'IPv4' && !iface.internal) {
          return iface.address;
        }
      }
    }
    
    return '127.0.0.1';
  }

  /**
   * 格式化运行时间
   * @param {number} uptime - 运行时间（秒）
   * @return {string} 格式化后的时间
   */
  formatUptime(uptime) {
    const days = Math.floor(uptime / 86400);
    const hours = Math.floor((uptime % 86400) / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);
    
    return `${days}天${hours}小时${minutes}分钟${seconds}秒`;
  }
}

module.exports = ServerService;

