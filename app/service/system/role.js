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
    
    // 查询条件
    const conditions = {
      roleId: role.roleId,
      roleName: role.roleName,
      roleKey: role.roleKey,
      status: role.status,
      params: {
        beginTime: role.beginTime,
        endTime: role.endTime,
        dataScope: '' // TODO: 实现数据权限过滤
      }
    };

    // 查询列表
    const roles = await ctx.service.db.mysql.ruoyi.sysRoleMapper.selectRoleList([conditions]);
    
    return roles || [];
  }

  /**
   * 根据角色ID查询角色
   * @param {number} roleId - 角色ID
   * @return {object} 角色信息
   */
  async selectRoleById(roleId) {
    const { ctx } = this;
    
    const roles = await ctx.service.db.mysql.ruoyi.sysRoleMapper.selectRoleById([roleId]);
    
    return roles && roles.length > 0 ? roles[0] : null;
  }

  /**
   * 校验角色名称是否唯一
   * @param {object} role - 角色对象
   * @return {boolean} true-唯一 false-不唯一
   */
  async checkRoleNameUnique(role) {
    const { ctx } = this;
    
    const roleId = role.roleId || -1;
    const roles = await ctx.service.db.mysql.ruoyi.sysRoleMapper.checkRoleNameUnique([role.roleName]);
    
    if (roles && roles.length > 0 && roles[0].role_id !== roleId) {
      return false;
    }
    
    return true;
  }

  /**
   * 校验角色权限字符是否唯一
   * @param {object} role - 角色对象
   * @return {boolean} true-唯一 false-不唯一
   */
  async checkRoleKeyUnique(role) {
    const { ctx } = this;
    
    const roleId = role.roleId || -1;
    const roles = await ctx.service.db.mysql.ruoyi.sysRoleMapper.checkRoleKeyUnique([role.roleKey]);
    
    if (roles && roles.length > 0 && roles[0].role_id !== roleId) {
      return false;
    }
    
    return true;
  }

  /**
   * 校验角色是否允许操作
   * @param {object} role - 角色对象
   */
  checkRoleAllowed(role) {
    const { ctx } = this;
    
    if (role.roleId && ctx.helper.isAdmin(role.roleId)) {
      throw new Error('不允许操作超级管理员角色');
    }
  }

  /**
   * 校验角色是否有数据权限
   * @param {number} roleId - 角色ID
   */
  async checkRoleDataScope(roleId) {
    const { ctx } = this;
    
    // 管理员拥有所有数据权限
    if (ctx.helper.isAdmin(ctx.state.user.userId)) {
      return;
    }
    
    // 查询角色是否在当前用户的数据权限范围内
    const role = await this.selectRoleById(roleId);
    if (!role) {
      throw new Error('没有权限访问角色数据！');
    }
  }

  /**
   * 新增角色
   * @param {object} role - 角色对象
   * @return {number} 影响行数
   */
  async insertRole(role) {
    const { ctx } = this;
    
    // 设置创建信息
    role.createBy = ctx.state.user.userName;
    
    // 插入角色
    const result = await ctx.service.db.mysql.ruoyi.sysRoleMapper.insertRole([role]);
    
    if (result && result.length > 0) {
      const roleId = result[0].roleId;
      
      // 插入角色与菜单关联
      if (role.menuIds && role.menuIds.length > 0) {
        await this.insertRoleMenu(roleId, role.menuIds);
      }
      
      return 1;
    }
    
    return 0;
  }

  /**
   * 修改角色
   * @param {object} role - 角色对象
   * @return {number} 影响行数
   */
  async updateRole(role) {
    const { ctx } = this;
    
    // 设置更新信息
    role.updateBy = ctx.state.user.userName;
    
    // 更新角色
    const result = await ctx.service.db.mysql.ruoyi.sysRoleMapper.updateRole([role]);
    
    // 删除角色与菜单关联
    await ctx.service.db.mysql.ruoyi.sysRoleMenuMapper.deleteRoleMenuByRoleId([role.roleId]);
    
    // 插入角色与菜单关联
    if (role.menuIds && role.menuIds.length > 0) {
      await this.insertRoleMenu(role.roleId, role.menuIds);
    }
    
    return result && result.length > 0 ? 1 : 0;
  }

  /**
   * 修改角色状态
   * @param {object} role - 角色对象
   * @return {number} 影响行数
   */
  async updateRoleStatus(role) {
    const { ctx } = this;
    
    const result = await ctx.service.db.mysql.ruoyi.sysRoleMapper.updateRole([role]);
    
    return result && result.length > 0 ? 1 : 0;
  }

  /**
   * 修改数据权限
   * @param {object} role - 角色对象
   * @return {number} 影响行数
   */
  async authDataScope(role) {
    const { ctx } = this;
    
    // 更新角色
    const result = await ctx.service.db.mysql.ruoyi.sysRoleMapper.updateRole([role]);
    
    // 删除角色与部门关联
    await ctx.service.db.mysql.ruoyi.sysRoleDeptMapper.deleteRoleDeptByRoleId([role.roleId]);
    
    // 插入角色与部门关联
    if (role.deptIds && role.deptIds.length > 0) {
      await this.insertRoleDept(role.roleId, role.deptIds);
    }
    
    return result && result.length > 0 ? 1 : 0;
  }

  /**
   * 删除角色
   * @param {array} roleIds - 角色ID数组
   * @return {number} 影响行数
   */
  async deleteRoleByIds(roleIds) {
    const { ctx } = this;
    
    // 删除角色与菜单关联
    await ctx.service.db.mysql.ruoyi.sysRoleMenuMapper.deleteRoleMenu([roleIds]);
    
    // 删除角色与部门关联
    await ctx.service.db.mysql.ruoyi.sysRoleDeptMapper.deleteRoleDept([roleIds]);
    
    // 删除角色（软删除）
    const result = await ctx.service.db.mysql.ruoyi.sysRoleMapper.deleteRoleByIds([roleIds]);
    
    return result && result.length > 0 ? roleIds.length : 0;
  }

  /**
   * 取消授权用户
   * @param {object} userRole - 用户角色对象
   * @return {number} 影响行数
   */
  async deleteAuthUser(userRole) {
    const { ctx } = this;
    
    const sql = `
      DELETE FROM sys_user_role 
      WHERE user_id = ? AND role_id = ?
    `;
    
    const result = await ctx.app.mysql.get('ruoyi').query(sql, [userRole.userId, userRole.roleId]);
    
    return result.affectedRows || 0;
  }

  /**
   * 批量取消授权用户
   * @param {number} roleId - 角色ID
   * @param {array} userIds - 用户ID数组
   * @return {number} 影响行数
   */
  async deleteAuthUsers(roleId, userIds) {
    const { ctx } = this;
    
    if (!userIds || userIds.length === 0) {
      return 0;
    }
    
    const placeholders = userIds.map(() => '?').join(',');
    const sql = `
      DELETE FROM sys_user_role 
      WHERE role_id = ? AND user_id IN (${placeholders})
    `;
    
    const params = [roleId, ...userIds];
    const result = await ctx.app.mysql.get('ruoyi').query(sql, params);
    
    return result.affectedRows || 0;
  }

  /**
   * 批量授权用户
   * @param {number} roleId - 角色ID
   * @param {array} userIds - 用户ID数组
   * @return {number} 影响行数
   */
  async insertAuthUsers(roleId, userIds) {
    const { ctx } = this;
    
    if (!userIds || userIds.length === 0) {
      return 0;
    }
    
    const userRoles = userIds.map(userId => ({
      userId,
      roleId
    }));
    
    await ctx.service.db.mysql.ruoyi.sysUserRoleMapper.batchUserRole([userRoles]);
    
    return userIds.length;
  }

  /**
   * 插入角色与菜单关联
   * @param {number} roleId - 角色ID
   * @param {array} menuIds - 菜单ID数组
   */
  async insertRoleMenu(roleId, menuIds) {
    const { ctx } = this;
    
    if (!menuIds || menuIds.length === 0) {
      return;
    }
    
    const roleMenus = menuIds.map(menuId => ({
      roleId,
      menuId
    }));
    
    await ctx.service.db.mysql.ruoyi.sysRoleMenuMapper.batchRoleMenu([roleMenus]);
  }

  /**
   * 插入角色与部门关联
   * @param {number} roleId - 角色ID
   * @param {array} deptIds - 部门ID数组
   */
  async insertRoleDept(roleId, deptIds) {
    const { ctx } = this;
    
    if (!deptIds || deptIds.length === 0) {
      return;
    }
    
    const roleDepts = deptIds.map(deptId => ({
      roleId,
      deptId
    }));
    
    await ctx.service.db.mysql.ruoyi.sysRoleDeptMapper.batchRoleDept([roleDepts]);
  }
}

module.exports = RoleService;

