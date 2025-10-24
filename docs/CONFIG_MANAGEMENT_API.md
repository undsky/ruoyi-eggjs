# 参数配置管理 API 接口文档

## 概述

本文档描述了参数配置管理模块的所有 API 接口实现，包括 CRUD 操作、缓存管理、根据键名查询等功能。

## 已实现的接口列表

### 1. 参数配置列表（分页）

**接口地址**: `GET /api/system/config/list`

**请求参数**:
```json
{
  "pageNum": 1,          // 页码，默认 1
  "pageSize": 10,        // 每页条数，默认 10
  "configName": "",      // 参数名称（模糊查询）
  "configKey": "",       // 参数键名（模糊查询）
  "configType": "",      // 系统内置（Y-是，N-否）
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
      "configId": 1,
      "configName": "主框架页-默认皮肤样式名称",
      "configKey": "sys.index.skinName",
      "configValue": "skin-blue",
      "configType": "Y",
      "createTime": "2025-10-24 10:00:00",
      "remark": "蓝色 skin-blue、绿色 skin-green、紫色 skin-purple、红色 skin-red、黄色 skin-yellow"
    }
  ],
  "total": 1
}
```

**测试命令**:
```bash
curl -X GET "http://localhost:7001/api/system/config/list?pageNum=1&pageSize=10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 2. 参数配置详情

**接口地址**: `GET /api/system/config/:configId`

**路径参数**:
- `configId`: 参数ID

**响应示例**:
```json
{
  "code": 200,
  "msg": "操作成功",
  "data": {
    "configId": 1,
    "configName": "主框架页-默认皮肤样式名称",
    "configKey": "sys.index.skinName",
    "configValue": "skin-blue",
    "configType": "Y",
    "createTime": "2025-10-24 10:00:00",
    "remark": "蓝色 skin-blue、绿色 skin-green、紫色 skin-purple、红色 skin-red、黄色 skin-yellow"
  }
}
```

**测试命令**:
```bash
curl -X GET "http://localhost:7001/api/system/config/1" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 3. 根据参数键名查询参数值

**接口地址**: `GET /api/system/config/configKey/:configKey`

**路径参数**:
- `configKey`: 参数键名

**功能说明**:
- 根据参数键名查询参数值
- 优先从缓存获取，缓存不存在时从数据库查询
- 常用于系统运行时获取配置参数

**响应示例**:
```json
{
  "code": 200,
  "msg": "操作成功",
  "data": "skin-blue"
}
```

**测试命令**:
```bash
curl -X GET "http://localhost:7001/api/system/config/configKey/sys.index.skinName" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 4. 新增参数配置

**接口地址**: `POST /api/system/config`

**请求参数**:
```json
{
  "configName": "测试参数",
  "configKey": "test.config.key",
  "configValue": "test-value",
  "configType": "N",
  "remark": "测试参数配置"
}
```

**字段说明**:
- `configName`: 参数名称（必填）
- `configKey`: 参数键名（必填，唯一）
- `configValue`: 参数键值（必填）
- `configType`: 系统内置（Y-是，N-否）
- `remark`: 备注

**响应示例**:
```json
{
  "code": 200,
  "msg": "新增成功"
}
```

**业务规则**:
- 新增后会自动将参数加入缓存

**测试命令**:
```bash
curl -X POST "http://localhost:7001/api/system/config" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "configName": "测试参数",
    "configKey": "test.config.key",
    "configValue": "test-value",
    "configType": "N",
    "remark": "测试参数配置"
  }'
```

---

### 5. 修改参数配置

**接口地址**: `PUT /api/system/config`

**请求参数**:
```json
{
  "configId": 10,
  "configName": "测试参数（已修改）",
  "configKey": "test.config.key",
  "configValue": "test-value-modified",
  "configType": "N",
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

**业务规则**:
- 修改键名时，会删除旧键名的缓存，创建新键名的缓存
- 修改后会自动更新缓存

**测试命令**:
```bash
curl -X PUT "http://localhost:7001/api/system/config" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "configId": 10,
    "configName": "测试参数（已修改）",
    "configKey": "test.config.key",
    "configValue": "test-value-modified",
    "configType": "N"
  }'
```

---

### 6. 删除参数配置

**接口地址**: `DELETE /api/system/config/:configIds`

**路径参数**:
- `configIds`: 参数ID，多个用逗号分隔，如 `10,11,12`

**响应示例**:
```json
{
  "code": 200,
  "msg": "删除成功"
}
```

**业务规则**:
- 内置参数（configType=Y）不允许删除
- 删除后会自动删除缓存

**测试命令**:
```bash
# 删除单个参数配置
curl -X DELETE "http://localhost:7001/api/system/config/10" \
  -H "Authorization: Bearer YOUR_TOKEN"

# 删除多个参数配置
curl -X DELETE "http://localhost:7001/api/system/config/10,11,12" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 7. 刷新参数缓存

**接口地址**: `DELETE /api/system/config/refreshCache`

**功能说明**:
- 清空所有参数缓存
- 重新从数据库加载参数到缓存

**响应示例**:
```json
{
  "code": 200,
  "msg": "刷新成功"
}
```

**使用场景**:
- 直接修改数据库后刷新缓存
- 系统维护时重置缓存

**测试命令**:
```bash
curl -X DELETE "http://localhost:7001/api/system/config/refreshCache" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 8. 导出参数配置

**接口地址**: `POST /api/system/config/export`

**请求参数**:
```json
{
  "configName": "",
  "configKey": "",
  "configType": ""
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
curl -X POST "http://localhost:7001/api/system/config/export" \
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
│   │   └── system/
│   │       ├── login.js
│   │       ├── user.js
│   │       ├── role.js
│   │       ├── menu.js
│   │       ├── dept.js
│   │       ├── post.js
│   │       ├── dictType.js
│   │       ├── dictData.js
│   │       └── config.js        # 参数配置控制器（新增）
│   └── service/
│       └── system/
│           ├── login.js
│           ├── user.js
│           ├── role.js
│           ├── dept.js
│           ├── post.js
│           ├── menu.js
│           ├── dictType.js
│           ├── dictData.js
│           └── config.js        # 参数配置服务（完善）
└── mapper/
    └── mysql/
        └── ruoyi/
            └── SysConfigMapper.xml
```

### 2. 核心功能

#### 2.1 数据校验
- ✅ 参数键名唯一性校验
- ✅ 内置参数保护（不允许删除）

#### 2.2 基础操作
- ✅ 参数配置 CRUD 操作
- ✅ 分页查询
- ✅ 条件过滤（参数名称、参数键名、系统内置）
- ✅ 批量删除

#### 2.3 缓存管理 ⭐
- ✅ 根据键名查询时优先从缓存获取
- ✅ 缓存不存在时从数据库查询并更新缓存
- ✅ 新增/修改时自动更新缓存
- ✅ 删除时自动删除缓存
- ✅ 支持手动刷新缓存

#### 2.4 其他功能
- ✅ 根据参数键名查询参数值
- ⏳ Excel 导出（框架已完成，待完善）

### 3. 缓存机制

**缓存键格式**: `config:{configKey}`

**示例**:
```javascript
// 皮肤样式参数
config:sys.index.skinName

// 验证码开关
config:sys.account.captchaEnabled
```

**缓存更新策略**:
- **新增参数**: 将新参数加入缓存
- **修改参数**: 更新缓存（键名改变时删除旧缓存）
- **删除参数**: 从缓存中删除
- **手动刷新**: 清空所有缓存 + 重新加载

**缓存优点**:
- 减少数据库查询
- 提高系统性能
- 参数配置不经常变化，适合缓存

### 4. 参数类型说明

| 类型 | 值 | 说明 |
|------|---|------|
| 系统内置 | Y | 系统内置参数，不允许删除 |
| 用户自定义 | N | 用户自定义参数，可以删除 |

### 5. 常用系统参数

| 参数键名 | 说明 | 示例值 |
|---------|------|--------|
| sys.index.skinName | 主框架页-默认皮肤样式名称 | skin-blue |
| sys.user.initPassword | 用户管理-账号初始密码 | 123456 |
| sys.account.captchaEnabled | 账号自助-验证码开关 | true |
| sys.account.registerUser | 账号自助-是否开启用户注册功能 | false |

### 6. 数据库表结构

本模块涉及以下数据表：
- `sys_config` - 参数配置表

### 7. 业务逻辑还原

所有接口的业务逻辑均参考 RuoYi Spring Boot 版本实现，包括：
- 数据校验规则
- 缓存管理策略
- 内置参数保护
- 错误提示信息

---

## 测试步骤

### 1. 准备工作
1. 确保数据库已初始化
2. 启动 Egg.js 应用
3. 获取登录 Token

### 2. 测试流程

```bash
# 1. 登录获取 Token
TOKEN=$(curl -X POST "http://localhost:7001/api/login" \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}' \
  | jq -r '.token')

# 2. 查询参数配置列表
curl -X GET "http://localhost:7001/api/system/config/list?pageNum=1&pageSize=10" \
  -H "Authorization: Bearer $TOKEN"

# 3. 根据键名查询参数值
curl -X GET "http://localhost:7001/api/system/config/configKey/sys.index.skinName" \
  -H "Authorization: Bearer $TOKEN"

# 4. 新增参数配置
curl -X POST "http://localhost:7001/api/system/config" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "configName": "测试参数",
    "configKey": "test.config.key",
    "configValue": "test-value",
    "configType": "N",
    "remark": "测试参数配置"
  }'

# 5. 查询参数配置详情
curl -X GET "http://localhost:7001/api/system/config/10" \
  -H "Authorization: Bearer $TOKEN"

# 6. 修改参数配置
curl -X PUT "http://localhost:7001/api/system/config" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "configId": 10,
    "configName": "测试参数（已修改）",
    "configKey": "test.config.key",
    "configValue": "test-value-modified",
    "configType": "N"
  }'

# 7. 刷新参数缓存
curl -X DELETE "http://localhost:7001/api/system/config/refreshCache" \
  -H "Authorization: Bearer $TOKEN"

# 8. 导出参数配置
curl -X POST "http://localhost:7001/api/system/config/export" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{}'

# 9. 删除参数配置
curl -X DELETE "http://localhost:7001/api/system/config/10" \
  -H "Authorization: Bearer $TOKEN"
```

---

## 注意事项

1. **Token 认证**: 所有接口都需要在请求头中携带 `Authorization: Bearer {token}`
2. **唯一性**: 参数键名（configKey）必须唯一
3. **删除限制**: 内置参数（configType=Y）不允许删除
4. **缓存管理**: 
   - 新增/修改/删除操作会自动更新缓存
   - 可手动刷新缓存
5. **键名更新**: 修改参数键名时，会自动处理缓存的更新

---

## 错误码说明

| 错误码 | 说明 |
|--------|------|
| 200 | 操作成功 |
| 500 | 操作失败 |
| 401 | 未授权（Token 失效） |
| 403 | 无权限 |

---

## 使用示例

### 示例1: 获取系统配置参数

```bash
# 获取验证码开关
curl -X GET "http://localhost:7001/api/system/config/configKey/sys.account.captchaEnabled" \
  -H "Authorization: Bearer $TOKEN"
```

**响应**:
```json
{
  "code": 200,
  "msg": "操作成功",
  "data": "true"
}
```

**业务代码使用**:
```javascript
// 在业务代码中使用
const captchaEnabled = await service.system.config.selectConfigByKey('sys.account.captchaEnabled');

if (captchaEnabled === 'true') {
  // 验证码已启用
  await validateCaptcha(code, uuid);
}
```

---

### 示例2: 管理自定义参数

```bash
# 1. 新增自定义参数
curl -X POST "http://localhost:7001/api/system/config" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "configName": "API超时时间",
    "configKey": "api.timeout.seconds",
    "configValue": "30",
    "configType": "N",
    "remark": "API请求超时时间（秒）"
  }'

# 2. 查询参数值
curl -X GET "http://localhost:7001/api/system/config/configKey/api.timeout.seconds" \
  -H "Authorization: Bearer $TOKEN"

# 3. 修改参数值
curl -X PUT "http://localhost:7001/api/system/config" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "configId": 10,
    "configName": "API超时时间",
    "configKey": "api.timeout.seconds",
    "configValue": "60",
    "configType": "N"
  }'
```

---

## 常见错误处理

### 1. 新增失败：参数键名已存在

**原因**: `configKey` 字段值已存在

**解决**: 使用不同的参数键名

---

### 2. 删除失败：内置参数不能删除

**原因**: 该参数为系统内置参数（configType=Y）

**解决**: 内置参数不允许删除，只能修改参数值

---

## 缓存管理说明

### 缓存结构

参数缓存以 `config:{configKey}` 为键，存储参数值。

**示例**:
```javascript
// 缓存键
config:sys.index.skinName

// 缓存值
"skin-blue"
```

### 缓存更新时机

1. **系统启动时**: 自动加载所有参数到缓存
2. **新增参数**: 将新参数加入缓存
3. **修改参数**: 更新缓存
4. **删除参数**: 从缓存中删除
5. **手动刷新**: 清空所有缓存 + 重新加载

### 缓存优点

- 减少数据库查询次数
- 提高系统响应速度
- 参数配置相对固定，适合缓存
- 支持热更新（修改后立即生效）

---

**文档版本**: v1.0  
**创建日期**: 2025-10-24  
**作者**: AI Assistant

