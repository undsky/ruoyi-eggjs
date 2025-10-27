/*
 * @Description: 登录认证控制器
 * @Author: AI Assistant
 * @Date: 2025-10-23
 */

const Controller = require('egg').Controller;
const { Route, HttpPost, HttpGet, HttpAll } = require('egg-decorator-router');

module.exports = app => {
  const { secret, expiresIn } = app.config.jwt;

  @Route('/api')
  class LoginController extends Controller {
    
    /**
     * 用户登录
     * POST /api/login
     * 说明：公开接口，无需权限验证
     */
    @HttpPost('/login')
    async login() {
      const { ctx, service } = this;
      const { username, password, code, uuid } = ctx.request.body;

      try {
        // 1. 校验验证码
        if (app.config.captcha.enabled) {
          await service.system.login.validateCaptcha(code, uuid);
        }

        // 2. 用户认证
        const user = await service.system.login.login(username, password);

        // 3. 生成 Token
        const tokenData = {
          userId: user.userId,
          userName: user.userName,
          deptId: user.deptId
        };

        const token = app.jwt.sign(tokenData, secret, {
          expiresIn,
          jwtid: `${Date.now()}_${user.userId}`
        });

        // 4. 记录登录日志
        await service.monitor.logininfor.recordLoginInfo(
          user.userName,
          '0',
          '登录成功',
          ctx
        );

        // 5. 存储在线用户信息到 Redis
        await service.system.login.recordOnlineUser(user, token);

        ctx.body = {
          code: 200,
          msg: '登录成功',
          token
        };
      } catch (err) {
        // 记录登录失败日志
        await service.monitor.logininfor.recordLoginInfo(
          username || '',
          '1',
          err.message,
          ctx
        );

        ctx.body = {
          code: 500,
          msg: err.message || '登录失败'
        };
      }
    }

    /**
     * 用户登出
     * POST /api/logout
     * 说明：需要登录，无需特殊权限
     */
    @HttpPost('/logout')
    async logout() {
      const { ctx, service } = this;
      
      try {
        const user = ctx.state.user;
        
        // 删除在线用户信息
        await service.system.login.removeOnlineUser(user.jti);
        
        // 记录登出日志
        await service.monitor.logininfor.recordLoginInfo(
          user.userName,
          '0',
          '退出成功',
          ctx
        );

        ctx.body = {
          code: 200,
          msg: '退出成功'
        };
      } catch (err) {
        ctx.body = {
          code: 500,
          msg: err.message || '退出失败'
        };
      }
    }

    /**
     * 获取用户信息
     * GET /api/getInfo
     * 说明：需要登录，无需特殊权限
     */
    @HttpGet('/getInfo')
    async getInfo() {
      const { ctx, service } = this;
      
      try {
        const userId = ctx.state.user.userId;
        
        // 查询用户详细信息
        const user = await service.system.user.selectUserById(userId);
        
        if (!user) {
          ctx.body = {
            code: 500,
            msg: '用户不存在'
          };
          return;
        }

        // 查询用户角色
        const roles = await service.system.role.selectRolesByUserId(userId);
        
        // 查询用户权限
        const permissions = await service.system.menu.selectPermsByUserId(userId);

        ctx.body = {
          code: 200,
          msg: '查询成功',
          user: {
            userId: user.userId,
            deptId: user.deptId,
            userName: user.userName,
            nickName: user.nickName,
            email: user.email,
            phonenumber: user.phonenumber,
            sex: user.sex,
            avatar: user.avatar,
            status: user.status,
            createTime: user.createTime
          },
          roles: roles.map(r => r.roleKey),
          permissions
        };
      } catch (err) {
        ctx.logger.error('获取用户信息失败:', err);
        ctx.body = {
          code: 500,
          msg: err.message || '获取用户信息失败'
        };
      }
    }

    /**
     * 获取路由菜单
     * GET /api/getRouters
     * 说明：需要登录，无需特殊权限
     */
    @HttpGet('/getRouters')
    async getRouters() {
      const { ctx, service } = this;
      
      try {
        const userId = ctx.state.user.userId;
        
        // 查询用户菜单
        const menus = await service.system.menu.selectMenuTreeByUserId(userId);

        ctx.body = {
          code: 200,
          msg: '查询成功',
          data: menus
        };
      } catch (err) {
        ctx.logger.error('获取路由菜单失败:', err);
        ctx.body = {
          code: 500,
          msg: err.message || '获取路由菜单失败'
        };
      }
    }

    /**
     * 用户注册
     * POST /api/register
     * 说明：公开接口，无需权限验证
     */
    @HttpPost('/register')
    async register() {
      const { ctx, service, app } = this;
      const { username, password, code, uuid } = ctx.request.body;

      try {
        // 1. 检查是否允许注册
        const registerEnabled = await service.system.config.selectConfigByKey('sys.account.registerUser');
        if (registerEnabled === 'false') {
          ctx.body = {
            code: 500,
            msg: '当前系统没有开启注册功能'
          };
          return;
        }

        // 2. 校验验证码
        if (app.config.captcha.enabled) {
          await service.system.login.validateCaptcha(code, uuid);
        }

        // 3. 校验用户名是否存在
        const exists = await service.system.user.checkUserNameUnique(username);
        if (exists) {
          ctx.body = {
            code: 500,
            msg: '用户名已存在'
          };
          return;
        }

        // 4. 注册用户
        await service.system.login.register(username, password);

        ctx.body = {
          code: 200,
          msg: '注册成功'
        };
      } catch (err) {
        ctx.logger.error('用户注册失败:', err);
        ctx.body = {
          code: 500,
          msg: err.message || '注册失败'
        };
      }
    }

    /**
     * 获取验证码
     * GET /api/captchaImage
     * 说明：公开接口，无需权限验证
     */
    @HttpGet('/captchaImage')
    async captchaImage() {
      const { ctx, service } = this;
      
      try {
        // 生成验证码
        const captcha = await service.system.login.createCaptcha();

        ctx.body = {
          code: 200,
          msg: '操作成功',
          ...captcha
        };
      } catch (err) {
        ctx.logger.error('生成验证码失败:', err);
        ctx.body = {
          code: 500,
          msg: err.message || '生成验证码失败'
        };
      }
    }
  }

  return LoginController;
};

