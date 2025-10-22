# ruoyi-eggjs

> 若依 Nodejs 版本，基于 Eggjs

### 特性

+ 使用 MyBatis XML 编写 SQL（[文档](https://github.com/undsky/ruoyi-eggjs-mybatis?tab=readme-ov-file#xml-%E6%98%A0%E5%B0%84%E6%96%87%E4%BB%B6)）
+ 支持多数据源、多数据库（[文档](https://github.com/undsky/ruoyi-eggjs-mybatis?tab=readme-ov-file#%E7%9B%AE%E5%BD%95%E7%BB%93%E6%9E%84)）
+ 代码自动生成（[文档](https://github.com/undsky/ruoyi-eggjs-cli)）
+ 文件模版（[文档](https://marketplace.visualstudio.com/items?itemName=qiu8310.dot-template-vscode)）
+ 路由注解（[文档](https://github.com/fyl080801/egg-decorator-router#readme)）
+ 兼容若依（TODO）

### 快速开始

#### 下载项目
```
git clone https://github.com/undsky/ruoyi-eggjs.git
npm i
```

#### 配置数据库、Redis
``` javascript
// ./config/config.local.js
config.mysql = {
    clients: {
      ruoyi: {
        host: "127.0.0.1",
        user: "root",
        password: "jyx123",
        database: "ruoyi",
      },
    },
  };

  const redis = {
    port: 6379,
    host: "127.0.0.1",
    password: "",
    db: 0,
  };
```

#### 运行
```
npm run dev
```

#### 访问
[http://localhost:7001]()

### TODO

> 实现若依（RuoYi-Vue）内置功能

1.  用户管理：用户是系统操作者，该功能主要完成系统用户配置。
2.  部门管理：配置系统组织机构（公司、部门、小组），树结构展现支持数据权限。
3.  岗位管理：配置系统用户所属担任职务。
4.  菜单管理：配置系统菜单，操作权限，按钮权限标识等。
5.  角色管理：角色菜单权限分配、设置角色按机构进行数据范围权限划分。
6.  字典管理：对系统中经常使用的一些较为固定的数据进行维护。
7.  参数管理：对系统动态配置常用参数。
8.  通知公告：系统通知公告信息发布维护。
9.  操作日志：系统正常操作日志记录和查询；系统异常信息日志记录和查询。
10. 登录日志：系统登录日志记录查询包含登录异常。
11. 在线用户：当前系统中活跃用户状态监控。
12. 定时任务：在线（添加、修改、删除)任务调度包含执行结果日志。
13. 代码生成：前后端代码的生成（java、html、xml、sql）支持CRUD下载 。
14. 系统接口：根据业务代码自动生成相关的api接口文档。
15. 服务监控：监视当前系统CPU、内存、磁盘、堆栈等相关信息。
16. 缓存监控：对系统的缓存信息查询，命令统计等。
17. 在线构建器：拖动表单元素生成相应的HTML代码。
18. 连接池监视：监视当前系统数据库连接池状态，可进行分析SQL找出系统性能瓶颈。