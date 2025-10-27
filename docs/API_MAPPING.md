# RuoYi Spring Boot 到 Egg.js API 接口映射表

> **说明**：本文档基于 RuoYi-Vue3 前端和 RuoYi-Vue-SpringBoot3 后端官方项目整理，完整映射所有 API 接口

## 📋 目录

- [一、认证授权模块](#一认证授权模块)
- [二、系统管理模块](#二系统管理模块)
- [三、系统监控模块](#三系统监控模块)
- [四、系统工具模块](#四系统工具模块)
- [五、个人中心模块](#五个人中心模块)
- [六、公共接口模块](#六公共接口模块)

---

## 一、认证授权模块

### 1.1 登录认证
| Spring Boot | Egg.js | 方法 | 说明 | 请求参数 | 响应数据 |
|-------------|--------|------|------|----------|----------|
| `/login` | `/api/login` | POST | 用户登录 | `{username, password, code, uuid}` | `{token}` |
| `/logout` | `/api/logout` | POST | 用户登出 | - | - |
| `/getInfo` | `/api/getInfo` | GET | 获取用户信息 | - | `{user, roles, permissions}` |
| `/getRouters` | `/api/getRouters` | GET | 获取路由菜单 | - | `menus[]` |
| `/register` | `/api/register` | POST | 用户注册 | `{username, password, ...}` | - |
| `/captchaImage` | `/api/captcha` | GET | 验证码图片 | - | `{uuid, img}` |

**说明**：
- `isToken: false` 表示无需 Token 验证
- 登录成功后返回的 token 需要在后续请求的 Header 中携带

---

## 二、系统管理模块

### 2.1 用户管理 (system/user)
| Spring Boot | Egg.js | 方法 | 说明 | 查询参数 | 请求体 |
|-------------|--------|------|------|----------|--------|
| `/system/user/list` | `/api/system/user/list` | GET | 用户列表（分页） | `pageNum, pageSize, userName, phonenumber, status, deptId, beginTime, endTime` | - |
| `/system/user/{userId}` | `/api/system/user/:userId` | GET | 用户详情 | - | - |
| `/system/user` | `/api/system/user` | POST | 新增用户 | - | `{userName, nickName, email, phonenumber, sex, password, deptId, postIds, roleIds, ...}` |
| `/system/user` | `/api/system/user` | PUT | 修改用户 | - | `{userId, userName, nickName, email, phonenumber, sex, deptId, postIds, roleIds, ...}` |
| `/system/user/{userIds}` | `/api/system/user/:userIds` | DELETE | 删除用户 | - | - |
| `/system/user/resetPwd` | `/api/system/user/resetPwd` | PUT | 重置密码 | - | `{userId, password}` |
| `/system/user/changeStatus` | `/api/system/user/changeStatus` | PUT | 修改状态 | - | `{userId, status}` |
| `/system/user/authRole/{userId}` | `/api/system/user/authRole/:userId` | GET | 查询授权角色 | - | - |
| `/system/user/authRole` | `/api/system/user/authRole` | PUT | 用户授权角色 | `userId, roleIds` | - |
| `/system/user/deptTree` | `/api/system/user/deptTree` | GET | 部门树选择 | - | - |
| `/system/user/export` | `/api/system/user/export` | POST | 导出用户 | - | 查询条件 (同list) |
| `/system/user/importData` | `/api/system/user/import` | POST | 导入用户 | `updateSupport` | `file` (multipart) |
| `/system/user/importTemplate` | `/api/system/user/importTemplate` | POST | 下载导入模板 | - | - |

### 2.2 角色管理 (system/role)
| Spring Boot | Egg.js | 方法 | 说明 | 查询参数 | 请求体 |
|-------------|--------|------|------|----------|--------|
| `/system/role/list` | `/api/system/role/list` | GET | 角色列表（分页） | `pageNum, pageSize, roleName, roleKey, status, beginTime, endTime` | - |
| `/system/role/{roleId}` | `/api/system/role/:roleId` | GET | 角色详情 | - | - |
| `/system/role` | `/api/system/role` | POST | 新增角色 | - | `{roleName, roleKey, roleSort, status, menuIds, deptIds, dataScope, ...}` |
| `/system/role` | `/api/system/role` | PUT | 修改角色 | - | `{roleId, roleName, roleKey, roleSort, status, menuIds, ...}` |
| `/system/role/{roleIds}` | `/api/system/role/:roleIds` | DELETE | 删除角色 | - | - |
| `/system/role/changeStatus` | `/api/system/role/changeStatus` | PUT | 修改状态 | - | `{roleId, status}` |
| `/system/role/dataScope` | `/api/system/role/dataScope` | PUT | 数据权限保存 | - | `{roleId, dataScope, deptIds, deptCheckStrictly}` |
| `/system/role/authUser/allocatedList` | `/api/system/role/allocatedList` | GET | 已授权用户列表 | `pageNum, pageSize, roleId, userName, phonenumber` | - |
| `/system/role/authUser/unallocatedList` | `/api/system/role/unallocatedList` | GET | 未授权用户列表 | `pageNum, pageSize, roleId, userName, phonenumber` | - |
| `/system/role/authUser/cancel` | `/api/system/role/authUser/cancel` | PUT | 取消授权用户 | - | `{userId, roleId}` |
| `/system/role/authUser/cancelAll` | `/api/system/role/authUser/cancelAll` | PUT | 批量取消授权 | `roleId, userIds` | - |
| `/system/role/authUser/selectAll` | `/api/system/role/authUser/selectAll` | PUT | 批量选择授权 | `roleId, userIds` | - |
| `/system/role/deptTree/{roleId}` | `/api/system/role/deptTree/:roleId` | GET | 角色部门树 | - | - |
| `/system/role/export` | `/api/system/role/export` | POST | 导出角色 | - | 查询条件 (同list) |

### 2.3 菜单管理 (system/menu)
| Spring Boot | Egg.js | 方法 | 说明 | 查询参数 | 请求体 |
|-------------|--------|------|------|----------|--------|
| `/system/menu/list` | `/api/system/menu/list` | GET | 菜单列表（树形） | `menuName, status` | - |
| `/system/menu/{menuId}` | `/api/system/menu/:menuId` | GET | 菜单详情 | - | - |
| `/system/menu` | `/api/system/menu` | POST | 新增菜单 | - | `{menuName, parentId, orderNum, path, component, isFrame, isCache, menuType, visible, status, icon, ...}` |
| `/system/menu` | `/api/system/menu` | PUT | 修改菜单 | - | `{menuId, menuName, parentId, orderNum, path, component, ...}` |
| `/system/menu/{menuId}` | `/api/system/menu/:menuId` | DELETE | 删除菜单 | - | - |
| `/system/menu/treeselect` | `/api/system/menu/treeselect` | GET | 菜单树选择 | - | - |
| `/system/menu/roleMenuTreeselect/{roleId}` | `/api/system/menu/roleMenuTreeselect/:roleId` | GET | 角色菜单树 | - | - |

### 2.4 部门管理 (system/dept)
| Spring Boot | Egg.js | 方法 | 说明 | 查询参数 | 请求体 |
|-------------|--------|------|------|----------|--------|
| `/system/dept/list` | `/api/system/dept/list` | GET | 部门列表（树形） | `deptName, status` | - |
| `/system/dept/{deptId}` | `/api/system/dept/:deptId` | GET | 部门详情 | - | - |
| `/system/dept` | `/api/system/dept` | POST | 新增部门 | - | `{deptName, parentId, orderNum, leader, phone, email, status, ...}` |
| `/system/dept` | `/api/system/dept` | PUT | 修改部门 | - | `{deptId, deptName, parentId, orderNum, leader, ...}` |
| `/system/dept/{deptId}` | `/api/system/dept/:deptId` | DELETE | 删除部门 | - | - |
| `/system/dept/list/exclude/{deptId}` | `/api/system/dept/list/exclude/:deptId` | GET | 排除节点查询 | - | - |
| `/system/dept/treeselect` | `/api/system/dept/treeselect` | GET | 部门树选择 | - | - |
| `/system/dept/roleDeptTreeselect/{roleId}` | `/api/system/dept/roleDeptTreeselect/:roleId` | GET | 角色部门树 | - | - |

### 2.5 岗位管理 (system/post)
| Spring Boot | Egg.js | 方法 | 说明 | 查询参数 | 请求体 |
|-------------|--------|------|------|----------|--------|
| `/system/post/list` | `/api/system/post/list` | GET | 岗位列表（分页） | `pageNum, pageSize, postCode, postName, status` | - |
| `/system/post/{postId}` | `/api/system/post/:postId` | GET | 岗位详情 | - | - |
| `/system/post` | `/api/system/post` | POST | 新增岗位 | - | `{postCode, postName, postSort, status, remark}` |
| `/system/post` | `/api/system/post` | PUT | 修改岗位 | - | `{postId, postCode, postName, postSort, status, remark}` |
| `/system/post/{postIds}` | `/api/system/post/:postIds` | DELETE | 删除岗位 | - | - |
| `/system/post/export` | `/api/system/post/export` | POST | 导出岗位 | - | 查询条件 (同list) |

### 2.6 字典类型 (system/dict/type)
| Spring Boot | Egg.js | 方法 | 说明 | 查询参数 | 请求体 |
|-------------|--------|------|------|----------|--------|
| `/system/dict/type/list` | `/api/system/dict/type/list` | GET | 字典类型列表 | `pageNum, pageSize, dictName, dictType, status, beginTime, endTime` | - |
| `/system/dict/type/{dictId}` | `/api/system/dict/type/:dictId` | GET | 字典类型详情 | - | - |
| `/system/dict/type` | `/api/system/dict/type` | POST | 新增字典类型 | - | `{dictName, dictType, status, remark}` |
| `/system/dict/type` | `/api/system/dict/type` | PUT | 修改字典类型 | - | `{dictId, dictName, dictType, status, remark}` |
| `/system/dict/type/{dictIds}` | `/api/system/dict/type/:dictIds` | DELETE | 删除字典类型 | - | - |
| `/system/dict/type/refreshCache` | `/api/system/dict/type/refreshCache` | DELETE | 刷新字典缓存 | - | - |
| `/system/dict/type/optionselect` | `/api/system/dict/type/optionselect` | GET | 字典选择框列表 | - | - |
| `/system/dict/type/export` | `/api/system/dict/type/export` | POST | 导出字典类型 | - | 查询条件 (同list) |

### 2.7 字典数据 (system/dict/data)
| Spring Boot | Egg.js | 方法 | 说明 | 查询参数 | 请求体 |
|-------------|--------|------|------|----------|--------|
| `/system/dict/data/list` | `/api/system/dict/data/list` | GET | 字典数据列表 | `pageNum, pageSize, dictType, dictLabel, status` | - |
| `/system/dict/data/{dictCode}` | `/api/system/dict/data/:dictCode` | GET | 字典数据详情 | - | - |
| `/system/dict/data/type/{dictType}` | `/api/system/dict/data/type/:dictType` | GET | 根据类型查询 | - | - |
| `/system/dict/data` | `/api/system/dict/data` | POST | 新增字典数据 | - | `{dictSort, dictLabel, dictValue, dictType, cssClass, listClass, isDefault, status, remark}` |
| `/system/dict/data` | `/api/system/dict/data` | PUT | 修改字典数据 | - | `{dictCode, dictSort, dictLabel, dictValue, dictType, ...}` |
| `/system/dict/data/{dictCodes}` | `/api/system/dict/data/:dictCodes` | DELETE | 删除字典数据 | - | - |
| `/system/dict/data/export` | `/api/system/dict/data/export` | POST | 导出字典数据 | - | 查询条件 (同list) |

### 2.8 参数配置 (system/config)
| Spring Boot | Egg.js | 方法 | 说明 | 查询参数 | 请求体 |
|-------------|--------|------|------|----------|--------|
| `/system/config/list` | `/api/system/config/list` | GET | 参数配置列表 | `pageNum, pageSize, configName, configKey, configType, beginTime, endTime` | - |
| `/system/config/{configId}` | `/api/system/config/:configId` | GET | 参数配置详情 | - | - |
| `/system/config/configKey/{configKey}` | `/api/system/config/configKey/:configKey` | GET | 根据键名查询 | - | - |
| `/system/config` | `/api/system/config` | POST | 新增参数配置 | - | `{configName, configKey, configValue, configType, remark}` |
| `/system/config` | `/api/system/config` | PUT | 修改参数配置 | - | `{configId, configName, configKey, configValue, configType, remark}` |
| `/system/config/{configIds}` | `/api/system/config/:configIds` | DELETE | 删除参数配置 | - | - |
| `/system/config/refreshCache` | `/api/system/config/refreshCache` | DELETE | 刷新参数缓存 | - | - |
| `/system/config/export` | `/api/system/config/export` | POST | 导出参数配置 | - | 查询条件 (同list) |

### 2.9 通知公告 (system/notice)
| Spring Boot | Egg.js | 方法 | 说明 | 查询参数 | 请求体 |
|-------------|--------|------|------|----------|--------|
| `/system/notice/list` | `/api/system/notice/list` | GET | 通知公告列表 | `pageNum, pageSize, noticeTitle, noticeType, createBy` | - |
| `/system/notice/{noticeId}` | `/api/system/notice/:noticeId` | GET | 通知公告详情 | - | - |
| `/system/notice` | `/api/system/notice` | POST | 新增通知公告 | - | `{noticeTitle, noticeType, noticeContent, status, remark}` |
| `/system/notice` | `/api/system/notice` | PUT | 修改通知公告 | - | `{noticeId, noticeTitle, noticeType, noticeContent, status, remark}` |
| `/system/notice/{noticeIds}` | `/api/system/notice/:noticeIds` | DELETE | 删除通知公告 | - | - |

---

## 三、系统监控模块

### 3.1 在线用户 (monitor/online)
| Spring Boot | Egg.js | 方法 | 说明 | 查询参数 | 请求体 |
|-------------|--------|------|------|----------|--------|
| `/monitor/online/list` | `/api/monitor/online/list` | GET | 在线用户列表 | `ipaddr, userName` | - |
| `/monitor/online/{tokenId}` | `/api/monitor/online/:tokenId` | DELETE | 强退用户 | - | - |

### 3.2 登录日志 (monitor/logininfor)
| Spring Boot | Egg.js | 方法 | 说明 | 查询参数 | 请求体 |
|-------------|--------|------|------|----------|--------|
| `/monitor/logininfor/list` | `/api/monitor/logininfor/list` | GET | 登录日志列表 | `pageNum, pageSize, ipaddr, userName, status, beginTime, endTime` | - |
| `/monitor/logininfor/{infoIds}` | `/api/monitor/logininfor/:infoIds` | DELETE | 删除登录日志 | - | - |
| `/monitor/logininfor/clean` | `/api/monitor/logininfor/clean` | DELETE | 清空登录日志 | - | - |
| `/monitor/logininfor/unlock/{userName}` | `/api/monitor/logininfor/unlock/:userName` | GET | 解锁用户 | - | - |
| `/monitor/logininfor/export` | `/api/monitor/logininfor/export` | POST | 导出登录日志 | - | 查询条件 (同list) |

### 3.3 操作日志 (monitor/operlog)
| Spring Boot | Egg.js | 方法 | 说明 | 查询参数 | 请求体 |
|-------------|--------|------|------|----------|--------|
| `/monitor/operlog/list` | `/api/monitor/operlog/list` | GET | 操作日志列表 | `pageNum, pageSize, title, operName, businessType, status, beginTime, endTime` | - |
| `/monitor/operlog/{operIds}` | `/api/monitor/operlog/:operIds` | DELETE | 删除操作日志 | - | - |
| `/monitor/operlog/clean` | `/api/monitor/operlog/clean` | DELETE | 清空操作日志 | - | - |
| `/monitor/operlog/export` | `/api/monitor/operlog/export` | POST | 导出操作日志 | - | 查询条件 (同list) |

### 3.4 服务监控 (monitor/server)
| Spring Boot | Egg.js | 方法 | 说明 | 查询参数 | 请求体 |
|-------------|--------|------|------|----------|--------|
| `/monitor/server` | `/api/monitor/server` | GET | 服务器信息 | - | - |

**返回数据包含**：
- CPU 信息 (核心数、使用率)
- 内存信息 (总量、已用、使用率)
- JVM 信息 (总量、已用、使用率)
- 磁盘信息 (总量、已用、使用率)
- 系统信息 (操作系统、主机名、IP 地址)

### 3.5 缓存监控 (monitor/cache)
| Spring Boot | Egg.js | 方法 | 说明 | 查询参数 | 请求体 |
|-------------|--------|------|------|----------|--------|
| `/monitor/cache` | `/api/monitor/cache` | GET | 缓存信息 | - | - |
| `/monitor/cache/getNames` | `/api/monitor/cache/getNames` | GET | 缓存名称列表 | - | - |
| `/monitor/cache/getKeys/{cacheName}` | `/api/monitor/cache/getKeys/:cacheName` | GET | 缓存键名列表 | - | - |
| `/monitor/cache/getValue/{cacheName}/{cacheKey}` | `/api/monitor/cache/getValue/:cacheName/:cacheKey` | GET | 缓存内容 | - | - |
| `/monitor/cache/clearCacheName/{cacheName}` | `/api/monitor/cache/clearCacheName/:cacheName` | DELETE | 清空缓存名称 | - | - |
| `/monitor/cache/clearCacheKey/{cacheKey}` | `/api/monitor/cache/clearCacheKey/:cacheKey` | DELETE | 清空缓存键值 | - | - |
| `/monitor/cache/clearCacheAll` | `/api/monitor/cache/clearCacheAll` | DELETE | 清空全部缓存 | - | - |

### 3.6 定时任务 (monitor/job)
| Spring Boot | Egg.js | 方法 | 说明 | 查询参数 | 请求体 |
|-------------|--------|------|------|----------|--------|
| `/monitor/job/list` | `/api/monitor/job/list` | GET | 定时任务列表 | `pageNum, pageSize, jobName, jobGroup, status` | - |
| `/monitor/job/{jobId}` | `/api/monitor/job/:jobId` | GET | 定时任务详情 | - | - |
| `/monitor/job` | `/api/monitor/job` | POST | 新增定时任务 | - | `{jobName, jobGroup, invokeTarget, cronExpression, misfirePolicy, concurrent, status, ...}` |
| `/monitor/job` | `/api/monitor/job` | PUT | 修改定时任务 | - | `{jobId, jobName, jobGroup, invokeTarget, cronExpression, ...}` |
| `/monitor/job/{jobIds}` | `/api/monitor/job/:jobIds` | DELETE | 删除定时任务 | - | - |
| `/monitor/job/changeStatus` | `/api/monitor/job/changeStatus` | PUT | 修改状态 | - | `{jobId, status}` |
| `/monitor/job/run` | `/api/monitor/job/run` | PUT | 立即执行 | - | `{jobId, jobGroup}` |
| `/monitor/job/export` | `/api/monitor/job/export` | POST | 导出定时任务 | - | 查询条件 (同list) |

### 3.7 定时任务日志 (monitor/jobLog) ✨ 新增
| Spring Boot | Egg.js | 方法 | 说明 | 查询参数 | 请求体 |
|-------------|--------|------|------|----------|--------|
| `/monitor/jobLog/list` | `/api/monitor/jobLog/list` | GET | 调度日志列表 | `pageNum, pageSize, jobName, jobGroup, status, beginTime, endTime` | - |
| `/monitor/jobLog/{jobLogId}` | `/api/monitor/jobLog/:jobLogId` | DELETE | 删除调度日志 | - | - |
| `/monitor/jobLog/clean` | `/api/monitor/jobLog/clean` | DELETE | 清空调度日志 | - | - |
| `/monitor/jobLog/export` | `/api/monitor/jobLog/export` | POST | 导出调度日志 | - | 查询条件 (同list) |

---

## 四、系统工具模块

### 4.1 代码生成 (tool/gen)
| Spring Boot | Egg.js | 方法 | 说明 | 查询参数 | 请求体 |
|-------------|--------|------|------|----------|--------|
| `/tool/gen/list` | `/api/tool/gen/list` | GET | 表列表（分页） | `pageNum, pageSize, tableName, tableComment, beginTime, endTime` | - |
| `/tool/gen/{tableId}` | `/api/tool/gen/:tableId` | GET | 表详情 | - | - |
| `/tool/gen/db/list` | `/api/tool/gen/db/list` | GET | 数据库表列表 | `pageNum, pageSize, tableName, tableComment` | - |
| `/tool/gen/column/{tableId}` | `/api/tool/gen/column/:tableId` | GET | 表字段列表 | - | - |
| `/tool/gen/importTable` | `/api/tool/gen/importTable` | POST | 导入表 | `tables` | - |
| `/tool/gen/createTable` | `/api/tool/gen/createTable` | POST | 建表 ✨ 新增 | `sql` | - |
| `/tool/gen` | `/api/tool/gen` | PUT | 修改生成配置 | - | `{tableId, tableName, tableComment, className, functionAuthor, ...}` |
| `/tool/gen/{tableIds}` | `/api/tool/gen/:tableIds` | DELETE | 删除表配置 | - | - |
| `/tool/gen/preview/{tableId}` | `/api/tool/gen/preview/:tableId` | GET | 预览代码 | - | - |
| `/tool/gen/download/{tableName}` | `/api/tool/gen/download/:tableName` | GET | 下载代码 | - | - |
| `/tool/gen/genCode/{tableName}` | `/api/tool/gen/genCode/:tableName` | GET | 生成代码（自定义路径） | - | - |
| `/tool/gen/synchDb/{tableName}` | `/api/tool/gen/synchDb/:tableName` | GET | 同步数据库 | - | - |
| `/tool/gen/batchGenCode` | `/api/tool/gen/batchGenCode` | GET | 批量生成代码 | `tables` | - |

---

## 五、个人中心模块

### 5.1 用户个人信息 (system/user/profile)
| Spring Boot | Egg.js | 方法 | 说明 | 查询参数 | 请求体 |
|-------------|--------|------|------|----------|--------|
| `/system/user/profile` | `/api/system/user/profile` | GET | 个人信息 | - | - |
| `/system/user/profile` | `/api/system/user/profile` | PUT | 修改个人信息 | - | `{nickName, email, phonenumber, sex, ...}` |
| `/system/user/profile/updatePwd` | `/api/system/user/profile/updatePwd` | PUT | 修改密码 | - | `{oldPassword, newPassword}` |
| `/system/user/profile/avatar` | `/api/system/user/profile/avatar` | POST | 上传头像 | - | `avatarfile` (multipart) |

**说明**：
- 头像上传使用 `Content-Type: multipart/form-data`
- 上传成功后返回头像访问路径

---

## 六、公共接口模块

### 6.1 公共接口 (common)
| Spring Boot | Egg.js | 方法 | 说明 | 查询参数 | 请求体 |
|-------------|--------|------|------|----------|--------|
| `/common/download` | `/api/common/download` | GET | 文件下载 | `fileName, delete` | - |
| `/common/download/resource` | `/api/common/download/resource` | GET | 本地资源下载 | `resource` | - |
| `/common/upload` | `/api/common/upload` | POST | 文件上传 | - | `file` (multipart) |

**说明**：
- `delete=true` 表示下载后删除文件
- `resource` 为文件相对路径
- 上传文件大小限制默认 10MB，可配置

---

## 七、接口请求/响应格式说明

### 7.1 请求格式

#### GET 请求 (查询参数)
```http
GET /api/system/user/list?pageNum=1&pageSize=10&userName=admin
Authorization: Bearer {token}
```

#### POST/PUT 请求 (JSON)
```http
POST /api/system/user
Content-Type: application/json
Authorization: Bearer {token}

{
  "userName": "test",
  "nickName": "测试用户",
  "email": "test@example.com",
  "phonenumber": "15888888888",
  "sex": "0",
  "password": "123456"
}
```

#### POST 请求 (文件上传)
```http
POST /api/common/upload
Content-Type: multipart/form-data
Authorization: Bearer {token}

file: [binary data]
```

### 7.2 响应格式

#### 成功响应
```json
{
  "code": 200,
  "msg": "操作成功",
  "data": {
    // 业务数据
  }
}
```

#### 分页响应
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

#### 失败响应
```json
{
  "code": 500,
  "msg": "操作失败"
}
```

#### 验证失败响应
```json
{
  "code": 400,
  "msg": "参数错误：用户名不能为空"
}
```

#### 未授权响应
```json
{
  "code": 401,
  "msg": "认证失败，无法访问系统资源"
}
```

#### 无权限响应
```json
{
  "code": 403,
  "msg": "没有权限，请联系管理员授权"
}
```

---

## 八、HTTP 状态码说明

| 状态码 | 说明 | 使用场景 | 前端处理 |
|--------|------|----------|----------|
| 200 | 成功 | 操作成功 | 正常处理 |
| 400 | 错误请求 | 参数验证失败 | 提示用户修正输入 |
| 401 | 未授权 | Token 失效或未登录 | 跳转登录页 |
| 403 | 禁止访问 | 无权限操作 | 提示权限不足 |
| 404 | 未找到 | 资源不存在 | 提示资源不存在 |
| 500 | 服务器错误 | 系统内部错误 | 提示稍后重试 |

---

## 九、请求头说明

### 9.1 必需请求头
```http
Content-Type: application/json           # POST/PUT JSON 数据
Authorization: Bearer {token}             # 认证令牌（登录后）
```

### 9.2 可选请求头
```http
X-Request-ID: {uuid}                     # 请求追踪ID
User-Agent: {userAgent}                  # 用户代理
repeatSubmit: false                      # 是否允许重复提交（默认true）
isToken: false                           # 是否需要Token验证（默认true）
```

---

## 十、分页参数说明

### 10.1 请求参数（查询字符串）
```
pageNum=1          # 页码（从1开始）
pageSize=10        # 每页条数（默认10）
```

### 10.2 响应格式
```json
{
  "code": 200,
  "msg": "查询成功",
  "rows": [...],         // 列表数据
  "total": 100           // 总记录数
}
```

### 10.3 前端分页组件示例
```javascript
// 分页参数
queryParams: {
  pageNum: 1,
  pageSize: 10,
  // ... 其他查询条件
}

// 处理分页响应
const { rows, total } = response.data;
this.dataList = rows;
this.total = total;
```

---

## 十一、时间格式说明

### 11.1 统一时间格式
```
YYYY-MM-DD HH:mm:ss
```

### 11.2 示例
```
2025-10-27 14:30:00
```

### 11.3 时间范围查询
```
beginTime=2025-10-01 00:00:00
endTime=2025-10-27 23:59:59
```

---

## 十二、导出功能说明

### 12.1 Excel 导出

#### 请求方式
```http
POST /api/system/user/export
Content-Type: application/json
Authorization: Bearer {token}

{
  // 导出条件（同列表查询条件）
  "userName": "admin",
  "status": "0"
}
```

#### 响应格式
```
Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
Content-Disposition: attachment; filename=user_20251027.xlsx

[Excel二进制数据]
```

#### 前端处理示例
```javascript
// 导出用户
export function exportUser(query) {
  return request({
    url: '/system/user/export',
    method: 'post',
    data: query,
    responseType: 'blob'
  })
}

// 下载文件
exportUser(queryParams).then(response => {
  const blob = new Blob([response.data]);
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'user_' + Date.now() + '.xlsx';
  link.click();
  window.URL.revokeObjectURL(url);
});
```

### 12.2 导入模板下载

#### 请求方式
```http
POST /api/system/user/importTemplate
Authorization: Bearer {token}
```

#### 响应格式
```
Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
Content-Disposition: attachment; filename=user_template.xlsx

[Excel模板]
```

---

## 十三、文件上传说明

### 13.1 单文件上传

#### 请求格式
```http
POST /api/common/upload
Content-Type: multipart/form-data
Authorization: Bearer {token}

file: [binary data]
```

#### 响应格式
```json
{
  "code": 200,
  "msg": "操作成功",
  "fileName": "20251027/abc123.jpg",
  "newFileName": "abc123.jpg",
  "originalFilename": "test.jpg",
  "url": "/profile/upload/20251027/abc123.jpg"
}
```

#### 前端示例
```javascript
const formData = new FormData();
formData.append('file', file);

request({
  url: '/common/upload',
  method: 'post',
  headers: {
    'Content-Type': 'multipart/form-data'
  },
  data: formData
}).then(response => {
  console.log('文件路径:', response.data.url);
});
```

### 13.2 文件大小限制
- 默认限制：10MB
- 可配置项：`config.multipart.fileSize`

### 13.3 支持的文件类型
- 图片：.jpg, .jpeg, .png, .gif
- 文档：.doc, .docx, .xls, .xlsx, .pdf, .txt
- 压缩包：.zip, .rar

---

## 十四、数据字典使用说明

### 14.1 获取字典数据
```http
GET /api/system/dict/data/type/sys_user_sex
```

### 14.2 响应示例
```json
{
  "code": 200,
  "msg": "查询成功",
  "data": [
    {
      "dictLabel": "男",
      "dictValue": "0",
      "dictType": "sys_user_sex"
    },
    {
      "dictLabel": "女",
      "dictValue": "1",
      "dictType": "sys_user_sex"
    }
  ]
}
```

### 14.3 常用字典类型
- `sys_user_sex` - 用户性别
- `sys_normal_disable` - 系统状态
- `sys_show_hide` - 显示状态
- `sys_yes_no` - 是否
- `sys_job_status` - 任务状态
- `sys_job_group` - 任务分组
- `sys_notice_type` - 通知类型
- `sys_notice_status` - 通知状态
- `sys_oper_type` - 操作类型
- `sys_common_status` - 通用状态

---

## 十五、数据权限说明

### 15.1 数据权限范围
| 权限标识 | 说明 | 数据范围 |
|---------|------|----------|
| 1 | 全部数据权限 | 查看所有数据 |
| 2 | 自定数据权限 | 查看指定部门数据 |
| 3 | 本部门数据权限 | 查看本部门数据 |
| 4 | 本部门及以下数据权限 | 查看本部门及子部门数据 |
| 5 | 仅本人数据权限 | 仅查看本人数据 |

### 15.2 数据权限过滤
后端在执行数据查询时，会根据用户角色的数据权限范围自动添加 SQL 过滤条件。

---

## 十六、缓存说明

### 16.1 缓存Key命名规范
```
login_tokens:{tokenId}              # 登录Token
sys_config:{configKey}               # 系统配置
sys_dict:{dictType}                  # 字典数据
captcha_codes:{uuid}                 # 验证码
pwd_err_cnt:{userName}               # 密码错误次数
repeat_submit:{cacheKey}             # 防重复提交
```

### 16.2 缓存过期时间
- 登录Token：7天（可配置）
- 验证码：5分钟
- 字典数据：永久（手动刷新）
- 系统配置：永久（手动刷新）
- 防重复提交：10秒

---

## 十七、错误码说明

| 错误码 | 说明 | 常见原因 | 解决方案 |
|--------|------|----------|----------|
| 200 | 成功 | 操作成功 | - |
| 400 | 错误请求 | 参数验证失败 | 检查请求参数 |
| 401 | 未授权 | Token失效/未登录 | 重新登录 |
| 403 | 禁止访问 | 无操作权限 | 联系管理员授权 |
| 404 | 未找到 | 资源不存在 | 检查请求路径 |
| 500 | 服务器错误 | 系统异常 | 查看服务器日志 |
| 601 | 用户名或密码错误 | 登录失败 | 重新输入 |
| 602 | 验证码错误 | 验证码输入错误 | 重新获取验证码 |
| 603 | 账号已被锁定 | 密码错误次数过多 | 联系管理员解锁 |

---

## 十八、性能优化建议

### 18.1 分页查询优化
- 避免查询大量数据，建议 pageSize ≤ 100
- 使用索引字段作为查询条件
- 避免使用 `LIKE '%keyword%'` 模糊查询

### 18.2 导出优化
- 导出大量数据时使用异步导出
- 限制单次导出记录数（建议 ≤ 10000）
- 使用筛选条件缩小导出范围

### 18.3 上传优化
- 控制单个文件大小（≤ 10MB）
- 大文件使用分片上传
- 图片自动压缩

### 18.4 缓存优化
- 合理设置缓存过期时间
- 热点数据提前加载到缓存
- 定期清理过期缓存

---

## 十九、安全建议

### 19.1 Token 安全
- Token 存储在 localStorage/sessionStorage
- 定期刷新 Token（接近过期时）
- 退出登录时清除 Token

### 19.2 密码安全
- 密码长度 ≥ 6 位
- 密码错误锁定机制（5次错误锁定10分钟）
- 定期修改密码（可配置）

### 19.3 权限验证
- 前端路由权限控制
- 后端接口权限验证
- 按钮级权限控制

### 19.4 防攻击
- 验证码防暴力破解
- 防重复提交
- SQL 注入防护
- XSS 攻击防护
- CSRF 防护

---

## 二十、接口对比总结

### 20.1 统计数据
| 模块 | Spring Boot 接口数 | Egg.js 已实现 | 待实现 |
|------|-------------------|---------------|--------|
| 认证授权 | 6 | 6 | 0 |
| 用户管理 | 13 | 13 | 0 |
| 角色管理 | 14 | 14 | 0 |
| 菜单管理 | 7 | 7 | 0 |
| 部门管理 | 8 | 8 | 0 |
| 岗位管理 | 6 | 6 | 0 |
| 字典类型 | 8 | 8 | 0 |
| 字典数据 | 7 | 7 | 0 |
| 参数配置 | 8 | 8 | 0 |
| 通知公告 | 5 | 5 | 0 |
| 在线用户 | 2 | 2 | 0 |
| 登录日志 | 5 | 5 | 0 |
| 操作日志 | 4 | 4 | 0 |
| 服务监控 | 1 | 1 | 0 |
| 缓存监控 | 7 | 7 | 0 |
| 定时任务 | 8 | 8 | 0 |
| 定时任务日志 | 4 | 0 | 4 ✨ |
| 代码生成 | 12 | 12 | 0 |
| 个人中心 | 4 | 4 | 0 |
| 公共接口 | 3 | 3 | 0 |
| **合计** | **132** | **128** | **4** |

### 20.2 主要差异
1. ✨ **新增接口**：定时任务日志模块（4个接口）
2. ✨ **新增接口**：代码生成建表接口 (`/tool/gen/createTable`)
3. 所有核心功能已完成实现

---

**文档版本**: v2.0  
**更新日期**: 2025-10-27  
**维护者**: ruoyi-eggjs 团队  
**参考项目**:
- [RuoYi-Vue3](https://github.com/yangzongzhuan/RuoYi-Vue3) - 前端
- [RuoYi-Vue-SpringBoot3](https://gitee.com/y_project/RuoYi-Vue) - 后端

---

## 📞 反馈与贡献

如发现接口映射错误或遗漏，欢迎提交 Issue 或 PR！
