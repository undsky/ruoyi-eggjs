# 通知公告管理 API 接口文档

## 概述

本文档描述了通知公告管理模块的所有 API 接口实现，包括 CRUD 操作等功能。

## 已实现的接口列表

### 1. 通知公告列表（分页）

**接口地址**: `GET /api/system/notice/list`

**请求参数**:
```json
{
  "pageNum": 1,          // 页码，默认 1
  "pageSize": 10,        // 每页条数，默认 10
  "noticeTitle": "",     // 公告标题（模糊查询）
  "noticeType": "",      // 公告类型（1-通知，2-公告）
  "createBy": ""         // 创建者（模糊查询）
}
```

**响应示例**:
```json
{
  "code": 200,
  "msg": "查询成功",
  "rows": [
    {
      "noticeId": 1,
      "noticeTitle": "温馨提醒：2025-10-24 若依新版本发布",
      "noticeType": "2",
      "noticeContent": "新版本内容",
      "status": "0",
      "createBy": "admin",
      "createTime": "2025-10-24 10:00:00",
      "remark": ""
    }
  ],
  "total": 1
}
```

**测试命令**:
```bash
curl -X GET "http://localhost:7001/api/system/notice/list?pageNum=1&pageSize=10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 2. 通知公告详情

**接口地址**: `GET /api/system/notice/:noticeId`

**路径参数**:
- `noticeId`: 通知公告ID

**响应示例**:
```json
{
  "code": 200,
  "msg": "操作成功",
  "data": {
    "noticeId": 1,
    "noticeTitle": "温馨提醒：2025-10-24 若依新版本发布",
    "noticeType": "2",
    "noticeContent": "新版本内容",
    "status": "0",
    "createBy": "admin",
    "createTime": "2025-10-24 10:00:00",
    "updateBy": null,
    "updateTime": null,
    "remark": ""
  }
}
```

**测试命令**:
```bash
curl -X GET "http://localhost:7001/api/system/notice/1" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 3. 新增通知公告

**接口地址**: `POST /api/system/notice`

**请求参数**:
```json
{
  "noticeTitle": "系统维护通知",
  "noticeType": "1",
  "noticeContent": "系统将于今晚22:00进行维护，预计维护时间2小时，请提前保存数据。",
  "status": "0",
  "remark": "系统维护"
}
```

**字段说明**:
- `noticeTitle`: 公告标题（必填）
- `noticeType`: 公告类型（必填，1-通知，2-公告）
- `noticeContent`: 公告内容（必填）
- `status`: 公告状态（0-正常，1-关闭）
- `remark`: 备注

**响应示例**:
```json
{
  "code": 200,
  "msg": "新增成功"
}
```

**测试命令**:
```bash
curl -X POST "http://localhost:7001/api/system/notice" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "noticeTitle": "系统维护通知",
    "noticeType": "1",
    "noticeContent": "系统将于今晚22:00进行维护，预计维护时间2小时。",
    "status": "0",
    "remark": "系统维护"
  }'
```

---

### 4. 修改通知公告

**接口地址**: `PUT /api/system/notice`

**请求参数**:
```json
{
  "noticeId": 10,
  "noticeTitle": "系统维护通知（已修改）",
  "noticeType": "1",
  "noticeContent": "系统将于今晚23:00进行维护，预计维护时间1小时。",
  "status": "0",
  "remark": "修改后的备注"
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
curl -X PUT "http://localhost:7001/api/system/notice" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "noticeId": 10,
    "noticeTitle": "系统维护通知（已修改）",
    "noticeType": "1",
    "noticeContent": "系统将于今晚23:00进行维护，预计维护时间1小时。",
    "status": "0"
  }'
```

---

### 5. 删除通知公告

**接口地址**: `DELETE /api/system/notice/:noticeIds`

**路径参数**:
- `noticeIds`: 通知公告ID，多个用逗号分隔，如 `10,11,12`

**响应示例**:
```json
{
  "code": 200,
  "msg": "删除成功"
}
```

**测试命令**:
```bash
# 删除单个通知公告
curl -X DELETE "http://localhost:7001/api/system/notice/10" \
  -H "Authorization: Bearer YOUR_TOKEN"

# 删除多个通知公告
curl -X DELETE "http://localhost:7001/api/system/notice/10,11,12" \
  -H "Authorization: Bearer YOUR_TOKEN"
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
│   │       ├── role.js
│   │       ├── menu.js
│   │       ├── dept.js
│   │       ├── post.js
│   │       ├── dictType.js
│   │       ├── dictData.js
│   │       ├── config.js
│   │       └── notice.js        # 通知公告控制器（新增）
│   └── service/
│       └── system/
│           ├── login.js
│           ├── user.js
│           ├── role.js
│           ├── dept.js
│           ├── post.js
│           ├── menu.js
│           ├── dictType.js
│           ├── dictData.js
│           ├── config.js
│           └── notice.js        # 通知公告服务（新增）
└── mapper/
    └── mysql/
        └── ruoyi/
            └── SysNoticeMapper.xml
```

### 2. 核心功能

#### 2.1 基础操作
- ✅ 通知公告 CRUD 操作
- ✅ 分页查询
- ✅ 条件过滤（公告标题、公告类型、创建者）
- ✅ 批量删除

### 3. 通知类型说明

| 类型 | 值 | 说明 |
|------|---|------|
| 通知 | 1 | 系统通知，如维护通知、升级通知 |
| 公告 | 2 | 系统公告，如新功能发布、活动通知 |

### 4. 状态说明

| 状态 | 值 | 说明 |
|------|---|------|
| 正常 | 0 | 公告正常显示 |
| 关闭 | 1 | 公告关闭，不显示 |

### 5. 数据库表结构

本模块涉及以下数据表：
- `sys_notice` - 通知公告表

### 6. 业务逻辑还原

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

# 2. 查询通知公告列表
curl -X GET "http://localhost:7001/api/system/notice/list?pageNum=1&pageSize=10" \
  -H "Authorization: Bearer $TOKEN"

# 3. 新增通知公告
curl -X POST "http://localhost:7001/api/system/notice" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "noticeTitle": "系统维护通知",
    "noticeType": "1",
    "noticeContent": "系统将于今晚22:00进行维护，预计维护时间2小时。",
    "status": "0",
    "remark": "系统维护"
  }'

# 4. 查询通知公告详情
curl -X GET "http://localhost:7001/api/system/notice/10" \
  -H "Authorization: Bearer $TOKEN"

# 5. 修改通知公告
curl -X PUT "http://localhost:7001/api/system/notice" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "noticeId": 10,
    "noticeTitle": "系统维护通知（已修改）",
    "noticeType": "1",
    "noticeContent": "系统将于今晚23:00进行维护，预计维护时间1小时。",
    "status": "0"
  }'

# 6. 删除通知公告
curl -X DELETE "http://localhost:7001/api/system/notice/10" \
  -H "Authorization: Bearer $TOKEN"
```

---

## 注意事项

1. **Token 认证**: 所有接口都需要在请求头中携带 `Authorization: Bearer {token}`
2. **公告类型**: 1-通知，2-公告
3. **公告状态**: 0-正常，1-关闭
4. **批量删除**: 支持一次删除多个通知公告

---

## 错误码说明

| 错误码 | 说明 |
|--------|------|
| 200 | 操作成功 |
| 500 | 操作失败 |
| 401 | 未授权（Token 失效） |
| 403 | 无权限 |

---

## 使用示例

### 示例1: 发布系统维护通知

```bash
curl -X POST "http://localhost:7001/api/system/notice" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "noticeTitle": "系统维护通知",
    "noticeType": "1",
    "noticeContent": "系统将于今晚22:00-24:00进行维护升级，期间系统将无法访问，请提前保存数据。给您带来不便，敬请谅解！",
    "status": "0"
  }'
```

---

### 示例2: 发布新功能公告

```bash
curl -X POST "http://localhost:7001/api/system/notice" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "noticeTitle": "新功能上线公告",
    "noticeType": "2",
    "noticeContent": "系统新增了数据导入导出功能，欢迎大家使用！详细说明请查看帮助文档。",
    "status": "0"
  }'
```

---

### 示例3: 关闭过期公告

```bash
# 修改公告状态为关闭
curl -X PUT "http://localhost:7001/api/system/notice" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "noticeId": 1,
    "noticeTitle": "温馨提醒：2025-10-24 若依新版本发布",
    "noticeType": "2",
    "noticeContent": "新版本内容",
    "status": "1"
  }'
```

---

**文档版本**: v1.0  
**创建日期**: 2025-10-24  
**作者**: AI Assistant

