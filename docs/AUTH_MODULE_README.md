# 认证授权模块实现文档

## 📋 模块概述

本文档说明认证授权模块的实现细节，包括用户登录、登出、注册、验证码等功能。

---

## ✅ 已实现功能

### 1. 用户登录 (POST /api/login)

**功能说明**：
- 验证码校验
- 用户名密码认证
- JWT Token 生成
- 登录日志记录
- 在线用户管理

**请求示例**：
```json
{
  "username": "admin",
  "password": "admin123",
  "code": "1234",
  "uuid": "unique-id"
}
```

**响应示例**：
```json
{
  "code": 200,
  "msg": "登录成功",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### 2. 用户登出 (POST /api/logout)

**功能说明**：
- 删除在线用户信息
- Token 加入黑名单
- 记录登出日志

**请求示例**：
```http
POST /api/logout
Authorization: Bearer {token}
```

**响应示例**：
```json
{
  "code": 200,
  "msg": "退出成功"
}
```

---

### 3. 获取用户信息 (GET /api/getInfo)

**功能说明**：
- 查询用户基本信息
- 查询用户角色
- 查询用户权限标识

**响应示例**：
```json
{
  "code": 200,
  "msg": "查询成功",
  "user": {
    "userId": 1,
    "userName": "admin",
    "nickName": "管理员",
    "email": "admin@example.com",
    "phonenumber": "15888888888",
    "sex": "0",
    "avatar": "",
    "status": "0",
    "createTime": "2025-01-01 00:00:00"
  },
  "roles": ["admin"],
  "permissions": ["*:*:*"]
}
```

---

### 4. 获取路由菜单 (GET /api/getRouters)

**功能说明**：
- 根据用户权限查询菜单
- 构建树形菜单结构
- 返回前端路由配置

**响应示例**：
```json
{
  "code": 200,
  "msg": "查询成功",
  "data": [
    {
      "name": "系统管理",
      "path": "/system",
      "hidden": false,
      "component": "Layout",
      "meta": {
        "title": "系统管理",
        "icon": "system",
        "noCache": false
      },
      "children": [
        {
          "name": "用户管理",
          "path": "user",
          "component": "system/user/index",
          "meta": {
            "title": "用户管理",
            "icon": "user"
          }
        }
      ]
    }
  ]
}
```

---

### 5. 用户注册 (POST /api/register)

**功能说明**：
- 检查注册开关
- 验证码校验
- 用户名唯一性校验
- 密码加密存储

**请求示例**：
```json
{
  "username": "testuser",
  "password": "123456",
  "code": "1234",
  "uuid": "unique-id"
}
```

**响应示例**：
```json
{
  "code": 200,
  "msg": "注册成功"
}
```

---

### 6. 获取验证码 (GET /api/captcha)

**功能说明**：
- 生成 SVG 验证码图片
- 存储验证码到 Redis（5分钟过期）
- 返回验证码图片和唯一标识

**响应示例**：
```json
{
  "code": 200,
  "msg": "操作成功",
  "uuid": "abc123",
  "img": "<svg>...</svg>"
}
```

---

## 📂 文件结构

```
ruoyi-eggjs/
├── app/
│   ├── controller/
│   │   └── system/
│   │       └── login.js           # 登录控制器
│   │
│   ├── service/
│   │   ├── system/
│   │   │   ├── login.js          # 登录服务
│   │   │   ├── user.js           # 用户服务
│   │   │   ├── role.js           # 角色服务
│   │   │   ├── menu.js           # 菜单服务
│   │   │   └── config.js         # 配置服务
│   │   │
│   │   └── monitor/
│   │       └── logininfor.js     # 登录日志服务
│   │
│   ├── extend/
│   │   └── helper.js             # Helper 扩展（含安全工具）
│   │
│   └── constant/
│       └── index.js              # 常量定义
│
└── config/
    └── config.default.js         # 验证码配置
```

---

## 🔑 核心技术点

### 1. 密码加密（BCrypt）

**实现位置**：`app/extend/helper.js`

```javascript
// 加密密码
const hashedPassword = await ctx.helper.security.encryptPassword('123456');

// 验证密码
const isMatch = await ctx.helper.security.comparePassword('123456', hashedPassword);
```

**特点**：
- 使用 bcryptjs 库
- 自动加盐（salt）
- 单向加密，不可逆
- 防止彩虹表攻击

---

### 2. JWT Token 生成

**实现位置**：`app/controller/system/login.js`

```javascript
const token = app.jwt.sign(
  {
    userId: 1,
    userName: 'admin',
    deptId: 100
  },
  secret,
  {
    expiresIn: '7d',
    jwtid: `${Date.now()}_${userId}`
  }
);
```

**Token 结构**：
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
eyJ1c2VySWQiOjEsInVzZXJOYW1lIjoiYWRtaW4iLCJkZXB0SWQiOjEwMCwiaWF0IjoxNjk4MDAwMDAwLCJleHAiOjE2OTg2MDQ4MDAsImp0aSI6IjE2OTgwMDAwMDBfMSJ9.
signature
```

**包含信息**：
- userId: 用户ID
- userName: 用户名
- deptId: 部门ID
- iat: 签发时间
- exp: 过期时间
- jti: Token 唯一标识

---

### 3. 验证码生成

**实现位置**：`app/service/system/login.js`

```javascript
const svgCaptcha = require('svg-captcha');

// 生成验证码
const captcha = svgCaptcha.create({
  size: 4,           // 验证码长度
  noise: 2,          // 干扰线条数
  color: true,       // 彩色字符
  background: '#f0f0f0',
  width: 120,
  height: 40,
  fontSize: 50
});

// 存储到 Redis（5分钟过期）
await app.cache.default.set(`captcha:${uuid}`, captcha.text, { ttl: 300 });
```

**特点**：
- SVG 格式，无需图片文件
- 支持数学运算验证码
- 自动添加干扰线
- 验证码区分大小写（可配置）

---

### 4. 在线用户管理

**实现位置**：`app/service/system/login.js`

```javascript
// 存储在线用户（Redis）
const onlineUser = {
  tokenId: token,
  userId: user.userId,
  userName: user.userName,
  ipaddr: ctx.request.ip,
  loginTime: new Date(),
  expireTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
};

await app.cache.default.set(`online_user:${userId}`, onlineUser, { ttl: 7 * 24 * 60 * 60 });
```

**用途**：
- 在线用户监控
- 强制用户下线
- 统计在线人数

---

### 5. Token 黑名单

**实现位置**：`app/service/system/login.js`

```javascript
// 登出时将 Token 加入黑名单
await app.cache.default.set(jti, 'revoked', { ttl: 7 * 24 * 60 * 60 });

// JWT 中间件校验
isRevoked: async (ctx, payload) => {
  return 'revoked' == await ctx.app.cache.default.get(payload.jti);
}
```

**作用**：
- 实现用户强制登出
- Token 失效管理
- 防止被盗 Token 继续使用

---

## 🔧 依赖安装

### 新增依赖

```bash
npm install bcryptjs svg-captcha --save
```

**依赖说明**：
- `bcryptjs`: 密码加密库
- `svg-captcha`: SVG 验证码生成

---

## 🧪 测试指南

### 1. 测试登录接口

```bash
# 先获取验证码
curl http://localhost:7001/api/auth/captcha

# 使用 Postman 测试登录
POST http://localhost:7001/api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123",
  "code": "返回的验证码",
  "uuid": "返回的uuid"
}
```

### 2. 测试获取用户信息

```bash
GET http://localhost:7001/api/auth/getInfo
Authorization: Bearer {登录返回的token}
```

### 3. 测试登出接口

```bash
POST http://localhost:7001/api/auth/logout
Authorization: Bearer {登录返回的token}
```

---

## ⚠️ 注意事项

### 1. 首次使用需要导入数据库

```bash
# 导入若依数据库脚本
mysql -u root -p ruoyi < sql/ry_20250522.sql
```

### 2. 配置数据库连接

修改 `config/config.local.js`：

```javascript
config.mysql = {
  clients: {
    ruoyi: {
      host: '127.0.0.1',
      user: 'root',
      password: 'your_password',
      database: 'ruoyi'
    }
  }
};
```

### 3. 验证码配置

在 `config/config.default.js` 中可关闭验证码：

```javascript
config.captcha = {
  enabled: false  // 开发时可暂时关闭
};
```

### 4. JWT 密钥配置

⚠️ **生产环境务必修改 JWT 密钥**：

```javascript
config.jwt = {
  secret: '请修改为复杂的密钥'
};
```

---

## 📊 接口清单

| 接口 | 方法 | 路径 | 需要认证 | 说明 |
|------|------|------|---------|------|
| 用户登录 | POST | `/api/login` | ❌ | 用户登录 |
| 用户登出 | POST | `/api/logout` | ✅ | 用户登出 |
| 获取用户信息 | GET | `/api/getInfo` | ✅ | 获取当前用户信息 |
| 获取路由菜单 | GET | `/api/getRouters` | ✅ | 获取用户菜单 |
| 用户注册 | POST | `/api/register` | ❌ | 用户注册 |
| 获取验证码 | GET | `/api/captcha` | ❌ | 获取验证码图片 |

---

## 🐛 常见问题

### Q1: 验证码一直提示错误？
A: 检查验证码是否过期（5分钟），或者临时关闭验证码功能测试。

### Q2: Token 一直提示未授权？
A: 检查请求头是否携带 `Authorization: Bearer {token}`。

### Q3: 用户名密码正确但无法登录？
A: 检查数据库中用户状态 `status` 是否为 '0'，删除标志 `del_flag` 是否为 '0'。

### Q4: 如何重置管理员密码？
A: 执行以下 SQL（密码：admin123）：
```sql
UPDATE sys_user 
SET password = '$2a$10$7JB720yubVSZvUI0rEqK/.VqGOZTH.ulu33dHOiBE8ByOhJIrdAu2' 
WHERE user_id = 1;
```

---

## 📚 相关文档

- [API 接口映射表](./API_MAPPING.md)
- [数据库设计文档](./DATABASE_DESIGN.md)
- [详细重构计划](./REFACTORING_PLAN.md)

---

**文档版本**: v1.0
**创建日期**: 2025-10-23
**模块状态**: ✅ 已完成

