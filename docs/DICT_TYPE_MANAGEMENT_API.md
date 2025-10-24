# 字典类型管理 API 接口文档

## 概述

本文档描述了字典类型管理模块的所有 API 接口实现，包括 CRUD 操作、缓存管理、导出功能等。

## 已实现的接口列表

### 1. 字典类型列表（分页）

**接口地址**: `GET /api/system/dict/type/list`

**请求参数**:
```json
{
  "pageNum": 1,          // 页码，默认 1
  "pageSize": 10,        // 每页条数，默认 10
  "dictName": "",        // 字典名称（模糊查询）
  "dictType": "",        // 字典类型（模糊查询）
  "status": "",          // 状态（0-正常，1-停用）
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
      "dictId": 1,
      "dictName": "用户性别",
      "dictType": "sys_user_sex",
      "status": "0",
      "createTime": "2025-10-24 10:00:00",
      "remark": "用户性别列表"
    }
  ],
  "total": 1
}
```

**测试命令**:
```bash
curl -X GET "http://localhost:7001/api/system/dict/type/list?pageNum=1&pageSize=10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 2. 字典类型详情

**接口地址**: `GET /api/system/dict/type/:dictId`

**路径参数**:
- `dictId`: 字典ID

**响应示例**:
```json
{
  "code": 200,
  "msg": "操作成功",
  "data": {
    "dictId": 1,
    "dictName": "用户性别",
    "dictType": "sys_user_sex",
    "status": "0",
    "createTime": "2025-10-24 10:00:00",
    "remark": "用户性别列表"
  }
}
```

**测试命令**:
```bash
curl -X GET "http://localhost:7001/api/system/dict/type/1" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 3. 新增字典类型

**接口地址**: `POST /api/system/dict/type`

**请求参数**:
```json
{
  "dictName": "测试字典",
  "dictType": "test_dict",
  "status": "0",
  "remark": "测试字典类型"
}
```

**字段说明**:
- `dictName`: 字典名称（必填）
- `dictType`: 字典类型（必填，唯一）
- `status`: 状态（0-正常，1-停用）
- `remark`: 备注

**响应示例**:
```json
{
  "code": 200,
  "msg": "新增成功"
}
```

**测试命令**:
```bash
curl -X POST "http://localhost:7001/api/system/dict/type" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "dictName": "测试字典",
    "dictType": "test_dict",
    "status": "0",
    "remark": "测试字典类型"
  }'
```

---

### 4. 修改字典类型

**接口地址**: `PUT /api/system/dict/type`

**请求参数**:
```json
{
  "dictId": 10,
  "dictName": "测试字典（已修改）",
  "dictType": "test_dict",
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

**业务规则**:
- 修改字典类型时，会自动更新所有关联的字典数据的类型
- 修改后会清空缓存

**测试命令**:
```bash
curl -X PUT "http://localhost:7001/api/system/dict/type" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "dictId": 10,
    "dictName": "测试字典（已修改）",
    "dictType": "test_dict",
    "status": "0"
  }'
```

---

### 5. 删除字典类型

**接口地址**: `DELETE /api/system/dict/type/:dictIds`

**路径参数**:
- `dictIds`: 字典ID，多个用逗号分隔，如 `10,11,12`

**响应示例**:
```json
{
  "code": 200,
  "msg": "删除成功"
}
```

**业务规则**:
- 删除前会检查是否有字典数据关联
- 如果有字典数据，则不允许删除
- 删除后会清空缓存

**测试命令**:
```bash
# 删除单个字典类型
curl -X DELETE "http://localhost:7001/api/system/dict/type/10" \
  -H "Authorization: Bearer YOUR_TOKEN"

# 删除多个字典类型
curl -X DELETE "http://localhost:7001/api/system/dict/type/10,11,12" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 6. 刷新字典缓存

**接口地址**: `DELETE /api/system/dict/type/refreshCache`

**功能说明**:
- 清空所有字典缓存
- 重新从数据库加载字典数据到缓存

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
curl -X DELETE "http://localhost:7001/api/system/dict/type/refreshCache" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 7. 获取字典选择框列表

**接口地址**: `GET /api/system/dict/type/optionselect`

**功能说明**:
- 查询所有字典类型
- 用于前端下拉选择框

**响应示例**:
```json
{
  "code": 200,
  "msg": "操作成功",
  "data": [
    {
      "dictId": 1,
      "dictName": "用户性别",
      "dictType": "sys_user_sex",
      "status": "0"
    },
    {
      "dictId": 2,
      "dictName": "菜单状态",
      "dictType": "sys_show_hide",
      "status": "0"
    }
  ]
}
```

**测试命令**:
```bash
curl -X GET "http://localhost:7001/api/system/dict/type/optionselect" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 8. 导出字典类型

**接口地址**: `POST /api/system/dict/type/export`

**请求参数**:
```json
{
  "dictName": "",
  "dictType": "",
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
curl -X POST "http://localhost:7001/api/system/dict/type/export" \
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
│   │       └── dictType.js      # 字典类型控制器（新增）
│   └── service/
│       └── system/
│           ├── login.js
│           ├── user.js
│           ├── role.js
│           ├── dept.js
│           ├── post.js
│           ├── menu.js
│           └── dictType.js      # 字典类型服务（新增）
└── mapper/
    └── mysql/
        └── ruoyi/
            ├── SysDictTypeMapper.xml
            └── SysDictDataMapper.xml
```

### 2. 核心功能

#### 2.1 数据校验
- ✅ 字典类型唯一性校验
- ✅ 删除前检查字典数据关联

#### 2.2 基础操作
- ✅ 字典类型 CRUD 操作
- ✅ 分页查询
- ✅ 条件过滤
- ✅ 批量删除

#### 2.3 缓存管理
- ✅ 加载字典缓存（启动时自动加载）
- ✅ 清空字典缓存
- ✅ 刷新字典缓存（清空+重新加载）
- ✅ 新增/修改/删除时自动清空缓存

#### 2.4 其他功能
- ✅ 字典选择框列表
- ✅ 修改字典类型时自动更新字典数据
- ⏳ Excel 导出（框架已完成，待完善）

### 3. 缓存机制

**缓存键格式**: `dict_{dictType}`

**示例**:
```javascript
// 用户性别字典
dict_sys_user_sex

// 菜单状态字典
dict_sys_show_hide
```

**缓存更新策略**:
- 新增字典类型：清空所有缓存
- 修改字典类型：清空所有缓存
- 删除字典类型：清空所有缓存
- 手动刷新：清空所有缓存 + 重新加载

**缓存优点**:
- 减少数据库查询
- 提高系统性能
- 字典数据不经常变化，适合缓存

### 4. 数据库表结构

本模块涉及以下数据表：
- `sys_dict_type` - 字典类型表
- `sys_dict_data` - 字典数据表

### 5. 业务逻辑还原

所有接口的业务逻辑均参考 RuoYi Spring Boot 版本实现，包括：
- 数据校验规则
- 缓存管理策略
- 关联数据检查
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

# 2. 查询字典类型列表
curl -X GET "http://localhost:7001/api/system/dict/type/list?pageNum=1&pageSize=10" \
  -H "Authorization: Bearer $TOKEN"

# 3. 新增字典类型
curl -X POST "http://localhost:7001/api/system/dict/type" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "dictName": "测试字典",
    "dictType": "test_dict",
    "status": "0",
    "remark": "测试字典类型"
  }'

# 4. 查询字典类型详情
curl -X GET "http://localhost:7001/api/system/dict/type/10" \
  -H "Authorization: Bearer $TOKEN"

# 5. 修改字典类型
curl -X PUT "http://localhost:7001/api/system/dict/type" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "dictId": 10,
    "dictName": "测试字典（已修改）",
    "dictType": "test_dict",
    "status": "0"
  }'

# 6. 查询字典选择框列表
curl -X GET "http://localhost:7001/api/system/dict/type/optionselect" \
  -H "Authorization: Bearer $TOKEN"

# 7. 刷新字典缓存
curl -X DELETE "http://localhost:7001/api/system/dict/type/refreshCache" \
  -H "Authorization: Bearer $TOKEN"

# 8. 导出字典类型
curl -X POST "http://localhost:7001/api/system/dict/type/export" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{}'

# 9. 删除字典类型
curl -X DELETE "http://localhost:7001/api/system/dict/type/10" \
  -H "Authorization: Bearer $TOKEN"
```

---

## 注意事项

1. **Token 认证**: 所有接口都需要在请求头中携带 `Authorization: Bearer {token}`
2. **唯一性**: 字典类型（dictType）必须唯一
3. **删除限制**: 如果字典类型下有字典数据，则不允许删除
4. **缓存管理**: 
   - 新增/修改/删除操作会自动清空缓存
   - 可手动刷新缓存
5. **类型更新**: 修改字典类型时，会自动更新所有关联的字典数据

---

## 错误码说明

| 错误码 | 说明 |
|--------|------|
| 200 | 操作成功 |
| 500 | 操作失败 |
| 401 | 未授权（Token 失效） |
| 403 | 无权限 |

---

## 常见错误处理

### 1. 新增失败：字典类型已存在

**原因**: `dictType` 字段值已存在

**解决**: 使用不同的字典类型值

---

### 2. 删除失败：已分配,不能删除

**原因**: 该字典类型下存在字典数据

**解决**: 先删除所有关联的字典数据，再删除字典类型

---

## 缓存管理说明

### 缓存结构

字典缓存以 `dict_{dictType}` 为键，存储该类型下所有字典数据。

**示例**:
```javascript
// 缓存键
dict_sys_user_sex

// 缓存值（JSON 字符串）
[
  {
    "dictCode": 1,
    "dictLabel": "男",
    "dictValue": "0",
    "dictType": "sys_user_sex",
    "dictSort": 1
  },
  {
    "dictCode": 2,
    "dictLabel": "女",
    "dictValue": "1",
    "dictType": "sys_user_sex",
    "dictSort": 2
  }
]
```

### 缓存更新时机

1. **系统启动时**: 自动加载所有字典数据到缓存
2. **新增字典类型**: 清空缓存
3. **修改字典类型**: 清空缓存
4. **删除字典类型**: 清空缓存
5. **手动刷新**: 清空缓存 + 重新加载

### 缓存优点

- 减少数据库查询次数
- 提高系统响应速度
- 字典数据相对固定，适合缓存

---

**文档版本**: v1.0  
**创建日期**: 2025-10-24  
**作者**: AI Assistant

