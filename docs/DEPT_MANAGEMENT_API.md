# 部门管理 API 接口文档

## 概述

本文档描述了部门管理模块的所有 API 接口实现，包括 CRUD 操作、树形结构构建、排除节点查询等功能。

## 已实现的接口列表

### 1. 部门列表（树形）

**接口地址**: `GET /api/system/dept/list`

**请求参数**:
```json
{
  "deptName": "",        // 部门名称（模糊查询）
  "status": ""           // 部门状态（0-正常，1-停用）
}
```

**响应示例**:
```json
{
  "code": 200,
  "msg": "查询成功",
  "data": [
    {
      "deptId": 100,
      "parentId": 0,
      "ancestors": "0",
      "deptName": "总公司",
      "orderNum": 0,
      "leader": "张三",
      "phone": "13800138000",
      "email": "admin@example.com",
      "status": "0",
      "createTime": "2025-10-24 10:00:00"
    }
  ]
}
```

**测试命令**:
```bash
curl -X GET "http://localhost:7001/api/system/dept/list" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 2. 部门列表（排除节点）

**接口地址**: `GET /api/system/dept/list/exclude/:deptId`

**路径参数**:
- `deptId`: 要排除的部门ID

**功能说明**:
- 查询部门列表时，排除指定部门及其所有子部门
- 用于选择上级部门时，避免选择自己或自己的子部门

**响应示例**:
```json
{
  "code": 200,
  "msg": "查询成功",
  "data": [
    {
      "deptId": 100,
      "deptName": "总公司",
      "parentId": 0
    }
  ]
}
```

**测试命令**:
```bash
curl -X GET "http://localhost:7001/api/system/dept/list/exclude/101" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 3. 部门详情

**接口地址**: `GET /api/system/dept/:deptId`

**路径参数**:
- `deptId`: 部门ID

**响应示例**:
```json
{
  "code": 200,
  "msg": "操作成功",
  "data": {
    "deptId": 100,
    "parentId": 0,
    "ancestors": "0",
    "deptName": "总公司",
    "orderNum": 0,
    "leader": "张三",
    "phone": "13800138000",
    "email": "admin@example.com",
    "status": "0",
    "parentName": null,
    "createTime": "2025-10-24 10:00:00"
  }
}
```

**测试命令**:
```bash
curl -X GET "http://localhost:7001/api/system/dept/100" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 4. 新增部门

**接口地址**: `POST /api/system/dept`

**请求参数**:
```json
{
  "parentId": 100,
  "deptName": "测试部门",
  "orderNum": 1,
  "leader": "李四",
  "phone": "13900139000",
  "email": "test@example.com",
  "status": "0"
}
```

**字段说明**:
- `parentId`: 父部门ID（0 表示顶级部门）
- `ancestors`: 祖级列表（自动生成，无需传入）
- `status`: 部门状态（0-正常，1-停用）

**响应示例**:
```json
{
  "code": 200,
  "msg": "新增成功"
}
```

**业务规则**:
- 父部门必须是正常状态才能新增子部门
- 同一父部门下的部门名称不能重复
- 自动生成 `ancestors` 字段（祖级列表）

**测试命令**:
```bash
curl -X POST "http://localhost:7001/api/system/dept" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "parentId": 100,
    "deptName": "测试部门",
    "orderNum": 1,
    "leader": "李四",
    "phone": "13900139000",
    "email": "test@example.com",
    "status": "0"
  }'
```

---

### 5. 修改部门

**接口地址**: `PUT /api/system/dept`

**请求参数**:
```json
{
  "deptId": 101,
  "parentId": 100,
  "deptName": "测试部门（已修改）",
  "orderNum": 1,
  "leader": "李四",
  "phone": "13900139000",
  "email": "test@example.com",
  "status": "0"
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
- 同一父部门下的部门名称不能重复
- 上级部门不能选择自己
- 停用部门时，必须先停用所有子部门
- 启用部门时，自动启用所有上级部门
- 修改上级部门时，自动更新所有子部门的 `ancestors` 字段

**测试命令**:
```bash
curl -X PUT "http://localhost:7001/api/system/dept" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "deptId": 101,
    "parentId": 100,
    "deptName": "测试部门（已修改）",
    "orderNum": 1,
    "leader": "李四",
    "phone": "13900139000",
    "email": "test@example.com",
    "status": "0"
  }'
```

---

### 6. 删除部门

**接口地址**: `DELETE /api/system/dept/:deptId`

**路径参数**:
- `deptId`: 部门ID

**响应示例**:
```json
{
  "code": 200,
  "msg": "删除成功"
}
```

**业务规则**:
- 存在子部门时不允许删除
- 部门存在用户时不允许删除
- 需要数据权限

**测试命令**:
```bash
curl -X DELETE "http://localhost:7001/api/system/dept/101" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 7. 部门树选择

**接口地址**: `GET /api/system/dept/treeselect`

**请求参数**:
```json
{
  "deptName": "",
  "status": ""
}
```

**响应示例**:
```json
{
  "code": 200,
  "msg": "操作成功",
  "data": [
    {
      "id": 100,
      "label": "总公司",
      "children": [
        {
          "id": 101,
          "label": "北京分公司",
          "children": [
            {
              "id": 103,
              "label": "研发部门"
            }
          ]
        },
        {
          "id": 102,
          "label": "上海分公司"
        }
      ]
    }
  ]
}
```

**用途**: 用于前端下拉树选择控件

**测试命令**:
```bash
curl -X GET "http://localhost:7001/api/system/dept/treeselect" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 8. 获取对应角色部门树列表

**接口地址**: `GET /api/system/dept/roleDeptTreeselect/:roleId`

**路径参数**:
- `roleId`: 角色ID

**响应示例**:
```json
{
  "code": 200,
  "msg": "操作成功",
  "checkedKeys": [100, 101, 103],
  "depts": [
    {
      "id": 100,
      "label": "总公司",
      "children": [
        {
          "id": 101,
          "label": "北京分公司"
        }
      ]
    }
  ]
}
```

**字段说明**:
- `checkedKeys`: 角色已分配的部门ID列表
- `depts`: 所有部门树形结构

**用途**: 用于角色分配数据权限时选择部门

**测试命令**:
```bash
curl -X GET "http://localhost:7001/api/system/dept/roleDeptTreeselect/2" \
  -H "Authorization: Bearer YOUR_TOKEN"
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
│   │       └── dept.js          # 部门管理控制器（新增）
│   └── service/
│       └── system/
│           ├── login.js
│           ├── user.js
│           ├── role.js
│           ├── dept.js          # 部门服务（完善）
│           ├── post.js
│           └── menu.js
└── mapper/
    └── mysql/
        └── ruoyi/
            ├── SysDeptMapper.xml
            └── SysRoleDeptMapper.xml
```

### 2. 核心功能

#### 2.1 数据校验
- ✅ 部门名称唯一性校验（同一父部门下）
- ✅ 上级部门循环引用校验
- ✅ 子部门存在性检查
- ✅ 部门用户关联检查
- ✅ 父部门状态检查
- ✅ 子部门状态检查

#### 2.2 树形结构
- ✅ 部门树构建
- ✅ 树形选择结构
- ✅ 排除节点查询
- ✅ 角色部门树
- ✅ 递归查找子部门

#### 2.3 祖级列表（ancestors）维护
- ✅ 新增时自动生成 ancestors
- ✅ 修改上级部门时更新 ancestors
- ✅ 自动更新所有子部门的 ancestors

#### 2.4 状态联动
- ✅ 启用部门时自动启用所有上级部门
- ✅ 停用部门时检查子部门状态

### 3. 祖级列表（ancestors）说明

**作用**: 记录从根节点到当前节点的所有祖先节点ID，用逗号分隔。

**示例**:
```
总公司 (deptId=100, ancestors="0")
└── 北京分公司 (deptId=101, ancestors="0,100")
    └── 研发部门 (deptId=103, ancestors="0,100,101")
```

**优点**:
- 快速查询所有子部门（FIND_IN_SET）
- 快速查询所有上级部门
- 避免递归查询，提高性能

### 4. 数据库表结构

本模块涉及以下数据表：
- `sys_dept` - 部门表
- `sys_role_dept` - 角色部门关联表
- `sys_user` - 用户表（检查用户关联）

### 5. 业务逻辑还原

所有接口的业务逻辑均参考 RuoYi Spring Boot 版本实现，包括：
- 数据校验规则
- 树形结构构建
- ancestors 字段维护
- 状态联动逻辑
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

# 2. 查询部门列表
curl -X GET "http://localhost:7001/api/system/dept/list" \
  -H "Authorization: Bearer $TOKEN"

# 3. 新增部门
curl -X POST "http://localhost:7001/api/system/dept" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "parentId": 100,
    "deptName": "测试部门",
    "orderNum": 1,
    "leader": "李四",
    "phone": "13900139000",
    "email": "test@example.com",
    "status": "0"
  }'

# 4. 查询部门详情
curl -X GET "http://localhost:7001/api/system/dept/100" \
  -H "Authorization: Bearer $TOKEN"

# 5. 修改部门
curl -X PUT "http://localhost:7001/api/system/dept" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "deptId": 101,
    "parentId": 100,
    "deptName": "测试部门（已修改）",
    "orderNum": 1,
    "leader": "李四",
    "phone": "13900139000",
    "email": "test@example.com",
    "status": "0"
  }'

# 6. 查询部门树选择
curl -X GET "http://localhost:7001/api/system/dept/treeselect" \
  -H "Authorization: Bearer $TOKEN"

# 7. 查询排除节点的部门列表
curl -X GET "http://localhost:7001/api/system/dept/list/exclude/101" \
  -H "Authorization: Bearer $TOKEN"

# 8. 查询角色部门树
curl -X GET "http://localhost:7001/api/system/dept/roleDeptTreeselect/2" \
  -H "Authorization: Bearer $TOKEN"

# 9. 删除部门
curl -X DELETE "http://localhost:7001/api/system/dept/101" \
  -H "Authorization: Bearer $TOKEN"
```

---

## 注意事项

1. **Token 认证**: 所有接口都需要在请求头中携带 `Authorization: Bearer {token}`
2. **树形结构**: 部门以树形结构展示，需要正确设置 `parentId`
3. **删除限制**: 
   - 存在子部门时不允许删除
   - 部门存在用户时不允许删除
4. **状态联动**: 
   - 启用部门时自动启用所有上级部门
   - 停用部门前必须先停用所有子部门
5. **祖级列表**: `ancestors` 字段自动维护，无需手动设置
6. **上级部门**: 不能选择自己或自己的子部门作为上级部门

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

### 1. 新增失败：部门停用，不允许新增

**原因**: 父部门状态为停用（status='1'）

**解决**: 先启用父部门，再新增子部门

---

### 2. 修改失败：上级部门不能是自己

**原因**: `parentId` 等于 `deptId`

**解决**: 选择其他部门作为上级部门

---

### 3. 修改失败：该部门包含未停用的子部门

**原因**: 停用部门时，存在状态为正常的子部门

**解决**: 先停用所有子部门，再停用父部门

---

### 4. 删除失败：存在下级部门,不允许删除

**原因**: 该部门存在子部门

**解决**: 先删除所有子部门，再删除父部门

---

### 5. 删除失败：部门存在用户,不允许删除

**原因**: 该部门下有用户

**解决**: 先将用户移动到其他部门，或删除用户，再删除部门

---

**文档版本**: v1.0  
**创建日期**: 2025-10-24  
**作者**: AI Assistant

