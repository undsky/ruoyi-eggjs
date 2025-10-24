# 服务监控 API 接口文档

## 概述

本文档描述了服务监控模块的 API 接口实现，用于获取服务器的 CPU、内存、磁盘、Node.js 进程等信息。

## 已实现的接口列表

### 1. 获取服务器信息

**接口地址**: `GET /api/monitor/server`

**功能说明**:
- 获取服务器的实时监控信息
- 包括 CPU、内存、系统、Node.js 进程、磁盘等信息

**响应示例**:
```json
{
  "code": 200,
  "msg": "操作成功",
  "data": {
    "cpu": {
      "cpuNum": 8,
      "total": 100,
      "sys": "5.23",
      "used": "35.67",
      "wait": 0,
      "free": "64.33"
    },
    "mem": {
      "total": "16.00",
      "used": "8.50",
      "free": "7.50",
      "usage": "53.13"
    },
    "sys": {
      "computerName": "SERVER-001",
      "computerIp": "192.168.1.100",
      "osName": "Windows_NT",
      "osArch": "x64",
      "userDir": "E:\\me\\ruoyi-eggjs"
    },
    "node": {
      "version": "v20.0.0",
      "home": "C:\\Program Files\\nodejs\\node.exe",
      "total": "128.00",
      "max": "128.00",
      "used": "85.50",
      "free": "42.50",
      "usage": "66.80",
      "name": "Node.js",
      "startTime": "2025-10-24T02:00:00.000Z",
      "runTime": "0天8小时30分钟15秒",
      "inputArgs": ""
    },
    "disk": [
      {
        "dirName": "C:",
        "sysTypeName": "NTFS",
        "typeName": "C:",
        "total": "-",
        "free": "-",
        "used": "-",
        "usage": "-"
      }
    ]
  }
}
```

**字段说明**:

#### CPU 信息 (cpu)
- `cpuNum`: CPU 核心数
- `total`: 总使用率基准（100%）
- `sys`: 系统使用率（%）
- `used`: 已使用率（%）
- `wait`: 等待率（%）
- `free`: 空闲率（%）

#### 内存信息 (mem)
- `total`: 总内存（GB）
- `used`: 已使用内存（GB）
- `free`: 空闲内存（GB）
- `usage`: 使用率（%）

#### 系统信息 (sys)
- `computerName`: 计算机名称
- `computerIp`: 计算机IP地址
- `osName`: 操作系统名称
- `osArch`: 操作系统架构
- `userDir`: 项目路径

#### Node.js 进程信息 (node)
- `version`: Node.js 版本
- `home`: Node.js 安装路径
- `total`: 总内存（MB）
- `max`: 最大内存（MB）
- `used`: 已使用内存（MB）
- `free`: 空闲内存（MB）
- `usage`: 使用率（%）
- `name`: 运行环境名称
- `startTime`: 启动时间
- `runTime`: 运行时长
- `inputArgs`: 启动参数

#### 磁盘信息 (disk)
- `dirName`: 盘符/挂载点
- `sysTypeName`: 文件系统类型
- `typeName`: 盘符名称
- `total`: 总大小
- `free`: 可用大小
- `used`: 已用大小
- `usage`: 使用率

**测试命令**:
```bash
curl -X GET "http://localhost:7001/api/monitor/server" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 实现细节

### 1. 文件结构

```
ruoyi-eggjs/
├── app/
│   ├── controller/
│   │   └── monitor/
│   │       ├── online.js
│   │       ├── logininfor.js
│   │       ├── operlog.js
│   │       └── server.js      # 服务监控控制器（新增）
│   └── service/
│       └── monitor/
│           ├── online.js
│           ├── logininfor.js
│           ├── operlog.js
│           └── server.js      # 服务监控服务（新增）
```

### 2. 核心功能

#### 2.1 CPU 监控
- ✅ CPU 核心数
- ✅ CPU 使用率
- ✅ 系统使用率
- ✅ 空闲率

#### 2.2 内存监控
- ✅ 总内存
- ✅ 已使用内存
- ✅ 空闲内存
- ✅ 使用率

#### 2.3 系统信息
- ✅ 计算机名称
- ✅ 本地IP地址
- ✅ 操作系统类型
- ✅ 系统架构
- ✅ 项目路径

#### 2.4 Node.js 进程监控
- ✅ Node.js 版本
- ✅ 安装路径
- ✅ 堆内存使用情况
- ✅ 启动时间
- ✅ 运行时长
- ✅ 启动参数

#### 2.5 磁盘信息
- ✅ 磁盘盘符/挂载点
- ✅ 文件系统类型
- ⏳ 磁盘空间信息（需要额外库支持）

### 3. 技术实现

**Node.js 内置模块**:
- `os` 模块：获取操作系统信息
- `process` 对象：获取 Node.js 进程信息
- `fs` 模块：文件系统操作

**获取 CPU 信息**:
```javascript
const cpus = os.cpus();
// 计算 CPU 使用率
const total = user + nice + sys + idle + irq;
const used = user + nice + sys + irq;
const usage = (used / total) * 100;
```

**获取内存信息**:
```javascript
const totalMem = os.totalmem();
const freeMem = os.freemem();
const usedMem = totalMem - freeMem;
const usage = (usedMem / totalMem) * 100;
```

**获取 Node.js 进程信息**:
```javascript
const memUsage = process.memoryUsage();
const uptime = process.uptime();
const heapUsage = (memUsage.heapUsed / memUsage.heapTotal) * 100;
```

### 4. 与 RuoYi Spring Boot 的对应关系

| RuoYi (Java) | Egg.js (Node.js) | 说明 |
|-------------|-----------------|------|
| JVM 信息 | Node.js 进程信息 | 运行环境信息 |
| 堆内存 | Heap 内存 | 内存使用情况 |
| 类路径 | 执行路径 | 运行路径 |
| JVM 启动时间 | 进程启动时间 | 启动时间 |
| JVM 运行时长 | 进程运行时长 | 运行时长 |

---

## 测试步骤

### 1. 准备工作
1. 确保 Egg.js 应用已启动
2. 获取登录 Token

### 2. 测试流程

```bash
# 1. 登录获取 Token
TOKEN=$(curl -X POST "http://localhost:7001/api/login" \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}' \
  | jq -r '.token')

# 2. 获取服务器信息
curl -X GET "http://localhost:7001/api/monitor/server" \
  -H "Authorization: Bearer $TOKEN"

# 3. 格式化输出（使用 jq）
curl -X GET "http://localhost:7001/api/monitor/server" \
  -H "Authorization: Bearer $TOKEN" | jq '.'
```

---

## 注意事项

1. **Token 认证**: 接口需要在请求头中携带 `Authorization: Bearer {token}`
2. **权限要求**: 需要监控权限
3. **跨平台**: 代码在 Windows、Linux、macOS 上都可运行
4. **磁盘信息**: 获取磁盘空间需要额外的库支持（如 diskusage）
5. **实时性**: 每次请求都会实时获取最新的服务器信息

---

## 错误码说明

| 错误码 | 说明 |
|--------|------|
| 200 | 操作成功 |
| 500 | 操作失败 |
| 401 | 未授权（Token 失效） |
| 403 | 无权限 |

---

## 使用场景

### 场景1: 服务器性能监控

管理员可以实时查看：
- CPU 使用率是否过高
- 内存使用情况
- Node.js 进程内存占用
- 系统运行时长

---

### 场景2: 资源预警

通过监控数据：
- CPU 使用率 > 80% → 需要优化或扩容
- 内存使用率 > 85% → 需要释放内存或扩容
- Node.js 堆内存使用率 > 90% → 可能存在内存泄漏

---

### 场景3: 系统运维

查看服务器信息：
- 确认服务器配置
- 检查运行环境
- 记录系统状态

---

## 扩展建议

### 1. 安装磁盘监控库

如需获取完整的磁盘空间信息，可以安装：

```bash
npm install diskusage
```

然后在 `getDiskInfo()` 方法中使用：

```javascript
const diskusage = require('diskusage');

async getDiskInfo() {
  const disks = [];
  
  if (os.platform() === 'win32') {
    const drives = ['C:', 'D:', 'E:'];
    
    for (const drive of drives) {
      try {
        const info = await diskusage.check(drive + '\\');
        disks.push({
          dirName: drive,
          sysTypeName: 'NTFS',
          typeName: drive,
          total: (info.total / 1024 / 1024 / 1024).toFixed(2) + 'G',
          free: (info.free / 1024 / 1024 / 1024).toFixed(2) + 'G',
          used: ((info.total - info.free) / 1024 / 1024 / 1024).toFixed(2) + 'G',
          usage: (((info.total - info.free) / info.total) * 100).toFixed(2)
        });
      } catch (err) {
        // 驱动器不存在
      }
    }
  } else {
    const info = await diskusage.check('/');
    disks.push({
      dirName: '/',
      sysTypeName: 'ext4',
      typeName: '/',
      total: (info.total / 1024 / 1024 / 1024).toFixed(2) + 'G',
      free: (info.free / 1024 / 1024 / 1024).toFixed(2) + 'G',
      used: ((info.total - info.free) / 1024 / 1024 / 1024).toFixed(2) + 'G',
      usage: (((info.total - info.free) / info.total) * 100).toFixed(2)
    });
  }
  
  return disks;
}
```

### 2. 添加更多监控指标

可以添加：
- 网络流量监控
- 进程列表
- 系统负载
- 端口监听状态

---

**文档版本**: v1.0  
**创建日期**: 2025-10-24  
**作者**: AI Assistant

