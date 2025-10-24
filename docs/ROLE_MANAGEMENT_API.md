# 角色管理 API 接口文档

## 概述

本文档描述了角色管理模块的所有 API 接口实现，包括 CRUD 操作、权限管理、用户授权等功能。

## 已实现的接口列表

### 1. 角色列表（分页）

**接口地址**: `GET /api/system/role/list`

**请求参数**:
```json
{
  "pageNum": 1,          // 页码，默认 1
  "pageSize": 10,        // 每页条数，默认 10
  "roleName": "",        // 角色名称（模糊查询）
  "roleKey": "",         // 角色权限字符（模糊查询）
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
      "roleId": 1,
      "roleName": "超级管理员",
      "roleKey": "admin",
      "roleSort": 1,
      "dataScope": "1",
      "status": "0",
      "createTime": "2025-10-24 10:00:00"
    }
  ],
  "total": 1
}
```

**测试命令**:
```bash
curl -X GET "http://localhost:7001/api/system/role/list?pageNum=1&pageSize=10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 2. 角色详情

**接口地址**: `GET /api/system/role/:roleId`

**路径参数**:
- `roleId`: 角色ID

**响应示例**:
```json
{
  "code": 200,
  "msg": "操作成功",
  "data": {
    "roleId": 2,
    "roleName": "普通角色",
    "roleKey": "common",
    "roleSort": 2,
    "dataScope": "2",
    "menuCheckStrictly": true,
    "deptCheckStrictly": true,
    "status": "0",
    "remark": "普通角色"
  }
}
```

**测试命令**:
```bash
curl -X GET "http://localhost:7001/api/system/role/2" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 3. 新增角色

**接口地址**: `POST /api/system/role`

**请求参数**:
```json
{
  "roleName": "测试角色",
  "roleKey": "test",
  "roleSort": 3,
  "status": "0",
  "menuIds": [1, 2, 3],
  "menuCheckStrictly": true,
  "deptCheckStrictly": true,
  "remark": "测试角色"
}
```

**响应示例**:
```json
{
  "code": 200,
  "msg": "新增成功"
}
```

**测试命令**:
```bash
curl -X POST "http://localhost:7001/api/system/role" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "roleName": "测试角色",
    "roleKey": "test",
    "roleSort": 3,
    "status": "0",
    "menuIds": [1, 2, 3],
    "remark": "测试角色"
  }'
```

---

### 4. 修改角色

**接口地址**: `PUT /api/system/role`

**请求参数**:
```json
{
  "roleId": 2,
  "roleName": "测试角色（已修改）",
  "roleKey": "test",
  "roleSort": 3,
  "status": "0",
  "menuIds": [1, 2, 3, 4],
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
curl -X PUT "http://localhost:7001/api/system/role" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "roleId": 2,
    "roleName": "测试角色（已修改）",
    "roleKey": "test",
    "roleSort": 3,
    "status": "0",
    "menuIds": [1, 2, 3, 4]
  }'
```

---

### 5. 删除角色

**接口地址**: `DELETE /api/system/role/:roleIds`

**路径参数**:
- `roleIds`: 角色ID，多个用逗号分隔，如 `2,3,4`

**响应示例**:
```json
{
  "code": 200,
  "msg": "删除成功"
}
```

**测试命令**:
```bash
# 删除单个角色
curl -X DELETE "http://localhost:7001/api/system/role/2" \
  -H "Authorization: Bearer YOUR_TOKEN"

# 删除多个角色
curl -X DELETE "http://localhost:7001/api/system/role/2,3,4" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 6. 修改状态

**接口地址**: `PUT /api/system/role/changeStatus`

**请求参数**:
```json
{
  "roleId": 2,
  "status": "1"  // 0-正常，1-停用
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
curl -X PUT "http://localhost:7001/api/system/role/changeStatus" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "roleId": 2,
    "status": "1"
  }'
```

---

### 7. 修改数据权限

**接口地址**: `PUT /api/system/role/dataScope`

**请求参数**:
```json
{
  "roleId": 2,
  "dataScope": "2",        // 数据范围（1全部 2自定义 3本部门 4本部门及以下 5仅本人）
  "deptIds": [100, 101],   // 自定义部门数据权限（dataScope=2时需要）
  "deptCheckStrictly": true
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
curl -X PUT "http://localhost:7001/api/system/role/dataScope" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "roleId": 2,
    "dataScope": "2",
    "deptIds": [100, 101]
  }'
```

---

### 8. 查询已分配用户角色列表

**接口地址**: `GET /api/system/role/allocatedList`

**请求参数**:
```json
{
  "pageNum": 1,
  "pageSize": 10,
  "roleId": 2,           // 角色ID（必填）
  "userName": "",        // 用户名（模糊查询）
  "phonenumber": ""      // 手机号（模糊查询）
}
```

**响应示例**:
```json
{
  "code": 200,
  "msg": "查询成功",
  "rows": [
    {
      "userId": 2,
      "userName": "testuser",
      "nickName": "测试用户",
      "email": "test@example.com",
      "phonenumber": "13900139000"
    }
  ],
  "total": 1
}
```

**测试命令**:
```bash
curl -X GET "http://localhost:7001/api/system/role/allocatedList?roleId=2&pageNum=1&pageSize=10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 9. 查询未分配用户角色列表

**接口地址**: `GET /api/system/role/unallocatedList`

**请求参数**:
```json
{
  "pageNum": 1,
  "pageSize": 10,
  "roleId": 2,           // 角色ID（必填）
  "userName": "",        // 用户名（模糊查询）
  "phonenumber": ""      // 手机号（模糊查询）
}
```

**响应示例**:
```json
{
  "code": 200,
  "msg": "查询成功",
  "rows": [
    {
      "userId": 3,
      "userName": "user3",
      "nickName": "用户3",
      "email": "user3@example.com",
      "phonenumber": "13900139003"
    }
  ],
  "total": 1
}
```

**测试命令**:
```bash
curl -X GET "http://localhost:7001/api/system/role/unallocatedList?roleId=2&pageNum=1&pageSize=10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 10. 取消授权用户

**接口地址**: `PUT /api/system/role/authUser/cancel`

**请求参数**:
```json
{
  "userId": 2,
  "roleId": 3
}
```

**响应示例**:
```json
{
  "code": 200,
  "msg": "取消授权成功"
}
```

**测试命令**:
```bash
curl -X PUT "http://localhost:7001/api/system/role/authUser/cancel" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 2,
    "roleId": 3
  }'
```

---

### 11. 批量取消授权用户

**接口地址**: `PUT /api/system/role/authUser/cancelAll`

**请求参数**:
```json
{
  "roleId": 2,
  "userIds": [3, 4, 5]  // 用户ID数组或逗号分隔的字符串
}
```

**响应示例**:
```json
{
  "code": 200,
  "msg": "取消授权成功"
}
```

**测试命令**:
```bash
curl -X PUT "http://localhost:7001/api/system/role/authUser/cancelAll" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "roleId": 2,
    "userIds": [3, 4, 5]
  }'
```

---

### 12. 批量选择用户授权

**接口地址**: `PUT /api/system/role/authUser/selectAll`

**请求参数**:
```json
{
  "roleId": 2,
  "userIds": [3, 4, 5]  // 用户ID数组或逗号分隔的字符串
}
```

**响应示例**:
```json
{
  "code": 200,
  "msg": "授权成功"
}
```

**测试命令**:
```bash
curl -X PUT "http://localhost:7001/api/system/role/authUser/selectAll" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "roleId": 2,
    "userIds": [3, 4, 5]
  }'
```

---

### 13. 获取对应角色部门树列表

**接口地址**: `GET /api/system/role/deptTree/:roleId`

**路径参数**:
- `roleId`: 角色ID

**响应示例**:
```json
{
  "code": 200,
  "msg": "操作成功",
  "checkedKeys": [100, 101],
  "depts": [
    {
      "deptId": 100,
      "deptName": "总公司",
      "parentId": 0,
      "orderNum": 0,
      "children": [
        {
          "deptId": 101,
          "deptName": "北京分公司",
          "parentId": 100,
          "orderNum": 1
        }
      ]
    }
  ]
}
```

**测试命令**:
```bash
curl -X GET "http://localhost:7001/api/system/role/deptTree/2" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 14. 导出角色

**接口地址**: `POST /api/system/role/export`

**请求参数**:
```json
{
  "roleName": "",
  "roleKey": "",
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
curl -X POST "http://localhost:7001/api/system/role/export" \
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
│   │       └── role.js          # 角色管理控制器（新增）
│   └── service/
│       └── system/
│           ├── login.js
│           ├── user.js
│           ├── role.js          # 角色服务（完善）
│           ├── dept.js          # 部门服务（完善）
│           └── post.js
└── mapper/
    └── mysql/
        └── ruoyi/
            ├── SysRoleMapper.xml
            ├── SysRoleMenuMapper.xml
            ├── SysRoleDeptMapper.xml
            └── SysUserRoleMapper.xml
```

### 2. 核心功能

#### 2.1 数据校验
- ✅ 角色名称唯一性校验
- ✅ 角色权限字符唯一性校验
- ✅ 超级管理员保护（不允许操作 roleId=1）
- ✅ 数据权限校验框架

#### 2.2 权限控制
- ✅ 角色数据权限校验
- ✅ 非管理员用户受数据权限限制

#### 2.3 关联数据处理
- ✅ 角色与菜单关联（增删改）
- ✅ 角色与部门关联（增删改）
- ✅ 角色与用户关联（授权/取消授权）
- ✅ 级联删除（删除角色时删除关联数据）

#### 2.4 数据权限
- ✅ 支持5种数据范围（全部、自定义、本部门、本部门及以下、仅本人）
- ✅ 自定义数据权限（角色与部门关联）

### 3. 待完善功能

#### 3.1 导出功能
- ⏳ Excel 文件生成导出

#### 3.2 数据权限
- ⏳ 完整的数据权限过滤逻辑
- ⏳ 基于角色的数据范围控制

### 4. 数据库表结构

本模块涉及以下数据表：
- `sys_role` - 角色表
- `sys_role_menu` - 角色菜单关联表
- `sys_role_dept` - 角色部门关联表
- `sys_user_role` - 用户角色关联表

### 5. 依赖服务

- `RoleService` - 角色服务
- `UserService` - 用户服务（用于用户授权）
- `DeptService` - 部门服务（用于部门树）

### 6. 业务逻辑还原

所有接口的业务逻辑均参考 RuoYi Spring Boot 版本实现，包括：
- 数据校验规则
- 权限控制逻辑
- 关联数据处理
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

# 2. 查询角色列表
curl -X GET "http://localhost:7001/api/system/role/list" \
  -H "Authorization: Bearer $TOKEN"

# 3. 新增角色
curl -X POST "http://localhost:7001/api/system/role" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "roleName": "测试角色",
    "roleKey": "test",
    "roleSort": 3,
    "status": "0",
    "menuIds": [1, 2, 3],
    "remark": "测试角色"
  }'

# 4. 查询角色详情
curl -X GET "http://localhost:7001/api/system/role/2" \
  -H "Authorization: Bearer $TOKEN"

# 5. 修改角色
curl -X PUT "http://localhost:7001/api/system/role" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "roleId": 2,
    "roleName": "测试角色（已修改）",
    "roleKey": "test",
    "roleSort": 3,
    "status": "0",
    "menuIds": [1, 2, 3, 4]
  }'

# 6. 修改状态
curl -X PUT "http://localhost:7001/api/system/role/changeStatus" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"roleId": 2, "status": "1"}'

# 7. 修改数据权限
curl -X PUT "http://localhost:7001/api/system/role/dataScope" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"roleId": 2, "dataScope": "2", "deptIds": [100, 101]}'

# 8. 查询已分配用户
curl -X GET "http://localhost:7001/api/system/role/allocatedList?roleId=2" \
  -H "Authorization: Bearer $TOKEN"

# 9. 查询未分配用户
curl -X GET "http://localhost:7001/api/system/role/unallocatedList?roleId=2" \
  -H "Authorization: Bearer $TOKEN"

# 10. 批量授权用户
curl -X PUT "http://localhost:7001/api/system/role/authUser/selectAll" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"roleId": 2, "userIds": [3, 4]}'

# 11. 批量取消授权
curl -X PUT "http://localhost:7001/api/system/role/authUser/cancelAll" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"roleId": 2, "userIds": [3, 4]}'

# 12. 查询角色部门树
curl -X GET "http://localhost:7001/api/system/role/deptTree/2" \
  -H "Authorization: Bearer $TOKEN"

# 13. 删除角色
curl -X DELETE "http://localhost:7001/api/system/role/2" \
  -H "Authorization: Bearer $TOKEN"
```

---

## 注意事项

1. **Token 认证**: 所有接口都需要在请求头中携带 `Authorization: Bearer {token}`
2. **管理员保护**: 不允许操作 roleId=1 的超级管理员角色
3. **数据权限**: 非管理员用户受数据权限限制
4. **关联数据**: 删除角色时会自动删除菜单、部门关联

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

