# 缓存监控 API 接口文档

## 概述

本文档描述了缓存监控模块的所有 API 接口实现，包括缓存信息查询、键名查询、内容查询、清空缓存等功能。

## 已实现的接口列表

### 1. 获取缓存信息

**接口地址**: `GET /api/monitor/cache`

**功能说明**:
- 获取缓存的统计信息
- 包括各类缓存的键数量、总键数等

**响应示例**:
```json
{
  "code": 200,
  "msg": "操作成功",
  "data": {
    "info": {
      "cacheStats": {
        "online_user:": 3,
        "config:": 15,
        "dict_": 8,
        "captcha:": 2,
        "login_fail:": 1
      },
      "totalKeys": 29
    },
    "dbSize": 29,
    "commandStats": []
  }
}
```

**字段说明**:
- `info.cacheStats`: 各类缓存的键数量统计
- `info.totalKeys`: 总键数
- `dbSize`: 数据库大小（键总数）
- `commandStats`: 命令统计（简化处理）

**测试命令**:
```bash
curl -X GET "http://localhost:7001/api/monitor/cache" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 2. 获取缓存名称列表

**接口地址**: `GET /api/monitor/cache/getNames`

**功能说明**:
- 获取系统中所有缓存类型的名称和说明

**响应示例**:
```json
{
  "code": 200,
  "msg": "操作成功",
  "data": [
    {
      "cacheName": "online_user:",
      "remark": "在线用户"
    },
    {
      "cacheName": "config:",
      "remark": "配置信息"
    },
    {
      "cacheName": "dict_",
      "remark": "数据字典"
    },
    {
      "cacheName": "captcha:",
      "remark": "验证码"
    },
    {
      "cacheName": "login_fail:",
      "remark": "登录失败次数"
    }
  ]
}
```

**测试命令**:
```bash
curl -X GET "http://localhost:7001/api/monitor/cache/getNames" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 3. 获取缓存键名列表

**接口地址**: `GET /api/monitor/cache/getKeys/:cacheName`

**路径参数**:
- `cacheName`: 缓存名称（前缀）

**功能说明**:
- 获取指定缓存名称（前缀）下的所有键名
- 自动添加通配符匹配

**响应示例**:
```json
{
  "code": 200,
  "msg": "操作成功",
  "data": [
    "config:sys.index.skinName",
    "config:sys.user.initPassword",
    "config:sys.account.captchaEnabled",
    "config:sys.account.registerUser"
  ]
}
```

**测试命令**:
```bash
# 获取配置缓存的所有键
curl -X GET "http://localhost:7001/api/monitor/cache/getKeys/config:" \
  -H "Authorization: Bearer YOUR_TOKEN"

# 获取字典缓存的所有键
curl -X GET "http://localhost:7001/api/monitor/cache/getKeys/dict_" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 4. 获取缓存内容

**接口地址**: `GET /api/monitor/cache/getValue/:cacheName/:cacheKey`

**路径参数**:
- `cacheName`: 缓存名称（用于显示）
- `cacheKey`: 缓存键名（完整键名）

**功能说明**:
- 获取指定缓存键的内容

**响应示例**:
```json
{
  "code": 200,
  "msg": "操作成功",
  "data": {
    "cacheName": "config:",
    "cacheKey": "config:sys.index.skinName",
    "cacheValue": "skin-blue"
  }
}
```

**测试命令**:
```bash
curl -X GET "http://localhost:7001/api/monitor/cache/getValue/config:/config:sys.index.skinName" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 5. 清空缓存名称

**接口地址**: `DELETE /api/monitor/cache/clearCacheName/:cacheName`

**路径参数**:
- `cacheName`: 缓存名称（前缀）

**功能说明**:
- 清空指定缓存名称（前缀）下的所有缓存
- 自动匹配所有符合前缀的键并删除

**响应示例**:
```json
{
  "code": 200,
  "msg": "清空成功"
}
```

**使用场景**:
- 清空所有配置缓存：`config:`
- 清空所有字典缓存：`dict_`
- 清空所有验证码：`captcha:`

**测试命令**:
```bash
# 清空所有配置缓存
curl -X DELETE "http://localhost:7001/api/monitor/cache/clearCacheName/config:" \
  -H "Authorization: Bearer YOUR_TOKEN"

# 清空所有字典缓存
curl -X DELETE "http://localhost:7001/api/monitor/cache/clearCacheName/dict_" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 6. 清空缓存键值

**接口地址**: `DELETE /api/monitor/cache/clearCacheKey/:cacheKey`

**路径参数**:
- `cacheKey`: 缓存键名（完整键名）

**功能说明**:
- 删除指定的缓存键

**响应示例**:
```json
{
  "code": 200,
  "msg": "清空成功"
}
```

**测试命令**:
```bash
curl -X DELETE "http://localhost:7001/api/monitor/cache/clearCacheKey/config:sys.index.skinName" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 7. 清空全部缓存

**接口地址**: `DELETE /api/monitor/cache/clearCacheAll`

**功能说明**:
- 清空系统中所有缓存
- 操作不可逆，请谨慎使用

**响应示例**:
```json
{
  "code": 200,
  "msg": "清空成功"
}
```

**警告**: 
- 此操作会清空所有缓存，包括在线用户、配置、字典等
- 清空后需要重新登录
- 建议只在必要时使用

**测试命令**:
```bash
curl -X DELETE "http://localhost:7001/api/monitor/cache/clearCacheAll" \
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
│   │       ├── server.js
│   │       └── cache.js        # 缓存监控控制器（新增）
│   └── service/
│       └── monitor/
│           ├── online.js
│           ├── logininfor.js
│           ├── operlog.js
│           ├── server.js
│           └── cache.js        # 缓存监控服务（新增）
```

### 2. 核心功能

#### 2.1 缓存信息查询
- ✅ 获取缓存统计信息
- ✅ 按前缀分组统计键数量
- ✅ 获取总键数

#### 2.2 缓存内容查询
- ✅ 获取缓存名称列表
- ✅ 获取指定前缀的所有键名
- ✅ 获取指定键的缓存值

#### 2.3 缓存清空
- ✅ 清空指定前缀的所有缓存
- ✅ 清空指定键的缓存
- ✅ 清空所有缓存

### 3. 缓存类型说明

| 缓存名称 | 前缀 | 说明 | 用途 |
|---------|------|------|------|
| 在线用户 | online_user: | 存储在线用户信息 | 在线用户监控、强退功能 |
| 配置信息 | config: | 存储系统配置参数 | 参数配置模块 |
| 数据字典 | dict_ | 存储字典数据 | 字典模块 |
| 验证码 | captcha: | 存储验证码 | 登录验证 |
| 登录失败次数 | login_fail: | 存储登录失败记录 | 账号锁定 |

### 4. 缓存键名示例

```
online_user:1
config:sys.index.skinName
dict_sys_user_sex
captcha:12345678-1234-1234-1234-123456789012
login_fail:testuser
```

### 5. 业务逻辑还原

所有接口的业务逻辑均参考 RuoYi Spring Boot 版本实现，包括：
- 缓存信息统计
- 键名查询逻辑
- 清空缓存策略

---

## 测试步骤

### 1. 准备工作
1. 确保 Egg.js 应用已启动
2. 获取登录 Token
3. 确保缓存中有数据

### 2. 测试流程

```bash
# 1. 登录获取 Token（会创建在线用户缓存）
TOKEN=$(curl -X POST "http://localhost:7001/api/login" \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}' \
  | jq -r '.token')

# 2. 获取缓存信息
curl -X GET "http://localhost:7001/api/monitor/cache" \
  -H "Authorization: Bearer $TOKEN"

# 3. 获取缓存名称列表
curl -X GET "http://localhost:7001/api/monitor/cache/getNames" \
  -H "Authorization: Bearer $TOKEN"

# 4. 获取配置缓存的所有键名
curl -X GET "http://localhost:7001/api/monitor/cache/getKeys/config:" \
  -H "Authorization: Bearer $TOKEN"

# 5. 获取字典缓存的所有键名
curl -X GET "http://localhost:7001/api/monitor/cache/getKeys/dict_" \
  -H "Authorization: Bearer $TOKEN"

# 6. 获取指定键的缓存值
curl -X GET "http://localhost:7001/api/monitor/cache/getValue/config:/config:sys.index.skinName" \
  -H "Authorization: Bearer $TOKEN"

# 7. 清空验证码缓存
curl -X DELETE "http://localhost:7001/api/monitor/cache/clearCacheName/captcha:" \
  -H "Authorization: Bearer $TOKEN"

# 8. 清空指定配置缓存
curl -X DELETE "http://localhost:7001/api/monitor/cache/clearCacheKey/config:sys.index.skinName" \
  -H "Authorization: Bearer $TOKEN"

# 9. 清空全部缓存（谨慎操作）
curl -X DELETE "http://localhost:7001/api/monitor/cache/clearCacheAll" \
  -H "Authorization: Bearer $TOKEN"
```

---

## 注意事项

1. **Token 认证**: 所有接口都需要在请求头中携带 `Authorization: Bearer {token}`
2. **权限要求**: 需要监控权限
3. **清空操作**: 
   - 清空缓存是不可逆操作，请谨慎使用
   - 清空全部缓存后需要重新登录
   - 清空配置/字典缓存后会自动重新加载
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

### 场景1: 监控缓存使用情况

管理员可以查看：
- 各类缓存的键数量
- 总缓存键数
- 判断缓存是否正常工作

```bash
curl -X GET "http://localhost:7001/api/monitor/cache" \
  -H "Authorization: Bearer $TOKEN"
```

---

### 场景2: 查看缓存详细内容

查看具体的缓存数据：

```bash
# 1. 查看有哪些配置缓存
curl -X GET "http://localhost:7001/api/monitor/cache/getKeys/config:" \
  -H "Authorization: Bearer $TOKEN"

# 2. 查看具体配置的值
curl -X GET "http://localhost:7001/api/monitor/cache/getValue/config:/config:sys.index.skinName" \
  -H "Authorization: Bearer $TOKEN"
```

---

### 场景3: 清理过期缓存

清理不需要的缓存：

```bash
# 清空所有验证码缓存
curl -X DELETE "http://localhost:7001/api/monitor/cache/clearCacheName/captcha:" \
  -H "Authorization: Bearer $TOKEN"

# 清空所有登录失败记录
curl -X DELETE "http://localhost:7001/api/monitor/cache/clearCacheName/login_fail:" \
  -H "Authorization: Bearer $TOKEN"
```

---

### 场景4: 系统维护

系统维护时清空缓存：

```bash
# 清空全部缓存（会强制所有用户重新登录）
curl -X DELETE "http://localhost:7001/api/monitor/cache/clearCacheAll" \
  -H "Authorization: Bearer $TOKEN"
```

**注意**: 清空全部缓存后：
- 所有在线用户会被强制下线
- 所有配置参数需要重新加载
- 所有字典数据需要重新加载

---

## 缓存键命名规范

### 1. 在线用户

**格式**: `online_user:{userId}`

**示例**: `online_user:1`

---

### 2. 配置信息

**格式**: `config:{configKey}`

**示例**: 
- `config:sys.index.skinName`
- `config:sys.user.initPassword`

---

### 3. 数据字典

**格式**: `dict_{dictType}`

**示例**:
- `dict_sys_user_sex`
- `dict_sys_show_hide`

---

### 4. 验证码

**格式**: `captcha:{uuid}`

**示例**: `captcha:12345678-1234-1234-1234-123456789012`

---

### 5. 登录失败次数

**格式**: `login_fail:{userName}`

**示例**: `login_fail:testuser`

---

**文档版本**: v1.0  
**创建日期**: 2025-10-24  
**作者**: AI Assistant

