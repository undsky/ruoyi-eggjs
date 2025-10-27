# 权限控制使用指南

> **说明**: 本文档介绍如何在 ruoyi-eggjs 项目中使用权限控制装饰器

---

## 📋 目录

- [快速开始](#快速开始)
- [装饰器说明](#装饰器说明)
- [使用示例](#使用示例)
- [权限规则](#权限规则)
- [高级用法](#高级用法)
- [常见问题](#常见问题)

---

## 🚀 快速开始

### 1. 引入装饰器

```javascript
const { RequiresPermissions, RequiresRoles, RequiresAuth } = require('../decorator/permission');
const { Route, HttpGet, HttpPost, HttpPut, HttpDelete } = require('egg-decorator-router');
const Controller = require('egg').Controller;
```

### 2. 使用装饰器

```javascript
@Route('/api/system/user')
class UserController extends Controller {
  
  /**
   * 用户列表 - 需要 system:user:list 权限
   */
  @RequiresPermissions('system:user:list')
  @HttpGet('/list')
  async list() {
    const { ctx } = this;
    // ... 业务逻辑
  }
  
  /**
   * 新增用户 - 需要 system:user:add 权限
   */
  @RequiresPermissions('system:user:add')
  @HttpPost()
  async add() {
    const { ctx } = this;
    // ... 业务逻辑
  }
}
```

---

## 📖 装饰器说明

### 1. @RequiresPermissions

验证用户是否拥有指定权限。

#### 语法

```javascript
@RequiresPermissions(permissions, logical?)
```

#### 参数

| 参数 | 类型 | 必需 | 说明 | 默认值 |
|------|------|------|------|--------|
| permissions | string \| array | 是 | 权限字符串或数组 | - |
| logical | string | 否 | 逻辑类型：'AND' 或 'OR' | 'AND' |

#### 示例

```javascript
// 单个权限
@RequiresPermissions('system:user:list')

// 多个权限 - AND 逻辑（需要同时拥有所有权限）
@RequiresPermissions(['system:user:list', 'system:user:query'], 'AND')

// 多个权限 - OR 逻辑（拥有其中一个即可）
@RequiresPermissions(['system:user:list', 'system:user:query'], 'OR')
```

---

### 2. @RequiresRoles

验证用户是否拥有指定角色。

#### 语法

```javascript
@RequiresRoles(roles, logical?)
```

#### 参数

| 参数 | 类型 | 必需 | 说明 | 默认值 |
|------|------|------|------|--------|
| roles | string \| array | 是 | 角色字符串或数组 | - |
| logical | string | 否 | 逻辑类型：'AND' 或 'OR' | 'AND' |

#### 示例

```javascript
// 单个角色
@RequiresRoles('admin')

// 多个角色 - AND 逻辑（需要同时拥有所有角色）
@RequiresRoles(['admin', 'editor'], 'AND')

// 多个角色 - OR 逻辑（拥有其中一个即可）
@RequiresRoles(['admin', 'editor'], 'OR')
```

---

### 3. @RequiresAuth

组合验证角色和权限。

#### 语法

```javascript
@RequiresAuth(options)
```

#### 参数

| 参数 | 类型 | 必需 | 说明 |
|------|------|------|------|
| options | object | 是 | 配置对象 |
| options.roles | string \| array | 否 | 角色 |
| options.permissions | string \| array | 否 | 权限 |
| options.logical | string | 否 | 逻辑类型 |

#### 示例

```javascript
// 同时验证角色和权限
@RequiresAuth({
  roles: 'admin',
  permissions: 'system:user:edit'
})

// 复杂验证
@RequiresAuth({
  roles: ['admin', 'editor'],
  permissions: ['system:user:list', 'system:user:query'],
  logical: 'OR'
})
```

---

## 💡 使用示例

### 示例 1: 用户管理 Controller

```javascript
const Controller = require('egg').Controller;
const { Route, HttpGet, HttpPost, HttpPut, HttpDelete } = require('egg-decorator-router');
const { RequiresPermissions } = require('../decorator/permission');

module.exports = app => {

  @Route('/api/system/user')
  class UserController extends Controller {

    /**
     * 用户列表
     * 权限: system:user:list
     */
    @RequiresPermissions('system:user:list')
    @HttpGet('/list')
    async list() {
      const { ctx, service } = this;
      
      try {
        const query = ctx.query;
        const pageNum = parseInt(query.pageNum) || 1;
        const pageSize = parseInt(query.pageSize) || 10;
        
        const list = await service.system.user.selectUserList(
          { pageNum, pageSize },
          query
        );
        
        const total = await service.system.user.selectUserCount(query);
        
        ctx.body = {
          code: 200,
          msg: '查询成功',
          rows: list,
          total
        };
      } catch (err) {
        ctx.logger.error('查询用户列表失败:', err);
        ctx.body = {
          code: 500,
          msg: err.message || '查询失败'
        };
      }
    }

    /**
     * 新增用户
     * 权限: system:user:add
     */
    @RequiresPermissions('system:user:add')
    @HttpPost()
    async add() {
      const { ctx, service } = this;
      
      try {
        const user = ctx.request.body;
        const result = await service.system.user.insertUser(user);
        
        ctx.body = {
          code: 200,
          msg: '新增成功'
        };
      } catch (err) {
        ctx.logger.error('新增用户失败:', err);
        ctx.body = {
          code: 500,
          msg: err.message || '新增失败'
        };
      }
    }

    /**
     * 修改用户
     * 权限: system:user:edit
     */
    @RequiresPermissions('system:user:edit')
    @HttpPut()
    async edit() {
      const { ctx, service } = this;
      
      try {
        const user = ctx.request.body;
        const result = await service.system.user.updateUser(user);
        
        ctx.body = {
          code: 200,
          msg: '修改成功'
        };
      } catch (err) {
        ctx.logger.error('修改用户失败:', err);
        ctx.body = {
          code: 500,
          msg: err.message || '修改失败'
        };
      }
    }

    /**
     * 删除用户
     * 权限: system:user:remove
     */
    @RequiresPermissions('system:user:remove')
    @HttpDelete('/:userIds')
    async remove() {
      const { ctx, service } = this;
      
      try {
        const userIds = ctx.params.userIds.split(',').map(id => parseInt(id));
        const result = await service.system.user.deleteUserByIds(userIds);
        
        ctx.body = {
          code: 200,
          msg: '删除成功'
        };
      } catch (err) {
        ctx.logger.error('删除用户失败:', err);
        ctx.body = {
          code: 500,
          msg: err.message || '删除失败'
        };
      }
    }

    /**
     * 导出用户
     * 权限: system:user:export
     */
    @RequiresPermissions('system:user:export')
    @HttpPost('/export')
    async export() {
      const { ctx, service } = this;
      
      try {
        const params = ctx.request.body;
        const list = await service.system.user.selectUserList(
          { pageNum: 1, pageSize: 100000 },
          params
        );
        
        const buffer = await service.system.user.exportUser(list);
        
        ctx.set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        ctx.set('Content-Disposition', `attachment; filename=user_${Date.now()}.xlsx`);
        
        ctx.body = buffer;
      } catch (err) {
        ctx.logger.error('导出用户失败:', err);
        ctx.body = {
          code: 500,
          msg: err.message || '导出失败'
        };
      }
    }
  }

  return UserController;
};
```

---

### 示例 2: 角色管理 Controller

```javascript
const Controller = require('egg').Controller;
const { Route, HttpGet, HttpPost, HttpPut, HttpDelete } = require('egg-decorator-router');
const { RequiresPermissions, RequiresRoles } = require('../decorator/permission');

module.exports = app => {

  @Route('/api/system/role')
  class RoleController extends Controller {

    /**
     * 角色列表
     * 权限: system:role:list
     */
    @RequiresPermissions('system:role:list')
    @HttpGet('/list')
    async list() {
      // ... 实现
    }

    /**
     * 数据权限保存
     * 权限: system:role:edit
     * 角色: admin (只有管理员可以修改数据权限)
     */
    @RequiresRoles('admin')
    @RequiresPermissions('system:role:edit')
    @HttpPut('/dataScope')
    async dataScope() {
      // ... 实现
    }

    /**
     * 删除角色
     * 权限: system:role:remove
     */
    @RequiresPermissions('system:role:remove')
    @HttpDelete('/:roleIds')
    async remove() {
      // ... 实现
    }
  }

  return RoleController;
};
```

---

### 示例 3: 多权限验证

```javascript
/**
 * 方式 1: 使用多个装饰器
 */
@RequiresRoles('admin')
@RequiresPermissions('system:user:edit')
@HttpPut()
async edit() {
  // 需要同时拥有 admin 角色和 system:user:edit 权限
}

/**
 * 方式 2: 使用 RequiresAuth 装饰器
 */
@RequiresAuth({
  roles: 'admin',
  permissions: 'system:user:edit'
})
@HttpPut()
async edit() {
  // 需要同时拥有 admin 角色和 system:user:edit 权限
}

/**
 * 方式 3: OR 逻辑
 */
@RequiresPermissions(['system:user:edit', 'system:user:add'], 'OR')
@HttpPut()
async edit() {
  // 拥有 system:user:edit 或 system:user:add 权限即可
}
```

---

## 🔐 权限规则

### 权限格式

权限采用三段式格式：`模块:功能:操作`

```
system:user:list      # 系统管理 - 用户 - 列表
system:user:add       # 系统管理 - 用户 - 新增
system:user:edit      # 系统管理 - 用户 - 修改
system:user:remove    # 系统管理 - 用户 - 删除
system:user:export    # 系统管理 - 用户 - 导出
system:user:import    # 系统管理 - 用户 - 导入
```

### 通配符权限

支持使用 `*` 作为通配符：

```javascript
*:*:*                 // 所有权限（超级管理员）
system:*:*            // 系统管理模块所有权限
system:user:*         // 用户管理所有权限
```

### 权限匹配规则

1. **精确匹配**: `system:user:list` 匹配 `system:user:list`
2. **通配符匹配**: `system:user:*` 匹配 `system:user:list`、`system:user:add` 等
3. **超级权限**: `*:*:*` 匹配所有权限

---

## 🎯 高级用法

### 1. 动态权限验证

```javascript
async checkDynamicPermission() {
  const { ctx } = this;
  const { getUserPermissions, checkPermissions } = require('../decorator/permission');
  
  // 获取用户权限
  const permissions = await getUserPermissions(ctx);
  
  // 动态验证
  const hasPermission = checkPermissions(permissions, 'system:user:edit', 'AND');
  
  if (!hasPermission) {
    ctx.body = {
      code: 403,
      msg: '没有权限'
    };
    return;
  }
  
  // 继续执行
}
```

### 2. 自定义权限验证

```javascript
const { getUserPermissions } = require('../decorator/permission');

async customCheck() {
  const { ctx } = this;
  
  // 获取用户权限
  const permissions = await getUserPermissions(ctx);
  
  // 自定义逻辑
  const canEdit = permissions.includes('system:user:edit');
  const canAdd = permissions.includes('system:user:add');
  
  if (!canEdit && !canAdd) {
    ctx.body = {
      code: 403,
      msg: '没有权限'
    };
    return;
  }
  
  // 继续执行
}
```

### 3. 权限缓存

权限和角色会自动缓存 10 分钟，减少数据库查询。

```javascript
// 缓存键格式
user:permissions:${userId}   // 用户权限缓存
user:roles:${userId}         // 用户角色缓存
```

如需手动清除缓存：

```javascript
async clearPermissionCache(userId) {
  await this.app.cache.default.del(`user:permissions:${userId}`);
  await this.app.cache.default.del(`user:roles:${userId}`);
}
```

---

## 🔧 配置

### 1. 启用权限中间件（可选）

在 `config/config.default.js` 中配置：

```javascript
// 权限中间件配置（如果需要全局拦截）
config.middleware = [
  // ... 其他中间件
  'permission'
];

config.permission = {
  enable: true,
  skipRoutes: [
    '/api/login',
    '/api/logout',
    '/api/register',
    '/api/captchaImage'
  ]
};
```

### 2. 权限缓存配置

在 `config/config.default.js` 中配置缓存时间：

```javascript
config.cache = {
  default: 'redis',
  ttl: 600,  // 默认缓存时间 10 分钟
  // ... 其他配置
};
```

---

## ❓ 常见问题

### Q1: 装饰器不生效？

**A**: 确保装饰器在 HTTP 方法装饰器之前：

```javascript
// ✅ 正确
@RequiresPermissions('system:user:list')
@HttpGet('/list')
async list() {}

// ❌ 错误
@HttpGet('/list')
@RequiresPermissions('system:user:list')
async list() {}
```

### Q2: 如何处理没有权限的情况？

**A**: 装饰器会自动返回 403 状态码和错误信息：

```json
{
  "code": 403,
  "msg": "没有权限，请联系管理员授权"
}
```

### Q3: 如何给用户分配权限？

**A**: 通过角色管理模块分配：

1. 创建角色并分配菜单权限
2. 给用户分配角色
3. 用户登录后自动获取权限

### Q4: 超级管理员如何设置？

**A**: 给用户分配 `*:*:*` 权限即可：

```javascript
// 在数据库中设置
INSERT INTO sys_role_menu (role_id, menu_id, perms) 
VALUES (1, 0, '*:*:*');
```

### Q5: 如何调试权限问题？

**A**: 可以查看日志或手动获取权限：

```javascript
const { getUserPermissions, getUserRoles } = require('../decorator/permission');

// 查看用户权限
const permissions = await getUserPermissions(ctx);
console.log('用户权限:', permissions);

// 查看用户角色
const roles = await getUserRoles(ctx);
console.log('用户角色:', roles);
```

---

## 📊 权限对照表

### 系统管理模块

| 功能 | 权限标识 | 说明 |
|------|---------|------|
| 用户列表 | system:user:list | 查看用户列表 |
| 用户详情 | system:user:query | 查看用户详情 |
| 新增用户 | system:user:add | 新增用户 |
| 修改用户 | system:user:edit | 修改用户 |
| 删除用户 | system:user:remove | 删除用户 |
| 导出用户 | system:user:export | 导出用户数据 |
| 导入用户 | system:user:import | 导入用户数据 |
| 重置密码 | system:user:resetPwd | 重置用户密码 |
| 角色列表 | system:role:list | 查看角色列表 |
| 角色详情 | system:role:query | 查看角色详情 |
| 新增角色 | system:role:add | 新增角色 |
| 修改角色 | system:role:edit | 修改角色 |
| 删除角色 | system:role:remove | 删除角色 |
| 菜单列表 | system:menu:list | 查看菜单列表 |
| 部门列表 | system:dept:list | 查看部门列表 |
| 岗位列表 | system:post:list | 查看岗位列表 |

### 系统监控模块

| 功能 | 权限标识 | 说明 |
|------|---------|------|
| 在线用户 | monitor:online:list | 查看在线用户 |
| 强退用户 | monitor:online:forceLogout | 强制用户退出 |
| 登录日志 | monitor:logininfor:list | 查看登录日志 |
| 操作日志 | monitor:operlog:list | 查看操作日志 |
| 服务监控 | monitor:server:list | 查看服务器信息 |
| 缓存监控 | monitor:cache:list | 查看缓存信息 |
| 定时任务 | monitor:job:list | 查看定时任务 |

---

## 🎉 最佳实践

### 1. 权限粒度

- ✅ 推荐：按功能划分权限（list、add、edit、remove、export）
- ❌ 不推荐：权限过于细化或过于粗糙

### 2. 命名规范

```
模块:功能:操作

示例:
system:user:list
system:role:edit
monitor:online:forceLogout
```

### 3. 角色设计

- **超级管理员**: `*:*:*`
- **系统管理员**: `system:*:*`
- **普通用户**: 具体权限列表

### 4. 安全建议

- 定期审查权限分配
- 最小权限原则
- 敏感操作需要管理员角色
- 定期更新权限缓存

---

## 📚 相关文档

- [API 接口映射文档](./API_MAPPING.md)
- [API 审计报告](./API_AUDIT_REPORT.md)
- [项目 README](../README.md)

---

**文档版本**: v1.0  
**更新日期**: 2025-10-27  
**维护者**: ruoyi-eggjs 团队

