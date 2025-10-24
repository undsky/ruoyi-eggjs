# 公共接口 API 文档

## 概述

本文档描述了公共接口模块的所有 API 接口实现，包括文件上传、文件下载、本地资源下载等功能。

## 已实现的接口列表

### 1. 文件上传

**接口地址**: `POST /api/common/upload`

**请求类型**: multipart/form-data

**请求参数**:
- `file`: 文件（必填）

**支持的文件类型**:
- 图片: .jpg, .jpeg, .png, .gif, .bmp, .wbmp
- 文档: .doc, .docx, .xls, .xlsx, .ppt, .pptx, .pdf, .txt
- 压缩: .zip, .gz, .tgz, .gzip
- 音视频: .mp3, .wav, .mp4, .avi

**响应示例**:
```json
{
  "code": 200,
  "msg": "上传成功",
  "url": "/public/uploads/1729753200000_abc123.jpg",
  "fileName": "/public/uploads/1729753200000_abc123.jpg",
  "newFileName": "1729753200000_abc123.jpg",
  "originalFilename": "photo.jpg"
}
```

**字段说明**:
- `url`: 文件访问URL
- `fileName`: 文件路径
- `newFileName`: 服务器端文件名
- `originalFilename`: 原始文件名

**测试命令**:
```bash
curl -X POST "http://localhost:7001/api/common/upload" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@photo.jpg"
```

---

### 2. 文件下载

**接口地址**: `GET /api/common/download`

**请求参数**:
```
fileName=1729753200000_abc123.jpg  // 文件名（必填）
delete=false                        // 下载后是否删除（可选，默认false）
```

**功能说明**:
- 下载已上传的文件
- 可选择下载后删除文件

**响应**: 文件流（application/octet-stream）

**测试命令**:
```bash
# 下载文件
curl -X GET "http://localhost:7001/api/common/download?fileName=1729753200000_abc123.jpg" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -o photo.jpg

# 下载后删除
curl -X GET "http://localhost:7001/api/common/download?fileName=1729753200000_abc123.jpg&delete=true" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -o photo.jpg
```

---

### 3. 本地资源下载

**接口地址**: `GET /api/common/download/resource`

**请求参数**:
```
resource=/profile/uploads/avatar/avatar_1.jpg  // 资源路径（必填）
```

**功能说明**:
- 下载系统中的本地资源文件
- 如用户头像、系统文件等

**响应**: 文件流（application/octet-stream）

**测试命令**:
```bash
curl -X GET "http://localhost:7001/api/common/download/resource?resource=/profile/uploads/avatar/avatar_1.jpg" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -o avatar.jpg
```

---

## 实现细节

### 1. 文件结构

```
ruoyi-eggjs/
├── app/
│   ├── controller/
│   │   ├── system/
│   │   ├── monitor/
│   │   ├── tool/
│   │   └── common.js          # 公共接口控制器（新增）
│   ├── service/
│   │   └── upload.js          # 文件上传服务（完善）
│   └── public/
│       └── uploads/           # 文件上传目录
│           ├── avatar/        # 头像
│           └── ...            # 其他文件
```

### 2. 核心功能

#### 2.1 文件上传
- ✅ 单文件上传
- ✅ 使用文件流处理
- ✅ 生成唯一文件名
- ✅ 返回文件访问URL

#### 2.2 文件下载
- ✅ 根据文件名下载
- ✅ 下载后可选择删除
- ✅ 文件名安全校验

#### 2.3 资源下载
- ✅ 下载本地资源文件
- ✅ 路径安全校验
- ✅ 支持各种文件类型

### 3. 文件命名规则

**生成的文件名格式**: `{timestamp}_{uuid}.{ext}`

**示例**:
- `1729753200000_abc123def456.jpg`
- `1729753200000_xyz789.pdf`

**优点**:
- 唯一性（时间戳 + 随机字符串）
- 保留原始扩展名
- 避免文件名冲突

### 4. 安全性

**文件名安全校验**:
- 禁止路径遍历（`..`）
- 禁止非法字符（`\\`, `//`）
- 防止恶意文件名

**文件类型限制**:
- 在配置文件中定义白名单
- 只允许上传指定类型的文件

### 5. 文件存储路径

**上传文件**: `app/public/uploads/`  
**头像文件**: `app/public/uploads/avatar/`  
**其他文件**: `app/public/uploads/`

### 6. 配置说明

在 `config.default.js` 中：

```javascript
config.uploadRelPath = path.join(config.static.prefix, 'uploads');
config.uploadAbsPath = path.join(_appPath, config.uploadRelPath);

config.multipart = {
  fileSize: '100mb',  // 文件大小限制
  files: 10,          // 同时上传文件数量
  whitelist: [        // 文件类型白名单
    '.jpg', '.jpeg', '.png', '.gif', 
    '.doc', '.docx', '.pdf', 
    // ...
  ]
};
```

---

## 测试步骤

### 1. 准备工作
1. 确保 Egg.js 应用已启动
2. 获取登录 Token
3. 准备测试文件

### 2. 测试流程

```bash
# 1. 登录获取 Token
TOKEN=$(curl -X POST "http://localhost:7001/api/login" \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}' \
  | jq -r '.token')

# 2. 上传文件
RESPONSE=$(curl -X POST "http://localhost:7001/api/common/upload" \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@photo.jpg")

echo $RESPONSE

# 提取文件名
FILE_NAME=$(echo $RESPONSE | jq -r '.newFileName')

# 3. 下载文件
curl -X GET "http://localhost:7001/api/common/download?fileName=$FILE_NAME" \
  -H "Authorization: Bearer $TOKEN" \
  -o downloaded.jpg

# 4. 下载本地资源
curl -X GET "http://localhost:7001/api/common/download/resource?resource=/profile/uploads/avatar/avatar_1.jpg" \
  -H "Authorization: Bearer $TOKEN" \
  -o avatar.jpg
```

---

## 注意事项

1. **Token 认证**: 所有接口都需要在请求头中携带 `Authorization: Bearer {token}`
2. **文件大小**: 默认限制 100MB，可在配置文件中修改
3. **文件类型**: 只能上传白名单中的文件类型
4. **安全性**: 
   - 文件名会被重命名，避免冲突
   - 路径会进行安全校验，防止路径遍历
5. **存储位置**: 文件保存在 `app/public/uploads/` 目录

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

### 场景1: 用户上传附件

用户在系统中上传文件：
- 上传图片、文档等
- 系统自动保存
- 返回访问URL

---

### 场景2: 导出文件下载

系统生成导出文件后：
- 用户下载导出的 Excel
- 下载后可选择删除临时文件

---

### 场景3: 资源文件访问

访问系统中的资源文件：
- 下载用户头像
- 下载系统文档
- 下载其他资源

---

**文档版本**: v1.0  
**创建日期**: 2025-10-24  
**作者**: AI Assistant

