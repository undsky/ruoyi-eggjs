# 定时任务监控 API 接口文档

## 概述

本文档描述了定时任务监控模块的所有 API 接口实现，包括任务的 CRUD 操作、状态修改、立即执行、导出等功能。

**注意**: 本模块为简化实现，提供了 API 接口框架。完整的定时任务功能需要：
1. 使用数据库存储任务配置
2. 集成任务调度框架（如 node-cron、agenda 等）
3. 实现任务的动态调度和执行

## 已实现的接口列表

### 1. 定时任务列表（分页）

**接口地址**: `GET /api/monitor/job/list`

**请求参数**:
```json
{
  "pageNum": 1,          // 页码，默认 1
  "pageSize": 10,        // 每页条数，默认 10
  "jobName": "",         // 任务名称（模糊查询）
  "jobGroup": "",        // 任务组名
  "status": ""           // 任务状态（0-正常，1-暂停）
}
```

**响应示例**:
```json
{
  "code": 200,
  "msg": "查询成功",
  "rows": [
    {
      "jobId": 1,
      "jobName": "系统默认（无参）",
      "jobGroup": "DEFAULT",
      "invokeTarget": "ryTask.ryNoParams",
      "cronExpression": "0 0/10 * * * ?",
      "misfirePolicy": "1",
      "concurrent": "1",
      "status": "0",
      "createTime": "2025-10-24 10:00:00",
      "remark": "worker"
    }
  ],
  "total": 1
}
```

**字段说明**:
- `jobId`: 任务ID
- `jobName`: 任务名称
- `jobGroup`: 任务组名
- `invokeTarget`: 调用目标字符串
- `cronExpression`: cron 表达式
- `misfirePolicy`: 错过策略（1-立即执行，2-执行一次，3-放弃执行）
- `concurrent`: 是否并发执行（0-允许，1-禁止）
- `status`: 任务状态（0-正常，1-暂停）
- `createTime`: 创建时间
- `remark`: 备注

**测试命令**:
```bash
curl -X GET "http://localhost:7001/api/monitor/job/list?pageNum=1&pageSize=10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 2. 定时任务详情

**接口地址**: `GET /api/monitor/job/:jobId`

**路径参数**:
- `jobId`: 任务ID

**响应示例**:
```json
{
  "code": 200,
  "msg": "操作成功",
  "data": {
    "jobId": 1,
    "jobName": "系统默认（无参）",
    "jobGroup": "DEFAULT",
    "invokeTarget": "ryTask.ryNoParams",
    "cronExpression": "0 0/10 * * * ?",
    "misfirePolicy": "1",
    "concurrent": "1",
    "status": "0",
    "createTime": "2025-10-24 10:00:00",
    "remark": "worker"
  }
}
```

**测试命令**:
```bash
curl -X GET "http://localhost:7001/api/monitor/job/1" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 3. 新增定时任务

**接口地址**: `POST /api/monitor/job`

**请求参数**:
```json
{
  "jobName": "测试任务",
  "jobGroup": "DEFAULT",
  "invokeTarget": "testTask.execute",
  "cronExpression": "0 0/5 * * * ?",
  "misfirePolicy": "1",
  "concurrent": "1",
  "status": "0",
  "remark": "测试定时任务"
}
```

**字段说明**:
- `jobName`: 任务名称（必填）
- `jobGroup`: 任务组名（默认 DEFAULT）
- `invokeTarget`: 调用目标（必填）
- `cronExpression`: cron 表达式（必填）
- `misfirePolicy`: 错过策略（1-立即执行，2-执行一次，3-放弃执行）
- `concurrent`: 是否并发（0-允许，1-禁止）
- `status`: 任务状态（0-正常，1-暂停）

**cron 表达式格式**: `秒 分 时 日 月 周`

**示例**:
- `0 0/10 * * * ?` - 每10分钟执行一次
- `0 0 2 * * ?` - 每天凌晨2点执行
- `0 0 12 * * ?` - 每天中午12点执行

**响应示例**:
```json
{
  "code": 200,
  "msg": "新增成功",
  "data": {
    "note": "注意：定时任务功能需要完善，建议使用 Egg.js schedule 或集成 node-cron"
  }
}
```

**测试命令**:
```bash
curl -X POST "http://localhost:7001/api/monitor/job" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "jobName": "测试任务",
    "jobGroup": "DEFAULT",
    "invokeTarget": "testTask.execute",
    "cronExpression": "0 0/5 * * * ?",
    "misfirePolicy": "1",
    "concurrent": "1",
    "status": "0",
    "remark": "测试定时任务"
  }'
```

---

### 4. 修改定时任务

**接口地址**: `PUT /api/monitor/job`

**请求参数**:
```json
{
  "jobId": 1,
  "jobName": "测试任务（已修改）",
  "jobGroup": "DEFAULT",
  "invokeTarget": "testTask.execute",
  "cronExpression": "0 0/10 * * * ?",
  "misfirePolicy": "1",
  "concurrent": "1",
  "status": "0",
  "remark": "修改后的备注"
}
```

**响应示例**:
```json
{
  "code": 200,
  "msg": "修改成功"
}
```

**测试命令**:
```bash
curl -X PUT "http://localhost:7001/api/monitor/job" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "jobId": 1,
    "jobName": "测试任务（已修改）",
    "jobGroup": "DEFAULT",
    "invokeTarget": "testTask.execute",
    "cronExpression": "0 0/10 * * * ?",
    "status": "0"
  }'
```

---

### 5. 删除定时任务

**接口地址**: `DELETE /api/monitor/job/:jobIds`

**路径参数**:
- `jobIds`: 任务ID，多个用逗号分隔，如 `1,2,3`

**响应示例**:
```json
{
  "code": 200,
  "msg": "删除成功"
}
```

**测试命令**:
```bash
# 删除单个任务
curl -X DELETE "http://localhost:7001/api/monitor/job/1" \
  -H "Authorization: Bearer YOUR_TOKEN"

# 删除多个任务
curl -X DELETE "http://localhost:7001/api/monitor/job/1,2,3" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 6. 修改任务状态

**接口地址**: `PUT /api/monitor/job/changeStatus`

**请求参数**:
```json
{
  "jobId": 1,
  "status": "1"  // 0-正常，1-暂停
}
```

**响应示例**:
```json
{
  "code": 200,
  "msg": "修改成功"
}
```

**功能说明**:
- 状态为 0（正常）时，任务会按计划执行
- 状态为 1（暂停）时，任务不会执行

**测试命令**:
```bash
curl -X PUT "http://localhost:7001/api/monitor/job/changeStatus" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"jobId": 1, "status": "1"}'
```

---

### 7. 立即执行任务

**接口地址**: `PUT /api/monitor/job/run`

**请求参数**:
```json
{
  "jobId": 1,
  "jobName": "测试任务",
  "jobGroup": "DEFAULT"
}
```

**功能说明**:
- 立即执行一次任务，不影响正常的调度计划
- 用于测试任务或手动触发任务

**响应示例**:
```json
{
  "code": 200,
  "msg": "执行成功"
}
```

**测试命令**:
```bash
curl -X PUT "http://localhost:7001/api/monitor/job/run" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"jobId": 1, "jobName": "测试任务", "jobGroup": "DEFAULT"}'
```

---

### 8. 导出定时任务

**接口地址**: `POST /api/monitor/job/export`

**请求参数**:
```json
{
  "jobName": "",
  "jobGroup": "",
  "status": ""
}
```

**响应示例**:
```json
{
  "code": 200,
  "msg": "导出成功",
  "data": [...]
}
```

**说明**: 目前返回 JSON 数据，Excel 导出功能待实现。

**测试命令**:
```bash
curl -X POST "http://localhost:7001/api/monitor/job/export" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{}'
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
│   │       ├── server.js
│   │       ├── cache.js
│   │       └── job.js          # 定时任务控制器（新增）
│   ├── service/
│   │   └── monitor/
│   │       ├── online.js
│   │       ├── logininfor.js
│   │       ├── operlog.js
│   │       ├── server.js
│   │       ├── cache.js
│   │       └── job.js          # 定时任务服务（新增）
│   └── schedule/               # Egg.js 定时任务目录
│       └── example.js
```

### 2. 核心功能

#### 2.1 任务管理（简化实现）
- ✅ 查询定时任务列表
- ✅ 查询任务详情
- ✅ 新增任务（接口框架）
- ✅ 修改任务（接口框架）
- ✅ 删除任务（接口框架）

#### 2.2 任务控制（简化实现）
- ✅ 修改任务状态（启动/暂停）
- ✅ 立即执行任务

#### 2.3 其他功能
- ✅ cron 表达式校验
- ⏳ Excel 导出（框架已完成，待完善）

### 3. 简化说明

**当前实现**:
- ✅ 提供完整的 API 接口
- ✅ 从 Egg.js schedule 读取任务列表
- ✅ 基础的 cron 表达式校验
- ⏳ 任务的新增、修改、删除为简化实现

**完整实现需要**:
1. **数据库存储**: 创建 `sys_job` 表存储任务配置
2. **任务调度**: 集成 node-cron、agenda 或其他调度框架
3. **动态调度**: 实现任务的动态新增、修改、删除
4. **执行日志**: 记录任务执行历史
5. **错误处理**: 任务执行失败时的处理策略

### 4. Egg.js Schedule 使用

**Egg.js 自带的定时任务**:

在 `app/schedule/` 目录下创建定时任务：

```javascript
// app/schedule/example.js
const Subscription = require('egg').Subscription;

class ExampleTask extends Subscription {
  // 配置定时任务
  static get schedule() {
    return {
      cron: '0 0/10 * * * ?',  // 每10分钟执行一次
      type: 'worker',           // 指定一个worker执行
      disable: false            // 是否禁用
    };
  }

  // 任务执行方法
  async subscribe() {
    const { ctx } = this;
    ctx.logger.info('定时任务执行');
    
    // 执行任务逻辑
    // ...
  }
}

module.exports = ExampleTask;
```

**优点**:
- Egg.js 框架内置，无需额外依赖
- 支持 cron 表达式
- 支持 worker 和 all 两种执行模式
- 支持 disable 禁用任务

**缺点**:
- 任务配置写在代码中，不支持动态配置
- 重启应用才能生效

### 5. 推荐的任务调度方案

#### 方案1: node-cron

```bash
npm install node-cron
```

```javascript
const cron = require('node-cron');

// 新增任务
const task = cron.schedule(cronExpression, () => {
  // 执行任务
}, {
  scheduled: true,
  timezone: "Asia/Shanghai"
});

// 暂停任务
task.stop();

// 启动任务
task.start();

// 销毁任务
task.destroy();
```

#### 方案2: agenda

```bash
npm install agenda
```

```javascript
const Agenda = require('agenda');
const agenda = new Agenda({ db: { address: mongoConnectionString } });

// 定义任务
agenda.define('testJob', async job => {
  // 执行任务
});

// 调度任务
await agenda.every('10 minutes', 'testJob');
await agenda.start();
```

### 6. cron 表达式说明

**格式**: `秒 分 时 日 月 周`

**示例**:
- `0 0/10 * * * ?` - 每10分钟执行一次
- `0 0 2 * * ?` - 每天凌晨2点执行
- `0 0 12 * * ?` - 每天中午12点执行
- `0 0 0 * * ?` - 每天零点执行
- `0 0 0 1 * ?` - 每月1号零点执行
- `0 0 0 ? * MON` - 每周一零点执行

**字段说明**:
- 秒: 0-59
- 分: 0-59
- 时: 0-23
- 日: 1-31
- 月: 1-12
- 周: 1-7 或 SUN-SAT

**特殊字符**:
- `*`: 任意值
- `?`: 不指定值（日和周互斥）
- `-`: 范围，如 1-5
- `,`: 列举，如 1,3,5
- `/`: 递增，如 0/5 表示从0开始每5个单位

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

# 2. 查询定时任务列表
curl -X GET "http://localhost:7001/api/monitor/job/list?pageNum=1&pageSize=10" \
  -H "Authorization: Bearer $TOKEN"

# 3. 新增定时任务
curl -X POST "http://localhost:7001/api/monitor/job" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "jobName": "测试任务",
    "jobGroup": "DEFAULT",
    "invokeTarget": "testTask.execute",
    "cronExpression": "0 0/5 * * * ?",
    "status": "0",
    "remark": "测试定时任务"
  }'

# 4. 查询任务详情
curl -X GET "http://localhost:7001/api/monitor/job/1" \
  -H "Authorization: Bearer $TOKEN"

# 5. 修改任务状态（暂停）
curl -X PUT "http://localhost:7001/api/monitor/job/changeStatus" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"jobId": 1, "status": "1"}'

# 6. 立即执行任务
curl -X PUT "http://localhost:7001/api/monitor/job/run" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"jobId": 1, "jobName": "测试任务", "jobGroup": "DEFAULT"}'

# 7. 导出定时任务
curl -X POST "http://localhost:7001/api/monitor/job/export" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{}'

# 8. 删除定时任务
curl -X DELETE "http://localhost:7001/api/monitor/job/1" \
  -H "Authorization: Bearer $TOKEN"
```

---

## 注意事项

1. **Token 认证**: 所有接口都需要在请求头中携带 `Authorization: Bearer {token}`
2. **权限要求**: 需要监控权限
3. **简化实现**: 当前为简化实现，提供 API 接口框架
4. **完整功能**: 需要集成任务调度框架（node-cron、agenda 等）
5. **cron 表达式**: 需要正确的 cron 表达式格式

---

## 错误码说明

| 错误码 | 说明 |
|--------|------|
| 200 | 操作成功 |
| 500 | 操作失败 |
| 401 | 未授权（Token 失效） |
| 403 | 无权限 |

---

## 完整实现建议

### 1. 创建数据库表

```sql
CREATE TABLE sys_job (
  job_id BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '任务ID',
  job_name VARCHAR(64) NOT NULL COMMENT '任务名称',
  job_group VARCHAR(64) NOT NULL DEFAULT 'DEFAULT' COMMENT '任务组名',
  invoke_target VARCHAR(500) NOT NULL COMMENT '调用目标字符串',
  cron_expression VARCHAR(255) DEFAULT '' COMMENT 'cron执行表达式',
  misfire_policy VARCHAR(20) DEFAULT '1' COMMENT '错过策略',
  concurrent CHAR(1) DEFAULT '1' COMMENT '是否并发',
  status CHAR(1) DEFAULT '0' COMMENT '状态',
  create_by VARCHAR(64) DEFAULT '' COMMENT '创建者',
  create_time DATETIME COMMENT '创建时间',
  update_by VARCHAR(64) DEFAULT '' COMMENT '更新者',
  update_time DATETIME COMMENT '更新时间',
  remark VARCHAR(500) DEFAULT '' COMMENT '备注',
  PRIMARY KEY (job_id)
) COMMENT = '定时任务调度表';
```

### 2. 集成 node-cron

```bash
npm install node-cron
```

### 3. 实现动态调度

在 `app/service/monitor/job.js` 中：

```javascript
const cron = require('node-cron');
const tasks = new Map();  // 存储任务实例

async insertJob(job) {
  // 1. 保存到数据库
  await ctx.service.db.mysql.ruoyi.sysJobMapper.insertJob([job]);
  
  // 2. 创建并启动任务
  const task = cron.schedule(job.cronExpression, async () => {
    // 执行任务逻辑
    await this.executeJob(job);
  }, {
    scheduled: job.status === '0',
    timezone: "Asia/Shanghai"
  });
  
  // 3. 存储任务实例
  tasks.set(job.jobId, task);
  
  return 1;
}

async executeJob(job) {
  // 执行任务的具体逻辑
  // 可以通过 eval 或其他方式调用指定方法
}
```

---

**文档版本**: v1.0  
**创建日期**: 2025-10-24  
**作者**: AI Assistant

