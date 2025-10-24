/*
 * @Description: 角色服务层
 * @Author: AI Assistant
 * @Date: 2025-10-23
 */

const Service = require('egg').Service;

class RoleService extends Service {

  /**
   * 查询所有角色
   * @return {array} 角色列表
   */
  async selectRoleAll() {
    const { ctx } = this;
    
    const sql = `
      SELECT r.role_id, r.role_name, r.role_key, r.role_sort, r.data_scope,
             r.menu_check_strictly, r.dept_check_strictly, r.status, r.del_flag,
             r.create_time, r.remark
      FROM sys_role r
      WHERE r.del_flag = '0'
      ORDER BY r.role_sort
    `;
    
    return await ctx.app.mysql.get('ruoyi').query(sql);
  }

  /**
   * 根据用户ID查询角色列表
   * @param {number} userId - 用户ID
   * @return {array} 角色列表
   */
  async selectRolesByUserId(userId) {
    const { ctx } = this;
    
    // 如果是管理员，返回所有角色
    if (ctx.helper.isAdmin(userId)) {
      return await this.selectRoleAll();
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
      ORDER BY r.role_sort
    `;
    
    return await ctx.app.mysql.get('ruoyi').query(sql, [userId]);
  }

  /**
   * 查询角色列表
   * @param {object} role - 查询参数
   * @return {array} 角色列表
   */
  async selectRoleList(role = {}) {
    const { ctx } = this;
    
    const sql = `
      SELECT r.role_id, r.role_name, r.role_key, r.role_sort, r.data_scope,
             r.menu_check_strictly, r.dept_check_strictly, r.status, r.del_flag,
             r.create_time, r.remark
      FROM sys_role r
      WHERE r.del_flag = '0'
      ${role.roleName ? "AND r.role_name LIKE CONCAT('%', ?, '%')" : ''}
      ${role.roleKey ? "AND r.role_key LIKE CONCAT('%', ?, '%')" : ''}
      ${role.status ? 'AND r.status = ?' : ''}
      ORDER BY r.role_sort
    `;
    
    const params = [];
    if (role.roleName) params.push(role.roleName);
    if (role.roleKey) params.push(role.roleKey);
    if (role.status) params.push(role.status);
    
    return await ctx.app.mysql.get('ruoyi').query(sql, params);
  }

  /**
   * 校验角色数据权限
   * @param {array} roleIds - 角色ID数组
   */
  async checkRoleDataScope(roleIds) {
    const { ctx } = this;
    
    if (!roleIds || roleIds.length === 0) {
      return;
    }

    const userId = ctx.state.user.userId;
    
    // 管理员拥有所有数据权限
    if (ctx.helper.isAdmin(userId)) {
      return;
    }
    
    // TODO: 实现角色数据权限校验
  }
}

module.exports = RoleService;

