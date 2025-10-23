# RuoYi Spring Boot 到 Egg.js 重构计划

## 项目概述

将 **RuoYi-Vue-springboot3** (Java Spring Boot 项目) 重构为 **ruoyi-eggjs** (Node.js Egg.js 项目)

---

## 一、两个项目架构对比分析

### 1.1 Spring Boot 项目结构 (RuoYi-Vue-springboot3)

```
RuoYi-Vue-springboot3/
├── ruoyi-admin/              # 入口模块，包含所有 Controller
│   └── web/controller/
│       ├── common/           # 公共控制器（验证码、文件上传等）
│       ├── monitor/          # 监控控制器（日志、缓存、在线用户等）
│       ├── system/           # 系统管理控制器（用户、角色、菜单等）
│       └── tool/             # 工具控制器（测试）
│
├── ruoyi-system/             # 系统核心业务模块
│   ├── domain/               # 实体类
│   ├── mapper/               # MyBatis Mapper 接口
│   └── service/              # 业务服务层
│
├── ruoyi-framework/          # 框架配置模块
│   └── config/               # Spring 配置（Security、Redis、Druid等）
│
├── ruoyi-common/             # 公共工具模块
│   ├── annotation/           # 注解（日志、权限、Excel等）
│   ├── constant/             # 常量定义
│   ├── core/                 # 核心类（BaseController、AjaxResult等）
│   ├── enums/                # 枚举类
│   ├── exception/            # 异常类
│   ├── filter/               # 过滤器（XSS、重复请求等）
│   └── utils/                # 工具类
│
├── ruoyi-quartz/             # 定时任务模块
├── ruoyi-generator/          # 代码生成模块
└── sql/                      # 数据库脚本
    └── ry_20250522.sql
```

**技术栈**：
- Spring Boot 3.5.4 + Java 17
- MyBatis 3.0.4
- Spring Security + JWT
- Redis (缓存、限流)
- Druid (数据库连接池)
- MySQL 8.2.0
- Swagger/SpringDoc (API文档)

---

### 1.2 Egg.js 项目结构 (ruoyi-eggjs)

```
ruoyi-eggjs/
├── app/
│   ├── controller/
│   │   └── api/              # API 控制器
│   │       └── index.js      # 示例控制器
│   │
│   ├── service/              # 业务服务层
│   │   ├── db/               # 数据库服务（自动生成）
│   │   │   └── mysql/ruoyi/  # 若依系统表服务
│   │   └── upload.js         # 文件上传服务
│   │
│   ├── middleware/           # 中间件
│   │   ├── accessControl.js  # JWT 访问控制
│   │   └── formatBody.js     # 响应格式化
│   │
│   └── public/               # 静态资源
│       └── uploads/          # 上传文件目录
│
├── config/                   # 配置文件
│   ├── config.default.js     # 默认配置
│   ├── config.local.js       # 本地开发配置
│   ├── config.prod.js        # 生产环境配置
│   └── plugin.js             # 插件配置
│
├── mapper/                   # MyBatis XML 映射文件
│   └── mysql/ruoyi/
│       ├── SysUserMapper.xml
│       ├── SysRoleMapper.xml
│       └── ...（15个Mapper文件）
│
├── cache/                    # 文件缓存目录
└── logs/                     # 日志目录
```

**技术栈**：
- Node.js >= 20.0.0
- Egg.js 3.x
- 自研插件：
  - ruoyi-eggjs-mybatis (MyBatis XML 支持)
  - ruoyi-eggjs-mysql (MySQL 数据库操作)
  - ruoyi-eggjs-cache (多级缓存)
  - ruoyi-eggjs-ratelimiter (API 限流)
  - ruoyi-eggjs-cli (代码生成工具)
- egg-jwt (JWT 认证)
- egg-decorator-router (路由注解)

---

## 二、核心功能模块对比

### 2.1 Spring Boot 项目核心功能（18个模块）

| 序号 | 功能模块 | 控制器 | 说明 |
|------|---------|--------|------|
| 1 | 用户管理 | SysUserController | 用户 CRUD、权限分配、导入导出 |
| 2 | 部门管理 | SysDeptController | 组织架构管理，树形结构 |
| 3 | 岗位管理 | SysPostController | 职务配置 |
| 4 | 菜单管理 | SysMenuController | 菜单权限、按钮权限 |
| 5 | 角色管理 | SysRoleController | 角色权限分配、数据范围 |
| 6 | 字典管理 | SysDictTypeController, SysDictDataController | 固定数据维护 |
| 7 | 参数管理 | SysConfigController | 动态配置参数 |
| 8 | 通知公告 | SysNoticeController | 系统公告发布 |
| 9 | 操作日志 | SysOperlogController | 操作记录查询 |
| 10 | 登录日志 | SysLogininforController | 登录记录查询 |
| 11 | 在线用户 | SysUserOnlineController | 活跃用户监控 |
| 12 | 定时任务 | (ruoyi-quartz模块) | 任务调度 |
| 13 | 代码生成 | (ruoyi-generator模块) | 代码生成工具 |
| 14 | 系统接口 | SwaggerConfig | API 文档 |
| 15 | 服务监控 | ServerController | CPU、内存监控 |
| 16 | 缓存监控 | CacheController | Redis 缓存监控 |
| 17 | 在线构建器 | - | 表单构建器 |
| 18 | 连接池监视 | - | Druid 监控 |

### 2.2 Egg.js 项目已实现功能

| 功能 | 状态 | 说明 |
|------|------|------|
| 项目框架 | ✅ 已完成 | Egg.js 框架搭建 |
| MyBatis XML | ✅ 已完成 | 支持 XML 方式编写 SQL |
| 代码生成 | ✅ 已完成 | 基于 Mapper 自动生成 Service |
| JWT 认证 | ✅ 已完成 | 用户认证和授权 |
| 多级缓存 | ✅ 已完成 | 内存、文件、Redis 缓存 |
| API 限流 | ✅ 已完成 | 请求频率限制 |
| 文件上传 | ✅ 已完成 | 文件上传功能 |
| 统一响应 | ✅ 已完成 | 统一 JSON 响应格式 |

### 2.3 待重构功能清单

**核心业务模块（优先级：高）**：
1. ❌ 用户管理完整实现
2. ❌ 部门管理
3. ❌ 岗位管理
4. ❌ 菜单管理
5. ❌ 角色管理
6. ❌ 字典管理
7. ❌ 参数管理

**日志监控模块（优先级：中）**：
8. ❌ 操作日志
9. ❌ 登录日志
10. ❌ 在线用户
11. ❌ 缓存监控
12. ❌ 服务监控

**扩展功能模块（优先级：低）**：
13. ❌ 通知公告
14. ❌ 定时任务
15. ❌ 代码生成（前端代码）
16. ❌ 系统接口文档
17. ❌ 在线构建器
18. ❌ 连接池监视

---

## 三、数据库表结构分析

### 3.1 核心系统表（共15张）

```sql
-- 用户信息表
sys_user                -- 用户基础信息

-- 组织架构表
sys_dept                -- 部门表
sys_post                -- 岗位表

-- 权限管理表
sys_role                -- 角色表
sys_menu                -- 菜单/权限表
sys_role_dept           -- 角色-部门关联表
sys_role_menu           -- 角色-菜单关联表
sys_user_role           -- 用户-角色关联表
sys_user_post           -- 用户-岗位关联表

-- 系统配置表
sys_dict_type           -- 字典类型表
sys_dict_data           -- 字典数据表
sys_config              -- 参数配置表
sys_notice              -- 通知公告表

-- 日志记录表
sys_oper_log            -- 操作日志表
sys_logininfor          -- 登录日志表
```

### 3.2 已生成的 Mapper 文件

Egg.js 项目已有 15 个 Mapper XML 文件：
- ✅ SysUserMapper.xml
- ✅ SysDeptMapper.xml
- ✅ SysPostMapper.xml
- ✅ SysRoleMapper.xml
- ✅ SysMenuMapper.xml
- ✅ SysRoleDeptMapper.xml
- ✅ SysRoleMenuMapper.xml
- ✅ SysUserRoleMapper.xml
- ✅ SysUserPostMapper.xml
- ✅ SysDictTypeMapper.xml
- ✅ SysDictDataMapper.xml
- ✅ SysConfigMapper.xml
- ✅ SysNoticeMapper.xml
- ✅ SysOperLogMapper.xml
- ✅ SysLogininforMapper.xml

**说明**：Mapper XML 文件已完整迁移，自动生成的 Service 层代码也已存在。

---

## 四、重构实施计划

### 阶段一：用户认证与权限体系（Week 1-2）

#### 1. 登录认证模块
**对应 Spring Boot**：
- `SysLoginController.java` (登录、登出、获取用户信息)
- `SysRegisterController.java` (用户注册)
- `CaptchaController.java` (验证码)

**需要实现 Egg.js**：
```javascript
// app/controller/system/login.js
- POST   /login          // 用户登录
- POST   /logout         // 用户登出
- GET    /getInfo        // 获取用户信息
- GET    /getRouters     // 获取路由信息
- POST   /register       // 用户注册
- GET    /captchaImage   // 验证码图片
```

**涉及技术**：
- JWT Token 生成与验证（已有）
- BCrypt 密码加密
- 验证码生成（svg-captcha）
- Redis 缓存 Token

#### 2. 用户管理模块
**对应 Spring Boot**：
- `SysUserController.java`（13个接口）
- `SysUserServiceImpl.java`

**需要实现 Egg.js**：
```javascript
// app/controller/system/user.js
- GET    /system/user/list           // 用户列表
- GET    /system/user/:userId        // 用户详情
- POST   /system/user                // 新增用户
- PUT    /system/user                // 修改用户
- DELETE /system/user/:userIds       // 删除用户
- PUT    /system/user/resetPwd       // 重置密码
- PUT    /system/user/changeStatus   // 修改状态
- GET    /system/user/authRole/:userId  // 授权角色
- PUT    /system/user/authRole       // 用户授权
- POST   /system/user/export         // 导出用户
- POST   /system/user/import         // 导入用户
- GET    /system/user/importTemplate // 导入模板
- GET    /system/user/deptTree        // 部门树
```

**涉及技术**：
- 数据权限过滤
- Excel 导入导出（node-xlsx）
- 事务处理

#### 3. 角色管理模块
**对应 Spring Boot**：
- `SysRoleController.java`

**需要实现 Egg.js**：
```javascript
// app/controller/system/role.js
- GET    /system/role/list           // 角色列表
- GET    /system/role/:roleId        // 角色详情
- POST   /system/role                // 新增角色
- PUT    /system/role                // 修改角色
- DELETE /system/role/:roleIds       // 删除角色
- PUT    /system/role/changeStatus   // 修改状态
- PUT    /system/role/dataScope      // 数据权限
- GET    /system/role/deptTree/:roleId // 部门树选择
```

---

### 阶段二：组织架构管理（Week 3）

#### 4. 部门管理模块
```javascript
// app/controller/system/dept.js
- GET    /system/dept/list           // 部门列表（树形）
- GET    /system/dept/:deptId        // 部门详情
- POST   /system/dept                // 新增部门
- PUT    /system/dept                // 修改部门
- DELETE /system/dept/:deptId        // 删除部门
- GET    /system/dept/list/exclude/:deptId // 排除节点
```

**关键技术**：
- 树形结构处理
- 父子节点关联
- 祖级列表 (ancestors) 维护

#### 5. 岗位管理模块
```javascript
// app/controller/system/post.js
- GET    /system/post/list           // 岗位列表
- GET    /system/post/:postId        // 岗位详情
- POST   /system/post                // 新增岗位
- PUT    /system/post                // 修改岗位
- DELETE /system/post/:postIds       // 删除岗位
- POST   /system/post/export         // 导出岗位
```

#### 6. 菜单管理模块
```javascript
// app/controller/system/menu.js
- GET    /system/menu/list           // 菜单列表（树形）
- GET    /system/menu/:menuId        // 菜单详情
- POST   /system/menu                // 新增菜单
- PUT    /system/menu                // 修改菜单
- DELETE /system/menu/:menuId        // 删除菜单
- GET    /system/menu/treeselect     // 菜单树选择
- GET    /system/menu/roleMenuTreeselect/:roleId // 角色菜单树
```

**关键技术**：
- 菜单树生成
- 权限标识管理
- 按钮权限控制

---

### 阶段三：系统配置管理（Week 4）

#### 7. 字典管理模块
```javascript
// app/controller/system/dict/type.js (字典类型)
- GET    /system/dict/type/list
- GET    /system/dict/type/:dictId
- POST   /system/dict/type
- PUT    /system/dict/type
- DELETE /system/dict/type/:dictIds
- POST   /system/dict/type/export
- GET    /system/dict/type/optionselect
- POST   /system/dict/type/refreshCache

// app/controller/system/dict/data.js (字典数据)
- GET    /system/dict/data/list
- GET    /system/dict/data/:dictCode
- GET    /system/dict/data/type/:dictType
- POST   /system/dict/data
- PUT    /system/dict/data
- DELETE /system/dict/data/:dictCodes
- POST   /system/dict/data/export
```

#### 8. 参数管理模块
```javascript
// app/controller/system/config.js
- GET    /system/config/list
- GET    /system/config/:configId
- GET    /system/config/configKey/:configKey
- POST   /system/config
- PUT    /system/config
- DELETE /system/config/:configIds
- POST   /system/config/export
- POST   /system/config/refreshCache
```

#### 9. 通知公告模块
```javascript
// app/controller/system/notice.js
- GET    /system/notice/list
- GET    /system/notice/:noticeId
- POST   /system/notice
- PUT    /system/notice
- DELETE /system/notice/:noticeIds
```

---

### 阶段四：日志监控管理（Week 5）

#### 10. 操作日志模块
```javascript
// app/controller/monitor/operlog.js
- GET    /monitor/operlog/list
- DELETE /monitor/operlog/:operIds
- POST   /monitor/operlog/export
- POST   /monitor/operlog/clean        // 清空日志
```

**实现要点**：
- 创建日志记录中间件
- AOP 拦截器模式
- 异步日志写入

#### 11. 登录日志模块
```javascript
// app/controller/monitor/logininfor.js
- GET    /monitor/logininfor/list
- DELETE /monitor/logininfor/:infoIds
- POST   /monitor/logininfor/export
- POST   /monitor/logininfor/clean
- GET    /monitor/logininfor/unlock/:userName  // 解锁用户
```

#### 12. 在线用户模块
```javascript
// app/controller/monitor/online.js
- GET    /monitor/online/list
- DELETE /monitor/online/:tokenId      // 强退用户
```

**实现要点**：
- 基于 Redis 存储在线用户
- Token 管理

---

### 阶段五：系统监控模块（Week 6）

#### 13. 缓存监控
```javascript
// app/controller/monitor/cache.js
- GET    /monitor/cache                // 缓存信息
- GET    /monitor/cache/getNames       // 缓存名称列表
- GET    /monitor/cache/getKeys/:cacheName // 缓存键名列表
- GET    /monitor/cache/getValue/:cacheName/:cacheKey // 缓存内容
- DELETE /monitor/cache/clearCacheName/:cacheName    // 清理指定缓存
- DELETE /monitor/cache/clearCacheKey/:cacheKey      // 清理指定键值
- DELETE /monitor/cache/clearCacheAll                // 清理全部缓存
```

#### 14. 服务监控
```javascript
// app/controller/monitor/server.js
- GET    /monitor/server                // 服务器信息
```

**实现要点**：
- 使用 `os` 模块获取系统信息
- CPU、内存、磁盘监控
- Node.js 进程信息

---

### 阶段六：扩展功能模块（Week 7-8）

#### 15. 定时任务模块
```javascript
// app/controller/monitor/job.js
- GET    /monitor/job/list
- GET    /monitor/job/:jobId
- POST   /monitor/job
- PUT    /monitor/job
- DELETE /monitor/job/:jobIds
- PUT    /monitor/job/changeStatus
- POST   /monitor/job/run               // 立即执行
```

**实现要点**：
- 使用 `node-schedule` 或 Egg.js Schedule
- 持久化任务配置
- 任务执行日志

#### 16. 代码生成模块（增强）
```javascript
// app/controller/tool/gen.js
- GET    /tool/gen/list                 // 表列表
- POST   /tool/gen/importTable          // 导入表
- POST   /tool/gen/batchGenCode         // 批量生成代码
- GET    /tool/gen/:tableId             // 表详情
- PUT    /tool/gen                      // 修改生成配置
- DELETE /tool/gen/:tableIds            // 删除表
- GET    /tool/gen/preview/:tableId     // 预览代码
- GET    /tool/gen/download/:tableName  // 下载代码
```

**实现要点**：
- 基于数据库表结构生成
- 支持 Vue 前端代码生成
- 模板引擎（Handlebars）

#### 17. 系统接口文档
```javascript
// 使用 egg-swagger-doc 插件
- 自动生成 Swagger 文档
- 接口在线测试
```

---

## 五、技术实施细节

### 5.1 核心工具类迁移

**Java -> Node.js 工具类对照表**：

| Java 工具类 | Node.js 实现 | 说明 |
|-------------|--------------|------|
| SecurityUtils | app/utils/security.js | 密码加密、用户信息获取 |
| StringUtils | lodash | 字符串工具 |
| DateUtils | dayjs | 日期处理 |
| ServletUtils | ctx.request/ctx.response | HTTP 请求响应 |
| ExcelUtil | node-xlsx, exceljs | Excel 导入导出 |
| FileUtils | fs-extra | 文件操作 |
| IpUtils | request-ip | IP 获取 |
| IdUtils | nanoid, uuid | ID 生成 |
| Md5Utils | crypto | MD5 加密 |

### 5.2 中间件设计

```javascript
// app/middleware/log.js - 操作日志中间件
// 记录所有 API 操作

// app/middleware/permission.js - 权限校验中间件
// 基于 @PreAuthorize 注解实现权限控制

// app/middleware/dataScope.js - 数据权限中间件
// 实现数据范围过滤

// app/middleware/repeatSubmit.js - 防重复提交中间件
// 防止表单重复提交

// app/middleware/xss.js - XSS 过滤中间件
// 防止 XSS 攻击
```

### 5.3 响应格式统一

**Spring Boot AjaxResult**：
```json
{
  "code": 200,
  "msg": "操作成功",
  "data": {...}
}
```

**Egg.js 已实现**（formatBody 中间件）：
```json
{
  "code": 200,
  "msg": "",
  "data": {...}
}
```

### 5.4 异常处理机制

```javascript
// app/middleware/error_handler.js
// 统一异常捕获和处理
// 对应 Spring Boot 的 GlobalExceptionHandler

module.exports = () => {
  return async function errorHandler(ctx, next) {
    try {
      await next();
    } catch (err) {
      // 记录异常日志
      ctx.logger.error(err);
      
      // 返回统一格式
      ctx.status = 500;
      ctx.body = {
        code: 500,
        msg: err.message || '系统内部错误'
      };
    }
  };
};
```

### 5.5 数据权限实现

**Spring Boot 实现方式**：
- 基于 `@DataScope` 注解
- AOP 拦截器在 SQL 中注入数据权限过滤条件

**Egg.js 实现方式**：
```javascript
// app/middleware/data_scope.js
// 在 Mapper 参数中注入 dataScope 参数

async function injectDataScope(ctx, userId) {
  const user = await ctx.service.system.user.selectUserById(userId);
  
  // 1. 全部数据权限
  if (user.roleKey === 'admin') {
    return '';
  }
  
  // 2. 自定义数据权限
  if (user.dataScope === '2') {
    const deptIds = await ctx.service.system.role.getRoleDeptIds(user.roleId);
    return `AND dept_id IN (${deptIds.join(',')})`;
  }
  
  // 3. 本部门数据权限
  if (user.dataScope === '3') {
    return `AND dept_id = ${user.deptId}`;
  }
  
  // 4. 本部门及以下数据权限
  if (user.dataScope === '4') {
    return `AND (dept_id = ${user.deptId} OR dept_id IN (SELECT dept_id FROM sys_dept WHERE find_in_set(${user.deptId}, ancestors)))`;
  }
  
  // 5. 仅本人数据权限
  return `AND user_id = ${userId}`;
}
```

---

## 六、重构检查清单

### 6.1 功能完整性检查

- [ ] 所有 Controller 接口已迁移
- [ ] 所有 Service 业务逻辑已实现
- [ ] 所有 Mapper SQL 已转换
- [ ] 所有工具类已迁移
- [ ] 所有常量定义已迁移
- [ ] 所有异常类已实现

### 6.2 性能优化检查

- [ ] 数据库连接池配置优化
- [ ] 缓存策略优化（Redis）
- [ ] 日志异步写入
- [ ] 静态资源 CDN 部署
- [ ] API 接口压力测试

### 6.3 安全性检查

- [ ] JWT Token 验证
- [ ] 密码加密存储（BCrypt）
- [ ] XSS 攻击防护
- [ ] SQL 注入防护
- [ ] CSRF 防护
- [ ] 接口限流
- [ ] 敏感数据脱敏

### 6.4 代码质量检查

- [ ] ESLint 代码规范检查
- [ ] 单元测试覆盖率 > 80%
- [ ] 接口文档完整
- [ ] 错误日志记录完整
- [ ] 代码注释完整

---

## 七、测试计划

### 7.1 单元测试
- 使用 `egg-mock` 进行单元测试
- 测试所有 Service 层业务逻辑
- 测试所有工具类方法

### 7.2 接口测试
- 使用 Postman 或 Apifox
- 测试所有 API 接口
- 验证响应格式和状态码

### 7.3 性能测试
- 使用 Apache JMeter 或 Artillery
- 并发用户测试
- 接口响应时间测试

### 7.4 安全测试
- SQL 注入测试
- XSS 攻击测试
- 权限绕过测试
- Token 失效测试

---

## 八、部署方案

### 8.1 开发环境
```bash
# 启动开发服务
npm run dev

# 数据库：MySQL 5.7+
# 缓存：Redis 5.0+
```

### 8.2 生产环境
```bash
# 使用 PM2 部署
pm2 start npm --name ruoyi-eggjs -- start

# 使用 Docker 部署
docker-compose up -d
```

### 8.3 Nginx 配置
```nginx
server {
    listen 80;
    server_name api.yourdomain.com;
    
    location / {
        proxy_pass http://127.0.0.1:7001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

---

## 九、项目时间表

| 阶段 | 内容 | 时间 | 负责人 |
|------|------|------|--------|
| 第1周 | 用户认证、用户管理 | Week 1 | - |
| 第2周 | 角色管理 | Week 2 | - |
| 第3周 | 部门、岗位、菜单管理 | Week 3 | - |
| 第4周 | 字典、参数、通知公告 | Week 4 | - |
| 第5周 | 操作日志、登录日志、在线用户 | Week 5 | - |
| 第6周 | 缓存监控、服务监控 | Week 6 | - |
| 第7周 | 定时任务、代码生成 | Week 7 | - |
| 第8周 | 系统接口文档、测试优化 | Week 8 | - |

---

## 十、参考资源

### 10.1 若依官方资源
- 官网：http://ruoyi.vip
- 文档：http://doc.ruoyi.vip
- Gitee：https://gitee.com/y_project/RuoYi-Vue

### 10.2 Egg.js 官方资源
- 官网：https://eggjs.org
- 文档：https://eggjs.org/zh-cn/intro/
- GitHub：https://github.com/eggjs/egg

### 10.3 相关插件文档
- ruoyi-eggjs-mybatis：https://github.com/undsky/ruoyi-eggjs-mybatis
- ruoyi-eggjs-mysql：https://github.com/undsky/ruoyi-eggjs-mysql
- ruoyi-eggjs-cache：https://github.com/undsky/ruoyi-eggjs-cache
- egg-decorator-router：https://github.com/fyl080801/egg-decorator-router

---

## 十一、常见问题 FAQ

### Q1: MyBatis XML 在 Egg.js 中如何使用？
A: 使用 `ruoyi-eggjs-mybatis` 插件，支持完整的 MyBatis XML 语法，包括动态 SQL、ResultMap 等。

### Q2: 如何实现 Spring Security 的权限控制？
A: 通过 JWT + 自定义权限中间件实现，使用装饰器语法 `@Permission('system:user:list')`。

### Q3: 数据权限如何实现？
A: 在 Mapper 参数中注入 `dataScope` SQL 片段，与原 Java 版本逻辑一致。

### Q4: 事务如何处理？
A: Egg.js 使用 `beginTransaction`、`commit`、`rollback` 手动控制事务。

### Q5: 定时任务如何实现？
A: 使用 Egg.js 内置的 Schedule 或 `node-schedule` 插件。

---

**文档版本**: v1.0
**创建日期**: 2025-10-23
**最后更新**: 2025-10-23

