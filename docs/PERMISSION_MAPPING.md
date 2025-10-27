# 权限注解映射文档

> 本文档记录从 Spring Boot 到 Egg.js 的权限注解映射关系

---

## 系统管理模块 (system)

### 用户管理 (user.js)
- `list()` -> `system:user:list` - 用户列表
- `getInfo()` -> `system:user:query` - 用户详情
- `add()` -> `system:user:add` - 新增用户
- `edit()` -> `system:user:edit` - 修改用户  
- `remove()` -> `system:user:remove` - 删除用户
- `export()` -> `system:user:export` - 导出用户
- `importData()` -> `system:user:import` - 导入用户
- `resetPwd()` -> `system:user:resetPwd` - 重置密码
- `changeStatus()` -> `system:user:edit` - 修改状态
- `authRole()` -> `system:user:query` - 查询授权角色
- `insertAuthRole()` -> `system:user:edit` - 用户授权
- `deptTree()` -> `system:user:list` - 部门树

### 角色管理 (role.js)
- `list()` -> `system:role:list` - 角色列表
- `getInfo()` -> `system:role:query` - 角色详情
- `add()` -> `system:role:add` - 新增角色
- `edit()` -> `system:role:edit` - 修改角色
- `dataScope()` -> `system:role:edit` - 数据权限
- `changeStatus()` -> `system:role:edit` - 修改状态
- `remove()` -> `system:role:remove` - 删除角色
- `export()` -> `system:role:export` - 导出角色
- `optionselect()` -> `system:role:query` - 角色选择框
- `allocatedList()` -> `system:role:list` - 已分配用户
- `unallocatedList()` -> `system:role:list` - 未分配用户
- `cancelAuthUser()` -> `system:role:edit` - 取消授权
- `cancelAuthUserAll()` -> `system:role:edit` - 批量取消授权
- `selectAuthUserAll()` -> `system:role:edit` - 批量选择用户
- `deptTree()` -> `system:role:query` - 部门树

### 菜单管理 (menu.js)
- `list()` -> `system:menu:list` - 菜单列表
- `getInfo()` -> `system:menu:query` - 菜单详情
- `add()` -> `system:menu:add` - 新增菜单
- `edit()` -> `system:menu:edit` - 修改菜单
- `remove()` -> `system:menu:remove` - 删除菜单
- `treeselect()` -> `system:menu:query` - 菜单树
- `roleMenuTreeselect()` -> `system:menu:query` - 角色菜单树

### 部门管理 (dept.js)
- `list()` -> `system:dept:list` - 部门列表
- `getInfo()` -> `system:dept:query` - 部门详情
- `add()` -> `system:dept:add` - 新增部门
- `edit()` -> `system:dept:edit` - 修改部门
- `remove()` -> `system:dept:remove` - 删除部门
- `treeselect()` -> `system:dept:query` - 部门树
- `roleDeptTreeselect()` -> `system:dept:query` - 角色部门树
- `excludeChild()` -> `system:dept:list` - 排除节点

### 岗位管理 (post.js)
- `list()` -> `system:post:list` - 岗位列表
- `getInfo()` -> `system:post:query` - 岗位详情
- `add()` -> `system:post:add` - 新增岗位
- `edit()` -> `system:post:edit` - 修改岗位
- `remove()` -> `system:post:remove` - 删除岗位
- `export()` -> `system:post:export` - 导出岗位

### 参数配置 (config.js) ✅ 已完成
- `list()` -> `system:config:list` - 参数列表
- `getInfo()` -> `system:config:query` - 参数详情
- `add()` -> `system:config:add` - 新增参数
- `edit()` -> `system:config:edit` - 修改参数
- `remove()` -> `system:config:remove` - 删除参数
- `refreshCache()` -> `system:config:remove` - 刷新缓存
- `export()` -> `system:config:export` - 导出参数

### 字典类型 (dictType.js)
- `list()` -> `system:dict:list` - 字典类型列表
- `getInfo()` -> `system:dict:query` - 字典类型详情
- `add()` -> `system:dict:add` - 新增字典类型
- `edit()` -> `system:dict:edit` - 修改字典类型
- `remove()` -> `system:dict:remove` - 删除字典类型
- `refreshCache()` -> `system:dict:remove` - 刷新缓存
- `optionselect()` -> `system:dict:query` - 字典选择框
- `export()` -> `system:dict:export` - 导出字典类型

### 字典数据 (dictData.js)
- `list()` -> `system:dict:list` - 字典数据列表
- `getInfo()` -> `system:dict:query` - 字典数据详情
- `dictType()` -> 无权限验证 - 根据字典类型查询
- `add()` -> `system:dict:add` - 新增字典数据
- `edit()` -> `system:dict:edit` - 修改字典数据
- `remove()` -> `system:dict:remove` - 删除字典数据
- `export()` -> `system:dict:export` - 导出字典数据

### 通知公告 (notice.js)
- `list()` -> `system:notice:list` - 通知列表
- `getInfo()` -> `system:notice:query` - 通知详情
- `add()` -> `system:notice:add` - 新增通知
- `edit()` -> `system:notice:edit` - 修改通知
- `remove()` -> `system:notice:remove` - 删除通知

---

## 系统监控模块 (monitor)

### 在线用户 (online.js)
- `list()` -> `monitor:online:list` - 在线用户列表
- `forceLogout()` -> `monitor:online:forceLogout` - 强退用户

### 登录日志 (logininfor.js)
- `list()` -> `monitor:logininfor:list` - 登录日志列表
- `remove()` -> `monitor:logininfor:remove` - 删除登录日志
- `clean()` -> `monitor:logininfor:remove` - 清空登录日志
- `unlock()` -> `monitor:logininfor:unlock` - 解锁用户
- `export()` -> `monitor:logininfor:export` - 导出登录日志

### 操作日志 (operlog.js)
- `list()` -> `monitor:operlog:list` - 操作日志列表
- `remove()` -> `monitor:operlog:remove` - 删除操作日志
- `clean()` -> `monitor:operlog:remove` - 清空操作日志
- `export()` -> `monitor:operlog:export` - 导出操作日志

### 定时任务 (job.js)
- `list()` -> `monitor:job:list` - 定时任务列表
- `getInfo()` -> `monitor:job:query` - 定时任务详情
- `add()` -> `monitor:job:add` - 新增定时任务
- `edit()` -> `monitor:job:edit` - 修改定时任务
- `remove()` -> `monitor:job:remove` - 删除定时任务
- `run()` -> `monitor:job:changeStatus` - 执行任务
- `changeStatus()` -> `monitor:job:changeStatus` - 修改状态
- `export()` -> `monitor:job:export` - 导出任务

### 定时任务日志 (jobLog.js)
- `list()` -> `monitor:job:list` - 任务日志列表
- `remove()` -> `monitor:job:remove` - 删除任务日志
- `clean()` -> `monitor:job:remove` - 清空任务日志
- `export()` -> `monitor:job:export` - 导出任务日志

### 缓存监控 (cache.js)
- `getInfo()` -> `monitor:cache:list` - 缓存信息
- `getNames()` -> `monitor:cache:list` - 缓存名称列表
- `getKeys()` -> `monitor:cache:list` - 缓存键名列表
- `getValue()` -> `monitor:cache:list` - 缓存内容
- `clearCacheName()` -> `monitor:cache:list` - 清理缓存名称
- `clearCacheKey()` -> `monitor:cache:list` - 清理缓存键名
- `clearCacheAll()` -> `monitor:cache:list` - 清理全部缓存

### 服务监控 (server.js)
- `getInfo()` -> `monitor:server:list` - 服务器信息

---

## 系统工具模块 (tool)

### 代码生成 (gen.js)
- `list()` -> `tool:gen:list` - 代码生成列表
- `dataList()` -> `tool:gen:list` - 数据表列表
- `columnList()` -> `tool:gen:list` - 表字段列表
- `importTable()` -> `tool:gen:import` - 导入表
- `edit()` -> `tool:gen:edit` - 修改配置
- `remove()` -> `tool:gen:remove` - 删除表配置
- `preview()` -> `tool:gen:preview` - 预览代码
- `download()` -> `tool:gen:code` - 下载代码
- `genCode()` -> `tool:gen:code` - 生成代码
- `synchDb()` -> `tool:gen:edit` - 同步数据库
- `batchGenCode()` -> `tool:gen:code` - 批量生成代码

---

## 通用模块 (common)

### 公共控制器 (common.js)
- `upload()` -> 无权限验证 - 文件上传
- `download()` -> 无权限验证 - 文件下载
- `downloadResource()` -> 无权限验证 - 资源下载

### 登录控制器 (login.js)
- `captchaImage()` -> 无权限验证 - 验证码
- `login()` -> 无权限验证 - 用户登录
- `logout()` -> 无权限验证 - 用户登出
- `getInfo()` -> 无权限验证 - 获取用户信息
- `getRouters()` -> 无权限验证 - 获取路由菜单
- `register()` -> 无权限验证 - 用户注册

### 个人中心 (profile.js)
- `profile()` -> 无权限验证 - 个人信息
- `updateProfile()` -> 无权限验证 - 修改个人信息
- `updatePwd()` -> 无权限验证 - 修改密码
- `avatar()` -> 无权限验证 - 修改头像

---

**文档版本**: v1.0  
**创建日期**: 2025-10-27  
**说明**: 此文档用于指导批量添加权限注解

