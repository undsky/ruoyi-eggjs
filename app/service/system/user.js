/*
 * @Description: 用户服务层
 * @Author: AI Assistant
 * @Date: 2025-10-23
 */

const Service = require('egg').Service;

class UserService extends Service {

  /**
   * 根据用户ID查询用户
   * @param {number} userId - 用户ID
   * @return {object} 用户信息
   */
  async selectUserById(userId) {
    const { ctx } = this;
    
    const users = await ctx.service.db.mysql.ruoyi.sysUserMapper.selectUserById([userId]);
    
    return users && users.length > 0 ? users[0] : null;
  }

  /**
   * 校验用户名是否唯一
   * @param {string} userName - 用户名
   * @return {boolean} true-存在 false-不存在
   */
  async checkUserNameUnique(userName) {
    const { ctx } = this;
    
    const users = await ctx.service.db.mysql.ruoyi.sysUserMapper.checkUserNameUnique([userName]);
    
    return users && users.length > 0;
  }
}

module.exports = UserService;

