# RuoYi Spring Boot vs Egg.js 架构对比分析

## 一、技术栈对比

### 1.1 后端框架

| 维度 | Spring Boot | Egg.js | 说明 |
|------|-------------|--------|------|
| 语言 | Java 17 | Node.js 20+ | Node.js 性能更优 |
| 框架 | Spring Boot 3.5.4 | Egg.js 3.x | 企业级框架 |
| 架构模式 | MVC | MVC | 相同 |
| 依赖注入 | @Autowired | Context 注入 | 机制不同 |
| 开发效率 | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | Node.js 更灵活 |

---

### 1.2 数据库操作

| 维度 | Spring Boot | Egg.js | 说明 |
|------|-------------|--------|------|
| ORM 框架 | MyBatis | 自研 MyBatis XML 插件 | XML 语法完全兼容 |
| SQL 编写 | XML Mapper | XML Mapper | 100% 兼容 |
| 连接池 | Druid | MySQL2 Pool | Egg.js 使用原生连接池 |
| 事务管理 | @Transactional | 手动控制 | Spring Boot 更方便 |
| 性能 | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | Node.js 异步优势 |

---

### 1.3 缓存策略

| 维度 | Spring Boot | Egg.js | 说明 |
|------|-------------|--------|------|
| 缓存框架 | Spring Cache + Redis | ruoyi-eggjs-cache | 自研插件 |
| 支持类型 | Redis | Memory + File + Redis | 多层级缓存 |
| 注解支持 | @Cacheable | 代码实现 | Spring Boot 更简洁 |
| 灵活性 | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | Egg.js 更灵活 |

---

### 1.4 权限认证

| 维度 | Spring Boot | Egg.js | 说明 |
|------|-------------|--------|------|
| 安全框架 | Spring Security | egg-jwt | JWT 标准 |
| 认证方式 | JWT | JWT | 相同 |
| 权限注解 | @PreAuthorize | 自定义中间件 | Spring Boot 更强大 |
| Session 管理 | Redis | Redis | 相同 |

---

### 1.5 日志管理

| 维度 | Spring Boot | Egg.js | 说明 |
|------|-------------|--------|------|
| 日志框架 | Logback | egg-logger | 内置日志 |
| 日志切面 | @Log 注解 | 自定义中间件 | Spring Boot AOP 更优雅 |
| 日志级别 | DEBUG/INFO/WARN/ERROR | 相同 | 相同 |
| 日志输出 | 文件 + 控制台 | 文件 + 控制台 | 相同 |

---

## 二、项目结构对比

### 2.1 Spring Boot 项目结构

```
RuoYi-Vue-springboot3/
├── ruoyi-admin/              # 入口模块
│   └── web/controller/       # 控制器层
│
├── ruoyi-system/             # 业务模块
│   ├── domain/               # 实体类 (Entity)
│   ├── mapper/               # Mapper 接口
│   └── service/              # 服务层
│       ├── impl/             # 服务实现
│       └── I*.java           # 服务接口
│
├── ruoyi-framework/          # 框架配置
│   └── config/               # Spring 配置类
│
├── ruoyi-common/             # 公共模块
│   ├── annotation/           # 自定义注解
│   ├── constant/             # 常量
│   ├── core/                 # 核心类
│   ├── exception/            # 异常类
│   ├── filter/               # 过滤器
│   └── utils/                # 工具类
│
├── ruoyi-quartz/             # 定时任务
└── ruoyi-generator/          # 代码生成

特点：
✅ 模块化清晰
✅ 分层明确
✅ 职责单一
⚠️ 文件较多
```

---

### 2.2 Egg.js 项目结构

```
ruoyi-eggjs/
├── app/
│   ├── controller/           # 控制器层
│   │   ├── api/              # API 控制器
│   │   ├── system/           # 系统管理（待实现）
│   │   └── monitor/          # 系统监控（待实现）
│   │
│   ├── service/              # 服务层
│   │   ├── db/               # 数据库服务（自动生成）
│   │   │   └── mysql/ruoyi/  # MyBatis Service
│   │   ├── system/           # 系统管理服务（待实现）
│   │   └── common/           # 公共服务
│   │
│   ├── middleware/           # 中间件
│   │   ├── accessControl.js  # JWT 访问控制
│   │   ├── formatBody.js     # 响应格式化
│   │   ├── log.js            # 日志记录（待实现）
│   │   ├── permission.js     # 权限校验（待实现）
│   │   └── dataScope.js      # 数据权限（待实现）
│   │
│   └── extend/               # 扩展（待实现）
│       ├── helper.js         # Helper 扩展
│       └── context.js        # Context 扩展
│
├── config/                   # 配置文件
│   ├── config.default.js     # 默认配置
│   ├── config.local.js       # 本地配置
│   ├── config.prod.js        # 生产配置
│   └── plugin.js             # 插件配置
│
├── mapper/                   # MyBatis XML
│   └── mysql/ruoyi/          # 若依 Mapper
│
├── utils/                    # 工具类（待实现）
├── constant/                 # 常量定义（待实现）
└── docs/                     # 项目文档

特点：
✅ 结构扁平
✅ 约定优于配置
✅ 插件化开发
⚠️ 需要手动规划目录
```

---

## 三、代码风格对比

### 3.1 Controller 层

**Spring Boot**：
```java
@RestController
@RequestMapping("/system/user")
public class SysUserController extends BaseController {
    
    @Autowired
    private ISysUserService userService;
    
    @PreAuthorize("@ss.hasPermi('system:user:list')")
    @GetMapping("/list")
    public TableDataInfo list(SysUser user) {
        startPage();
        List<SysUser> list = userService.selectUserList(user);
        return getDataTable(list);
    }
    
    @PreAuthorize("@ss.hasPermi('system:user:add')")
    @Log(title = "用户管理", businessType = BusinessType.INSERT)
    @PostMapping
    public AjaxResult add(@Validated @RequestBody SysUser user) {
        if (!userService.checkUserNameUnique(user)) {
            return error("新增用户失败，登录账号已存在");
        }
        user.setCreateBy(getUsername());
        return toAjax(userService.insertUser(user));
    }
}
```

**Egg.js**：
```javascript
const { Route, HttpGet, HttpPost } = require('egg-decorator-router');
const Controller = require('egg').Controller;

@Route('/api/system/user')
class UserController extends Controller {
  
  @HttpGet('/list')
  async list() {
    const { ctx, service } = this;
    
    // 权限验证（中间件）
    // 分页参数
    const { pageNum, pageSize } = ctx.request.body;
    
    // 查询用户列表
    const users = await service.system.user.selectUserList(
      ctx.helper.page({ pageNum, pageSize }),
      ctx.request.body
    );
    
    ctx.body = users;
  }
  
  @HttpPost()
  async add() {
    const { ctx, service } = this;
    const user = ctx.request.body;
    
    // 校验用户名唯一性
    const exists = await service.system.user.checkUserNameUnique(user.userName);
    if (exists) {
      ctx.body = { code: 500, msg: '新增用户失败，登录账号已存在' };
      return;
    }
    
    // 新增用户
    user.createBy = ctx.state.user.userName;
    const result = await service.system.user.insertUser(user);
    
    ctx.body = { code: 200, msg: '操作成功', data: result };
  }
}

module.exports = UserController;
```

**对比总结**：
- Spring Boot: 注解驱动，代码简洁
- Egg.js: 装饰器语法，更灵活

---

### 3.2 Service 层

**Spring Boot**：
```java
@Service
public class SysUserServiceImpl implements ISysUserService {
    
    @Autowired
    private SysUserMapper userMapper;
    
    @Override
    @DataScope(deptAlias = "d", userAlias = "u")
    public List<SysUser> selectUserList(SysUser user) {
        return userMapper.selectUserList(user);
    }
    
    @Override
    @Transactional
    public int insertUser(SysUser user) {
        // 新增用户信息
        int rows = userMapper.insertUser(user);
        // 新增用户岗位关联
        insertUserPost(user);
        // 新增用户与角色管理
        insertUserRole(user);
        return rows;
    }
}
```

**Egg.js**：
```javascript
const Service = require('egg').Service;

class UserService extends Service {
  
  async selectUserList(values, params) {
    const { ctx } = this;
    
    // 注入数据权限
    params.dataScope = await this.injectDataScope(ctx.state.user);
    
    // 查询用户列表
    return await ctx.service.db.mysql.ruoyi.sysUserMapper
      .selectUserList(values, params);
  }
  
  async insertUser(user) {
    const { ctx, app } = this;
    const conn = await app.mysql.get('ruoyi').beginTransaction();
    
    try {
      // 新增用户信息
      const result = await conn.insert('sys_user', user);
      const userId = result.insertId;
      
      // 新增用户岗位关联
      await this.insertUserPost(conn, userId, user.postIds);
      
      // 新增用户角色关联
      await this.insertUserRole(conn, userId, user.roleIds);
      
      await conn.commit();
      return result;
    } catch (err) {
      await conn.rollback();
      throw err;
    }
  }
}

module.exports = UserService;
```

**对比总结**：
- Spring Boot: `@Transactional` 声明式事务
- Egg.js: 手动控制事务（更灵活但繁琐）

---

### 3.3 Mapper 层

**Spring Boot**：
```java
// SysUserMapper.java
@Mapper
public interface SysUserMapper {
    List<SysUser> selectUserList(SysUser user);
    SysUser selectUserById(Long userId);
    int insertUser(SysUser user);
    int updateUser(SysUser user);
    int deleteUserById(Long userId);
}
```

**Egg.js**：
```javascript
// SysUserMapper.js (自动生成)
class SysUserMapperService extends Service {
  
  selectUserListMapper(values, params) {
    return this.mapper('selectUserList', values, params);
  }
  
  async selectUserList(values, params) {
    return await this.db().select(this.selectUserListMapper(values, params));
  }
  
  async insertUser(values, params) {
    return await this.db().insert(this.insertUserMapper(values, params));
  }
}
```

**对比总结**：
- Spring Boot: 接口 + XML，简洁
- Egg.js: Service + XML，自动生成

---

## 四、关键功能实现对比

### 4.1 数据权限

**Spring Boot**：
```java
// 使用注解 + AOP
@DataScope(deptAlias = "d", userAlias = "u")
public List<SysUser> selectUserList(SysUser user) {
    return userMapper.selectUserList(user);
}

// AOP 切面自动注入 SQL
// WHERE ... AND (u.dept_id = ? OR u.dept_id IN (...))
```

**Egg.js**：
```javascript
// 使用中间件 + 参数注入
async selectUserList(params) {
  // 手动注入数据权限 SQL
  params.dataScope = await this.injectDataScope(ctx.state.user);
  
  return await ctx.service.db.mysql.ruoyi.sysUserMapper
    .selectUserList([], params);
}

// XML 中使用
// ${params.dataScope}
```

**优缺点**：
- Spring Boot: 透明、优雅，但不够灵活
- Egg.js: 灵活、可控，但需要手动处理

---

### 4.2 操作日志

**Spring Boot**：
```java
@Log(title = "用户管理", businessType = BusinessType.INSERT)
@PostMapping
public AjaxResult add(@RequestBody SysUser user) {
    return toAjax(userService.insertUser(user));
}

// AOP 自动记录日志
```

**Egg.js**：
```javascript
// 使用中间件
// app/middleware/log.js
module.exports = () => {
  return async function log(ctx, next) {
    const startTime = Date.now();
    
    await next();
    
    // 记录操作日志
    await ctx.service.monitor.operLog.insert({
      title: '用户管理',
      businessType: 1,
      method: ctx.request.url,
      requestMethod: ctx.request.method,
      operName: ctx.state.user.userName,
      operTime: new Date(),
      costTime: Date.now() - startTime
    });
  };
};
```

**优缺点**：
- Spring Boot: 声明式，代码侵入小
- Egg.js: 中间件模式，全局统一处理

---

### 4.3 分页查询

**Spring Boot**：
```java
// 使用 PageHelper
startPage();
List<SysUser> list = userService.selectUserList(user);
return getDataTable(list);

// PageHelper 自动拦截 SQL
// SELECT * FROM sys_user LIMIT ?, ?
```

**Egg.js**：
```javascript
// 手动处理分页
async selectUserList(params) {
  const { pageNum = 1, pageSize = 10 } = params;
  
  // 计算 LIMIT
  const offset = (pageNum - 1) * pageSize;
  
  // 查询总数
  const total = await ctx.service.db.mysql.ruoyi.sysUserMapper
    .countUserList([], params);
  
  // 查询列表
  const rows = await ctx.service.db.mysql.ruoyi.sysUserMapper
    .selectUserList([offset, pageSize], params);
  
  return { rows, total };
}
```

**优缺点**：
- Spring Boot: PageHelper 自动分页，简单
- Egg.js: 手动分页，需要写两次查询

---

### 4.4 参数校验

**Spring Boot**：
```java
public AjaxResult add(@Validated @RequestBody SysUser user) {
    // @Validated 自动校验
    // @NotBlank, @Size, @Email 等注解
}

// Entity 类
public class SysUser {
    @NotBlank(message = "用户账号不能为空")
    @Size(max = 30, message = "用户账号长度不能超过30个字符")
    private String userName;
    
    @Email(message = "邮箱格式不正确")
    private String email;
}
```

**Egg.js**：
```javascript
// 使用 egg-validate 插件
async add() {
  const { ctx } = this;
  
  // 定义校验规则
  ctx.validate({
    userName: { type: 'string', required: true, max: 30 },
    email: { type: 'email', required: false },
    phonenumber: { type: 'string', format: /^1[3-9]\d{9}$/ }
  });
  
  // 校验通过后继续执行
  const user = ctx.request.body;
  // ...
}
```

**优缺点**：
- Spring Boot: 注解校验，声明式
- Egg.js: 代码校验，更灵活

---

## 五、性能对比

### 5.1 并发性能

| 指标 | Spring Boot | Egg.js | 说明 |
|------|-------------|--------|------|
| 单线程/进程 | 多线程 | 单线程（多进程） | Node.js 事件驱动 |
| I/O 模型 | 阻塞 I/O | 非阻塞 I/O | Node.js 优势 |
| CPU 利用 | 多核利用好 | 需要多进程 | Java 优势 |
| 内存占用 | 较高 | 较低 | Node.js 优势 |
| 启动速度 | 慢 (10-30秒) | 快 (1-3秒) | Node.js 优势 |
| QPS (1000用户) | 5000-8000 | 8000-15000 | Node.js 更高 |

---

### 5.2 开发效率

| 指标 | Spring Boot | Egg.js | 说明 |
|------|-------------|--------|------|
| 上手难度 | 中等 | 简单 | Node.js 更容易 |
| 代码量 | 较多 | 较少 | JS 更简洁 |
| 热更新 | DevTools (慢) | nodemon (快) | Node.js 优势 |
| 调试难度 | 中等 | 简单 | Node.js 更友好 |
| 生态丰富度 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | Java 更成熟 |

---

## 六、适用场景

### 6.1 Spring Boot 适合

✅ 大型企业应用
✅ 复杂业务逻辑
✅ 需要强类型约束
✅ 团队熟悉 Java
✅ 高并发计算密集型
✅ 需要成熟的企业级解决方案

---

### 6.2 Egg.js 适合

✅ 中小型应用
✅ I/O 密集型应用
✅ API 网关
✅ 微服务架构
✅ 快速原型开发
✅ 需要高性能、低延迟
✅ 团队熟悉 JavaScript

---

## 七、迁移建议

### 7.1 完全兼容的部分

✅ **数据库表结构**：100% 兼容
✅ **MyBatis XML**：100% 兼容（使用 ruoyi-eggjs-mybatis）
✅ **业务逻辑**：90% 兼容（需要转换语法）
✅ **API 接口**：100% 兼容（RESTful 风格一致）

---

### 7.2 需要重写的部分

⚠️ **事务管理**：需要手动控制
⚠️ **权限注解**：改为中间件实现
⚠️ **日志注解**：改为中间件实现
⚠️ **参数校验**：改为代码校验
⚠️ **异常处理**：改为统一异常捕获

---

### 7.3 迁移策略

**渐进式迁移**：
1. 保留 Spring Boot 项目运行
2. 逐模块迁移到 Egg.js
3. 使用相同数据库
4. 前端切换部分接口到 Egg.js
5. 灰度发布验证
6. 完全替换 Spring Boot

**优势**：
- 风险低
- 可回滚
- 逐步验证

---

## 八、总结

### 8.1 技术选型建议

| 场景 | 推荐 | 理由 |
|------|------|------|
| 新项目快速开发 | ✅ Egg.js | 开发效率高 |
| 企业级复杂应用 | ✅ Spring Boot | 生态成熟 |
| API 网关/微服务 | ✅ Egg.js | 性能优势 |
| 大数据处理 | ✅ Spring Boot | 多线程优势 |
| 实时通信应用 | ✅ Egg.js | 异步 I/O |
| 金融核心系统 | ✅ Spring Boot | 稳定性 |

---

### 8.2 最佳实践

**如果选择 Egg.js 重构**：
1. ✅ 复用 MyBatis XML Mapper（100% 兼容）
2. ✅ 复用数据库设计（完全一致）
3. ✅ 复用前端代码（API 兼容）
4. ✅ 参考 Spring Boot 业务逻辑
5. ✅ 使用 Egg.js 特性优化性能

---

**文档版本**: v1.0
**创建日期**: 2025-10-23

