# 代码生成工具 API 接口文档

## 概述

本文档描述了代码生成工具模块的所有 API 接口实现，包括表管理、代码生成、预览、下载等功能。

**重要说明**: 本模块为简化实现，提供了完整的 API 接口框架。完整的代码生成功能建议使用 **ruoyi-eggjs-cli** 工具。

## 已实现的接口列表

### 1. 代码生成表列表（分页）

**接口地址**: `GET /api/tool/gen/list`

**请求参数**:
```json
{
  "pageNum": 1,          // 页码，默认 1
  "pageSize": 10,        // 每页条数，默认 10
  "tableName": "",       // 表名称（模糊查询）
  "tableComment": ""     // 表描述（模糊查询）
}
```

**响应示例**:
```json
{
  "code": 200,
  "msg": "查询成功",
  "rows": [],
  "total": 0
}
```

**测试命令**:
```bash
curl -X GET "http://localhost:7001/api/tool/gen/list?pageNum=1&pageSize=10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 2. 数据库表列表（分页）

**接口地址**: `GET /api/tool/gen/db/list`

**请求参数**:
```json
{
  "pageNum": 1,
  "pageSize": 10,
  "tableName": "",
  "tableComment": ""
}
```

**功能说明**:
- 查询数据库中的所有表
- 用于选择要生成代码的表

**响应示例**:
```json
{
  "code": 200,
  "msg": "查询成功",
  "rows": [
    {
      "tableName": "sys_user",
      "tableComment": "用户信息表",
      "createTime": "2025-10-24 10:00:00",
      "updateTime": "2025-10-24 10:00:00"
    }
  ],
  "total": 1
}
```

**测试命令**:
```bash
curl -X GET "http://localhost:7001/api/tool/gen/db/list?pageNum=1&pageSize=10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 3. 代码生成表详情

**接口地址**: `GET /api/tool/gen/:tableId`

**路径参数**:
- `tableId`: 表ID

**响应示例**:
```json
{
  "code": 200,
  "msg": "操作成功",
  "data": {
    "info": null,
    "rows": [],
    "tables": []
  }
}
```

**测试命令**:
```bash
curl -X GET "http://localhost:7001/api/tool/gen/1" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 4. 表字段列表

**接口地址**: `GET /api/tool/gen/column/:tableId`

**路径参数**:
- `tableId`: 表ID

**响应示例**:
```json
{
  "code": 200,
  "msg": "查询成功",
  "rows": [],
  "total": 0
}
```

**测试命令**:
```bash
curl -X GET "http://localhost:7001/api/tool/gen/column/1" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 5. 导入表结构

**接口地址**: `POST /api/tool/gen/importTable`

**请求参数**:
```json
{
  "tables": "sys_user,sys_role"  // 表名，逗号分隔
}
```

**功能说明**:
- 导入指定的数据库表
- 保存表结构到代码生成配置表

**响应示例**:
```json
{
  "code": 200,
  "msg": "导入成功",
  "data": {
    "note": "代码生成功能为简化实现，建议使用 ruoyi-eggjs-cli 工具"
  }
}
```

**测试命令**:
```bash
curl -X POST "http://localhost:7001/api/tool/gen/importTable" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"tables": "sys_user,sys_role"}'
```

---

### 6. 修改代码生成配置

**接口地址**: `PUT /api/tool/gen`

**请求参数**:
```json
{
  "tableId": 1,
  "tableName": "sys_user",
  "tableComment": "用户信息表",
  "className": "SysUser",
  "functionAuthor": "ruoyi",
  "packageName": "com.ruoyi.system"
}
```

**响应示例**:
```json
{
  "code": 200,
  "msg": "修改成功"
}
```

**测试命令**:
```bash
curl -X PUT "http://localhost:7001/api/tool/gen" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "tableId": 1,
    "tableName": "sys_user",
    "className": "SysUser"
  }'
```

---

### 7. 删除表配置

**接口地址**: `DELETE /api/tool/gen/:tableIds`

**路径参数**:
- `tableIds`: 表ID，多个用逗号分隔

**响应示例**:
```json
{
  "code": 200,
  "msg": "删除成功"
}
```

**测试命令**:
```bash
curl -X DELETE "http://localhost:7001/api/tool/gen/1,2,3" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 8. 预览代码

**接口地址**: `GET /api/tool/gen/preview/:tableId`

**路径参数**:
- `tableId`: 表ID

**功能说明**:
- 预览生成的代码
- 不实际生成文件

**响应示例**:
```json
{
  "code": 200,
  "msg": "操作成功",
  "data": {
    "controller.js": "// Controller 代码",
    "service.js": "// Service 代码",
    "mapper.xml": "<!-- Mapper XML -->"
  }
}
```

**测试命令**:
```bash
curl -X GET "http://localhost:7001/api/tool/gen/preview/1" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 9. 下载代码

**接口地址**: `GET /api/tool/gen/download/:tableName`

**路径参数**:
- `tableName`: 表名

**功能说明**:
- 生成代码并下载 zip 压缩包

**响应**: 文件流（application/octet-stream）

**测试命令**:
```bash
curl -X GET "http://localhost:7001/api/tool/gen/download/sys_user" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -o sys_user.zip
```

---

### 10. 生成代码（自定义路径）

**接口地址**: `GET /api/tool/gen/genCode/:tableName`

**路径参数**:
- `tableName`: 表名

**功能说明**:
- 生成代码到自定义路径

**响应示例**:
```json
{
  "code": 200,
  "msg": "生成成功"
}
```

**测试命令**:
```bash
curl -X GET "http://localhost:7001/api/tool/gen/genCode/sys_user" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 11. 同步数据库

**接口地址**: `GET /api/tool/gen/synchDb/:tableName`

**路径参数**:
- `tableName`: 表名

**功能说明**:
- 同步数据库最新的表结构
- 更新字段配置

**响应示例**:
```json
{
  "code": 200,
  "msg": "同步成功"
}
```

**测试命令**:
```bash
curl -X GET "http://localhost:7001/api/tool/gen/synchDb/sys_user" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 12. 批量生成代码

**接口地址**: `GET /api/tool/gen/batchGenCode`

**请求参数**:
```
tables=sys_user,sys_role,sys_menu  // 表名，逗号分隔
```

**功能说明**:
- 批量生成多个表的代码
- 打包成 zip 下载

**响应**: 文件流（application/octet-stream）

**测试命令**:
```bash
curl -X GET "http://localhost:7001/api/tool/gen/batchGenCode?tables=sys_user,sys_role" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -o ruoyi-gen.zip
```

---

## 实现细节

### 1. 文件结构

```
ruoyi-eggjs/
├── app/
│   ├── controller/
│   │   ├── system/          # 系统管理控制器
│   │   ├── monitor/         # 系统监控控制器
│   │   └── tool/
│   │       └── gen.js       # 代码生成控制器（新增）
│   └── service/
│       ├── system/          # 系统管理服务
│       ├── monitor/         # 系统监控服务
│       └── tool/
│           └── gen.js       # 代码生成服务（新增）
```

### 2. 核心功能

#### 2.1 表管理（简化实现）
- ✅ 查询代码生成表列表
- ✅ 查询数据库表列表
- ✅ 查询表详情
- ✅ 查询表字段列表

#### 2.2 代码生成（简化实现）
- ✅ 预览代码
- ✅ 下载代码
- ✅ 生成代码到自定义路径
- ✅ 批量生成代码

#### 2.3 其他功能（简化实现）
- ✅ 导入表结构
- ✅ 修改生成配置
- ✅ 删除表配置
- ✅ 同步数据库

### 3. 简化说明

**当前实现**:
- ✅ 提供完整的 12 个 API 接口
- ✅ 可查询数据库表列表
- ✅ 可查询表字段信息
- ⏳ 代码生成为框架实现

**完整实现需要**:
1. **数据库表**: 创建 `gen_table`、`gen_table_column` 表
2. **代码模板**: 准备 Controller、Service、Mapper 等模板
3. **模板引擎**: 使用 ejs、handlebars 等模板引擎
4. **文件生成**: 根据模板生成代码文件
5. **文件打包**: 使用 archiver 打包成 zip

### 4. 推荐使用 ruoyi-eggjs-cli

**ruoyi-eggjs-cli** 是专门为 ruoyi-eggjs 开发的代码生成工具。

**安装**:
```bash
npm install -g ruoyi-eggjs-cli
```

**使用**:
```bash
# 生成 Service 代码
ruoyi-gen service --mapper=SysUserMapper.xml

# 生成 Controller 代码  
ruoyi-gen controller --name=user

# 查看帮助
ruoyi-gen --help
```

**优点**:
- 专为 ruoyi-eggjs 设计
- 支持从 Mapper XML 生成 Service
- 命令行工具，使用方便
- 无需 Web 界面

### 5. 完整实现建议

#### 方案1: 集成模板引擎

```bash
npm install ejs archiver
```

```javascript
const ejs = require('ejs');
const archiver = require('archiver');

// 生成 Controller 代码
const template = fs.readFileSync('templates/controller.ejs', 'utf8');
const code = ejs.render(template, {
  tableName: 'sys_user',
  className: 'User',
  // ...
});

// 打包成 zip
const archive = archiver('zip');
archive.append(code, { name: 'controller/user.js' });
// ...
```

#### 方案2: 使用现有工具

直接使用 **ruoyi-eggjs-cli** 工具，无需 Web 界面。

---

## 测试步骤

### 1. 准备工作
1. 确保数据库已初始化
2. 启动 Egg.js 应用
3. 获取登录 Token

### 2. 测试流程

```bash
# 1. 登录获取 Token
TOKEN=$(curl -X POST "http://localhost:7001/api/login" \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}' \
  | jq -r '.token')

# 2. 查询数据库表列表
curl -X GET "http://localhost:7001/api/tool/gen/db/list?pageNum=1&pageSize=10" \
  -H "Authorization: Bearer $TOKEN"

# 3. 导入表结构
curl -X POST "http://localhost:7001/api/tool/gen/importTable" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"tables": "sys_user"}'

# 4. 查询代码生成表列表
curl -X GET "http://localhost:7001/api/tool/gen/list" \
  -H "Authorization: Bearer $TOKEN"

# 5. 预览代码
curl -X GET "http://localhost:7001/api/tool/gen/preview/1" \
  -H "Authorization: Bearer $TOKEN"

# 6. 下载代码
curl -X GET "http://localhost:7001/api/tool/gen/download/sys_user" \
  -H "Authorization: Bearer $TOKEN" \
  -o sys_user.zip
```

---

## 注意事项

1. **Token 认证**: 所有接口都需要在请求头中携带 `Authorization: Bearer {token}`
2. **权限要求**: 需要代码生成权限
3. **简化实现**: 当前为简化实现，提供 API 接口框架
4. **推荐工具**: 建议使用 **ruoyi-eggjs-cli** 命令行工具
5. **完整功能**: 需要创建数据库表、准备代码模板

---

## 错误码说明

| 错误码 | 说明 |
|--------|------|
| 200 | 操作成功 |
| 500 | 操作失败 |
| 401 | 未授权（Token 失效） |
| 403 | 无权限 |

---

## 使用 ruoyi-eggjs-cli 工具

### 安装

```bash
npm install -g ruoyi-eggjs-cli
```

### 生成 Service

```bash
# 从 Mapper XML 生成 Service
ruoyi-gen service --mapper=SysUserMapper.xml

# 生成结果
✓ 成功生成: app/service/db/mysql/ruoyi/SysUserMapper.js
```

### 生成 Controller

```bash
# 生成 Controller
ruoyi-gen controller --name=user --path=/api/system/user

# 生成结果
✓ 成功生成: app/controller/system/user.js
```

### 优点

- ✅ 专为 ruoyi-eggjs 设计
- ✅ 支持从 Mapper XML 生成 Service
- ✅ 命令行工具，使用方便
- ✅ 无需 Web 界面
- ✅ 已安装即用

---

**文档版本**: v1.0  
**创建日期**: 2025-10-24  
**作者**: AI Assistant

