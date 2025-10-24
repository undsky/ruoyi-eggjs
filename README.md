# ruoyi-eggjs

> 若依（RuoYi）Node.js 版本，基于 Egg.js 企业级框架

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen.svg)](https://nodejs.org)
[![Egg](https://img.shields.io/badge/egg-%5E3-blue.svg)](https://eggjs.org)

一个基于 Egg.js 的企业级后台管理系统，参照若依（RuoYi）架构设计，采用 MyBatis XML 风格的 SQL 编写方式，提供完善的权限管理、用户管理等后台管理功能。

---

## 🎯 接口代码 AI 生成，欢迎 PR 修复 BUG

#### 认证授权模块
+ `/captchaImage` - 获取验证码
+ `/login` - 用户登录
+ `/logout` - 用户登出
+ `/getInfo` - 获取用户信息
+ `/getRouters` - 获取路由菜单
+ `/register` - 用户注册

#### 用户管理模块
+ `/api/system/user/list` - 用户列表（分页）
+ `/api/system/user/:userId` - 用户详情
+ `/api/system/user` (POST) - 新增用户
+ `/api/system/user` (PUT) - 修改用户
+ `/api/system/user/:userIds` (DELETE) - 删除用户
+ `/api/system/user/resetPwd` - 重置密码
+ `/api/system/user/changeStatus` - 修改状态
+ `/api/system/user/authRole/:userId` - 查询授权角色
+ `/api/system/user/authRole` (PUT) - 用户授权
+ `/api/system/user/deptTree` - 部门树选择
+ `/api/system/user/export` - 导出用户
+ `/api/system/user/import` - 导入用户
+ `/api/system/user/importTemplate` - 导入模板

📖 详细 API 文档: [用户管理 API 文档](docs/USER_MANAGEMENT_API.md)

#### 角色管理模块
+ `/api/system/role/list` - 角色列表（分页）
+ `/api/system/role/:roleId` - 角色详情
+ `/api/system/role` (POST) - 新增角色
+ `/api/system/role` (PUT) - 修改角色
+ `/api/system/role/:roleIds` (DELETE) - 删除角色
+ `/api/system/role/changeStatus` - 修改状态
+ `/api/system/role/dataScope` - 数据权限
+ `/api/system/role/allocatedList` - 已授权用户列表
+ `/api/system/role/unallocatedList` - 未授权用户列表
+ `/api/system/role/authUser/cancel` - 取消授权
+ `/api/system/role/authUser/cancelAll` - 批量取消授权
+ `/api/system/role/authUser/selectAll` - 批量授权
+ `/api/system/role/deptTree/:roleId` - 角色部门树
+ `/api/system/role/export` - 导出角色

📖 详细 API 文档: [角色管理 API 文档](docs/ROLE_MANAGEMENT_API.md)

#### 菜单管理模块
+ `/api/system/menu/list` - 菜单列表（树形）
+ `/api/system/menu/:menuId` - 菜单详情
+ `/api/system/menu` (POST) - 新增菜单
+ `/api/system/menu` (PUT) - 修改菜单
+ `/api/system/menu/:menuId` (DELETE) - 删除菜单
+ `/api/system/menu/treeselect` - 菜单树选择
+ `/api/system/menu/roleMenuTreeselect/:roleId` - 角色菜单树

📖 详细 API 文档: [菜单管理 API 文档](docs/MENU_MANAGEMENT_API.md)

#### 部门管理模块 ✨ NEW
+ `/api/system/dept/list` - 部门列表（树形）
+ `/api/system/dept/:deptId` - 部门详情
+ `/api/system/dept` (POST) - 新增部门
+ `/api/system/dept` (PUT) - 修改部门
+ `/api/system/dept/:deptId` (DELETE) - 删除部门
+ `/api/system/dept/list/exclude/:deptId` - 排除节点查询
+ `/api/system/dept/treeselect` - 部门树选择
+ `/api/system/dept/roleDeptTreeselect/:roleId` - 角色部门树

📖 详细 API 文档: [部门管理 API 文档](docs/DEPT_MANAGEMENT_API.md)



---

## ✨ 特性

### 核心特性

- 🗄️ **MyBatis XML 编写 SQL** - 业务逻辑与 SQL 分离，支持动态 SQL（[文档](https://github.com/undsky/ruoyi-eggjs-mybatis)）
- 🔌 **多数据库支持** - 支持 MySQL、SQLite 等多种数据库，支持多数据源配置（[文档](https://github.com/undsky/ruoyi-eggjs-mybatis?tab=readme-ov-file#%E7%9B%AE%E5%BD%95%E7%BB%93%E6%9E%84)）
- 🤖 **代码自动生成** - 基于 XML Mapper 自动生成 Service 层代码（[文档](https://github.com/undsky/ruoyi-eggjs-cli)）
- 📝 **文件模版** - 使用 VSCode 插件快速生成代码模板（[文档](https://marketplace.visualstudio.com/items?itemName=qiu8310.dot-template-vscode)）
- 🎯 **路由注解** - 使用装饰器定义路由，简洁优雅（[文档](https://github.com/fyl080801/egg-decorator-router)）
- 🔐 **JWT 认证** - 基于 JWT 的用户认证和权限控制
- 🚀 **缓存支持** - 多层级缓存策略（内存、文件、Redis）
- 🛡️ **限流保护** - API 请求频率限制，防止恶意攻击
- 📦 **文件上传** - 支持多种文件类型上传
- 🎨 **统一响应格式** - 自动格式化 API 响应

### 技术栈

| 技术 | 版本 | 说明 |
| --- | --- | --- |
| [Node.js](https://nodejs.org) | >=20.0.0 | JavaScript 运行时 |
| [Egg.js](https://eggjs.org) | ^3 | 企业级 Node.js 框架 |
| [MySQL2](https://github.com/sidorares/node-mysql2) | ^3 | MySQL 数据库驱动 |
| [cache-manager](https://github.com/node-cache-manager/node-cache-manager) | ^4 | 缓存管理 |
| [JWT](https://jwt.io) | ^3 | 身份认证 |
| [dayjs](https://day.js.org) | ^1 | 日期处理 |

### 自研插件

| 插件 | 说明 | 文档 |
| --- | --- | --- |
| [ruoyi-eggjs-mybatis](https://github.com/undsky/ruoyi-eggjs-mybatis) | MyBatis XML SQL 映射 | [README](https://github.com/undsky/ruoyi-eggjs-mybatis) |
| [ruoyi-eggjs-mysql](https://github.com/undsky/ruoyi-eggjs-mysql) | MySQL 数据库操作 | [README](https://github.com/undsky/ruoyi-eggjs-mysql) |
| [ruoyi-eggjs-cache](https://github.com/undsky/ruoyi-eggjs-cache) | 多层级缓存 | [README](https://github.com/undsky/ruoyi-eggjs-cache) |
| [ruoyi-eggjs-ratelimiter](https://github.com/undsky/ruoyi-eggjs-ratelimiter) | API 限流 | [README](https://github.com/undsky/ruoyi-eggjs-ratelimiter) |
| [ruoyi-eggjs-cli](https://github.com/undsky/ruoyi-eggjs-cli) | 代码生成工具 | [README](https://github.com/undsky/ruoyi-eggjs-cli) |
| [ruoyi-eggjs-sqlite](https://github.com/undsky/ruoyi-eggjs-sqlite) | SQLite 数据库操作 | [README](https://github.com/undsky/ruoyi-eggjs-sqlite) |
| [ruoyi-eggjs-handlebars](https://github.com/undsky/ruoyi-eggjs-handlebars) | Handlebars 模板引擎 | [README](https://github.com/undsky/ruoyi-eggjs-handlebars) |

## 📦 项目结构

```
ruoyi-eggjs/
├── app/
│   ├── controller/          # 控制器
│   │   └── api/            # API 控制器
│   │       └── index.js    # 示例控制器
│   ├── middleware/          # 中间件
│   │   ├── accessControl.js # 访问控制（JWT 验证）
│   │   └── formatBody.js   # 响应格式化
│   ├── service/            # 服务层
│   │   ├── db/            # 数据库服务（自动生成）
│   │   │   └── mysql/
│   │   │       └── ruoyi/ # 若依系统表服务
│   │   └── upload.js      # 文件上传服务
│   ├── public/            # 静态资源
│   │   ├── uploads/       # 上传文件目录
│   │   └── favicon.ico    # 网站图标
│   └── schedule/          # 定时任务
├── config/
│   ├── config.default.js  # 默认配置
│   ├── config.local.js    # 本地开发配置
│   ├── config.prod.js     # 生产环境配置
│   └── plugin.js          # 插件配置
├── mapper/                # MyBatis XML 映射文件
│   └── mysql/
│       └── ruoyi/        # 若依系统表 Mapper
│           ├── SysUserMapper.xml
│           ├── SysRoleMapper.xml
│           └── ...
├── cache/                # 文件缓存目录
├── logs/                 # 日志目录
├── run/                  # 运行时文件
├── package.json
└── README.md
```

## 🚀 快速开始

### 环境要求

- Node.js >= 20.0.0
- MySQL >= 5.7 或 MariaDB >= 10.2
- Redis >= 5.0（可选，用于缓存和限流）

### 1. 克隆项目

```bash
git clone https://github.com/undsky/ruoyi-eggjs.git
cd ruoyi-eggjs
```

### 2. 安装依赖

```bash
npm install
```

### 3. 导入数据库

导入若依数据库脚本到 MySQL：

```sql
-- 创建数据库
CREATE DATABASE IF NOT EXISTS ruoyi DEFAULT CHARSET utf8mb4 COLLATE utf8mb4_general_ci;

-- 导入数据表和数据
-- 请从若依官方获取最新的数据库脚本
-- https://gitee.com/y_project/RuoYi-Vue
```

### 4. 配置数据库

创建或修改 `config/config.local.js`：

```javascript
// config/config.local.js
const path = require('path');

module.exports = appInfo => {
  const config = {};

  // MySQL 数据库配置
  config.mysql = {
    default: {
      port: 3306,
      charset: 'utf8mb4',
      multipleStatements: true,
      connectionLimit: 100,
    },
    clients: {
      ruoyi: {
        host: '127.0.0.1',
        user: 'root',
        password: 'your_password',  // 修改为你的密码
        database: 'ruoyi',
      },
    },
  };

  // 缓存配置（可选，使用 Redis）
  config.cache = {
    default: 'redis',
    ttl: 600,
    fs: {
      path: path.join(appInfo.baseDir, 'cache'),
      subdirs: false,
      zip: false,
    },
    redis: {
      host: '127.0.0.1',
      port: 6379,
      password: '',
      db: 0,
    },
  };

  // 限流配置（可选，使用 Redis）
  config.ratelimiter = {
    points: 100,
    duration: 60,
    redis: {
      host: '127.0.0.1',
      port: 6379,
      password: '',
      db: 0,
    },
  };

  return config;
};
```

### 5. 运行项目

#### 开发模式

开发模式会自动启动 Mapper 代码生成器和调试服务：

```bash
npm run dev
```

#### 生产模式

```bash
# 启动
npm start

# 停止
npm stop
```

### 6. 访问应用

打开浏览器访问：[http://localhost:7001](http://localhost:7001)

测试接口：
- 版本信息：`GET http://localhost:7001/api/version`

### 前端项目

下载 [https://github.com/yangzongzhuan/RuoYi-Vue3](https://github.com/yangzongzhuan/RuoYi-Vue3)

#### 修改接口地址

``` javascript
// vite.config.js
const baseUrl = 'http://localhost:7001/api' // 后端接口
```

## ⚙️ 配置说明

### 核心配置

#### JWT 认证配置

```javascript
// config/config.default.js
config.jwt = {
  enable: true,
  match: /^\/api[\/]?((?!version|auth).)*$/i,  // 需要验证的路由
  secret: 'z2Em*CpGBZDw+',  // 密钥（生产环境务必修改）
  expiresIn: '7d',  // 过期时间
  getToken(ctx) {
    // 从 Header 或 Query 获取 Token
    const authorization = ctx.headers.authorization;
    if (authorization) {
      const [pre, token] = authorization.split(' ');
      if ('Bearer' == pre || 'Token' == pre) {
        return token;
      }
    }
    return ctx.request.body.token || ctx.query.token;
  },
  isRevoked: async (ctx, payload) => {
    // 检查 Token 是否被撤销
    return 'revoked' == await ctx.app.cache.default.get(payload.jti);
  },
};
```

#### CORS 跨域配置

```javascript
config.cors = {
  allowMethods: 'GET,POST',
  credentials: true,
  origin: '*',  // 生产环境建议配置具体域名
};
```

#### 文件上传配置

```javascript
config.multipart = {
  fileSize: '100mb',  // 单文件大小限制
  files: 10,          // 同时上传文件数量
  whitelist: [
    '.jpg', '.jpeg', '.png', '.gif',
    '.doc', '.docx', '.xls', '.xlsx',
    '.pdf', '.txt', '.zip',
  ],
};
```

## 🔧 核心功能

### 1. MyBatis XML SQL 映射

在 `mapper` 目录下编写 XML 映射文件：

```xml
<!-- mapper/mysql/ruoyi/SysUserMapper.xml -->
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="mapper/mysql/ruoyi/SysUserMapper.xml">
    
    <select id="selectUserList">
        SELECT * FROM sys_user
        <where>
            <if test="userName">
                AND user_name LIKE '%${userName}%'
            </if>
        </where>
        ORDER BY create_time DESC
        LIMIT ?, ?
    </select>
    
</mapper>
```

### 2. 自动生成 Service 代码

运行代码生成器：

```bash
npm run mapper
```

会自动生成 `app/service/db/mysql/ruoyi/SysUserMapper.js`：

```javascript
class SysUserMapperService extends Service {
    async selectUserList(values, params) {
        return await this.db().select(this.selectUserListMapper(values, params));
    }
}
```

### 3. 路由注解

使用装饰器定义路由：

```javascript
const { Route, HttpGet, HttpPost } = require('egg-decorator-router');

@Route('/api/user')
class UserController extends Controller {
  
  @HttpPost('/list')
  async list() {
    const { ctx } = this;
    const users = await ctx.service.db.mysql.ruoyi.sysUserMapper.selectUserList(
      ctx.helper.page(ctx.request.body),
      ctx.request.body
    );
    ctx.body = users;
  }

  @HttpGet('/:id')
  async info() {
    const { ctx } = this;
    const user = await ctx.service.db.mysql.ruoyi.sysUserMapper.selectUserById(
      [ctx.params.id]
    );
    ctx.body = user;
  }
}
```

### 4. 缓存使用

```javascript
// 在 Service 中使用缓存
async getUserById(userId) {
  const { app } = this;
  
  return await app.cache.default.wrap(`user:${userId}`, async () => {
    // 缓存不存在时执行此函数
    return await this.service.db.mysql.ruoyi.sysUserMapper.selectUserById([userId]);
  }, { ttl: 600 });  // 缓存 10 分钟
}
```

### 5. 统一响应格式

所有 API 响应会自动格式化为：

```json
{
  "code": 200,
  "msg": "",
  "data": {
    // 业务数据
  }
}
```

## 📝 开发指南

### 开发工作流

1. **编写 XML Mapper**
   ```bash
   # 在 mapper/mysql/ruoyi/ 目录下创建或修改 XML 文件
   ```

2. **自动生成 Service**
   ```bash
   # 开发模式会自动监听 XML 变化并生成代码
   npm run dev
   ```

3. **编写 Controller**
   ```javascript
   // 使用生成的 Service
   await ctx.service.db.mysql.ruoyi.xxxMapper.methodName(values, params);
   ```

4. **测试接口**
   ```bash
   # 使用 Postman 或 curl 测试
   ```

### 命令说明

```bash
# 开发模式（自动生成 Mapper + 调试）
npm run dev

# 仅生成 Mapper 代码
npm run mapper

# 仅启动调试服务
npm run debug

# 生产模式启动
npm start

# 停止服务
npm stop
```

### 目录规范

- **Controller**：`app/controller/api/*.js` - API 控制器
- **Service**：`app/service/*.js` - 业务逻辑
- **Middleware**：`app/middleware/*.js` - 中间件
- **Mapper**：`mapper/mysql/数据库名/*.xml` - SQL 映射文件
- **自动生成**：`app/service/db/mysql/数据库名/*.js` - 自动生成的 Service

## 🚢 部署说明

### 使用 egg-scripts 部署

```bash
# 安装依赖
npm install --production

# 启动服务（后台运行）
npm start

# 停止服务
npm stop
```

### 使用 PM2 部署

```bash
# 安装 PM2
npm install -g pm2

# 启动
pm2 start npm --name ruoyi-eggjs -- start

# 查看状态
pm2 status

# 查看日志
pm2 logs ruoyi-eggjs

# 停止
pm2 stop ruoyi-eggjs

# 重启
pm2 restart ruoyi-eggjs
```

### 使用 Docker 部署

```dockerfile
# Dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 7001

CMD ["npm", "start"]
```

```bash
# 构建镜像
docker build -t ruoyi-eggjs .

# 运行容器
docker run -d \
  --name ruoyi-eggjs \
  -p 7001:7001 \
  -e MYSQL_HOST=your-mysql-host \
  -e MYSQL_PASSWORD=your-password \
  ruoyi-eggjs
```

### Nginx 反向代理

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://127.0.0.1:7001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## 📋 功能清单（参考若依）

### ✅ 已实现

#### 基础设施
- [x] 项目框架搭建
- [x] MyBatis XML SQL 映射
- [x] 代码自动生成工具
- [x] JWT 认证授权
- [x] 多级缓存支持
- [x] API 限流保护
- [x] 文件上传功能
- [x] 统一响应格式

#### 认证授权模块 (NEW! 🎉)
- [x] **用户登录**：用户名密码认证、JWT Token 生成 ([文档](docs/AUTH_MODULE_README.md))
- [x] **用户登出**：Token 黑名单、在线用户管理
- [x] **获取用户信息**：用户基本信息、角色、权限查询
- [x] **获取路由菜单**：基于权限的菜单树生成
- [x] **用户注册**：用户注册功能（可配置开关）
- [x] **验证码**：SVG 验证码生成和校验

**快速开始**：[认证模块快速测试指南](docs/QUICK_START_AUTH.md)

### ⏳ 待实现（TODO）

> 参照若依（RuoYi-Vue）内置功能

1. [ ] **用户管理**：用户是系统操作者，该功能主要完成系统用户配置
2. [ ] **部门管理**：配置系统组织机构（公司、部门、小组），树结构展现支持数据权限
3. [ ] **岗位管理**：配置系统用户所属担任职务
4. [ ] **菜单管理**：配置系统菜单，操作权限，按钮权限标识等
5. [ ] **角色管理**：角色菜单权限分配、设置角色按机构进行数据范围权限划分
6. [ ] **字典管理**：对系统中经常使用的一些较为固定的数据进行维护
7. [ ] **参数管理**：对系统动态配置常用参数
8. [ ] **通知公告**：系统通知公告信息发布维护
9. [ ] **操作日志**：系统正常操作日志记录和查询；系统异常信息日志记录和查询
10. [ ] **登录日志**：系统登录日志记录查询包含登录异常
11. [ ] **在线用户**：当前系统中活跃用户状态监控
12. [ ] **定时任务**：在线（添加、修改、删除）任务调度包含执行结果日志
13. [ ] **代码生成**：前后端代码的生成（Node.js、Vue、XML、SQL）支持 CRUD 下载
14. [ ] **系统接口**：根据业务代码自动生成相关的 API 接口文档
15. [ ] **服务监控**：监视当前系统 CPU、内存、磁盘、堆栈等相关信息
16. [ ] **缓存监控**：对系统的缓存信息查询，命令统计等
17. [ ] **在线构建器**：拖动表单元素生成相应的 HTML 代码
18. [ ] **连接池监视**：监视当前系统数据库连接池状态，可进行分析 SQL 找出系统性能瓶颈

## 🤝 参与贡献

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交改动 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 提交 Pull Request

## 📄 开源协议

本项目基于 [MIT](LICENSE) 协议开源。

## 🙏 鸣谢

- [若依（RuoYi）](https://gitee.com/y_project/RuoYi-Vue) - 优秀的开源后台管理系统
- [Egg.js](https://eggjs.org) - 企业级 Node.js 框架
- 所有贡献者

## 📞 联系方式

- 网站：[https://www.undsky.com](https://www.undsky.com)
- GitHub：[https://github.com/undsky/ruoyi-eggjs](https://github.com/undsky/ruoyi-eggjs)
- Issues：[https://github.com/undsky/ruoyi-eggjs/issues](https://github.com/undsky/ruoyi-eggjs/issues)
