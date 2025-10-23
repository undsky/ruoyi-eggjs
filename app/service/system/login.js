/*
 * @Description: 登录认证服务层
 * @Author: AI Assistant
 * @Date: 2025-10-23
 */

const Service = require('egg').Service;
const svgCaptcha = require('svg-captcha');
const { nanoid } = require('nanoid');

class LoginService extends Service {

  /**
   * 用户登录
   * @param {string} userName - 用户名
   * @param {string} password - 密码
   * @return {object} 用户信息
   */
  async login(userName, password) {
    const { ctx, app } = this;

    // 1. 查询用户
    const users = await ctx.service.db.mysql.ruoyi.sysUserMapper.selectUserByUserName([userName]);
    
    if (!users || users.length === 0) {
      throw new Error('用户不存在或密码错误');
    }

    const user = users[0];

    // 2. 检查用户状态
    if (user.delFlag === '2') {
      throw new Error('用户已被删除');
    }

    if (user.status === '1') {
      throw new Error('用户已被停用，请联系管理员');
    }

    // 3. 验证密码
    const security = ctx.helper.security;
    const isMatch = await security.comparePassword(password, user.password);
    
    if (!isMatch) {
      throw new Error('用户不存在或密码错误');
    }

    // 4. 更新登录信息
    await ctx.service.db.mysql.ruoyi.sysUserMapper.updateLoginInfo([
      user.userId,
      ctx.request.ip,
      new Date()
    ]);

    return user;
  }

  /**
   * 用户注册
   * @param {string} userName - 用户名
   * @param {string} password - 密码
   */
  async register(userName, password) {
    const { ctx } = this;

    // 获取默认密码
    const initPassword = await ctx.service.system.config.selectConfigByKey('sys.user.initPassword');

    // 加密密码
    const security = ctx.helper.security;
    const hashedPassword = await security.encryptPassword(password || initPassword || '123456');

    // 插入用户
    await ctx.service.db.mysql.ruoyi.sysUserMapper.insertUser([], {
      userName,
      nickName: userName,
      password: hashedPassword,
      status: '0',
      delFlag: '0',
      createTime: new Date()
    });
  }

  /**
   * 验证验证码
   * @param {string} code - 验证码
   * @param {string} uuid - 唯一标识
   */
  async validateCaptcha(code, uuid) {
    const { app } = this;

    if (!code || !uuid) {
      throw new Error('验证码不能为空');
    }

    // 从缓存中获取验证码
    const cacheKey = `captcha:${uuid}`;
    const cachedCode = await app.cache.default.get(cacheKey);

    if (!cachedCode) {
      throw new Error('验证码已过期，请重新获取');
    }

    // 验证码不区分大小写
    if (code.toLowerCase() !== cachedCode.toLowerCase()) {
      throw new Error('验证码错误');
    }

    // 验证通过后删除缓存
    await app.cache.default.del(cacheKey);
  }

  /**
   * 生成验证码
   * @return {object} 验证码信息
   */
  async createCaptcha() {
    const { app } = this;

    // 生成验证码
    const captcha = svgCaptcha.create({
      size: 4,        // 验证码长度
      noise: 2,       // 干扰线条数
      color: true,    // 验证码字符颜色
      background: '#f0f0f0',  // 背景色
      width: 120,
      height: 40,
      fontSize: 50
    });

    // 生成唯一标识
    const uuid = nanoid();

    // 存储到缓存（5分钟过期）
    const cacheKey = `captcha:${uuid}`;
    await app.cache.default.set(cacheKey, captcha.text, { ttl: 300 });

    return {
      uuid,
      img: captcha.data  // SVG 图片
    };
  }

  /**
   * 记录在线用户信息
   * @param {object} user - 用户信息
   * @param {string} token - Token
   */
  async recordOnlineUser(user, token) {
    const { app, ctx } = this;

    const onlineUser = {
      tokenId: token,
      userId: user.userId,
      userName: user.userName,
      deptName: user.deptName || '',
      ipaddr: ctx.request.ip,
      loginTime: new Date(),
      expireTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)  // 7天后过期
    };

    // 存储到 Redis（与 Token 过期时间一致）
    const cacheKey = `online_user:${user.userId}`;
    await app.cache.default.set(cacheKey, onlineUser, { ttl: 7 * 24 * 60 * 60 });
  }

  /**
   * 删除在线用户信息
   * @param {string} jti - Token ID
   */
  async removeOnlineUser(jti) {
    const { app } = this;

    // 将 Token 加入黑名单
    await app.cache.default.set(jti, 'revoked', { ttl: 7 * 24 * 60 * 60 });
  }
}

module.exports = LoginService;

