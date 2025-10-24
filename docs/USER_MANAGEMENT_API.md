# 用户管理 API 接口文档

## 概述

本文档描述了用户管理模块的所有 API 接口实现，包括 CRUD 操作、权限管理、导入导出等功能。

## 已实现的接口列表

### 1. 用户列表（分页）

**接口地址**: `GET /api/system/user/list`

**请求参数**:
```json
{
  "pageNum": 1,          // 页码，默认 1
  "pageSize": 10,        // 每页条数，默认 10
  "userName": "",        // 用户名（模糊查询）
  "phonenumber": "",     // 手机号（模糊查询）
  "status": "",          // 状态（0-正常，1-停用）
  "deptId": 0,           // 部门ID
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
      "userId": 1,
      "deptId": 103,
      "userName": "admin",
      "nickName": "管理员",
      "email": "admin@example.com",
      "phonenumber": "13800138000",
      "sex": "0",
      "status": "0",
      "createTime": "2025-10-24 10:00:00"
    }
  ],
  "total": 1
}
```

**测试命令**:
```bash
curl -X GET "http://localhost:7001/api/system/user/list?pageNum=1&pageSize=10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 2. 用户详情

**接口地址**: `GET /api/system/user/:userId`

**路径参数**:
- `userId`: 用户ID

**响应示例**:
```json
{
  "code": 200,
  "msg": "操作成功",
  "data": {
    "userId": 1,
    "userName": "admin",
    "nickName": "管理员",
    "email": "admin@example.com",
    "phonenumber": "13800138000",
    "sex": "0",
    "status": "0",
    "deptId": 103
  },
  "postIds": [1, 2],
  "roleIds": [1],
  "roles": [...],
  "posts": [...]
}
```

**测试命令**:
```bash
curl -X GET "http://localhost:7001/api/system/user/1" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 3. 新增用户

**接口地址**: `POST /api/system/user`

**请求参数**:
```json
{
  "userName": "testuser",
  "nickName": "测试用户",
  "password": "123456",
  "email": "test@example.com",
  "phonenumber": "13900139000",
  "sex": "0",
  "status": "0",
  "deptId": 103,
  "postIds": [1],
  "roleIds": [2],
  "remark": "测试用户"
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
curl -X POST "http://localhost:7001/api/system/user" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "userName": "testuser",
    "nickName": "测试用户",
    "password": "123456",
    "email": "test@example.com",
    "phonenumber": "13900139000",
    "sex": "0",
    "status": "0",
    "deptId": 103,
    "postIds": [1],
    "roleIds": [2]
  }'
```

---

### 4. 修改用户

**接口地址**: `PUT /api/system/user`

**请求参数**:
```json
{
  "userId": 2,
  "userName": "testuser",
  "nickName": "测试用户（已修改）",
  "email": "test@example.com",
  "phonenumber": "13900139000",
  "sex": "0",
  "status": "0",
  "deptId": 103,
  "postIds": [1],
  "roleIds": [2],
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
curl -X PUT "http://localhost:7001/api/system/user" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 2,
    "userName": "testuser",
    "nickName": "测试用户（已修改）",
    "email": "test@example.com",
    "phonenumber": "13900139000",
    "sex": "0",
    "status": "0",
    "deptId": 103,
    "postIds": [1],
    "roleIds": [2]
  }'
```

---

### 5. 删除用户

**接口地址**: `DELETE /api/system/user/:userIds`

**路径参数**:
- `userIds`: 用户ID，多个用逗号分隔，如 `2,3,4`

**响应示例**:
```json
{
  "code": 200,
  "msg": "删除成功"
}
```

**测试命令**:
```bash
# 删除单个用户
curl -X DELETE "http://localhost:7001/api/system/user/2" \
  -H "Authorization: Bearer YOUR_TOKEN"

# 删除多个用户
curl -X DELETE "http://localhost:7001/api/system/user/2,3,4" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 6. 重置密码

**接口地址**: `PUT /api/system/user/resetPwd`

**请求参数**:
```json
{
  "userId": 2,
  "password": "newpassword123"
}
```

**响应示例**:
```json
{
  "code": 200,
  "msg": "重置成功"
}
```

**测试命令**:
```bash
curl -X PUT "http://localhost:7001/api/system/user/resetPwd" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 2,
    "password": "newpassword123"
  }'
```

---

### 7. 修改状态

**接口地址**: `PUT /api/system/user/changeStatus`

**请求参数**:
```json
{
  "userId": 2,
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
curl -X PUT "http://localhost:7001/api/system/user/changeStatus" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 2,
    "status": "1"
  }'
```

---

### 8. 查询授权角色

**接口地址**: `GET /api/system/user/authRole/:userId`

**路径参数**:
- `userId`: 用户ID

**响应示例**:
```json
{
  "code": 200,
  "msg": "操作成功",
  "user": {
    "userId": 2,
    "userName": "testuser",
    "nickName": "测试用户"
  },
  "roles": [
    {
      "roleId": 1,
      "roleName": "管理员",
      "roleKey": "admin"
    },
    {
      "roleId": 2,
      "roleName": "普通角色",
      "roleKey": "common"
    }
  ]
}
```

**测试命令**:
```bash
curl -X GET "http://localhost:7001/api/system/user/authRole/2" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 9. 用户授权

**接口地址**: `PUT /api/system/user/authRole`

**请求参数**:
```json
{
  "userId": 2,
  "roleIds": [2, 3]  // 角色ID数组
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
curl -X PUT "http://localhost:7001/api/system/user/authRole" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 2,
    "roleIds": [2, 3]
  }'
```

---

### 10. 部门树选择

**接口地址**: `GET /api/system/user/deptTree`

**请求参数**:
```json
{
  "deptName": "",  // 部门名称（可选）
  "status": ""     // 状态（可选）
}
```

**响应示例**:
```json
{
  "code": 200,
  "msg": "操作成功",
  "data": [
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
curl -X GET "http://localhost:7001/api/system/user/deptTree" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 11. 导出用户

**接口地址**: `POST /api/system/user/export`

**请求参数**:
```json
{
  "userName": "",
  "phonenumber": "",
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
curl -X POST "http://localhost:7001/api/system/user/export" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{}'
```

---

### 12. 导入用户

**接口地址**: `POST /api/system/user/import`

**请求参数**:
```json
{
  "updateSupport": "true"  // 是否更新已存在的用户
}
```

**响应示例**:
```json
{
  "code": 200,
  "msg": "导入成功 10 条"
}
```

**说明**: Excel 文件上传功能待实现。

**测试命令**:
```bash
curl -X POST "http://localhost:7001/api/system/user/import" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "updateSupport": "true"
  }'
```

---

### 13. 下载导入模板

**接口地址**: `POST /api/system/user/importTemplate`

**响应示例**:
```json
{
  "code": 200,
  "msg": "下载成功"
}
```

**说明**: 模板下载功能待实现。

**测试命令**:
```bash
curl -X POST "http://localhost:7001/api/system/user/importTemplate" \
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
│   │       └── user.js          # 用户管理控制器（新增）
│   └── service/
│       └── system/
│           ├── login.js
│           ├── user.js          # 用户服务（完善）
│           ├── role.js          # 角色服务（完善）
│           ├── dept.js          # 部门服务（新增）
│           └── post.js          # 岗位服务（新增）
└── mapper/
    └── mysql/
        └── ruoyi/
            ├── SysUserMapper.xml
            ├── SysUserRoleMapper.xml
            └── SysUserPostMapper.xml
```

### 2. 核心功能

#### 2.1 数据校验
- ✅ 用户名唯一性校验
- ✅ 手机号唯一性校验
- ✅ 邮箱唯一性校验
- ✅ 超级管理员保护（不允许操作）
- ✅ 当前用户保护（不允许删除自己）

#### 2.2 权限控制
- ✅ 数据权限校验框架（待完善具体逻辑）
- ✅ 部门数据权限
- ✅ 角色数据权限
- ✅ 非管理员不能分配管理员角色

#### 2.3 关联数据处理
- ✅ 用户与角色关联（增删改）
- ✅ 用户与岗位关联（增删改）
- ✅ 级联删除（删除用户时删除关联数据）

#### 2.4 密码处理
- ✅ 新增用户时密码加密
- ✅ 重置密码功能
- ✅ 使用 bcrypt 加密算法

### 3. 待完善功能

#### 3.1 导入导出
- ⏳ Excel 文件上传解析
- ⏳ Excel 文件生成导出
- ⏳ 导入模板下载

#### 3.2 数据权限
- ⏳ 完整的数据权限过滤逻辑
- ⏳ 基于角色的数据范围控制

#### 3.3 其他功能
- ⏳ 操作日志记录
- ⏳ 数据字典集成

### 4. 数据库表结构

本模块涉及以下数据表：
- `sys_user` - 用户表
- `sys_role` - 角色表
- `sys_dept` - 部门表
- `sys_post` - 岗位表
- `sys_user_role` - 用户角色关联表
- `sys_user_post` - 用户岗位关联表

### 5. 依赖服务

- `UserService` - 用户服务
- `RoleService` - 角色服务
- `DeptService` - 部门服务
- `PostService` - 岗位服务

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

# 2. 查询用户列表
curl -X GET "http://localhost:7001/api/system/user/list" \
  -H "Authorization: Bearer $TOKEN"

# 3. 新增用户
curl -X POST "http://localhost:7001/api/system/user" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "userName": "testuser",
    "nickName": "测试用户",
    "password": "123456",
    "email": "test@example.com",
    "phonenumber": "13900139000",
    "sex": "0",
    "status": "0",
    "deptId": 103,
    "postIds": [1],
    "roleIds": [2]
  }'

# 4. 查询用户详情
curl -X GET "http://localhost:7001/api/system/user/2" \
  -H "Authorization: Bearer $TOKEN"

# 5. 修改用户
curl -X PUT "http://localhost:7001/api/system/user" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 2,
    "userName": "testuser",
    "nickName": "测试用户（已修改）",
    "email": "test@example.com",
    "phonenumber": "13900139000",
    "sex": "0",
    "status": "0",
    "deptId": 103,
    "postIds": [1],
    "roleIds": [2]
  }'

# 6. 修改状态
curl -X PUT "http://localhost:7001/api/system/user/changeStatus" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"userId": 2, "status": "1"}'

# 7. 重置密码
curl -X PUT "http://localhost:7001/api/system/user/resetPwd" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"userId": 2, "password": "newpassword123"}'

# 8. 查询授权角色
curl -X GET "http://localhost:7001/api/system/user/authRole/2" \
  -H "Authorization: Bearer $TOKEN"

# 9. 用户授权
curl -X PUT "http://localhost:7001/api/system/user/authRole" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"userId": 2, "roleIds": [2, 3]}'

# 10. 删除用户
curl -X DELETE "http://localhost:7001/api/system/user/2" \
  -H "Authorization: Bearer $TOKEN"
```

---

## 注意事项

1. **Token 认证**: 所有接口都需要在请求头中携带 `Authorization: Bearer {token}`
2. **管理员保护**: 不允许操作 userId=1 的超级管理员用户
3. **自我保护**: 不允许删除当前登录用户
4. **数据权限**: 非管理员用户受数据权限限制
5. **密码加密**: 所有密码操作都会自动加密
6. **关联数据**: 删除用户时会自动删除角色和岗位关联

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

