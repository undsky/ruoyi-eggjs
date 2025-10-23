/*
 * @Description: 角色服务层
 * @Author: AI Assistant
 * @Date: 2025-10-23
 */

const Service = require('egg').Service;

class RoleService extends Service {

  /**
   * 根据用户ID查询角色列表
   * @param {number} userId - 用户ID
   * @return {array} 角色列表
   */
  async selectRolesByUserId(userId) {
    const { ctx } = this;
    
    // 如果是管理员，返回所有角色
    if (ctx.helper.isAdmin(userId)) {
      return await ctx.service.db.mysql.ruoyi.sysRoleMapper.selectRoleAll([]);
    }
    
    // 查询用户角色
    const sql = `
      SELECT DISTINCT r.role_id, r.role_name, r.role_key, r.role_sort, r.data_scope,
             r.menu_check_strictly, r.dept_check_strictly, r.status, r.del_flag,
             r.create_time, r.remark
      FROM sys_role r
      LEFT JOIN sys_user_role ur ON ur.role_id = r.role_id
      LEFT JOIN sys_user u ON u.user_id = ur.user_id
      WHERE r.del_flag = '0' AND ur.user_id = ?
    `;
    
    return await ctx.app.mysql.get('ruoyi').query(sql, [userId]);
  }
}

module.exports = RoleService;

