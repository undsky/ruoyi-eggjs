# RuoYi Spring Boot 到 Egg.js API 接口映射表

## 一、认证授权模块

### 1.1 登录认证
| Spring Boot | Egg.js | 方法 | 说明 |
|-------------|--------|------|------|
| `/login` | `/api/login` | POST | 用户登录 |
| `/logout` | `/api/logout` | POST | 用户登出 |
| `/getInfo` | `/api/getInfo` | GET | 获取用户信息 |
| `/getRouters` | `/api/getRouters` | GET | 获取路由菜单 |
| `/register` | `/api/register` | POST | 用户注册 |
| `/captchaImage` | `/api/captcha` | GET | 验证码图片 |

---

## 二、系统管理模块

### 2.1 用户管理 (system/user)
| Spring Boot | Egg.js | 方法 | 说明 |
|-------------|--------|------|------|
| `/system/user/list` | `/api/system/user/list` | GET | 用户列表（分页） |
| `/system/user/{userId}` | `/api/system/user/:userId` | GET | 用户详情 |
| `/system/user` | `/api/system/user` | POST | 新增用户 |
| `/system/user` | `/api/system/user` | PUT | 修改用户 |
| `/system/user/{userIds}` | `/api/system/user/:userIds` | DELETE | 删除用户 |
| `/system/user/resetPwd` | `/api/system/user/resetPwd` | PUT | 重置密码 |
| `/system/user/changeStatus` | `/api/system/user/changeStatus` | PUT | 修改状态 |
| `/system/user/authRole/{userId}` | `/api/system/user/authRole/:userId` | GET | 查询授权角色 |
| `/system/user/authRole` | `/api/system/user/authRole` | PUT | 用户授权 |
| `/system/user/deptTree` | `/api/system/user/deptTree` | GET | 部门树选择 |
| `/system/user/export` | `/api/system/user/export` | POST | 导出用户 |
| `/system/user/importData` | `/api/system/user/import` | POST | 导入用户 |
| `/system/user/importTemplate` | `/api/system/user/importTemplate` | POST | 导入模板 |

### 2.2 角色管理 (system/role)
| Spring Boot | Egg.js | 方法 | 说明 |
|-------------|--------|------|------|
| `/system/role/list` | `/api/system/role/list` | GET | 角色列表 |
| `/system/role/{roleId}` | `/api/system/role/:roleId` | GET | 角色详情 |
| `/system/role` | `/api/system/role` | POST | 新增角色 |
| `/system/role` | `/api/system/role` | PUT | 修改角色 |
| `/system/role/{roleIds}` | `/api/system/role/:roleIds` | DELETE | 删除角色 |
| `/system/role/changeStatus` | `/api/system/role/changeStatus` | PUT | 修改状态 |
| `/system/role/dataScope` | `/api/system/role/dataScope` | PUT | 数据权限 |
| `/system/role/allocatedList` | `/api/system/role/allocatedList` | GET | 已授权用户列表 |
| `/system/role/unallocatedList` | `/api/system/role/unallocatedList` | GET | 未授权用户列表 |
| `/system/role/authUser/cancel` | `/api/system/role/authUser/cancel` | PUT | 取消授权 |
| `/system/role/authUser/cancelAll` | `/api/system/role/authUser/cancelAll` | PUT | 批量取消授权 |
| `/system/role/authUser/selectAll` | `/api/system/role/authUser/selectAll` | PUT | 批量授权 |
| `/system/role/deptTree/{roleId}` | `/api/system/role/deptTree/:roleId` | GET | 角色部门树 |
| `/system/role/export` | `/api/system/role/export` | POST | 导出角色 |

### 2.3 菜单管理 (system/menu)
| Spring Boot | Egg.js | 方法 | 说明 |
|-------------|--------|------|------|
| `/system/menu/list` | `/api/system/menu/list` | GET | 菜单列表（树形） |
| `/system/menu/{menuId}` | `/api/system/menu/:menuId` | GET | 菜单详情 |
| `/system/menu` | `/api/system/menu` | POST | 新增菜单 |
| `/system/menu` | `/api/system/menu` | PUT | 修改菜单 |
| `/system/menu/{menuId}` | `/api/system/menu/:menuId` | DELETE | 删除菜单 |
| `/system/menu/treeselect` | `/api/system/menu/treeselect` | GET | 菜单树选择 |
| `/system/menu/roleMenuTreeselect/{roleId}` | `/api/system/menu/roleMenuTreeselect/:roleId` | GET | 角色菜单树 |

### 2.4 部门管理 (system/dept)
| Spring Boot | Egg.js | 方法 | 说明 |
|-------------|--------|------|------|
| `/system/dept/list` | `/api/system/dept/list` | GET | 部门列表（树形） |
| `/system/dept/{deptId}` | `/api/system/dept/:deptId` | GET | 部门详情 |
| `/system/dept` | `/api/system/dept` | POST | 新增部门 |
| `/system/dept` | `/api/system/dept` | PUT | 修改部门 |
| `/system/dept/{deptId}` | `/api/system/dept/:deptId` | DELETE | 删除部门 |
| `/system/dept/list/exclude/{deptId}` | `/api/system/dept/list/exclude/:deptId` | GET | 排除节点查询 |
| `/system/dept/treeselect` | `/api/system/dept/treeselect` | GET | 部门树选择 |
| `/system/dept/roleDeptTreeselect/{roleId}` | `/api/system/dept/roleDeptTreeselect/:roleId` | GET | 角色部门树 |

### 2.5 岗位管理 (system/post)
| Spring Boot | Egg.js | 方法 | 说明 |
|-------------|--------|------|------|
| `/system/post/list` | `/api/system/post/list` | GET | 岗位列表 |
| `/system/post/{postId}` | `/api/system/post/:postId` | GET | 岗位详情 |
| `/system/post` | `/api/system/post` | POST | 新增岗位 |
| `/system/post` | `/api/system/post` | PUT | 修改岗位 |
| `/system/post/{postIds}` | `/api/system/post/:postIds` | DELETE | 删除岗位 |
| `/system/post/export` | `/api/system/post/export` | POST | 导出岗位 |

### 2.6 字典类型 (system/dict/type)
| Spring Boot | Egg.js | 方法 | 说明 |
|-------------|--------|------|------|
| `/system/dict/type/list` | `/api/system/dict/type/list` | GET | 字典类型列表 |
| `/system/dict/type/{dictId}` | `/api/system/dict/type/:dictId` | GET | 字典类型详情 |
| `/system/dict/type` | `/api/system/dict/type` | POST | 新增字典类型 |
| `/system/dict/type` | `/api/system/dict/type` | PUT | 修改字典类型 |
| `/system/dict/type/{dictIds}` | `/api/system/dict/type/:dictIds` | DELETE | 删除字典类型 |
| `/system/dict/type/refreshCache` | `/api/system/dict/type/refreshCache` | DELETE | 刷新字典缓存 |
| `/system/dict/type/optionselect` | `/api/system/dict/type/optionselect` | GET | 字典选择框列表 |
| `/system/dict/type/export` | `/api/system/dict/type/export` | POST | 导出字典类型 |

### 2.7 字典数据 (system/dict/data)
| Spring Boot | Egg.js | 方法 | 说明 |
|-------------|--------|------|------|
| `/system/dict/data/list` | `/api/system/dict/data/list` | GET | 字典数据列表 |
| `/system/dict/data/{dictCode}` | `/api/system/dict/data/:dictCode` | GET | 字典数据详情 |
| `/system/dict/data/type/{dictType}` | `/api/system/dict/data/type/:dictType` | GET | 根据类型查询 |
| `/system/dict/data` | `/api/system/dict/data` | POST | 新增字典数据 |
| `/system/dict/data` | `/api/system/dict/data` | PUT | 修改字典数据 |
| `/system/dict/data/{dictCodes}` | `/api/system/dict/data/:dictCodes` | DELETE | 删除字典数据 |
| `/system/dict/data/export` | `/api/system/dict/data/export` | POST | 导出字典数据 |

### 2.8 参数配置 (system/config)
| Spring Boot | Egg.js | 方法 | 说明 |
|-------------|--------|------|------|
| `/system/config/list` | `/api/system/config/list` | GET | 参数配置列表 |
| `/system/config/{configId}` | `/api/system/config/:configId` | GET | 参数配置详情 |
| `/system/config/configKey/{configKey}` | `/api/system/config/configKey/:configKey` | GET | 根据键名查询 |
| `/system/config` | `/api/system/config` | POST | 新增参数配置 |
| `/system/config` | `/api/system/config` | PUT | 修改参数配置 |
| `/system/config/{configIds}` | `/api/system/config/:configIds` | DELETE | 删除参数配置 |
| `/system/config/refreshCache` | `/api/system/config/refreshCache` | DELETE | 刷新参数缓存 |
| `/system/config/export` | `/api/system/config/export` | POST | 导出参数配置 |

### 2.9 通知公告 (system/notice)
| Spring Boot | Egg.js | 方法 | 说明 |
|-------------|--------|------|------|
| `/system/notice/list` | `/api/system/notice/list` | GET | 通知公告列表 |
| `/system/notice/{noticeId}` | `/api/system/notice/:noticeId` | GET | 通知公告详情 |
| `/system/notice` | `/api/system/notice` | POST | 新增通知公告 |
| `/system/notice` | `/api/system/notice` | PUT | 修改通知公告 |
| `/system/notice/{noticeIds}` | `/api/system/notice/:noticeIds` | DELETE | 删除通知公告 |

---

## 三、系统监控模块

### 3.1 在线用户 (monitor/online)
| Spring Boot | Egg.js | 方法 | 说明 |
|-------------|--------|------|------|
| `/monitor/online/list` | `/api/monitor/online/list` | GET | 在线用户列表 |
| `/monitor/online/{tokenId}` | `/api/monitor/online/:tokenId` | DELETE | 强退用户 |

### 3.2 登录日志 (monitor/logininfor)
| Spring Boot | Egg.js | 方法 | 说明 |
|-------------|--------|------|------|
| `/monitor/logininfor/list` | `/api/monitor/logininfor/list` | GET | 登录日志列表 |
| `/monitor/logininfor/{infoIds}` | `/api/monitor/logininfor/:infoIds` | DELETE | 删除登录日志 |
| `/monitor/logininfor/clean` | `/api/monitor/logininfor/clean` | DELETE | 清空登录日志 |
| `/monitor/logininfor/unlock/{userName}` | `/api/monitor/logininfor/unlock/:userName` | GET | 解锁用户 |
| `/monitor/logininfor/export` | `/api/monitor/logininfor/export` | POST | 导出登录日志 |

### 3.3 操作日志 (monitor/operlog)
| Spring Boot | Egg.js | 方法 | 说明 |
|-------------|--------|------|------|
| `/monitor/operlog/list` | `/api/monitor/operlog/list` | GET | 操作日志列表 |
| `/monitor/operlog/{operIds}` | `/api/monitor/operlog/:operIds` | DELETE | 删除操作日志 |
| `/monitor/operlog/clean` | `/api/monitor/operlog/clean` | DELETE | 清空操作日志 |
| `/monitor/operlog/export` | `/api/monitor/operlog/export` | POST | 导出操作日志 |

### 3.4 服务监控 (monitor/server)
| Spring Boot | Egg.js | 方法 | 说明 |
|-------------|--------|------|------|
| `/monitor/server` | `/api/monitor/server` | GET | 服务器信息 |

### 3.5 缓存监控 (monitor/cache)
| Spring Boot | Egg.js | 方法 | 说明 |
|-------------|--------|------|------|
| `/monitor/cache` | `/api/monitor/cache` | GET | 缓存信息 |
| `/monitor/cache/getNames` | `/api/monitor/cache/getNames` | GET | 缓存名称列表 |
| `/monitor/cache/getKeys/{cacheName}` | `/api/monitor/cache/getKeys/:cacheName` | GET | 缓存键名列表 |
| `/monitor/cache/getValue/{cacheName}/{cacheKey}` | `/api/monitor/cache/getValue/:cacheName/:cacheKey` | GET | 缓存内容 |
| `/monitor/cache/clearCacheName/{cacheName}` | `/api/monitor/cache/clearCacheName/:cacheName` | DELETE | 清空缓存名称 |
| `/monitor/cache/clearCacheKey/{cacheKey}` | `/api/monitor/cache/clearCacheKey/:cacheKey` | DELETE | 清空缓存键值 |
| `/monitor/cache/clearCacheAll` | `/api/monitor/cache/clearCacheAll` | DELETE | 清空全部缓存 |

### 3.6 定时任务 (monitor/job)
| Spring Boot | Egg.js | 方法 | 说明 |
|-------------|--------|------|------|
| `/monitor/job/list` | `/api/monitor/job/list` | GET | 定时任务列表 |
| `/monitor/job/{jobId}` | `/api/monitor/job/:jobId` | GET | 定时任务详情 |
| `/monitor/job` | `/api/monitor/job` | POST | 新增定时任务 |
| `/monitor/job` | `/api/monitor/job` | PUT | 修改定时任务 |
| `/monitor/job/{jobIds}` | `/api/monitor/job/:jobIds` | DELETE | 删除定时任务 |
| `/monitor/job/changeStatus` | `/api/monitor/job/changeStatus` | PUT | 修改状态 |
| `/monitor/job/run` | `/api/monitor/job/run` | PUT | 立即执行 |
| `/monitor/job/export` | `/api/monitor/job/export` | POST | 导出定时任务 |

---

## 四、系统工具模块

### 4.1 代码生成 (tool/gen)
| Spring Boot | Egg.js | 方法 | 说明 |
|-------------|--------|------|------|
| `/tool/gen/list` | `/api/tool/gen/list` | GET | 表列表 |
| `/tool/gen/{tableId}` | `/api/tool/gen/:tableId` | GET | 表详情 |
| `/tool/gen/db/list` | `/api/tool/gen/db/list` | GET | 数据库表列表 |
| `/tool/gen/column/{tableId}` | `/api/tool/gen/column/:tableId` | GET | 表字段列表 |
| `/tool/gen/importTable` | `/api/tool/gen/importTable` | POST | 导入表 |
| `/tool/gen` | `/api/tool/gen` | PUT | 修改生成配置 |
| `/tool/gen/{tableIds}` | `/api/tool/gen/:tableIds` | DELETE | 删除表配置 |
| `/tool/gen/preview/{tableId}` | `/api/tool/gen/preview/:tableId` | GET | 预览代码 |
| `/tool/gen/download/{tableName}` | `/api/tool/gen/download/:tableName` | GET | 下载代码 |
| `/tool/gen/genCode/{tableName}` | `/api/tool/gen/genCode/:tableName` | GET | 生成代码（自定义路径） |
| `/tool/gen/synchDb/{tableName}` | `/api/tool/gen/synchDb/:tableName` | GET | 同步数据库 |
| `/tool/gen/batchGenCode` | `/api/tool/gen/batchGenCode` | GET | 批量生成代码 |

---

## 五、个人中心模块

### 5.1 用户个人信息 (system/user/profile)
| Spring Boot | Egg.js | 方法 | 说明 |
|-------------|--------|------|------|
| `/system/user/profile` | `/api/system/user/profile` | GET | 个人信息 |
| `/system/user/profile` | `/api/system/user/profile` | PUT | 修改个人信息 |
| `/system/user/profile/updatePwd` | `/api/system/user/profile/updatePwd` | PUT | 修改密码 |
| `/system/user/profile/avatar` | `/api/system/user/profile/avatar` | POST | 上传头像 |

---

## 六、公共接口模块

### 6.1 公共接口 (common)
| Spring Boot | Egg.js | 方法 | 说明 |
|-------------|--------|------|------|
| `/common/download` | `/api/common/download` | GET | 文件下载 |
| `/common/download/resource` | `/api/common/download/resource` | GET | 本地资源下载 |
| `/common/upload` | `/api/common/upload` | POST | 文件上传 |

---

## 七、响应格式统一

### 7.1 成功响应
```json
{
  "code": 200,
  "msg": "操作成功",
  "data": {
    // 数据内容
  }
}
```

### 7.2 分页响应
```json
{
  "code": 200,
  "msg": "查询成功",
  "rows": [
    // 列表数据
  ],
  "total": 100
}
```

### 7.3 失败响应
```json
{
  "code": 500,
  "msg": "操作失败"
}
```

### 7.4 未授权响应
```json
{
  "code": 401,
  "msg": "未授权，请重新登录"
}
```

### 7.5 无权限响应
```json
{
  "code": 403,
  "msg": "没有权限，请联系管理员"
}
```

---

## 八、HTTP 状态码说明

| 状态码 | 说明 | 使用场景 |
|--------|------|----------|
| 200 | 成功 | 操作成功 |
| 400 | 错误请求 | 参数错误 |
| 401 | 未授权 | Token 失效或未登录 |
| 403 | 禁止访问 | 无权限操作 |
| 404 | 未找到 | 资源不存在 |
| 500 | 服务器错误 | 系统内部错误 |

---

## 九、请求头说明

### 9.1 必需请求头
```http
Content-Type: application/json
Authorization: Bearer {token}
```

### 9.2 可选请求头
```http
X-Request-ID: {uuid}          # 请求追踪ID
User-Agent: {userAgent}       # 用户代理
```

---

## 十、分页参数说明

### 10.1 请求参数
```json
{
  "pageNum": 1,      // 页码（从1开始）
  "pageSize": 10     // 每页条数
}
```

### 10.2 响应格式
```json
{
  "code": 200,
  "msg": "查询成功",
  "rows": [...],     // 列表数据
  "total": 100       // 总记录数
}
```

---

## 十一、时间格式说明

**统一使用格式**：`YYYY-MM-DD HH:mm:ss`

**示例**：`2025-10-23 14:30:00`

---

## 十二、导出功能说明

### 12.1 Excel 导出
- 响应类型：`application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`
- 文件名格式：`{模块名称}_{时间戳}.xlsx`

### 12.2 导入模板下载
- 提供标准模板下载接口
- 包含示例数据和说明

---

**文档版本**: v1.0
**创建日期**: 2025-10-23

