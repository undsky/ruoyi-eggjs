# RuoYi 数据库设计文档

## 一、数据库概览

**数据库名称**: `ruoyi`
**字符集**: `utf8mb4`
**排序规则**: `utf8mb4_general_ci`
**引擎**: `InnoDB`

**核心表数量**: 15 张

---

## 二、核心表结构

### 2.1 用户信息表 (sys_user)

用户基础信息表，存储系统用户的账号、个人信息等。

```sql
CREATE TABLE sys_user (
  user_id           BIGINT(20)      NOT NULL AUTO_INCREMENT    COMMENT '用户ID',
  dept_id           BIGINT(20)      DEFAULT NULL               COMMENT '部门ID',
  user_name         VARCHAR(30)     NOT NULL                   COMMENT '用户账号',
  nick_name         VARCHAR(30)     NOT NULL                   COMMENT '用户昵称',
  user_type         VARCHAR(2)      DEFAULT '00'               COMMENT '用户类型（00系统用户）',
  email             VARCHAR(50)     DEFAULT ''                 COMMENT '用户邮箱',
  phonenumber       VARCHAR(11)     DEFAULT ''                 COMMENT '手机号码',
  sex               CHAR(1)         DEFAULT '0'                COMMENT '用户性别（0男 1女 2未知）',
  avatar            VARCHAR(100)    DEFAULT ''                 COMMENT '头像地址',
  password          VARCHAR(100)    DEFAULT ''                 COMMENT '密码',
  status            CHAR(1)         DEFAULT '0'                COMMENT '账号状态（0正常 1停用）',
  del_flag          CHAR(1)         DEFAULT '0'                COMMENT '删除标志（0代表存在 2代表删除）',
  login_ip          VARCHAR(128)    DEFAULT ''                 COMMENT '最后登录IP',
  login_date        DATETIME                                   COMMENT '最后登录时间',
  pwd_update_date   DATETIME                                   COMMENT '密码最后更新时间',
  create_by         VARCHAR(64)     DEFAULT ''                 COMMENT '创建者',
  create_time       DATETIME                                   COMMENT '创建时间',
  update_by         VARCHAR(64)     DEFAULT ''                 COMMENT '更新者',
  update_time       DATETIME                                   COMMENT '更新时间',
  remark            VARCHAR(500)    DEFAULT NULL               COMMENT '备注',
  PRIMARY KEY (user_id),
  KEY idx_dept_id (dept_id),
  KEY idx_user_name (user_name)
) ENGINE=InnoDB COMMENT='用户信息表';
```

**字段说明**：
- `user_id`: 主键，自增
- `dept_id`: 外键，关联 sys_dept 表
- `user_name`: 登录账号，唯一
- `password`: BCrypt 加密存储
- `status`: 0-正常，1-停用
- `del_flag`: 0-存在，2-删除（逻辑删除）

---

### 2.2 部门表 (sys_dept)

组织架构表，树形结构存储。

```sql
CREATE TABLE sys_dept (
  dept_id           BIGINT(20)      NOT NULL AUTO_INCREMENT    COMMENT '部门id',
  parent_id         BIGINT(20)      DEFAULT 0                  COMMENT '父部门id',
  ancestors         VARCHAR(50)     DEFAULT ''                 COMMENT '祖级列表',
  dept_name         VARCHAR(30)     DEFAULT ''                 COMMENT '部门名称',
  order_num         INT(4)          DEFAULT 0                  COMMENT '显示顺序',
  leader            VARCHAR(20)     DEFAULT NULL               COMMENT '负责人',
  phone             VARCHAR(11)     DEFAULT NULL               COMMENT '联系电话',
  email             VARCHAR(50)     DEFAULT NULL               COMMENT '邮箱',
  status            CHAR(1)         DEFAULT '0'                COMMENT '部门状态（0正常 1停用）',
  del_flag          CHAR(1)         DEFAULT '0'                COMMENT '删除标志（0代表存在 2代表删除）',
  create_by         VARCHAR(64)     DEFAULT ''                 COMMENT '创建者',
  create_time       DATETIME                                   COMMENT '创建时间',
  update_by         VARCHAR(64)     DEFAULT ''                 COMMENT '更新者',
  update_time       DATETIME                                   COMMENT '更新时间',
  PRIMARY KEY (dept_id),
  KEY idx_parent_id (parent_id)
) ENGINE=InnoDB COMMENT='部门表';
```

**字段说明**：
- `dept_id`: 主键
- `parent_id`: 父部门ID，0表示根节点
- `ancestors`: 祖级列表，如 `0,100,101` 表示层级关系
- `order_num`: 同级排序

---

### 2.3 岗位表 (sys_post)

职务信息表。

```sql
CREATE TABLE sys_post (
  post_id       BIGINT(20)      NOT NULL AUTO_INCREMENT    COMMENT '岗位ID',
  post_code     VARCHAR(64)     NOT NULL                   COMMENT '岗位编码',
  post_name     VARCHAR(50)     NOT NULL                   COMMENT '岗位名称',
  post_sort     INT(4)          NOT NULL                   COMMENT '显示顺序',
  status        CHAR(1)         NOT NULL                   COMMENT '状态（0正常 1停用）',
  create_by     VARCHAR(64)     DEFAULT ''                 COMMENT '创建者',
  create_time   DATETIME                                   COMMENT '创建时间',
  update_by     VARCHAR(64)     DEFAULT ''                 COMMENT '更新者',
  update_time   DATETIME                                   COMMENT '更新时间',
  remark        VARCHAR(500)    DEFAULT NULL               COMMENT '备注',
  PRIMARY KEY (post_id),
  UNIQUE KEY uk_post_code (post_code)
) ENGINE=InnoDB COMMENT='岗位信息表';
```

---

### 2.4 角色表 (sys_role)

角色信息表，用于权限管理。

```sql
CREATE TABLE sys_role (
  role_id           BIGINT(20)      NOT NULL AUTO_INCREMENT    COMMENT '角色ID',
  role_name         VARCHAR(30)     NOT NULL                   COMMENT '角色名称',
  role_key          VARCHAR(100)    NOT NULL                   COMMENT '角色权限字符串',
  role_sort         INT(4)          NOT NULL                   COMMENT '显示顺序',
  data_scope        CHAR(1)         DEFAULT '1'                COMMENT '数据范围（1：全部数据权限 2：自定数据权限 3：本部门数据权限 4：本部门及以下数据权限 5：仅本人数据权限）',
  menu_check_strictly   TINYINT(1)  DEFAULT 1                  COMMENT '菜单树选择项是否关联显示',
  dept_check_strictly   TINYINT(1)  DEFAULT 1                  COMMENT '部门树选择项是否关联显示',
  status            CHAR(1)         NOT NULL                   COMMENT '角色状态（0正常 1停用）',
  del_flag          CHAR(1)         DEFAULT '0'                COMMENT '删除标志（0代表存在 2代表删除）',
  create_by         VARCHAR(64)     DEFAULT ''                 COMMENT '创建者',
  create_time       DATETIME                                   COMMENT '创建时间',
  update_by         VARCHAR(64)     DEFAULT ''                 COMMENT '更新者',
  update_time       DATETIME                                   COMMENT '更新时间',
  remark            VARCHAR(500)    DEFAULT NULL               COMMENT '备注',
  PRIMARY KEY (role_id),
  UNIQUE KEY uk_role_key (role_key)
) ENGINE=InnoDB COMMENT='角色信息表';
```

**数据权限说明**：
- `1`: 全部数据权限
- `2`: 自定义数据权限（需配合 sys_role_dept）
- `3`: 本部门数据权限
- `4`: 本部门及以下数据权限
- `5`: 仅本人数据权限

---

### 2.5 菜单权限表 (sys_menu)

菜单和权限表，树形结构。

```sql
CREATE TABLE sys_menu (
  menu_id           BIGINT(20)      NOT NULL AUTO_INCREMENT    COMMENT '菜单ID',
  menu_name         VARCHAR(50)     NOT NULL                   COMMENT '菜单名称',
  parent_id         BIGINT(20)      DEFAULT 0                  COMMENT '父菜单ID',
  order_num         INT(4)          DEFAULT 0                  COMMENT '显示顺序',
  path              VARCHAR(200)    DEFAULT ''                 COMMENT '路由地址',
  component         VARCHAR(255)    DEFAULT NULL               COMMENT '组件路径',
  query             VARCHAR(255)    DEFAULT NULL               COMMENT '路由参数',
  is_frame          INT(1)          DEFAULT 1                  COMMENT '是否为外链（0是 1否）',
  is_cache          INT(1)          DEFAULT 0                  COMMENT '是否缓存（0缓存 1不缓存）',
  menu_type         CHAR(1)         DEFAULT ''                 COMMENT '菜单类型（M目录 C菜单 F按钮）',
  visible           CHAR(1)         DEFAULT '0'                COMMENT '菜单状态（0显示 1隐藏）',
  status            CHAR(1)         DEFAULT '0'                COMMENT '菜单状态（0正常 1停用）',
  perms             VARCHAR(100)    DEFAULT NULL               COMMENT '权限标识',
  icon              VARCHAR(100)    DEFAULT '#'                COMMENT '菜单图标',
  create_by         VARCHAR(64)     DEFAULT ''                 COMMENT '创建者',
  create_time       DATETIME                                   COMMENT '创建时间',
  update_by         VARCHAR(64)     DEFAULT ''                 COMMENT '更新者',
  update_time       DATETIME                                   COMMENT '更新时间',
  remark            VARCHAR(500)    DEFAULT ''                 COMMENT '备注',
  PRIMARY KEY (menu_id),
  KEY idx_parent_id (parent_id)
) ENGINE=InnoDB COMMENT='菜单权限表';
```

**菜单类型说明**：
- `M`: 目录（一级菜单）
- `C`: 菜单（二级菜单）
- `F`: 按钮（权限标识）

**权限标识示例**：
- `system:user:list` - 用户列表查询
- `system:user:add` - 用户新增
- `system:user:edit` - 用户修改
- `system:user:remove` - 用户删除

---

### 2.6 用户-角色关联表 (sys_user_role)

多对多关系表。

```sql
CREATE TABLE sys_user_role (
  user_id   BIGINT(20) NOT NULL COMMENT '用户ID',
  role_id   BIGINT(20) NOT NULL COMMENT '角色ID',
  PRIMARY KEY (user_id, role_id),
  KEY idx_user_id (user_id),
  KEY idx_role_id (role_id)
) ENGINE=InnoDB COMMENT='用户和角色关联表';
```

---

### 2.7 用户-岗位关联表 (sys_user_post)

多对多关系表。

```sql
CREATE TABLE sys_user_post (
  user_id   BIGINT(20) NOT NULL COMMENT '用户ID',
  post_id   BIGINT(20) NOT NULL COMMENT '岗位ID',
  PRIMARY KEY (user_id, post_id),
  KEY idx_user_id (user_id),
  KEY idx_post_id (post_id)
) ENGINE=InnoDB COMMENT='用户与岗位关联表';
```

---

### 2.8 角色-菜单关联表 (sys_role_menu)

多对多关系表。

```sql
CREATE TABLE sys_role_menu (
  role_id   BIGINT(20) NOT NULL COMMENT '角色ID',
  menu_id   BIGINT(20) NOT NULL COMMENT '菜单ID',
  PRIMARY KEY (role_id, menu_id),
  KEY idx_role_id (role_id),
  KEY idx_menu_id (menu_id)
) ENGINE=InnoDB COMMENT='角色和菜单关联表';
```

---

### 2.9 角色-部门关联表 (sys_role_dept)

用于自定义数据权限。

```sql
CREATE TABLE sys_role_dept (
  role_id   BIGINT(20) NOT NULL COMMENT '角色ID',
  dept_id   BIGINT(20) NOT NULL COMMENT '部门ID',
  PRIMARY KEY (role_id, dept_id),
  KEY idx_role_id (role_id),
  KEY idx_dept_id (dept_id)
) ENGINE=InnoDB COMMENT='角色和部门关联表';
```

---

### 2.10 字典类型表 (sys_dict_type)

字典分类表。

```sql
CREATE TABLE sys_dict_type (
  dict_id       BIGINT(20)      NOT NULL AUTO_INCREMENT    COMMENT '字典主键',
  dict_name     VARCHAR(100)    DEFAULT ''                 COMMENT '字典名称',
  dict_type     VARCHAR(100)    DEFAULT ''                 COMMENT '字典类型',
  status        CHAR(1)         DEFAULT '0'                COMMENT '状态（0正常 1停用）',
  create_by     VARCHAR(64)     DEFAULT ''                 COMMENT '创建者',
  create_time   DATETIME                                   COMMENT '创建时间',
  update_by     VARCHAR(64)     DEFAULT ''                 COMMENT '更新者',
  update_time   DATETIME                                   COMMENT '更新时间',
  remark        VARCHAR(500)    DEFAULT NULL               COMMENT '备注',
  PRIMARY KEY (dict_id),
  UNIQUE KEY uk_dict_type (dict_type)
) ENGINE=InnoDB COMMENT='字典类型表';
```

---

### 2.11 字典数据表 (sys_dict_data)

字典数据表。

```sql
CREATE TABLE sys_dict_data (
  dict_code     BIGINT(20)      NOT NULL AUTO_INCREMENT    COMMENT '字典编码',
  dict_sort     INT(4)          DEFAULT 0                  COMMENT '字典排序',
  dict_label    VARCHAR(100)    DEFAULT ''                 COMMENT '字典标签',
  dict_value    VARCHAR(100)    DEFAULT ''                 COMMENT '字典键值',
  dict_type     VARCHAR(100)    DEFAULT ''                 COMMENT '字典类型',
  css_class     VARCHAR(100)    DEFAULT NULL               COMMENT '样式属性（其他样式扩展）',
  list_class    VARCHAR(100)    DEFAULT NULL               COMMENT '表格回显样式',
  is_default    CHAR(1)         DEFAULT 'N'                COMMENT '是否默认（Y是 N否）',
  status        CHAR(1)         DEFAULT '0'                COMMENT '状态（0正常 1停用）',
  create_by     VARCHAR(64)     DEFAULT ''                 COMMENT '创建者',
  create_time   DATETIME                                   COMMENT '创建时间',
  update_by     VARCHAR(64)     DEFAULT ''                 COMMENT '更新者',
  update_time   DATETIME                                   COMMENT '更新时间',
  remark        VARCHAR(500)    DEFAULT NULL               COMMENT '备注',
  PRIMARY KEY (dict_code),
  KEY idx_dict_type (dict_type)
) ENGINE=InnoDB COMMENT='字典数据表';
```

---

### 2.12 参数配置表 (sys_config)

系统参数配置表。

```sql
CREATE TABLE sys_config (
  config_id     INT(5)          NOT NULL AUTO_INCREMENT    COMMENT '参数主键',
  config_name   VARCHAR(100)    DEFAULT ''                 COMMENT '参数名称',
  config_key    VARCHAR(100)    DEFAULT ''                 COMMENT '参数键名',
  config_value  VARCHAR(500)    DEFAULT ''                 COMMENT '参数键值',
  config_type   CHAR(1)         DEFAULT 'N'                COMMENT '系统内置（Y是 N否）',
  create_by     VARCHAR(64)     DEFAULT ''                 COMMENT '创建者',
  create_time   DATETIME                                   COMMENT '创建时间',
  update_by     VARCHAR(64)     DEFAULT ''                 COMMENT '更新者',
  update_time   DATETIME                                   COMMENT '更新时间',
  remark        VARCHAR(500)    DEFAULT NULL               COMMENT '备注',
  PRIMARY KEY (config_id),
  UNIQUE KEY uk_config_key (config_key)
) ENGINE=InnoDB COMMENT='参数配置表';
```

**常用配置示例**：
- `sys.user.initPassword`: 用户初始密码
- `sys.index.skinName`: 主题样式
- `sys.account.captchaEnabled`: 验证码开关

---

### 2.13 通知公告表 (sys_notice)

系统公告表。

```sql
CREATE TABLE sys_notice (
  notice_id         INT(4)          NOT NULL AUTO_INCREMENT    COMMENT '公告ID',
  notice_title      VARCHAR(50)     NOT NULL                   COMMENT '公告标题',
  notice_type       CHAR(1)         NOT NULL                   COMMENT '公告类型（1通知 2公告）',
  notice_content    LONGBLOB        DEFAULT NULL               COMMENT '公告内容',
  status            CHAR(1)         DEFAULT '0'                COMMENT '公告状态（0正常 1关闭）',
  create_by         VARCHAR(64)     DEFAULT ''                 COMMENT '创建者',
  create_time       DATETIME                                   COMMENT '创建时间',
  update_by         VARCHAR(64)     DEFAULT ''                 COMMENT '更新者',
  update_time       DATETIME                                   COMMENT '更新时间',
  remark            VARCHAR(255)    DEFAULT NULL               COMMENT '备注',
  PRIMARY KEY (notice_id)
) ENGINE=InnoDB COMMENT='通知公告表';
```

---

### 2.14 操作日志表 (sys_oper_log)

系统操作日志表。

```sql
CREATE TABLE sys_oper_log (
  oper_id           BIGINT(20)      NOT NULL AUTO_INCREMENT    COMMENT '日志主键',
  title             VARCHAR(50)     DEFAULT ''                 COMMENT '模块标题',
  business_type     INT(2)          DEFAULT 0                  COMMENT '业务类型（0其它 1新增 2修改 3删除）',
  method            VARCHAR(100)    DEFAULT ''                 COMMENT '方法名称',
  request_method    VARCHAR(10)     DEFAULT ''                 COMMENT '请求方式',
  operator_type     INT(1)          DEFAULT 0                  COMMENT '操作类别（0其它 1后台用户 2手机端用户）',
  oper_name         VARCHAR(50)     DEFAULT ''                 COMMENT '操作人员',
  dept_name         VARCHAR(50)     DEFAULT ''                 COMMENT '部门名称',
  oper_url          VARCHAR(255)    DEFAULT ''                 COMMENT '请求URL',
  oper_ip           VARCHAR(128)    DEFAULT ''                 COMMENT '主机地址',
  oper_location     VARCHAR(255)    DEFAULT ''                 COMMENT '操作地点',
  oper_param        VARCHAR(2000)   DEFAULT ''                 COMMENT '请求参数',
  json_result       VARCHAR(2000)   DEFAULT ''                 COMMENT '返回参数',
  status            INT(1)          DEFAULT 0                  COMMENT '操作状态（0正常 1异常）',
  error_msg         VARCHAR(2000)   DEFAULT ''                 COMMENT '错误消息',
  oper_time         DATETIME                                   COMMENT '操作时间',
  cost_time         BIGINT(20)      DEFAULT 0                  COMMENT '消耗时间',
  PRIMARY KEY (oper_id),
  KEY idx_business_type (business_type),
  KEY idx_status (status),
  KEY idx_oper_time (oper_time)
) ENGINE=InnoDB COMMENT='操作日志记录';
```

**业务类型说明**：
- `0`: 其它
- `1`: 新增
- `2`: 修改
- `3`: 删除
- `4`: 授权
- `5`: 导出
- `6`: 导入
- `7`: 强退
- `8`: 清空数据

---

### 2.15 登录日志表 (sys_logininfor)

系统登录日志表。

```sql
CREATE TABLE sys_logininfor (
  info_id        BIGINT(20)      NOT NULL AUTO_INCREMENT    COMMENT '访问ID',
  user_name      VARCHAR(50)     DEFAULT ''                 COMMENT '用户账号',
  ipaddr         VARCHAR(128)    DEFAULT ''                 COMMENT '登录IP地址',
  login_location VARCHAR(255)    DEFAULT ''                 COMMENT '登录地点',
  browser        VARCHAR(50)     DEFAULT ''                 COMMENT '浏览器类型',
  os             VARCHAR(50)     DEFAULT ''                 COMMENT '操作系统',
  status         CHAR(1)         DEFAULT '0'                COMMENT '登录状态（0成功 1失败）',
  msg            VARCHAR(255)    DEFAULT ''                 COMMENT '提示消息',
  login_time     DATETIME                                   COMMENT '访问时间',
  PRIMARY KEY (info_id),
  KEY idx_user_name (user_name),
  KEY idx_status (status),
  KEY idx_login_time (login_time)
) ENGINE=InnoDB COMMENT='系统访问记录';
```

---

## 三、数据库关系图

```
sys_user (用户表)
  ├─ 1:N → sys_user_role (用户-角色关联)
  ├─ 1:N → sys_user_post (用户-岗位关联)
  └─ N:1 → sys_dept (部门表)

sys_role (角色表)
  ├─ 1:N → sys_role_menu (角色-菜单关联)
  ├─ 1:N → sys_role_dept (角色-部门关联，用于数据权限)
  └─ 1:N → sys_user_role (用户-角色关联)

sys_menu (菜单表) - 树形结构
  └─ 1:N → sys_role_menu (角色-菜单关联)

sys_dept (部门表) - 树形结构
  ├─ 1:N → sys_user (用户表)
  └─ 1:N → sys_role_dept (角色-部门关联)

sys_post (岗位表)
  └─ 1:N → sys_user_post (用户-岗位关联)

sys_dict_type (字典类型)
  └─ 1:N → sys_dict_data (字典数据)

sys_config (参数配置) - 独立表

sys_notice (通知公告) - 独立表

sys_oper_log (操作日志) - 独立表

sys_logininfor (登录日志) - 独立表
```

---

## 四、索引设计说明

### 4.1 主键索引
所有表都有主键自增索引。

### 4.2 唯一索引
- `sys_user.user_name` - 用户账号唯一
- `sys_role.role_key` - 角色标识唯一
- `sys_post.post_code` - 岗位编码唯一
- `sys_dict_type.dict_type` - 字典类型唯一
- `sys_config.config_key` - 参数键名唯一

### 4.3 普通索引
- `sys_user.dept_id` - 按部门查询用户
- `sys_dept.parent_id` - 树形结构查询
- `sys_menu.parent_id` - 树形结构查询
- `sys_dict_data.dict_type` - 按类型查询字典
- `sys_oper_log.business_type, status, oper_time` - 日志查询优化
- `sys_logininfor.user_name, status, login_time` - 登录日志查询优化

### 4.4 联合主键
- `sys_user_role (user_id, role_id)`
- `sys_user_post (user_id, post_id)`
- `sys_role_menu (role_id, menu_id)`
- `sys_role_dept (role_id, dept_id)`

---

## 五、数据权限实现原理

### 5.1 数据范围类型

| 类型值 | 说明 | SQL 实现 |
|--------|------|----------|
| 1 | 全部数据权限 | 无过滤条件 |
| 2 | 自定义数据权限 | `dept_id IN (SELECT dept_id FROM sys_role_dept WHERE role_id = ?)` |
| 3 | 本部门数据权限 | `dept_id = ?` |
| 4 | 本部门及以下数据权限 | `dept_id = ? OR dept_id IN (SELECT dept_id FROM sys_dept WHERE find_in_set(?, ancestors))` |
| 5 | 仅本人数据权限 | `user_id = ?` |

### 5.2 实现步骤

1. 用户登录后，获取用户角色
2. 根据角色的 `data_scope` 字段确定数据范围
3. 在查询时动态注入数据权限 SQL
4. Egg.js 实现方式：在 Mapper 参数中传入 `dataScope` 字段

**示例**：
```xml
<!-- SysUserMapper.xml -->
<select id="selectUserList">
  SELECT * FROM sys_user u
  LEFT JOIN sys_dept d ON u.dept_id = d.dept_id
  WHERE u.del_flag = '0'
  <!-- 数据范围过滤 -->
  ${params.dataScope}
</select>
```

```javascript
// Egg.js Service 层
async selectUserList(params) {
  const { ctx } = this;
  const user = ctx.state.user;
  
  // 注入数据权限
  params.dataScope = await this.injectDataScope(user);
  
  return await ctx.service.db.mysql.ruoyi.sysUserMapper.selectUserList([], params);
}
```

---

## 六、逻辑删除设计

### 6.1 使用 del_flag 字段

大部分表使用 `del_flag` 字段实现逻辑删除：
- `0`: 正常（未删除）
- `2`: 已删除

### 6.2 优点
- 数据可恢复
- 保留历史记录
- 避免外键约束问题

### 6.3 注意事项
- 所有查询需加 `WHERE del_flag = '0'`
- 删除操作改为 `UPDATE SET del_flag = '2'`
- 定期清理已删除数据

---

## 七、树形结构设计

### 7.1 祖级列表 (ancestors) 模式

**优点**：
- 查询效率高
- 支持任意层级
- 便于查询子树

**字段设计**：
- `parent_id`: 父节点ID
- `ancestors`: 祖级列表，如 `0,100,101`

**示例**：
```
部门结构：
0 (根节点)
├── 100 (若依科技)
    ├── 101 (深圳总公司)
    │   ├── 103 (研发部门)
    │   └── 104 (市场部门)
    └── 102 (长沙分公司)

对应 ancestors：
- 100: "0"
- 101: "0,100"
- 103: "0,100,101"
- 104: "0,100,101"
- 102: "0,100"
```

**查询子树 SQL**：
```sql
-- 查询部门101的所有子部门
SELECT * FROM sys_dept 
WHERE find_in_set(101, ancestors);
```

---

## 八、性能优化建议

### 8.1 索引优化
- ✅ 已添加常用查询字段索引
- ✅ 关联表使用联合主键
- ⚠️ 定期分析慢查询日志

### 8.2 分区表（大数据量）
```sql
-- 日志表按月分区（可选）
ALTER TABLE sys_oper_log PARTITION BY RANGE (TO_DAYS(oper_time)) (
  PARTITION p202501 VALUES LESS THAN (TO_DAYS('2025-02-01')),
  PARTITION p202502 VALUES LESS THAN (TO_DAYS('2025-03-01')),
  ...
);
```

### 8.3 归档策略
- 操作日志保留 3 个月
- 登录日志保留 6 个月
- 定期归档到历史库

### 8.4 缓存策略
- 字典数据：Redis 缓存，TTL 1小时
- 参数配置：Redis 缓存，TTL 1小时
- 用户权限：Redis 缓存，TTL 30分钟
- 菜单树：Redis 缓存，TTL 1小时

---

## 九、数据迁移脚本

### 9.1 初始化脚本位置
```
sql/ry_20250522.sql
```

### 9.2 执行步骤
```bash
# 1. 创建数据库
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS ruoyi DEFAULT CHARSET utf8mb4 COLLATE utf8mb4_general_ci;"

# 2. 导入数据
mysql -u root -p ruoyi < sql/ry_20250522.sql

# 3. 验证
mysql -u root -p ruoyi -e "SHOW TABLES;"
```

---

## 十、备份恢复策略

### 10.1 备份策略
- 全量备份：每天凌晨 2:00
- 增量备份：每小时一次（binlog）
- 保留周期：30天

### 10.2 备份脚本
```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/data/backup/mysql"
DB_NAME="ruoyi"

# 全量备份
mysqldump -u root -p${MYSQL_PASSWORD} \
  --single-transaction \
  --routines \
  --triggers \
  --events \
  ${DB_NAME} | gzip > ${BACKUP_DIR}/ruoyi_${DATE}.sql.gz

# 删除30天前的备份
find ${BACKUP_DIR} -name "ruoyi_*.sql.gz" -mtime +30 -delete
```

---

**文档版本**: v1.0
**创建日期**: 2025-10-23
**数据库版本**: MySQL 5.7+

