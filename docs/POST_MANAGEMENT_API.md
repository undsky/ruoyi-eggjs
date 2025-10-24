# 岗位管理 API 接口文档

## 概述

本文档描述了岗位管理模块的所有 API 接口实现，包括 CRUD 操作、导出功能等。

## 已实现的接口列表

### 1. 岗位列表（分页）

**接口地址**: `GET /api/system/post/list`

**请求参数**:
```json
{
  "pageNum": 1,          // 页码，默认 1
  "pageSize": 10,        // 每页条数，默认 10
  "postCode": "",        // 岗位编码（模糊查询）
  "postName": "",        // 岗位名称（模糊查询）
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
      "postId": 1,
      "postCode": "ceo",
      "postName": "董事长",
      "postSort": 1,
      "status": "0",
      "createTime": "2025-10-24 10:00:00",
      "remark": "董事长"
    }
  ],
  "total": 1
}
```

**测试命令**:
```bash
curl -X GET "http://localhost:7001/api/system/post/list?pageNum=1&pageSize=10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 2. 岗位详情

**接口地址**: `GET /api/system/post/:postId`

**路径参数**:
- `postId`: 岗位ID

**响应示例**:
```json
{
  "code": 200,
  "msg": "操作成功",
  "data": {
    "postId": 1,
    "postCode": "ceo",
    "postName": "董事长",
    "postSort": 1,
    "status": "0",
    "createTime": "2025-10-24 10:00:00",
    "remark": "董事长"
  }
}
```

**测试命令**:
```bash
curl -X GET "http://localhost:7001/api/system/post/1" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 3. 新增岗位

**接口地址**: `POST /api/system/post`

**请求参数**:
```json
{
  "postCode": "test",
  "postName": "测试岗位",
  "postSort": 5,
  "status": "0",
  "remark": "测试岗位"
}
```

**字段说明**:
- `postCode`: 岗位编码（必填，唯一）
- `postName`: 岗位名称（必填，唯一）
- `postSort`: 岗位排序（数字越小越靠前）
- `status`: 岗位状态（0-正常，1-停用）

**响应示例**:
```json
{
  "code": 200,
  "msg": "新增成功"
}
```

**测试命令**:
```bash
curl -X POST "http://localhost:7001/api/system/post" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "postCode": "test",
    "postName": "测试岗位",
    "postSort": 5,
    "status": "0",
    "remark": "测试岗位"
  }'
```

---

### 4. 修改岗位

**接口地址**: `PUT /api/system/post`

**请求参数**:
```json
{
  "postId": 5,
  "postCode": "test",
  "postName": "测试岗位（已修改）",
  "postSort": 5,
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
curl -X PUT "http://localhost:7001/api/system/post" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "postId": 5,
    "postCode": "test",
    "postName": "测试岗位（已修改）",
    "postSort": 5,
    "status": "0"
  }'
```

---

### 5. 删除岗位

**接口地址**: `DELETE /api/system/post/:postIds`

**路径参数**:
- `postIds`: 岗位ID，多个用逗号分隔，如 `5,6,7`

**响应示例**:
```json
{
  "code": 200,
  "msg": "删除成功"
}
```

**测试命令**:
```bash
# 删除单个岗位
curl -X DELETE "http://localhost:7001/api/system/post/5" \
  -H "Authorization: Bearer YOUR_TOKEN"

# 删除多个岗位
curl -X DELETE "http://localhost:7001/api/system/post/5,6,7" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 6. 导出岗位

**接口地址**: `POST /api/system/post/export`

**请求参数**:
```json
{
  "postCode": "",
  "postName": "",
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
curl -X POST "http://localhost:7001/api/system/post/export" \
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
│   │       └── post.js          # 岗位管理控制器（新增）
│   └── service/
│       └── system/
│           ├── login.js
│           ├── user.js
│           ├── role.js
│           ├── dept.js
│           ├── post.js          # 岗位服务（完善）
│           └── menu.js
└── mapper/
    └── mysql/
        └── ruoyi/
            ├── SysPostMapper.xml
            └── SysUserPostMapper.xml
```

### 2. 核心功能

#### 2.1 数据校验
- ✅ 岗位名称唯一性校验
- ✅ 岗位编码唯一性校验

#### 2.2 基础操作
- ✅ 岗位 CRUD 操作
- ✅ 分页查询
- ✅ 条件过滤
- ✅ 批量删除

#### 2.3 导出功能
- ✅ 导出功能框架（Excel 导出待完善）

### 3. 数据库表结构

本模块涉及以下数据表：
- `sys_post` - 岗位表
- `sys_user_post` - 用户岗位关联表

### 4. 业务逻辑还原

所有接口的业务逻辑均参考 RuoYi Spring Boot 版本实现，包括：
- 数据校验规则
- 错误提示信息
- 排序逻辑（按 post_sort）

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

# 2. 查询岗位列表
curl -X GET "http://localhost:7001/api/system/post/list?pageNum=1&pageSize=10" \
  -H "Authorization: Bearer $TOKEN"

# 3. 新增岗位
curl -X POST "http://localhost:7001/api/system/post" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "postCode": "test",
    "postName": "测试岗位",
    "postSort": 5,
    "status": "0",
    "remark": "测试岗位"
  }'

# 4. 查询岗位详情
curl -X GET "http://localhost:7001/api/system/post/5" \
  -H "Authorization: Bearer $TOKEN"

# 5. 修改岗位
curl -X PUT "http://localhost:7001/api/system/post" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "postId": 5,
    "postCode": "test",
    "postName": "测试岗位（已修改）",
    "postSort": 5,
    "status": "0"
  }'

# 6. 导出岗位
curl -X POST "http://localhost:7001/api/system/post/export" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{}'

# 7. 删除岗位
curl -X DELETE "http://localhost:7001/api/system/post/5" \
  -H "Authorization: Bearer $TOKEN"
```

---

## 注意事项

1. **Token 认证**: 所有接口都需要在请求头中携带 `Authorization: Bearer {token}`
2. **唯一性**: 岗位名称和岗位编码必须唯一
3. **排序**: 岗位按 `postSort` 字段升序排列
4. **批量删除**: 支持一次删除多个岗位

---

## 错误码说明

| 错误码 | 说明 |
|--------|------|
| 200 | 操作成功 |
| 500 | 操作失败 |
| 401 | 未授权（Token 失效） |
| 403 | 无权限 |

---

**文档版本**: v1.0  
**创建日期**: 2025-10-24  
**作者**: AI Assistant

