/*
 * @Description: 部门服务层
 * @Author: AI Assistant
 * @Date: 2025-10-24
 */

const Service = require('egg').Service;

class DeptService extends Service {

  /**
   * 查询部门列表
   * @param {object} dept - 查询参数
   * @return {array} 部门列表
   */
  async selectDeptList(dept = {}) {
    const { ctx } = this;
    
    const sql = `
      SELECT d.dept_id, d.parent_id, d.ancestors, d.dept_name, d.order_num, 
             d.leader, d.phone, d.email, d.status, d.del_flag, d.create_time
      FROM sys_dept d
      WHERE d.del_flag = '0'
      ${dept.deptId ? 'AND d.dept_id = ?' : ''}
      ${dept.parentId ? 'AND d.parent_id = ?' : ''}
      ${dept.deptName ? "AND d.dept_name LIKE CONCAT('%', ?, '%')" : ''}
      ${dept.status ? 'AND d.status = ?' : ''}
      ORDER BY d.parent_id, d.order_num
    `;
    
    const params = [];
    if (dept.deptId) params.push(dept.deptId);
    if (dept.parentId) params.push(dept.parentId);
    if (dept.deptName) params.push(dept.deptName);
    if (dept.status) params.push(dept.status);
    
    return await ctx.app.mysql.get('ruoyi').query(sql, params);
  }

  /**
   * 查询部门树结构
   * @param {object} dept - 查询参数
   * @return {array} 部门树
   */
  async selectDeptTreeList(dept = {}) {
    const { ctx } = this;
    
    const list = await this.selectDeptList(dept);
    
    return ctx.helper.buildTree(list, 'deptId', 'parentId', 0);
  }

  /**
   * 根据部门ID查询部门
   * @param {number} deptId - 部门ID
   * @return {object} 部门信息
   */
  async selectDeptById(deptId) {
    const { ctx } = this;
    
    const depts = await ctx.service.db.mysql.ruoyi.sysDeptMapper.selectDeptById([deptId]);
    
    return depts && depts.length > 0 ? depts[0] : null;
  }

  /**
   * 校验部门数据权限
   * @param {number} deptId - 部门ID
   */
  async checkDeptDataScope(deptId) {
    const { ctx } = this;
    
    if (!deptId) {
      return;
    }

    const userId = ctx.state.user.userId;
    
    // 管理员拥有所有数据权限
    if (ctx.helper.isAdmin(userId)) {
      return;
    }

    // 检查部门是否存在
    const dept = await this.selectDeptById(deptId);
    if (!dept) {
      throw new Error('部门不存在');
    }
    
    // TODO: 实现数据权限校验逻辑
  }

  /**
   * 根据角色ID查询部门ID列表
   * @param {number} roleId - 角色ID
   * @return {array} 部门ID列表
   */
  async selectDeptListByRoleId(roleId) {
    const { ctx } = this;
    
    const sql = `
      SELECT dept_id
      FROM sys_role_dept
      WHERE role_id = ?
    `;
    
    const depts = await ctx.app.mysql.get('ruoyi').query(sql, [roleId]);
    
    return depts.map(d => d.dept_id);
  }
}

module.exports = DeptService;

