# 个人中心 API 接口文档

## 概述

本文档描述了个人中心模块的所有 API 接口实现，包括个人信息查询、修改、密码修改、头像上传等功能。

## 已实现的接口列表

### 1. 获取个人信息

**接口地址**: `GET /api/system/user/profile`

**功能说明**:
- 获取当前登录用户的个人信息
- 包括角色组和岗位组信息

**响应示例**:
```json
{
  "code": 200,
  "msg": "操作成功",
  "data": {
    "userId": 1,
    "userName": "admin",
    "nickName": "管理员",
    "email": "admin@example.com",
    "phonenumber": "13800138000",
    "sex": "0",
    "avatar": "/public/uploads/avatar/avatar_1.jpg",
    "status": "0",
    "deptId": 103,
    "createTime": "2025-10-24 10:00:00"
  },
  "roleGroup": "超级管理员",
  "postGroup": "董事长"
}
```

**字段说明**:
- `data`: 用户详细信息
- `roleGroup`: 角色组（多个角色用逗号分隔）
- `postGroup`: 岗位组（多个岗位用逗号分隔）

**测试命令**:
```bash
curl -X GET "http://localhost:7001/api/system/user/profile" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 2. 修改个人信息

**接口地址**: `PUT /api/system/user/profile`

**请求参数**:
```json
{
  "nickName": "管理员（已修改）",
  "email": "admin@example.com",
  "phonenumber": "13800138000",
  "sex": "0"
}
```

**字段说明**:
- `nickName`: 用户昵称
- `email`: 邮箱
- `phonenumber`: 手机号
- `sex`: 用户性别（0-男，1-女，2-未知）

**响应示例**:
```json
{
  "code": 200,
  "msg": "修改成功"
}
```

**业务规则**:
- 手机号必须唯一（不能与其他用户重复）
- 邮箱必须唯一（不能与其他用户重复）
- 用户名不允许修改

**测试命令**:
```bash
curl -X PUT "http://localhost:7001/api/system/user/profile" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "nickName": "管理员（已修改）",
    "email": "admin@example.com",
    "phonenumber": "13800138000",
    "sex": "0"
  }'
```

---

### 3. 修改密码

**接口地址**: `PUT /api/system/user/profile/updatePwd`

**请求参数**:
```json
{
  "oldPassword": "admin123",
  "newPassword": "newpassword123"
}
```

**字段说明**:
- `oldPassword`: 旧密码（明文）
- `newPassword`: 新密码（明文）

**响应示例**:
```json
{
  "code": 200,
  "msg": "修改成功"
}
```

**业务规则**:
- 必须提供正确的旧密码
- 新密码不能与旧密码相同
- 新密码会自动加密（bcrypt）

**测试命令**:
```bash
curl -X PUT "http://localhost:7001/api/system/user/profile/updatePwd" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "oldPassword": "admin123",
    "newPassword": "newpassword123"
  }'
```

---

### 4. 上传头像

**接口地址**: `POST /api/system/user/profile/avatar`

**请求类型**: multipart/form-data

**请求参数**:
- `file`: 头像文件（图片文件）

**支持的图片格式**:
- jpg / jpeg
- png
- gif
- bmp

**响应示例**:
```json
{
  "code": 200,
  "msg": "上传成功",
  "imgUrl": "/public/uploads/avatar/avatar_1_1729753200000.jpg"
}
```

**字段说明**:
- `imgUrl`: 头像访问URL

**业务规则**:
- 上传新头像后会删除旧头像文件
- 头像文件名格式：`avatar_{userId}_{timestamp}.{ext}`
- 头像保存路径：`app/public/uploads/avatar/`

**测试命令**:
```bash
curl -X POST "http://localhost:7001/api/system/user/profile/avatar" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@/path/to/avatar.jpg"
```

---

## 实现细节

### 1. 文件结构

```
ruoyi-eggjs/
├── app/
│   ├── controller/
│   │   └── system/
│   │       ├── login.js
│   │       ├── user.js
│   │       ├── ...
│   │       └── profile.js      # 个人中心控制器（新增）
│   ├── service/
│   │   └── system/
│   │       ├── user.js         # 用户服务（完善）
│   │       └── ...
│   └── public/
│       └── uploads/
│           └── avatar/         # 头像上传目录
```

### 2. 核心功能

#### 2.1 个人信息管理
- ✅ 查询个人信息
- ✅ 修改个人信息（昵称、邮箱、手机号、性别）
- ✅ 显示角色组和岗位组

#### 2.2 密码管理
- ✅ 修改密码
- ✅ 旧密码校验
- ✅ 新密码加密
- ✅ 防止新旧密码相同

#### 2.3 头像管理
- ✅ 上传头像
- ✅ 删除旧头像
- ✅ 返回头像URL

### 3. 头像上传流程

1. 接收上传的文件流
2. 生成唯一的文件名
3. 保存到 `app/public/uploads/avatar/` 目录
4. 生成访问URL
5. 更新用户头像字段
6. 删除旧头像文件
7. 返回新头像URL

### 4. 数据校验

**修改个人信息**:
- 手机号唯一性校验
- 邮箱唯一性校验

**修改密码**:
- 旧密码正确性校验
- 新密码与旧密码不能相同

**上传头像**:
- 文件格式校验（通过配置）
- 文件大小限制（通过配置）

---

## 测试步骤

### 1. 准备工作
1. 确保数据库已初始化
2. 启动 Egg.js 应用
3. 登录获取 Token

### 2. 测试流程

```bash
# 1. 登录获取 Token
TOKEN=$(curl -X POST "http://localhost:7001/api/login" \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}' \
  | jq -r '.token')

# 2. 获取个人信息
curl -X GET "http://localhost:7001/api/system/user/profile" \
  -H "Authorization: Bearer $TOKEN"

# 3. 修改个人信息
curl -X PUT "http://localhost:7001/api/system/user/profile" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "nickName": "管理员（已修改）",
    "email": "admin@example.com",
    "phonenumber": "13800138000",
    "sex": "0"
  }'

# 4. 修改密码
curl -X PUT "http://localhost:7001/api/system/user/profile/updatePwd" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "oldPassword": "admin123",
    "newPassword": "newpassword123"
  }'

# 5. 上传头像
curl -X POST "http://localhost:7001/api/system/user/profile/avatar" \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@avatar.jpg"
```

---

## 注意事项

1. **Token 认证**: 所有接口都需要在请求头中携带 `Authorization: Bearer {token}`
2. **权限**: 只能修改自己的个人信息，不能修改其他用户
3. **密码安全**: 
   - 旧密码必须正确
   - 新密码会自动加密
   - 新密码不能与旧密码相同
4. **头像上传**: 
   - 支持的图片格式在配置文件中定义
   - 旧头像会被自动删除
5. **数据唯一性**: 手机号和邮箱必须唯一

---

## 错误码说明

| 错误码 | 说明 |
|--------|------|
| 200 | 操作成功 |
| 500 | 操作失败 |
| 401 | 未授权（Token 失效） |
| 403 | 无权限 |

---

## 使用场景

### 场景1: 用户修改个人信息

用户登录后，在个人中心可以：
- 查看自己的详细信息
- 修改昵称、邮箱、手机号
- 修改性别

---

### 场景2: 用户修改密码

用户可以定期修改密码：
- 输入旧密码
- 输入新密码
- 系统自动加密保存

---

### 场景3: 用户上传头像

用户可以自定义头像：
- 上传图片文件
- 系统自动保存
- 删除旧头像
- 返回新头像URL

---

**文档版本**: v1.0  
**创建日期**: 2025-10-24  
**作者**: AI Assistant

