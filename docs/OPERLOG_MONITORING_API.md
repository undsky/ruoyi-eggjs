# 操作日志监控 API 接口文档

## 概述

本文档描述了操作日志监控模块的所有 API 接口实现，包括日志查询、删除、清空、导出等功能。

## 已实现的接口列表

### 1. 操作日志列表（分页）

**接口地址**: `GET /api/monitor/operlog/list`

**请求参数**:
```json
{
  "pageNum": 1,          // 页码，默认 1
  "pageSize": 10,        // 每页条数，默认 10
  "title": "",           // 系统模块（模糊查询）
  "operName": "",        // 操作人员（模糊查询）
  "businessType": "",    // 业务类型（0其它 1新增 2修改 3删除）
  "status": "",          // 操作状态（0-正常，1-异常）
  "operIp": "",          // 操作IP（模糊查询）
  "beginTime": "",       // 开始时间
  "endTime": ""          // 结束时间
}
```

**响应示例**:
```json
{
  "code": 200,
  "msg": "查询成功",
  "rows": [
    {
      "operId": 1,
      "title": "用户管理",
      "businessType": 1,
      "method": "UserController.add",
      "requestMethod": "POST",
      "operatorType": 0,
      "operName": "admin",
      "deptName": "研发部门",
      "operUrl": "/api/system/user",
      "operIp": "127.0.0.1",
      "operLocation": "内网IP",
      "operParam": "{\"userName\":\"test\"}",
      "jsonResult": "{\"code\":200,\"msg\":\"成功\"}",
      "status": "0",
      "errorMsg": "",
      "operTime": "2025-10-24 10:00:00",
      "costTime": 50
    }
  ],
  "total": 1
}
```

**字段说明**:
- `operId`: 日志ID
- `title`: 系统模块
- `businessType`: 业务类型（0-其它，1-新增，2-修改，3-删除，4-授权，5-导出，6-导入，7-强退，8-生成代码，9-清空数据）
- `method`: 方法名称
- `requestMethod`: 请求方式（GET/POST/PUT/DELETE）
- `operatorType`: 操作类别（0-其它，1-后台用户，2-手机端用户）
- `operName`: 操作人员
- `deptName`: 部门名称
- `operUrl`: 请求URL
- `operIp`: 操作IP地址
- `operLocation`: 操作地点
- `operParam`: 请求参数
- `jsonResult`: 返回结果
- `status`: 操作状态（0-正常，1-异常）
- `errorMsg`: 错误消息
- `operTime`: 操作时间
- `costTime`: 消耗时间（毫秒）

**测试命令**:
```bash
curl -X GET "http://localhost:7001/api/monitor/operlog/list?pageNum=1&pageSize=10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 2. 删除操作日志

**接口地址**: `DELETE /api/monitor/operlog/:operIds`

**路径参数**:
- `operIds`: 日志ID，多个用逗号分隔，如 `1,2,3`

**响应示例**:
```json
{
  "code": 200,
  "msg": "删除成功"
}
```

**测试命令**:
```bash
# 删除单个日志
curl -X DELETE "http://localhost:7001/api/monitor/operlog/1" \
  -H "Authorization: Bearer YOUR_TOKEN"

# 删除多个日志
curl -X DELETE "http://localhost:7001/api/monitor/operlog/1,2,3" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 3. 清空操作日志

**接口地址**: `DELETE /api/monitor/operlog/clean`

**功能说明**:
- 清空所有操作日志
- 使用 TRUNCATE 命令，速度快
- 操作不可逆，请谨慎使用

**响应示例**:
```json
{
  "code": 200,
  "msg": "清空成功"
}
```

**测试命令**:
```bash
curl -X DELETE "http://localhost:7001/api/monitor/operlog/clean" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 4. 导出操作日志

**接口地址**: `POST /api/monitor/operlog/export`

**请求参数**:
```json
{
  "title": "",
  "operName": "",
  "businessType": "",
  "status": "",
  "operIp": "",
  "beginTime": "",
  "endTime": ""
}
```

**响应示例**:
```json
{
  "code": 200,
  "msg": "导出成功",
  "data": [...]
}
```

**说明**: 目前返回 JSON 数据，Excel 导出功能待实现。

**测试命令**:
```bash
curl -X POST "http://localhost:7001/api/monitor/operlog/export" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "1"}'
```

---

## 实现细节

### 1. 文件结构

```
ruoyi-eggjs/
├── app/
│   ├── controller/
│   │   ├── system/          # 系统管理控制器
│   │   └── monitor/
│   │       ├── online.js    # 在线用户
│   │       ├── logininfor.js # 登录日志
│   │       └── operlog.js   # 操作日志（新增）
│   └── service/
│       ├── system/          # 系统管理服务
│       └── monitor/
│           ├── online.js    # 在线用户
│           ├── logininfor.js # 登录日志
│           └── operlog.js   # 操作日志（新增）
└── mapper/
    └── mysql/
        └── ruoyi/
            └── SysOperLogMapper.xml
```

### 2. 核心功能

#### 2.1 日志管理
- ✅ 查询操作日志列表
- ✅ 按条件过滤（模块、操作人、业务类型、状态、IP、时间范围）
- ✅ 分页查询
- ✅ 删除日志
- ✅ 批量删除
- ✅ 清空所有日志

#### 2.2 自动记录
- ✅ 提供记录操作日志的方法
- ✅ 记录请求参数、返回结果
- ✅ 记录操作IP、耗时等信息

#### 2.3 其他功能
- ✅ 按操作时间倒序排列
- ⏳ Excel 导出（框架已完成，待完善）

### 3. 业务类型说明

| 类型 | 值 | 说明 |
|------|---|------|
| 其它 | 0 | 其它操作 |
| 新增 | 1 | 新增数据 |
| 修改 | 2 | 修改数据 |
| 删除 | 3 | 删除数据 |
| 授权 | 4 | 授权操作 |
| 导出 | 5 | 导出数据 |
| 导入 | 6 | 导入数据 |
| 强退 | 7 | 强退用户 |
| 生成代码 | 8 | 生成代码 |
| 清空数据 | 9 | 清空数据 |

### 4. 操作状态说明

| 状态 | 值 | 说明 |
|------|---|------|
| 正常 | 0 | 操作成功 |
| 异常 | 1 | 操作失败 |

### 5. 日志记录示例

**手动记录日志** (在业务代码中):
```javascript
// 在 Controller 中记录操作日志
await service.monitor.operlog.recordOperLog({
  title: '用户管理',
  businessType: 1,  // 新增
  method: 'UserController.add',
  operUrl: '/api/system/user',
  status: '0',
  costTime: 50
});
```

**建议**: 在关键操作处添加日志记录，如：
- 新增用户
- 修改角色权限
- 删除重要数据
- 导入导出操作

### 6. 数据库表结构

本模块涉及以下数据表：
- `sys_oper_log` - 操作日志表

### 7. 业务逻辑还原

所有接口的业务逻辑均参考 RuoYi Spring Boot 版本实现，包括：
- 数据查询逻辑
- 错误提示信息

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

# 2. 查询操作日志列表
curl -X GET "http://localhost:7001/api/monitor/operlog/list?pageNum=1&pageSize=10" \
  -H "Authorization: Bearer $TOKEN"

# 3. 按模块过滤
curl -X GET "http://localhost:7001/api/monitor/operlog/list?title=用户管理" \
  -H "Authorization: Bearer $TOKEN"

# 4. 按业务类型过滤（查询新增操作）
curl -X GET "http://localhost:7001/api/monitor/operlog/list?businessType=1" \
  -H "Authorization: Bearer $TOKEN"

# 5. 按状态过滤（查询异常操作）
curl -X GET "http://localhost:7001/api/monitor/operlog/list?status=1" \
  -H "Authorization: Bearer $TOKEN"

# 6. 按操作人过滤
curl -X GET "http://localhost:7001/api/monitor/operlog/list?operName=admin" \
  -H "Authorization: Bearer $TOKEN"

# 7. 按时间范围过滤
curl -X GET "http://localhost:7001/api/monitor/operlog/list?beginTime=2025-10-24%2000:00:00&endTime=2025-10-24%2023:59:59" \
  -H "Authorization: Bearer $TOKEN"

# 8. 导出操作日志
curl -X POST "http://localhost:7001/api/monitor/operlog/export" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "1"}'

# 9. 删除操作日志
curl -X DELETE "http://localhost:7001/api/monitor/operlog/1,2,3" \
  -H "Authorization: Bearer $TOKEN"

# 10. 清空操作日志（谨慎操作）
curl -X DELETE "http://localhost:7001/api/monitor/operlog/clean" \
  -H "Authorization: Bearer $TOKEN"
```

---

## 注意事项

1. **Token 认证**: 所有接口都需要在请求头中携带 `Authorization: Bearer {token}`
2. **权限要求**: 需要监控权限
3. **清空操作**: 清空日志是不可逆操作，请谨慎使用
4. **日志记录**: 需要在业务代码中手动调用记录方法
5. **性能考虑**: 日志表会快速增长，建议定期清理

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

### 场景1: 审计用户操作

管理员可以查看所有用户的操作记录，包括：
- 谁操作了
- 操作了什么模块
- 执行了什么操作（新增/修改/删除）
- 什么时候操作的
- 操作是否成功
- 耗时多少

---

### 场景2: 排查系统异常

当系统出现问题时，可以：
- 查询异常的操作记录（status=1）
- 查看错误消息
- 分析请求参数
- 追溯问题来源

---

### 场景3: 监控敏感操作

可以重点关注：
- 删除操作（businessType=3）
- 清空数据操作（businessType=9）
- 强退用户操作（businessType=7）
- 导出操作（businessType=5）

---

### 场景4: 性能分析

通过 `costTime` 字段：
- 分析慢查询
- 优化接口性能
- 发现性能瓶颈

---

## 数据示例

### 新增操作日志

```json
{
  "operId": 1,
  "title": "用户管理",
  "businessType": 1,
  "method": "UserController.add",
  "requestMethod": "POST",
  "operatorType": 0,
  "operName": "admin",
  "deptName": "研发部门",
  "operUrl": "/api/system/user",
  "operIp": "127.0.0.1",
  "operLocation": "内网IP",
  "operParam": "{\"userName\":\"testuser\",\"nickName\":\"测试用户\"}",
  "jsonResult": "{\"code\":200,\"msg\":\"新增成功\"}",
  "status": "0",
  "errorMsg": "",
  "operTime": "2025-10-24 10:00:00",
  "costTime": 50
}
```

### 删除操作日志

```json
{
  "operId": 2,
  "title": "角色管理",
  "businessType": 3,
  "method": "RoleController.remove",
  "requestMethod": "DELETE",
  "operatorType": 0,
  "operName": "admin",
  "deptName": "研发部门",
  "operUrl": "/api/system/role/10",
  "operIp": "127.0.0.1",
  "operLocation": "内网IP",
  "operParam": "",
  "jsonResult": "{\"code\":200,\"msg\":\"删除成功\"}",
  "status": "0",
  "errorMsg": "",
  "operTime": "2025-10-24 10:05:00",
  "costTime": 30
}
```

### 异常操作日志

```json
{
  "operId": 3,
  "title": "菜单管理",
  "businessType": 3,
  "method": "MenuController.remove",
  "requestMethod": "DELETE",
  "operatorType": 0,
  "operName": "admin",
  "deptName": "研发部门",
  "operUrl": "/api/system/menu/1",
  "operIp": "127.0.0.1",
  "operLocation": "内网IP",
  "operParam": "",
  "jsonResult": "{\"code\":500,\"msg\":\"存在子菜单,不允许删除\"}",
  "status": "1",
  "errorMsg": "存在子菜单,不允许删除",
  "operTime": "2025-10-24 10:10:00",
  "costTime": 20
}
```

---

**文档版本**: v1.0  
**创建日期**: 2025-10-24  
**作者**: AI Assistant

