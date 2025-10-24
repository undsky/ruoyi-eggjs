# 字典数据管理 API 接口文档

## 概述

本文档描述了字典数据管理模块的所有 API 接口实现，包括 CRUD 操作、缓存管理、根据类型查询等功能。

## 已实现的接口列表

### 1. 字典数据列表（分页）

**接口地址**: `GET /api/system/dict/data/list`

**请求参数**:
```json
{
  "pageNum": 1,          // 页码，默认 1
  "pageSize": 10,        // 每页条数，默认 10
  "dictType": "",        // 字典类型
  "dictLabel": "",       // 字典标签（模糊查询）
  "status": ""           // 状态（0-正常，1-停用）
}
```

**响应示例**:
```json
{
  "code": 200,
  "msg": "查询成功",
  "rows": [
    {
      "dictCode": 1,
      "dictSort": 1,
      "dictLabel": "男",
      "dictValue": "0",
      "dictType": "sys_user_sex",
      "cssClass": "",
      "listClass": "default",
      "isDefault": "Y",
      "status": "0",
      "createTime": "2025-10-24 10:00:00",
      "remark": "性别男"
    }
  ],
  "total": 1
}
```

**测试命令**:
```bash
curl -X GET "http://localhost:7001/api/system/dict/data/list?pageNum=1&pageSize=10&dictType=sys_user_sex" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 2. 字典数据详情

**接口地址**: `GET /api/system/dict/data/:dictCode`

**路径参数**:
- `dictCode`: 字典数据ID

**响应示例**:
```json
{
  "code": 200,
  "msg": "操作成功",
  "data": {
    "dictCode": 1,
    "dictSort": 1,
    "dictLabel": "男",
    "dictValue": "0",
    "dictType": "sys_user_sex",
    "cssClass": "",
    "listClass": "default",
    "isDefault": "Y",
    "status": "0",
    "createTime": "2025-10-24 10:00:00",
    "remark": "性别男"
  }
}
```

**测试命令**:
```bash
curl -X GET "http://localhost:7001/api/system/dict/data/1" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 3. 根据字典类型查询字典数据

**接口地址**: `GET /api/system/dict/data/type/:dictType`

**路径参数**:
- `dictType`: 字典类型

**功能说明**:
- 根据字典类型查询该类型下所有字典数据
- 优先从缓存获取，缓存不存在时从数据库查询
- 常用于前端下拉选择框

**响应示例**:
```json
{
  "code": 200,
  "msg": "操作成功",
  "data": [
    {
      "dictCode": 1,
      "dictLabel": "男",
      "dictValue": "0",
      "dictType": "sys_user_sex",
      "dictSort": 1,
      "cssClass": "",
      "listClass": "default",
      "isDefault": "Y",
      "status": "0"
    },
    {
      "dictCode": 2,
      "dictLabel": "女",
      "dictValue": "1",
      "dictType": "sys_user_sex",
      "dictSort": 2,
      "cssClass": "",
      "listClass": "default",
      "isDefault": "N",
      "status": "0"
    }
  ]
}
```

**测试命令**:
```bash
curl -X GET "http://localhost:7001/api/system/dict/data/type/sys_user_sex" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 4. 新增字典数据

**接口地址**: `POST /api/system/dict/data`

**请求参数**:
```json
{
  "dictLabel": "未知",
  "dictValue": "2",
  "dictType": "sys_user_sex",
  "dictSort": 3,
  "cssClass": "",
  "listClass": "info",
  "isDefault": "N",
  "status": "0",
  "remark": "性别未知"
}
```

**字段说明**:
- `dictLabel`: 字典标签（必填）
- `dictValue`: 字典键值（必填）
- `dictType`: 字典类型（必填）
- `dictSort`: 字典排序（数字越小越靠前）
- `cssClass`: 样式属性（CSS 类名）
- `listClass`: 表格回显样式（default/primary/success/info/warning/danger）
- `isDefault`: 是否默认（Y-是，N-否）
- `status`: 状态（0-正常，1-停用）

**响应示例**:
```json
{
  "code": 200,
  "msg": "新增成功"
}
```

**业务规则**:
- 新增后会自动更新该字典类型的缓存

**测试命令**:
```bash
curl -X POST "http://localhost:7001/api/system/dict/data" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "dictLabel": "未知",
    "dictValue": "2",
    "dictType": "sys_user_sex",
    "dictSort": 3,
    "listClass": "info",
    "isDefault": "N",
    "status": "0",
    "remark": "性别未知"
  }'
```

---

### 5. 修改字典数据

**接口地址**: `PUT /api/system/dict/data`

**请求参数**:
```json
{
  "dictCode": 3,
  "dictLabel": "未知（已修改）",
  "dictValue": "2",
  "dictType": "sys_user_sex",
  "dictSort": 3,
  "listClass": "warning",
  "isDefault": "N",
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
- 修改后会自动更新该字典类型的缓存

**测试命令**:
```bash
curl -X PUT "http://localhost:7001/api/system/dict/data" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "dictCode": 3,
    "dictLabel": "未知（已修改）",
    "dictValue": "2",
    "dictType": "sys_user_sex",
    "dictSort": 3,
    "listClass": "warning",
    "isDefault": "N",
    "status": "0"
  }'
```

---

### 6. 删除字典数据

**接口地址**: `DELETE /api/system/dict/data/:dictCodes`

**路径参数**:
- `dictCodes`: 字典数据ID，多个用逗号分隔，如 `3,4,5`

**响应示例**:
```json
{
  "code": 200,
  "msg": "删除成功"
}
```

**业务规则**:
- 删除后会自动更新该字典类型的缓存

**测试命令**:
```bash
# 删除单个字典数据
curl -X DELETE "http://localhost:7001/api/system/dict/data/3" \
  -H "Authorization: Bearer YOUR_TOKEN"

# 删除多个字典数据
curl -X DELETE "http://localhost:7001/api/system/dict/data/3,4,5" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 7. 导出字典数据

**接口地址**: `POST /api/system/dict/data/export`

**请求参数**:
```json
{
  "dictType": "",
  "dictLabel": "",
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
curl -X POST "http://localhost:7001/api/system/dict/data/export" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"dictType": "sys_user_sex"}'
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
│   │       └── dictData.js      # 字典数据控制器（新增）
│   └── service/
│       └── system/
│           ├── login.js
│           ├── user.js
│           ├── role.js
│           ├── dept.js
│           ├── post.js
│           ├── menu.js
│           ├── dictType.js
│           └── dictData.js      # 字典数据服务（新增）
└── mapper/
    └── mysql/
        └── ruoyi/
            ├── SysDictTypeMapper.xml
            └── SysDictDataMapper.xml
```

### 2. 核心功能

#### 2.1 基础操作
- ✅ 字典数据 CRUD 操作
- ✅ 分页查询
- ✅ 条件过滤（字典类型、字典标签、状态）
- ✅ 批量删除

#### 2.2 缓存管理 ⭐
- ✅ 根据类型查询时优先从缓存获取
- ✅ 缓存不存在时从数据库查询并更新缓存
- ✅ 新增/修改/删除时自动更新对应类型的缓存

#### 2.3 其他功能
- ✅ 根据字典类型查询字典数据
- ⏳ Excel 导出（框架已完成，待完善）

### 3. 缓存机制

**缓存策略**:
1. **查询时**: 优先从缓存获取，缓存不存在时查询数据库并更新缓存
2. **新增时**: 插入数据后，更新该字典类型的缓存
3. **修改时**: 更新数据后，更新该字典类型的缓存
4. **删除时**: 删除数据后，更新该字典类型的缓存

**缓存键格式**: `dict_{dictType}`

**缓存更新方法**:
```javascript
async updateDictCache(dictType) {
  // 重新查询该类型的所有字典数据
  const dictDataList = await ctx.service.db.mysql.ruoyi.sysDictDataMapper
    .selectDictDataByType([dictType]);
  
  // 更新缓存
  const cacheKey = `dict_${dictType}`;
  await app.cache.default.set(cacheKey, JSON.stringify(dictDataList || []), 0);
}
```

### 4. 字典数据字段说明

| 字段 | 说明 | 示例 |
|------|------|------|
| dictCode | 字典数据ID | 1 |
| dictSort | 字典排序 | 1 |
| dictLabel | 字典标签 | "男" |
| dictValue | 字典键值 | "0" |
| dictType | 字典类型 | "sys_user_sex" |
| cssClass | 样式属性 | "" |
| listClass | 表格回显样式 | "default" |
| isDefault | 是否默认 | "Y" |
| status | 状态 | "0" |

### 5. 表格回显样式（listClass）

| 值 | 说明 | 前端展示 |
|------|------|---------|
| default | 默认 | 灰色 |
| primary | 主要 | 蓝色 |
| success | 成功 | 绿色 |
| info | 信息 | 浅蓝色 |
| warning | 警告 | 橙色 |
| danger | 危险 | 红色 |

### 6. 数据库表结构

本模块涉及以下数据表：
- `sys_dict_type` - 字典类型表
- `sys_dict_data` - 字典数据表

### 7. 业务逻辑还原

所有接口的业务逻辑均参考 RuoYi Spring Boot 版本实现，包括：
- 缓存管理策略
- 排序逻辑（按 dict_sort）
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

# 2. 查询字典数据列表
curl -X GET "http://localhost:7001/api/system/dict/data/list?pageNum=1&pageSize=10&dictType=sys_user_sex" \
  -H "Authorization: Bearer $TOKEN"

# 3. 根据字典类型查询字典数据
curl -X GET "http://localhost:7001/api/system/dict/data/type/sys_user_sex" \
  -H "Authorization: Bearer $TOKEN"

# 4. 新增字典数据
curl -X POST "http://localhost:7001/api/system/dict/data" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "dictLabel": "未知",
    "dictValue": "2",
    "dictType": "sys_user_sex",
    "dictSort": 3,
    "listClass": "info",
    "isDefault": "N",
    "status": "0",
    "remark": "性别未知"
  }'

# 5. 查询字典数据详情
curl -X GET "http://localhost:7001/api/system/dict/data/3" \
  -H "Authorization: Bearer $TOKEN"

# 6. 修改字典数据
curl -X PUT "http://localhost:7001/api/system/dict/data" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "dictCode": 3,
    "dictLabel": "未知（已修改）",
    "dictValue": "2",
    "dictType": "sys_user_sex",
    "dictSort": 3,
    "listClass": "warning",
    "isDefault": "N",
    "status": "0"
  }'

# 7. 导出字典数据
curl -X POST "http://localhost:7001/api/system/dict/data/export" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"dictType": "sys_user_sex"}'

# 8. 删除字典数据
curl -X DELETE "http://localhost:7001/api/system/dict/data/3" \
  -H "Authorization: Bearer $TOKEN"
```

---

## 注意事项

1. **Token 认证**: 所有接口都需要在请求头中携带 `Authorization: Bearer {token}`
2. **字典类型**: 新增字典数据前需要先创建对应的字典类型
3. **缓存管理**: 
   - 新增/修改/删除操作会自动更新对应字典类型的缓存
   - 查询时优先从缓存获取
4. **排序**: 字典数据按 `dictSort` 字段升序排列
5. **批量删除**: 支持一次删除多个字典数据

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

### 示例1: 获取用户性别字典

```bash
curl -X GET "http://localhost:7001/api/system/dict/data/type/sys_user_sex" \
  -H "Authorization: Bearer $TOKEN"
```

**响应**:
```json
{
  "code": 200,
  "msg": "操作成功",
  "data": [
    {"dictLabel": "男", "dictValue": "0"},
    {"dictLabel": "女", "dictValue": "1"}
  ]
}
```

**前端使用**:
```javascript
// 获取字典数据
const sexDict = await api.getDictDataByType('sys_user_sex');

// 渲染下拉框
<select>
  <option v-for="item in sexDict" :value="item.dictValue">
    {{ item.dictLabel }}
  </option>
</select>
```

---

### 示例2: 管理字典数据

```bash
# 1. 新增字典数据
curl -X POST "http://localhost:7001/api/system/dict/data" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "dictLabel": "测试",
    "dictValue": "test",
    "dictType": "sys_normal_disable",
    "dictSort": 3,
    "status": "0"
  }'

# 2. 查询该类型下所有数据（包含新增的）
curl -X GET "http://localhost:7001/api/system/dict/data/type/sys_normal_disable" \
  -H "Authorization: Bearer $TOKEN"
```

---

**文档版本**: v1.0  
**创建日期**: 2025-10-24  
**作者**: AI Assistant

