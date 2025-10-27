# 权限控制快速开始

> 5 分钟快速上手 ruoyi-eggjs 权限控制

---

## ⚡ 快速开始

### 步骤 1: 引入装饰器（30秒）

在你的 Controller 文件顶部添加：

```javascript
const { RequiresPermissions } = require('../../decorator/permission');
```

### 步骤 2: 使用装饰器（1分钟）

在需要权限控制的方法前添加装饰器：

```javascript
@RequiresPermissions('system:user:list')
@HttpGet('/list')
async list() {
  // 你的代码
}
```

### 步骤 3: 完成！

就这么简单！权限控制已经生效了。

---

## 📝 常用示例

### 示例 1: 列表查询

```javascript
/**
 * 用户列表
 * 权限：system:user:list
 */
@RequiresPermissions('system:user:list')
@HttpGet('/list')
async list() {
  // 查询用户列表
}
```

### 示例 2: 新增数据

```javascript
/**
 * 新增用户
 * 权限：system:user:add
 */
@RequiresPermissions('system:user:add')
@HttpPost()
async add() {
  // 新增用户
}
```

### 示例 3: 修改数据

```javascript
/**
 * 修改用户
 * 权限：system:user:edit
 */
@RequiresPermissions('system:user:edit')
@HttpPut()
async edit() {
  // 修改用户
}
```

### 示例 4: 删除数据

```javascript
/**
 * 删除用户
 * 权限：system:user:remove
 */
@RequiresPermissions('system:user:remove')
@HttpDelete('/:userIds')
async remove() {
  // 删除用户
}
```

### 示例 5: 导出数据

```javascript
/**
 * 导出用户
 * 权限：system:user:export
 */
@RequiresPermissions('system:user:export')
@HttpPost('/export')
async export() {
  // 导出用户
}
```

---

## 🎯 权限命名规范

遵循 `模块:功能:操作` 格式：

```
system:user:list      # 用户列表
system:user:add       # 新增用户
system:user:edit      # 修改用户
system:user:remove    # 删除用户
system:user:export    # 导出用户
```

---

## 🔧 完整示例

```javascript
const Controller = require('egg').Controller;
const { Route, HttpGet, HttpPost, HttpPut, HttpDelete } = require('egg-decorator-router');
const { RequiresPermissions } = require('../../decorator/permission');

module.exports = app => {

  @Route('/api/system/user')
  class UserController extends Controller {

    // 查询 - system:user:list
    @RequiresPermissions('system:user:list')
    @HttpGet('/list')
    async list() {
      // ... 实现
    }

    // 新增 - system:user:add
    @RequiresPermissions('system:user:add')
    @HttpPost()
    async add() {
      // ... 实现
    }

    // 修改 - system:user:edit
    @RequiresPermissions('system:user:edit')
    @HttpPut()
    async edit() {
      // ... 实现
    }

    // 删除 - system:user:remove
    @RequiresPermissions('system:user:remove')
    @HttpDelete('/:userIds')
    async remove() {
      // ... 实现
    }

    // 导出 - system:user:export
    @RequiresPermissions('system:user:export')
    @HttpPost('/export')
    async export() {
      // ... 实现
    }
  }

  return UserController;
};
```

---

## ⚠️ 注意事项

### 1. 装饰器顺序

权限装饰器必须在 HTTP 方法装饰器之前：

```javascript
// ✅ 正确
@RequiresPermissions('system:user:list')
@HttpGet('/list')

// ❌ 错误
@HttpGet('/list')
@RequiresPermissions('system:user:list')
```

### 2. 公开接口

不需要权限的接口不加装饰器：

```javascript
// 登录接口 - 不需要权限
@HttpPost('/login')
async login() {
  // ... 实现
}

// 验证码接口 - 不需要权限
@HttpGet('/captchaImage')
async captcha() {
  // ... 实现
}
```

### 3. 超级管理员

用户拥有 `*:*:*` 权限时，可以访问所有接口。

---

## 🚀 高级用法

### 多个权限（AND 逻辑）

同时需要多个权限：

```javascript
@RequiresPermissions(['system:user:edit', 'system:user:add'], 'AND')
@HttpPut()
async edit() {
  // 需要同时拥有 edit 和 add 权限
}
```

### 多个权限（OR 逻辑）

拥有其中一个权限即可：

```javascript
@RequiresPermissions(['system:user:edit', 'system:user:add'], 'OR')
@HttpPut()
async edit() {
  // 拥有 edit 或 add 权限即可
}
```

### 角色验证

```javascript
const { RequiresRoles } = require('../../decorator/permission');

@RequiresRoles('admin')
@HttpDelete('/:userIds')
async remove() {
  // 只有 admin 角色可以删除
}
```

### 组合验证

```javascript
const { RequiresAuth } = require('../../decorator/permission');

@RequiresAuth({
  roles: 'admin',
  permissions: 'system:user:remove'
})
@HttpDelete('/:userIds')
async remove() {
  // 需要 admin 角色 AND system:user:remove 权限
}
```

---

## 📚 更多文档

- [权限控制详细指南](./PERMISSION_GUIDE.md) - 完整功能说明
- [API 接口映射文档](./API_MAPPING.md) - 所有接口文档
- [完整示例代码](../app/controller/system/config_with_permission.example.js) - 实际使用示例

---

## ✅ 检查清单

使用权限控制前，确保：

- [ ] 已创建 `app/decorator/permission.js` 文件
- [ ] 已在 Controller 中引入装饰器
- [ ] 已为接口添加权限注解
- [ ] 权限字符串格式正确（`模块:功能:操作`）
- [ ] 装饰器顺序正确（权限装饰器在前）

---

## 🆘 遇到问题？

### 装饰器不生效

1. 检查装饰器顺序
2. 检查文件路径是否正确
3. 查看控制台错误日志

### 403 没有权限

1. 确认用户已分配相关权限
2. 清除权限缓存重试
3. 检查权限字符串是否正确

### 需要帮助

查看 [权限控制详细指南](./PERMISSION_GUIDE.md) 或查看示例代码。

---

**快速开始文档版本**: v1.0  
**更新日期**: 2025-10-27

