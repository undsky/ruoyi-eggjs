# 在线用户监控 API 接口文档

## 概述

本文档描述了在线用户监控模块的所有 API 接口实现，包括在线用户列表查询、强退用户等功能。

## 已实现的接口列表

### 1. 在线用户列表

**接口地址**: `GET /api/monitor/online/list`

**请求参数**:
```json
{
  "pageNum": 1,          // 页码，默认 1
  "pageSize": 10,        // 每页条数，默认 10
  "ipaddr": "",          // 登录地址（模糊查询）
  "userName": ""         // 用户名称（模糊查询）
}
```

**响应示例**:
```json
{
  "code": 200,
  "msg": "查询成功",
  "rows": [
    {
      "tokenId": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "userId": 1,
      "userName": "admin",
      "deptName": "研发部门",
      "ipaddr": "127.0.0.1",
      "loginTime": "2025-10-24 10:00:00",
      "expireTime": "2025-10-31 10:00:00"
    }
  ],
  "total": 1
}
```

**字段说明**:
- `tokenId`: 用户的 JWT Token
- `userId`: 用户ID
- `userName`: 用户名
- `deptName`: 部门名称
- `ipaddr`: 登录IP地址
- `loginTime`: 登录时间
- `expireTime`: Token过期时间

**测试命令**:
```bash
curl -X GET "http://localhost:7001/api/monitor/online/list?pageNum=1&pageSize=10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 2. 强退用户

**接口地址**: `DELETE /api/monitor/online/:tokenId`

**路径参数**:
- `tokenId`: 用户的 Token ID

**功能说明**:
- 强制用户下线
- 将用户的 Token 加入黑名单
- 删除用户的在线信息

**响应示例**:
```json
{
  "code": 200,
  "msg": "强退成功"
}
```

**测试命令**:
```bash
curl -X DELETE "http://localhost:7001/api/monitor/online/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Authorization: Bearer YOUR_TOKEN"
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
│   │       └── online.js    # 在线用户控制器（新增）
│   └── service/
│       ├── system/          # 系统管理服务
│       └── monitor/
│           └── online.js    # 在线用户服务（新增）
```

### 2. 核心功能

#### 2.1 在线用户管理
- ✅ 查询所有在线用户
- ✅ 按IP地址过滤
- ✅ 按用户名过滤
- ✅ 分页查询
- ✅ 按登录时间倒序排列

#### 2.2 强退功能
- ✅ 强制用户下线
- ✅ Token 加入黑名单
- ✅ 删除在线用户信息

### 3. 缓存机制

**在线用户缓存**:
- **缓存键格式**: `online_user:{userId}`
- **缓存内容**: 在线用户对象（包含 tokenId、userName、ipaddr、loginTime 等）
- **过期时间**: 7天（与 Token 过期时间一致）

**Token 黑名单**:
- **缓存键格式**: `{tokenId}`
- **缓存内容**: `revoked`
- **过期时间**: 7天

**示例**:
```javascript
// 在线用户缓存
online_user:1 -> {
  tokenId: "xxx",
  userId: 1,
  userName: "admin",
  ipaddr: "127.0.0.1",
  loginTime: "2025-10-24 10:00:00",
  ...
}

// Token 黑名单
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... -> "revoked"
```

### 4. 强退流程

1. 将 Token 加入黑名单（设置为 `revoked`）
2. 查找并删除对应的在线用户缓存
3. 用户下次请求时，JWT 中间件会检查黑名单，拒绝访问

### 5. 与登录模块的配合

**登录时** (`login.js`):
```javascript
async recordOnlineUser(user, token) {
  const onlineUser = {
    tokenId: token,
    userId: user.userId,
    userName: user.userName,
    // ...
  };
  await app.cache.default.set(`online_user:${user.userId}`, onlineUser, { ttl: 7 * 24 * 60 * 60 });
}
```

**登出时** (`login.js`):
```javascript
async removeOnlineUser(jti) {
  await app.cache.default.set(jti, 'revoked', { ttl: 7 * 24 * 60 * 60 });
}
```

**强退时** (`online.js`):
```javascript
async forceLogout(tokenId) {
  // Token 加入黑名单
  await app.cache.default.set(tokenId, 'revoked', { ttl: 7 * 24 * 60 * 60 });
  // 删除在线用户信息
  await app.cache.default.del(`online_user:${userId}`);
}
```

---

## 测试步骤

### 1. 准备工作
1. 确保数据库已初始化
2. 启动 Egg.js 应用
3. 获取登录 Token

### 2. 测试流程

```bash
# 1. 用户A登录获取 Token
TOKEN_A=$(curl -X POST "http://localhost:7001/api/login" \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}' \
  | jq -r '.token')

echo "Token A: $TOKEN_A"

# 2. 用户B登录获取 Token（可选，用于测试多用户在线）
TOKEN_B=$(curl -X POST "http://localhost:7001/api/login" \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"123456"}' \
  | jq -r '.token')

echo "Token B: $TOKEN_B"

# 3. 查询在线用户列表
curl -X GET "http://localhost:7001/api/monitor/online/list?pageNum=1&pageSize=10" \
  -H "Authorization: Bearer $TOKEN_A"

# 4. 按用户名过滤
curl -X GET "http://localhost:7001/api/monitor/online/list?userName=admin" \
  -H "Authorization: Bearer $TOKEN_A"

# 5. 按IP地址过滤
curl -X GET "http://localhost:7001/api/monitor/online/list?ipaddr=127.0.0.1" \
  -H "Authorization: Bearer $TOKEN_A"

# 6. 强退用户B（使用 Token B 的值）
curl -X DELETE "http://localhost:7001/api/monitor/online/$TOKEN_B" \
  -H "Authorization: Bearer $TOKEN_A"

# 7. 再次查询在线用户列表，验证用户B已被强退
curl -X GET "http://localhost:7001/api/monitor/online/list" \
  -H "Authorization: Bearer $TOKEN_A"

# 8. 用户B尝试访问（应该失败）
curl -X GET "http://localhost:7001/api/getInfo" \
  -H "Authorization: Bearer $TOKEN_B"
```

---

## 注意事项

1. **Token 认证**: 所有接口都需要在请求头中携带 `Authorization: Bearer {token}`
2. **权限要求**: 需要监控权限
3. **强退限制**: 
   - 只能强退其他用户，不能强退自己
   - 强退后用户需要重新登录
4. **缓存依赖**: 需要配置缓存服务（ruoyi-eggjs-cache）

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

### 场景1: 查看当前在线用户

管理员可以查看当前系统中所有在线的用户，包括：
- 谁在线
- 从哪里登录的（IP地址）
- 什么时候登录的
- Token 什么时候过期

---

### 场景2: 强制用户下线

当发现：
- 异常登录（IP地址异常）
- 用户账号被盗用
- 需要维护系统

管理员可以强制用户下线，用户需要重新登录。

---

### 场景3: 监控登录情况

通过在线用户列表，可以：
- 监控系统活跃度
- 发现异常登录
- 统计用户分布

---

**文档版本**: v1.0  
**创建日期**: 2025-10-24  
**作者**: AI Assistant

