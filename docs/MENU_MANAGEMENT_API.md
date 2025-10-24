# 菜单管理 API 接口文档

## 概述

本文档描述了菜单管理模块的所有 API 接口实现，包括 CRUD 操作、树形结构构建、菜单选择等功能。

## 已实现的接口列表

### 1. 菜单列表（树形）

**接口地址**: `GET /api/system/menu/list`

**请求参数**:
```json
{
  "menuName": "",       // 菜单名称（模糊查询）
  "visible": "",        // 菜单状态（0-显示，1-隐藏）
  "status": ""          // 菜单状态（0-正常，1-停用）
}
```

**响应示例**:
```json
{
  "code": 200,
  "msg": "查询成功",
  "data": [
    {
      "menuId": 1,
      "menuName": "系统管理",
      "parentId": 0,
      "orderNum": 1,
      "path": "system",
      "component": null,
      "menuType": "M",
      "visible": "0",
      "status": "0",
      "perms": null,
      "icon": "system",
      "createTime": "2025-10-24 10:00:00"
    }
  ]
}
```

**测试命令**:
```bash
curl -X GET "http://localhost:7001/api/system/menu/list" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 2. 菜单详情

**接口地址**: `GET /api/system/menu/:menuId`

**路径参数**:
- `menuId`: 菜单ID

**响应示例**:
```json
{
  "code": 200,
  "msg": "操作成功",
  "data": {
    "menuId": 1,
    "menuName": "系统管理",
    "parentId": 0,
    "orderNum": 1,
    "path": "system",
    "component": null,
    "query": null,
    "routeName": null,
    "isFrame": "1",
    "isCache": "0",
    "menuType": "M",
    "visible": "0",
    "status": "0",
    "perms": null,
    "icon": "system",
    "remark": "系统管理目录"
  }
}
```

**测试命令**:
```bash
curl -X GET "http://localhost:7001/api/system/menu/1" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 3. 新增菜单

**接口地址**: `POST /api/system/menu`

**请求参数**:
```json
{
  "menuName": "测试菜单",
  "parentId": 0,
  "orderNum": 1,
  "path": "test",
  "component": "test/index",
  "query": "",
  "routeName": "",
  "isFrame": "1",
  "isCache": "0",
  "menuType": "C",
  "visible": "0",
  "status": "0",
  "perms": "system:test:list",
  "icon": "test",
  "remark": "测试菜单"
}
```

**字段说明**:
- `menuType`: 菜单类型（M-目录，C-菜单，F-按钮）
- `isFrame`: 是否外链（0-是，1-否）
- `isCache`: 是否缓存（0-缓存，1-不缓存）
- `visible`: 显示状态（0-显示，1-隐藏）
- `status`: 菜单状态（0-正常，1-停用）

**响应示例**:
```json
{
  "code": 200,
  "msg": "新增成功"
}
```

**测试命令**:
```bash
curl -X POST "http://localhost:7001/api/system/menu" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "menuName": "测试菜单",
    "parentId": 0,
    "orderNum": 1,
    "path": "test",
    "component": "test/index",
    "isFrame": "1",
    "isCache": "0",
    "menuType": "C",
    "visible": "0",
    "status": "0",
    "perms": "system:test:list",
    "icon": "test"
  }'
```

---

### 4. 修改菜单

**接口地址**: `PUT /api/system/menu`

**请求参数**:
```json
{
  "menuId": 100,
  "menuName": "测试菜单（已修改）",
  "parentId": 0,
  "orderNum": 1,
  "path": "test",
  "component": "test/index",
  "isFrame": "1",
  "isCache": "0",
  "menuType": "C",
  "visible": "0",
  "status": "0",
  "perms": "system:test:list",
  "icon": "test",
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
curl -X PUT "http://localhost:7001/api/system/menu" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "menuId": 100,
    "menuName": "测试菜单（已修改）",
    "parentId": 0,
    "orderNum": 1,
    "path": "test",
    "component": "test/index",
    "isFrame": "1",
    "isCache": "0",
    "menuType": "C",
    "visible": "0",
    "status": "0",
    "perms": "system:test:list",
    "icon": "test"
  }'
```

---

### 5. 删除菜单

**接口地址**: `DELETE /api/system/menu/:menuId`

**路径参数**:
- `menuId`: 菜单ID

**响应示例**:
```json
{
  "code": 200,
  "msg": "删除成功"
}
```

**特殊情况**:
- 存在子菜单时不允许删除
- 菜单已分配给角色时不允许删除

**测试命令**:
```bash
curl -X DELETE "http://localhost:7001/api/system/menu/100" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 6. 菜单下拉树列表

**接口地址**: `GET /api/system/menu/treeselect`

**请求参数**:
```json
{
  "menuName": "",
  "visible": "",
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
      "id": 1,
      "label": "系统管理",
      "children": [
        {
          "id": 100,
          "label": "用户管理"
        },
        {
          "id": 101,
          "label": "角色管理"
        }
      ]
    }
  ]
}
```

**测试命令**:
```bash
curl -X GET "http://localhost:7001/api/system/menu/treeselect" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 7. 加载对应角色菜单列表树

**接口地址**: `GET /api/system/menu/roleMenuTreeselect/:roleId`

**路径参数**:
- `roleId`: 角色ID

**响应示例**:
```json
{
  "code": 200,
  "msg": "操作成功",
  "checkedKeys": [1, 100, 101, 1000, 1001],
  "menus": [
    {
      "id": 1,
      "label": "系统管理",
      "children": [
        {
          "id": 100,
          "label": "用户管理"
        }
      ]
    }
  ]
}
```

**字段说明**:
- `checkedKeys`: 角色已分配的菜单ID列表
- `menus`: 所有菜单树形结构

**测试命令**:
```bash
curl -X GET "http://localhost:7001/api/system/menu/roleMenuTreeselect/2" \
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
│   │       └── menu.js          # 菜单管理控制器（新增）
│   └── service/
│       └── system/
│           ├── login.js
│           ├── user.js
│           ├── role.js
│           ├── dept.js
│           ├── post.js
│           └── menu.js          # 菜单服务（完善）
└── mapper/
    └── mysql/
        └── ruoyi/
            ├── SysMenuMapper.xml
            └── SysRoleMenuMapper.xml
```

### 2. 核心功能

#### 2.1 数据校验
- ✅ 菜单名称唯一性校验（同一父菜单下）
- ✅ 外链地址格式校验（http(s)://）
- ✅ 上级菜单循环引用校验
- ✅ 子菜单存在性检查
- ✅ 菜单角色关联检查

#### 2.2 树形结构
- ✅ 菜单树构建（管理界面）
- ✅ 路由菜单树构建（前端路由）
- ✅ 树形选择结构（下拉选择）
- ✅ 角色菜单树（角色分配）
- ✅ 递归查找子菜单

#### 2.3 权限控制
- ✅ 管理员显示所有菜单
- ✅ 普通用户显示有权限的菜单
- ✅ 根据用户ID查询菜单
- ✅ 根据角色ID查询菜单

### 3. 菜单类型说明

| 类型 | 代码 | 说明 | 特点 |
|------|------|------|------|
| 目录 | M | 菜单目录 | 不可点击，只作为父节点 |
| 菜单 | C | 菜单项 | 可点击，对应一个页面 |
| 按钮 | F | 按钮 | 页面内的操作按钮，不显示在菜单栏 |

### 4. 外链菜单

当 `isFrame = 0` 时，表示外链菜单，此时：
- `path` 必须以 `http://` 或 `https://` 开头
- 点击菜单会打开外部链接

### 5. 数据库表结构

本模块涉及以下数据表：
- `sys_menu` - 菜单表
- `sys_role_menu` - 角色菜单关联表

### 6. 业务逻辑还原

所有接口的业务逻辑均参考 RuoYi Spring Boot 版本实现，包括：
- 数据校验规则
- 权限控制逻辑
- 树形结构构建
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

# 2. 查询菜单列表
curl -X GET "http://localhost:7001/api/system/menu/list" \
  -H "Authorization: Bearer $TOKEN"

# 3. 新增菜单
curl -X POST "http://localhost:7001/api/system/menu" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "menuName": "测试菜单",
    "parentId": 0,
    "orderNum": 1,
    "path": "test",
    "component": "test/index",
    "isFrame": "1",
    "isCache": "0",
    "menuType": "C",
    "visible": "0",
    "status": "0",
    "perms": "system:test:list",
    "icon": "test"
  }'

# 4. 查询菜单详情
curl -X GET "http://localhost:7001/api/system/menu/1" \
  -H "Authorization: Bearer $TOKEN"

# 5. 修改菜单
curl -X PUT "http://localhost:7001/api/system/menu" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "menuId": 100,
    "menuName": "测试菜单（已修改）",
    "parentId": 0,
    "orderNum": 1,
    "path": "test",
    "component": "test/index",
    "isFrame": "1",
    "isCache": "0",
    "menuType": "C",
    "visible": "0",
    "status": "0",
    "perms": "system:test:list",
    "icon": "test"
  }'

# 6. 查询菜单树选择
curl -X GET "http://localhost:7001/api/system/menu/treeselect" \
  -H "Authorization: Bearer $TOKEN"

# 7. 查询角色菜单树
curl -X GET "http://localhost:7001/api/system/menu/roleMenuTreeselect/2" \
  -H "Authorization: Bearer $TOKEN"

# 8. 删除菜单
curl -X DELETE "http://localhost:7001/api/system/menu/100" \
  -H "Authorization: Bearer $TOKEN"
```

---

## 注意事项

1. **Token 认证**: 所有接口都需要在请求头中携带 `Authorization: Bearer {token}`
2. **树形结构**: 菜单以树形结构展示，需要正确设置 `parentId`
3. **删除限制**: 
   - 存在子菜单时不允许删除
   - 菜单已分配给角色时不允许删除
4. **外链菜单**: `isFrame=0` 时，`path` 必须以 http(s):// 开头
5. **菜单类型**: M-目录、C-菜单、F-按钮

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

