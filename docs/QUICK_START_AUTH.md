# 认证模块快速开始指南

## 🚀 快速测试认证功能

按照以下步骤快速测试认证授权模块。

---

## 📋 前置准备

### 1. 安装依赖

```bash
cd ruoyi-eggjs
npm install
```

新安装的依赖：
- `bcryptjs`: 密码加密
- `svg-captcha`: 验证码生成

---

### 2. 配置数据库

修改 `config/config.local.js`：

```javascript
module.exports = appInfo => {
  const config = {};

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

  return config;
};
```

---

### 3. 导入数据库（如果还未导入）

```bash
# 创建数据库
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS ruoyi DEFAULT CHARSET utf8mb4 COLLATE utf8mb4_general_ci;"

# 导入若依数据库脚本（从 Spring Boot 项目获取）
mysql -u root -p ruoyi < C:\Users\user\Downloads\RuoYi-Vue-springboot3\sql\ry_20250522.sql
```

---

## 🎯 测试步骤

### 步骤 1：启动项目

```bash
npm run dev
```

启动成功后会看到：
```
[egg-scripts] server started on http://127.0.0.1:7001
```

---

### 步骤 2：测试验证码接口

#### 使用 curl：

```bash
curl http://localhost:7001/api/captcha
```

#### 使用浏览器：

直接访问：`http://localhost:7001/api/captcha`

**响应示例**：
```json
{
  "code": 200,
  "msg": "操作成功",
  "uuid": "abc123def456",
  "img": "<svg xmlns='http://www.w3.org/2000/svg' width='120' height='40'>...</svg>"
}
```

💡 **提示**：将 `img` 字段的内容保存为 HTML 文件查看验证码图片。

---

### 步骤 3：测试登录接口

#### 使用 Postman

1. **方法**：POST
2. **URL**：`http://localhost:7001/api/login`
3. **Headers**：
   ```
   Content-Type: application/json
   ```
4. **Body (raw JSON)**：
   ```json
   {
     "username": "admin",
     "password": "admin123",
     "code": "1234",
     "uuid": "上一步返回的uuid"
   }
   ```

#### 使用 curl：

```bash
curl -X POST http://localhost:7001/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123",
    "code": "替换为验证码",
    "uuid": "替换为uuid"
  }'
```

**成功响应**：
```json
{
  "code": 200,
  "msg": "登录成功",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJOYW1lIjoiYWRtaW4iLCJkZXB0SWQiOjEwMywiaWF0IjoxNzI5NjYwMDAwLCJleHAiOjE3MzAyNjQ4MDAsImp0aSI6IjE3Mjk2NjAwMDBfMSJ9.xxxxxxxxxxxx"
}
```

⚠️ **注意**：保存返回的 `token`，后续接口需要使用。

---

### 步骤 4：测试获取用户信息

#### 使用 Postman

1. **方法**：GET
2. **URL**：`http://localhost:7001/api/getInfo`
3. **Headers**：
   ```
   Authorization: Bearer {上一步获取的token}
   ```

#### 使用 curl：

```bash
curl -X GET http://localhost:7001/api/getInfo \
  -H "Authorization: Bearer {替换为token}"
```

**成功响应**：
```json
{
  "code": 200,
  "msg": "查询成功",
  "user": {
    "userId": 1,
    "deptId": 103,
    "userName": "admin",
    "nickName": "若依",
    "email": "ry@163.com",
    "phonenumber": "15888888888",
    "sex": "1",
    "avatar": "",
    "status": "0",
    "createTime": "2025-01-01 00:00:00"
  },
  "roles": ["admin"],
  "permissions": ["*:*:*"]
}
```

---

### 步骤 5：测试获取路由菜单

#### 使用 Postman

1. **方法**：GET
2. **URL**：`http://localhost:7001/api/getRouters`
3. **Headers**：
   ```
   Authorization: Bearer {token}
   ```

#### 使用 curl：

```bash
curl -X GET http://localhost:7001/api/getRouters \
  -H "Authorization: Bearer {替换为token}"
```

**成功响应**：
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
      "children": [...]
    }
  ]
}
```

---

### 步骤 6：测试用户登出

#### 使用 Postman

1. **方法**：POST
2. **URL**：`http://localhost:7001/api/logout`
3. **Headers**：
   ```
   Authorization: Bearer {token}
   ```

#### 使用 curl：

```bash
curl -X POST http://localhost:7001/api/logout \
  -H "Authorization: Bearer {替换为token}"
```

**成功响应**：
```json
{
  "code": 200,
  "msg": "退出成功"
}
```

---

## 🧪 完整测试流程（使用测试文件）

### 创建测试文件 `test-auth.sh`：

```bash
#!/bin/bash

# API 基础路径
BASE_URL="http://localhost:7001/api"

echo "=========================================="
echo "1. 测试验证码接口"
echo "=========================================="
CAPTCHA_RESPONSE=$(curl -s $BASE_URL/captcha)
echo $CAPTCHA_RESPONSE | jq '.'

# 提取 uuid（需要 jq 工具）
UUID=$(echo $CAPTCHA_RESPONSE | jq -r '.uuid')
echo "验证码 UUID: $UUID"

echo ""
echo "=========================================="
echo "2. 测试登录接口"
echo "=========================================="
read -p "请输入验证码: " CODE

LOGIN_RESPONSE=$(curl -s -X POST $BASE_URL/login \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"admin\",\"password\":\"admin123\",\"code\":\"$CODE\",\"uuid\":\"$UUID\"}")

echo $LOGIN_RESPONSE | jq '.'

# 提取 token
TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.token')
echo "Token: $TOKEN"

echo ""
echo "=========================================="
echo "3. 测试获取用户信息"
echo "=========================================="
curl -s -X GET $BASE_URL/getInfo \
  -H "Authorization: Bearer $TOKEN" | jq '.'

echo ""
echo "=========================================="
echo "4. 测试获取路由菜单"
echo "=========================================="
curl -s -X GET $BASE_URL/getRouters \
  -H "Authorization: Bearer $TOKEN" | jq '.'

echo ""
echo "=========================================="
echo "5. 测试用户登出"
echo "=========================================="
curl -s -X POST $BASE_URL/logout \
  -H "Authorization: Bearer $TOKEN" | jq '.'

echo ""
echo "测试完成！"
```

### 运行测试：

```bash
chmod +x test-auth.sh
./test-auth.sh
```

---

## 🐛 常见问题排查

### 1. 验证码错误

**问题**：验证码一直提示错误

**解决方案**：
```javascript
// 临时关闭验证码（开发环境）
// config/config.default.js
config.captcha = {
  enabled: false
};
```

然后登录时不传 `code` 和 `uuid` 参数。

---

### 2. Token 未授权

**问题**：接口返回 401 或 UnauthorizedError

**检查清单**：
- ✅ Header 中是否包含 `Authorization`
- ✅ Token 格式是否正确：`Bearer {token}`
- ✅ Token 是否过期（默认7天）
- ✅ Token 是否被登出（加入黑名单）

---

### 3. 数据库连接失败

**问题**：启动时报数据库连接错误

**检查清单**：
- ✅ MySQL 服务是否启动
- ✅ 数据库名称是否正确
- ✅ 用户名密码是否正确
- ✅ 数据库是否已导入

**测试连接**：
```bash
mysql -u root -p ruoyi -e "SELECT COUNT(*) FROM sys_user;"
```

---

### 4. 用户名密码错误

**问题**：正确的用户名密码无法登录

**检查方案**：

1. **检查用户状态**：
```sql
SELECT user_id, user_name, status, del_flag FROM sys_user WHERE user_name = 'admin';
```

应该返回：
- `status = '0'` （正常）
- `del_flag = '0'` （未删除）

2. **重置管理员密码**：
```sql
UPDATE sys_user 
SET password = '$2a$10$7JB720yubVSZvUI0rEqK/.VqGOZTH.ulu33dHOiBE8ByOhJIrdAu2' 
WHERE user_id = 1;
```

密码重置为：`admin123`

---

### 5. 菜单数据为空

**问题**：`getRouters` 返回空数组

**检查方案**：

1. **检查菜单数据**：
```sql
SELECT COUNT(*) FROM sys_menu WHERE status = '0';
```

2. **检查角色菜单关联**：
```sql
SELECT COUNT(*) FROM sys_role_menu;
```

3. **检查用户角色关联**：
```sql
SELECT COUNT(*) FROM sys_user_role WHERE user_id = 1;
```

---

## 📊 测试检查清单

- [ ] 验证码接口正常返回 SVG 图片
- [ ] 登录接口返回 Token
- [ ] 获取用户信息接口返回正确数据
- [ ] 获取路由菜单接口返回菜单树
- [ ] 登出接口正常工作
- [ ] Token 过期后无法访问接口
- [ ] 登出后 Token 无法继续使用
- [ ] 登录日志正常记录

---

## 🎉 完成测试

恭喜！认证授权模块已完成测试。

**下一步**：
- 📖 阅读 [认证模块实现文档](AUTH_MODULE_README.md)
- 🔧 开始实现用户管理模块
- 📋 查看 [详细重构计划](../REFACTORING_PLAN.md)

---

## 📞 获取帮助

遇到问题？

1. 📄 查看 [认证模块文档](AUTH_MODULE_README.md)
2. 🔍 查看日志文件：`logs/ruoyi-eggjs/`
3. 💬 提交 Issue

---

**文档版本**: v1.0
**创建日期**: 2025-10-23

