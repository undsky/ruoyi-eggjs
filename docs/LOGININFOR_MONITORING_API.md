# 登录日志监控 API 接口文档

## 概述

本文档描述了登录日志监控模块的所有 API 接口实现，包括日志查询、删除、清空、解锁用户、导出等功能。

## 已实现的接口列表

### 1. 登录日志列表（分页）

**接口地址**: `GET /api/monitor/logininfor/list`

**请求参数**:
```json
{
  "pageNum": 1,          // 页码，默认 1
  "pageSize": 10,        // 每页条数，默认 10
  "ipaddr": "",          // 登录地址（模糊查询）
  "userName": "",        // 用户名称（模糊查询）
  "status": "",          // 登录状态（0-成功，1-失败）
  "beginTime": "",       // 开始时间
  "endTime": ""          // 结束时间
}
```

**响应示例**:
```json
{
  "code": 200,
  "msg": "查询成功",
  "rows": [
    {
      "infoId": 1,
      "userName": "admin",
      "ipaddr": "127.0.0.1",
      "loginLocation": "内网IP",
      "browser": "Chrome",
      "os": "Windows",
      "status": "0",
      "msg": "登录成功",
      "loginTime": "2025-10-24 10:00:00"
    }
  ],
  "total": 1
}
```

**字段说明**:
- `infoId`: 日志ID
- `userName`: 用户名
- `ipaddr`: 登录IP地址
- `loginLocation`: 登录地点
- `browser`: 浏览器类型
- `os`: 操作系统
- `status`: 登录状态（0-成功，1-失败）
- `msg`: 提示消息
- `loginTime`: 登录时间

**测试命令**:
```bash
curl -X GET "http://localhost:7001/api/monitor/logininfor/list?pageNum=1&pageSize=10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 2. 删除登录日志

**接口地址**: `DELETE /api/monitor/logininfor/:infoIds`

**路径参数**:
- `infoIds`: 日志ID，多个用逗号分隔，如 `1,2,3`

**响应示例**:
```json
{
  "code": 200,
  "msg": "删除成功"
}
```

**测试命令**:
```bash
# 删除单个日志
curl -X DELETE "http://localhost:7001/api/monitor/logininfor/1" \
  -H "Authorization: Bearer YOUR_TOKEN"

# 删除多个日志
curl -X DELETE "http://localhost:7001/api/monitor/logininfor/1,2,3" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 3. 清空登录日志

**接口地址**: `DELETE /api/monitor/logininfor/clean`

**功能说明**:
- 清空所有登录日志
- 使用 TRUNCATE 命令，速度快
- 操作不可逆，请谨慎使用

**响应示例**:
```json
{
  "code": 200,
  "msg": "清空成功"
}
```

**测试命令**:
```bash
curl -X DELETE "http://localhost:7001/api/monitor/logininfor/clean" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 4. 解锁用户

**接口地址**: `GET /api/monitor/logininfor/unlock/:userName`

**路径参数**:
- `userName`: 用户名

**功能说明**:
- 清除用户的登录失败记录缓存
- 用于解除账号锁定
- 当用户多次登录失败被锁定后，管理员可以手动解锁

**响应示例**:
```json
{
  "code": 200,
  "msg": "解锁成功"
}
```

**使用场景**:
- 用户忘记密码，多次尝试后账号被锁定
- 管理员可以通过此接口解锁账号
- 用户可以继续尝试登录

**测试命令**:
```bash
curl -X GET "http://localhost:7001/api/monitor/logininfor/unlock/testuser" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 5. 导出登录日志

**接口地址**: `POST /api/monitor/logininfor/export`

**请求参数**:
```json
{
  "ipaddr": "",
  "userName": "",
  "status": "",
  "beginTime": "",
  "endTime": ""
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
curl -X POST "http://localhost:7001/api/monitor/logininfor/export" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "1"}'
```

---

## 实现细节

### 1. 文件结构

```
ruoyi-eggjs/
├── app/
│   ├── controller/
│   │   ├── system/          # 系统管理控制器
│   │   └── monitor/
│   │       ├── online.js    # 在线用户
│   │       └── logininfor.js # 登录日志（新增）
│   └── service/
│       ├── system/          # 系统管理服务
│       └── monitor/
│           ├── online.js    # 在线用户
│           └── logininfor.js # 登录日志（完善）
└── mapper/
    └── mysql/
        └── ruoyi/
            └── SysLogininforMapper.xml
```

### 2. 核心功能

#### 2.1 日志管理
- ✅ 查询登录日志列表
- ✅ 按条件过滤（IP地址、用户名、状态、时间范围）
- ✅ 分页查询
- ✅ 删除日志
- ✅ 批量删除
- ✅ 清空所有日志

#### 2.2 解锁功能
- ✅ 解锁用户账号
- ✅ 清除登录失败记录缓存

#### 2.3 自动记录
- ✅ 登录成功时自动记录
- ✅ 登录失败时自动记录
- ✅ 记录浏览器、操作系统信息

#### 2.4 其他功能
- ✅ 按登录时间倒序排列
- ⏳ Excel 导出（框架已完成，待完善）

### 3. 日志记录时机

**登录成功** (`login.js`):
```javascript
await service.monitor.logininfor.recordLoginInfo(
  user.userName,
  '0',          // 状态：成功
  '登录成功',
  ctx
);
```

**登录失败** (`login.js`):
```javascript
await service.monitor.logininfor.recordLoginInfo(
  username || '',
  '1',          // 状态：失败
  err.message,  // 失败原因
  ctx
);
```

**登出成功** (`login.js`):
```javascript
await service.monitor.logininfor.recordLoginInfo(
  user.userName,
  '0',          // 状态：成功
  '退出成功',
  ctx
);
```

### 4. 登录状态说明

| 状态 | 值 | 说明 |
|------|---|------|
| 成功 | 0 | 登录成功 |
| 失败 | 1 | 登录失败 |

### 5. 解锁机制

**账号锁定**:
- 当用户连续登录失败N次（如5次）后，账号会被锁定
- 锁定信息存储在缓存中：`login_fail:{userName}`

**解锁方式**:
1. **自动解锁**: 等待一段时间（如30分钟）后自动解锁
2. **手动解锁**: 管理员通过解锁接口手动解锁

**解锁流程**:
```javascript
// 清除登录失败记录缓存
const cacheKey = `login_fail:${userName}`;
await app.cache.default.del(cacheKey);
```

### 6. 数据库表结构

本模块涉及以下数据表：
- `sys_logininfor` - 登录日志表

### 7. 业务逻辑还原

所有接口的业务逻辑均参考 RuoYi Spring Boot 版本实现，包括：
- 数据查询逻辑
- 日志记录时机
- 解锁机制
- 错误提示信息

---

## 测试步骤

### 1. 准备工作
1. 确保数据库已初始化
2. 启动 Egg.js 应用
3. 获取登录 Token

### 2. 测试流程

```bash
# 1. 登录获取 Token（会自动记录登录日志）
TOKEN=$(curl -X POST "http://localhost:7001/api/login" \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}' \
  | jq -r '.token')

# 2. 查询登录日志列表
curl -X GET "http://localhost:7001/api/monitor/logininfor/list?pageNum=1&pageSize=10" \
  -H "Authorization: Bearer $TOKEN"

# 3. 按用户名过滤
curl -X GET "http://localhost:7001/api/monitor/logininfor/list?userName=admin" \
  -H "Authorization: Bearer $TOKEN"

# 4. 按状态过滤（查询失败记录）
curl -X GET "http://localhost:7001/api/monitor/logininfor/list?status=1" \
  -H "Authorization: Bearer $TOKEN"

# 5. 按时间范围过滤
curl -X GET "http://localhost:7001/api/monitor/logininfor/list?beginTime=2025-10-24%2000:00:00&endTime=2025-10-24%2023:59:59" \
  -H "Authorization: Bearer $TOKEN"

# 6. 解锁用户
curl -X GET "http://localhost:7001/api/monitor/logininfor/unlock/testuser" \
  -H "Authorization: Bearer $TOKEN"

# 7. 导出登录日志
curl -X POST "http://localhost:7001/api/monitor/logininfor/export" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "1"}'

# 8. 删除登录日志
curl -X DELETE "http://localhost:7001/api/monitor/logininfor/1,2,3" \
  -H "Authorization: Bearer $TOKEN"

# 9. 清空登录日志（谨慎操作）
curl -X DELETE "http://localhost:7001/api/monitor/logininfor/clean" \
  -H "Authorization: Bearer $TOKEN"
```

---

## 注意事项

1. **Token 认证**: 所有接口都需要在请求头中携带 `Authorization: Bearer {token}`
2. **权限要求**: 需要监控权限
3. **清空操作**: 清空日志是不可逆操作，请谨慎使用
4. **自动记录**: 登录、登出操作会自动记录日志
5. **解锁功能**: 用于解除因登录失败过多而被锁定的账号

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

### 场景1: 查看登录历史

管理员可以查看所有用户的登录历史，包括：
- 谁登录了
- 从哪里登录的（IP地址）
- 什么时候登录的
- 登录是否成功
- 使用什么浏览器和操作系统

---

### 场景2: 排查登录异常

当发现异常登录时，可以：
- 查询特定用户的登录记录
- 查询特定IP的登录记录
- 查询失败的登录记录
- 发现可疑的登录行为

---

### 场景3: 解锁被锁定的账号

当用户因多次登录失败被锁定时：
```bash
# 管理员解锁用户
curl -X GET "http://localhost:7001/api/monitor/logininfor/unlock/testuser" \
  -H "Authorization: Bearer $TOKEN"
```

用户可以继续尝试登录。

---

### 场景4: 定期清理日志

为了节省存储空间，可以：
- 删除指定的日志记录
- 清空所有历史日志
- 导出重要日志后再清理

---

## 数据示例

### 登录成功日志

```json
{
  "infoId": 1,
  "userName": "admin",
  "ipaddr": "127.0.0.1",
  "loginLocation": "内网IP",
  "browser": "Chrome",
  "os": "Windows",
  "status": "0",
  "msg": "登录成功",
  "loginTime": "2025-10-24 10:00:00"
}
```

### 登录失败日志

```json
{
  "infoId": 2,
  "userName": "testuser",
  "ipaddr": "192.168.1.100",
  "loginLocation": "内网IP",
  "browser": "Firefox",
  "os": "macOS",
  "status": "1",
  "msg": "用户不存在/密码错误",
  "loginTime": "2025-10-24 10:05:00"
}
```

---

**文档版本**: v1.0  
**创建日期**: 2025-10-24  
**作者**: AI Assistant

