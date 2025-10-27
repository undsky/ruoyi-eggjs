# 权限控制使用示例

> 本文档提供权限控制的实际使用示例

---

## 基础示例

### 示例 1: 单个权限验证

```javascript
const Controller = require('egg').Controller;
const { Route, HttpGet } = require('egg-decorator-router');
const { RequiresPermissions } = require('../../decorator/permission');

module.exports = app => {
  @Route('/api/system/user')
  class UserController extends Controller {
    
    /**
     * 用户列表
     * 需要权限：system:user:list
     */
    @RequiresPermissions('system:user:list')
    @HttpGet('/list')
    async list() {
      const { ctx, service } = this;
      const list = await service.system.user.selectUserList(ctx.query);
      ctx.body = { code: 200, data: list };
    }
  }
  
  return UserController;
};
```

### 示例 2: 多个权限（AND 逻辑）

```javascript
/**
 * 修改用户
 * 需要同时拥有 edit 和 query 权限
 */
@RequiresPermissions(['system:user:edit', 'system:user:query'], 'AND')
@HttpPut()
async edit() {
  const { ctx, service } = this;
  const user = ctx.request.body;
  await service.system.user.updateUser(user);
  ctx.body = { code: 200, msg: '修改成功' };
}
```

### 示例 3: 多个权限（OR 逻辑）

```javascript
/**
 * 查看用户详情
 * 拥有 list 或 query 权限即可
 */
@RequiresPermissions(['system:user:list', 'system:user:query'], 'OR')
@HttpGet('/:userId')
async getInfo() {
  const { ctx, service } = this;
  const userId = ctx.params.userId;
  const user = await service.system.user.selectUserById(userId);
  ctx.body = { code: 200, data: user };
}
```

### 示例 4: 角色验证

```javascript
const { RequiresRoles } = require('../../decorator/permission');

/**
 * 删除用户
 * 只有 admin 角色可以删除
 */
@RequiresRoles('admin')
@HttpDelete('/:userIds')
async remove() {
  const { ctx, service } = this;
  const userIds = ctx.params.userIds.split(',');
  await service.system.user.deleteUserByIds(userIds);
  ctx.body = { code: 200, msg: '删除成功' };
}
```

### 示例 5: 组合验证（角色+权限）

```javascript
const { RequiresAuth } = require('../../decorator/permission');

/**
 * 修改数据权限
 * 需要 admin 角色 + system:role:edit 权限
 */
@RequiresAuth({
  roles: 'admin',
  permissions: 'system:role:edit'
})
@HttpPut('/dataScope')
async dataScope() {
  const { ctx, service } = this;
  const role = ctx.request.body;
  await service.system.role.authDataScope(role);
  ctx.body = { code: 200, msg: '修改成功' };
}
```

---

## 完整 Controller 示例

```javascript
/*
 * @Description: 用户管理控制器
 * @Author: Your Name
 * @Date: 2025-10-27
 */

const Controller = require('egg').Controller;
const { Route, HttpGet, HttpPost, HttpPut, HttpDelete } = require('egg-decorator-router');
const { RequiresPermissions, RequiresRoles } = require('../../decorator/permission');

module.exports = app => {

  @Route('/api/system/user')
  class UserController extends Controller {

    /**
     * 用户列表
     * 权限：system:user:list
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
     * 用户详情
     * 权限：system:user:query
     */
    @RequiresPermissions('system:user:query')
    @HttpGet('/:userId')
    async getInfo() {
      const { ctx, service } = this;
      
      try {
        const userId = parseInt(ctx.params.userId);
        const user = await service.system.user.selectUserById(userId);
        
        ctx.body = {
          code: 200,
          msg: '查询成功',
          data: user
        };
      } catch (err) {
        ctx.logger.error('查询用户详情失败:', err);
        ctx.body = {
          code: 500,
          msg: err.message || '查询失败'
        };
      }
    }

    /**
     * 新增用户
     * 权限：system:user:add
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
     * 权限：system:user:edit
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
     * 权限：system:user:remove
     * 角色：admin
     */
    @RequiresRoles('admin')
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
     * 权限：system:user:export
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

    /**
     * 重置密码
     * 权限：system:user:resetPwd
     */
    @RequiresPermissions('system:user:resetPwd')
    @HttpPut('/resetPwd')
    async resetPwd() {
      const { ctx, service } = this;
      
      try {
        const { userId, password } = ctx.request.body;
        await service.system.user.resetUserPwd(userId, password);
        
        ctx.body = {
          code: 200,
          msg: '重置成功'
        };
      } catch (err) {
        ctx.logger.error('重置密码失败:', err);
        ctx.body = {
          code: 500,
          msg: err.message || '重置失败'
        };
      }
    }
  }

  return UserController;
};
```

---

## 权限测试示例

### 测试场景 1: 有权限

```bash
# 登录获取 token（假设用户拥有 system:user:list 权限）
curl -X POST http://localhost:7001/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# 返回
{
  "code": 200,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}

# 访问用户列表（有权限）
curl -X GET http://localhost:7001/api/system/user/list \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# 返回
{
  "code": 200,
  "msg": "查询成功",
  "rows": [...],
  "total": 10
}
```

### 测试场景 2: 无权限

```bash
# 登录获取 token（假设用户没有 system:user:remove 权限）
curl -X POST http://localhost:7001/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"user","password":"user123"}'

# 尝试删除用户（无权限）
curl -X DELETE http://localhost:7001/api/system/user/1 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# 返回
{
  "code": 403,
  "msg": "没有权限，请联系管理员授权"
}
```

---

## 高级用法示例

### 动态权限验证

```javascript
async customPermissionCheck() {
  const { ctx } = this;
  const { getUserPermissions, checkPermissions } = require('../../decorator/permission');
  
  // 获取用户权限
  const permissions = await getUserPermissions(ctx);
  
  // 动态验证
  const canEdit = checkPermissions(permissions, 'system:user:edit', 'AND');
  const canAdd = checkPermissions(permissions, 'system:user:add', 'AND');
  
  if (canEdit || canAdd) {
    // 有权限，继续执行
    ctx.body = {
      code: 200,
      msg: '有权限'
    };
  } else {
    // 无权限
    ctx.body = {
      code: 403,
      msg: '没有权限'
    };
  }
}
```

### 根据权限返回不同数据

```javascript
@HttpGet('/list')
async list() {
  const { ctx, service } = this;
  const { getUserPermissions } = require('../../decorator/permission');
  
  // 获取用户权限
  const permissions = await getUserPermissions(ctx);
  
  let list;
  if (permissions.includes('*:*:*')) {
    // 超级管理员：返回所有数据
    list = await service.system.user.selectAllUsers();
  } else if (permissions.includes('system:user:list')) {
    // 普通权限：返回部门数据
    list = await service.system.user.selectDeptUsers(ctx.state.user.deptId);
  } else {
    // 无权限：只返回自己的数据
    list = await service.system.user.selectUserById(ctx.state.user.userId);
  }
  
  ctx.body = {
    code: 200,
    data: list
  };
}
```

---

## 相关文档

- [快速开始](./PERMISSION_QUICK_START.md) - 5分钟快速入门
- [完整指南](./PERMISSION_GUIDE.md) - 详细功能说明
- [实现总结](./PERMISSION_IMPLEMENTATION.md) - 技术实现细节

---

**更新日期**: 2025-10-27

