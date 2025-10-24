/*
 * @Description: 登录日志服务层
 * @Author: AI Assistant
 * @Date: 2025-10-23
 */

const Service = require('egg').Service;

class LogininforService extends Service {

  /**
   * 查询登录日志列表
   * @param {object} logininfor - 查询参数
   * @return {array} 登录日志列表
   */
  async selectLogininforList(logininfor = {}) {
    const { ctx } = this;
    
    // 查询条件
    const conditions = {
      ipaddr: logininfor.ipaddr,
      status: logininfor.status,
      userName: logininfor.userName,
      params: {
        beginTime: logininfor.beginTime,
        endTime: logininfor.endTime
      }
    };

    // 查询列表
    const logininforList = await ctx.service.db.mysql.ruoyi.sysLogininforMapper.selectLogininforList([conditions]);
    
    return logininforList || [];
  }

  /**
   * 删除登录日志
   * @param {array} infoIds - 日志ID数组
   * @return {number} 影响行数
   */
  async deleteLogininforByIds(infoIds) {
    const { ctx } = this;
    
    // 删除登录日志
    const result = await ctx.service.db.mysql.ruoyi.sysLogininforMapper.deleteLogininforByIds([infoIds]);
    
    return result && result.length > 0 ? infoIds.length : 0;
  }

  /**
   * 清空登录日志
   */
  async cleanLogininfor() {
    const { ctx } = this;
    
    // 清空登录日志
    await ctx.service.db.mysql.ruoyi.sysLogininforMapper.cleanLogininfor([]);
  }

  /**
   * 解锁用户（清除登录失败记录缓存）
   * @param {string} userName - 用户名
   */
  async unlockUser(userName) {
    const { app } = this;
    
    // 清除登录失败记录缓存
    const cacheKey = `login_fail:${userName}`;
    await app.cache.default.del(cacheKey);
  }

  /**
   * 记录登录信息
   * @param {string} userName - 用户名
   * @param {string} status - 登录状态（0成功 1失败）
   * @param {string} msg - 提示消息
   * @param {object} ctx - 上下文
   */
  async recordLoginInfo(userName, status, msg, ctx) {
    const { app } = this;
    
    try {
      const logininfor = {
        userName,
        ipaddr: ctx.helper.getClientIP(ctx),
        loginLocation: '',  // 可以集成 IP 地址解析库
        browser: this.getBrowser(ctx),
        os: this.getOS(ctx),
        status,
        msg,
        loginTime: new Date()
      };
      
      // 异步写入数据库
      await ctx.service.db.mysql.ruoyi.sysLogininforMapper.insertLogininfor([], logininfor);
    } catch (err) {
      ctx.logger.error('记录登录日志失败:', err);
    }
  }

  /**
   * 获取浏览器类型
   * @param {object} ctx - 上下文
   * @return {string} 浏览器类型
   */
  getBrowser(ctx) {
    const userAgent = ctx.get('user-agent') || '';
    
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    if (userAgent.includes('IE')) return 'IE';
    
    return 'Unknown';
  }

  /**
   * 获取操作系统
   * @param {object} ctx - 上下文
   * @return {string} 操作系统
   */
  getOS(ctx) {
    const userAgent = ctx.get('user-agent') || '';
    
    if (userAgent.includes('Windows')) return 'Windows';
    if (userAgent.includes('Mac')) return 'macOS';
    if (userAgent.includes('Linux')) return 'Linux';
    if (userAgent.includes('Android')) return 'Android';
    if (userAgent.includes('iPhone')) return 'iOS';
    
    return 'Unknown';
  }
}

module.exports = LogininforService;

