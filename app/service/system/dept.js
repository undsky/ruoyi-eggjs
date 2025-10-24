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
    
    // 查询条件
    const conditions = {
      deptId: dept.deptId,
      parentId: dept.parentId,
      deptName: dept.deptName,
      status: dept.status,
      params: {
        dataScope: '' // TODO: 实现数据权限过滤
      }
    };

    // 查询列表
    const depts = await ctx.service.db.mysql.ruoyi.sysDeptMapper.selectDeptList([conditions]);
    
    return depts || [];
  }

  /**
   * 查询部门树结构
   * @param {object} dept - 查询参数
   * @return {array} 部门树
   */
  async selectDeptTreeList(dept = {}) {
    const { ctx } = this;
    
    const list = await this.selectDeptList(dept);
    
    return this.buildDeptTree(list);
  }

  /**
   * 构建部门树
   * @param {array} depts - 部门列表
   * @return {array} 部门树
   */
  buildDeptTree(depts) {
    const { ctx } = this;
    
    // 找出所有部门ID
    const deptIds = depts.map(d => d.dept_id);
    
    // 找出顶级节点（父节点不在列表中的）
    const tree = [];
    depts.forEach(dept => {
      if (!deptIds.includes(dept.parent_id)) {
        this.recursionFn(depts, dept);
        tree.push(dept);
      }
    });
    
    return tree.length > 0 ? tree : depts;
  }

  /**
   * 递归查找子部门
   * @param {array} depts - 部门列表
   * @param {object} dept - 当前部门
   */
  recursionFn(depts, dept) {
    const children = depts.filter(d => d.parent_id === dept.dept_id);
    
    if (children.length > 0) {
      dept.children = children;
      children.forEach(child => {
        this.recursionFn(depts, child);
      });
    }
  }

  /**
   * 构建部门树选择结构
   * @param {array} depts - 部门列表
   * @return {array} 树选择结构
   */
  buildDeptTreeSelect(depts) {
    const deptTree = this.buildDeptTree(depts);
    return this.convertToTreeSelect(deptTree);
  }

  /**
   * 转换为树选择结构
   * @param {array} depts - 部门树
   * @return {array} 树选择结构
   */
  convertToTreeSelect(depts) {
    const treeSelect = [];
    
    depts.forEach(dept => {
      const node = {
        id: dept.dept_id,
        label: dept.dept_name
      };
      
      if (dept.children && dept.children.length > 0) {
        node.children = this.convertToTreeSelect(dept.children);
      }
      
      treeSelect.push(node);
    });
    
    return treeSelect;
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
   * 根据角色ID查询部门ID列表
   * @param {number} roleId - 角色ID
   * @return {array} 部门ID列表
   */
  async selectDeptListByRoleId(roleId) {
    const { ctx } = this;
    
    // 查询角色信息
    const role = await ctx.service.system.role.selectRoleById(roleId);
    const deptCheckStrictly = role && role.dept_check_strictly;
    
    const sql = `
      SELECT d.dept_id
      FROM sys_dept d
      LEFT JOIN sys_role_dept rd ON d.dept_id = rd.dept_id
      WHERE rd.role_id = ?
      ${deptCheckStrictly ? 'AND d.dept_id NOT IN (SELECT d.parent_id FROM sys_dept d INNER JOIN sys_role_dept rd ON d.dept_id = rd.dept_id AND rd.role_id = ?)' : ''}
      ORDER BY d.parent_id, d.order_num
    `;
    
    const params = deptCheckStrictly ? [roleId, roleId] : [roleId];
    const depts = await ctx.app.mysql.get('ruoyi').query(sql, params);
    
    return depts.map(d => d.dept_id);
  }

  /**
   * 校验部门名称是否唯一
   * @param {object} dept - 部门对象
   * @return {boolean} true-唯一 false-不唯一
   */
  async checkDeptNameUnique(dept) {
    const { ctx } = this;
    
    const deptId = dept.deptId || -1;
    const conditions = {
      deptName: dept.deptName,
      parentId: dept.parentId
    };
    
    const depts = await ctx.service.db.mysql.ruoyi.sysDeptMapper.checkDeptNameUnique([conditions]);
    
    if (depts && depts.length > 0 && depts[0].dept_id !== deptId) {
      return false;
    }
    
    return true;
  }

  /**
   * 是否存在子部门
   * @param {number} deptId - 部门ID
   * @return {boolean} true-存在 false-不存在
   */
  async hasChildByDeptId(deptId) {
    const { ctx } = this;
    
    const result = await ctx.service.db.mysql.ruoyi.sysDeptMapper.hasChildByDeptId([deptId]);
    
    return result && result.length > 0 && result[0].count > 0;
  }

  /**
   * 检查部门是否存在用户
   * @param {number} deptId - 部门ID
   * @return {boolean} true-存在 false-不存在
   */
  async checkDeptExistUser(deptId) {
    const { ctx } = this;
    
    const result = await ctx.service.db.mysql.ruoyi.sysDeptMapper.checkDeptExistUser([deptId]);
    
    return result && result.length > 0 && result[0].count > 0;
  }

  /**
   * 查询正常状态的子部门数量
   * @param {number} deptId - 部门ID
   * @return {number} 子部门数量
   */
  async selectNormalChildrenDeptById(deptId) {
    const { ctx } = this;
    
    const result = await ctx.service.db.mysql.ruoyi.sysDeptMapper.selectNormalChildrenDeptById([deptId]);
    
    return result && result.length > 0 ? result[0].count : 0;
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
      throw new Error('没有权限访问部门数据！');
    }
    
    // TODO: 实现数据权限校验逻辑
  }

  /**
   * 新增部门
   * @param {object} dept - 部门对象
   * @return {number} 影响行数
   */
  async insertDept(dept) {
    const { ctx } = this;
    
    // 查询父部门信息
    const parentDept = await this.selectDeptById(dept.parentId);
    
    // 如果父节点不为正常状态,则不允许新增子节点
    if (parentDept && parentDept.status !== '0') {
      throw new Error('部门停用，不允许新增');
    }
    
    // 设置祖级列表
    dept.ancestors = parentDept ? `${parentDept.ancestors},${dept.parentId}` : '0';
    
    // 设置创建信息
    dept.createBy = ctx.state.user.userName;
    
    // 插入部门
    const result = await ctx.service.db.mysql.ruoyi.sysDeptMapper.insertDept([dept]);
    
    return result && result.length > 0 ? 1 : 0;
  }

  /**
   * 修改部门
   * @param {object} dept - 部门对象
   * @return {number} 影响行数
   */
  async updateDept(dept) {
    const { ctx } = this;
    
    // 查询新父部门信息
    const newParentDept = await this.selectDeptById(dept.parentId);
    
    // 查询旧部门信息
    const oldDept = await this.selectDeptById(dept.deptId);
    
    if (newParentDept && oldDept) {
      // 计算新的祖级列表
      const newAncestors = `${newParentDept.ancestors},${newParentDept.dept_id}`;
      const oldAncestors = oldDept.ancestors;
      
      dept.ancestors = newAncestors;
      
      // 更新子部门的祖级列表
      await this.updateDeptChildren(dept.deptId, newAncestors, oldAncestors);
    }
    
    // 设置更新信息
    dept.updateBy = ctx.state.user.userName;
    
    // 更新部门
    const result = await ctx.service.db.mysql.ruoyi.sysDeptMapper.updateDept([dept]);
    
    // 如果该部门是启用状态，则启用该部门的所有上级部门
    if (dept.status === '0' && dept.ancestors && dept.ancestors !== '0') {
      await this.updateParentDeptStatusNormal(dept);
    }
    
    return result && result.length > 0 ? 1 : 0;
  }

  /**
   * 更新子部门的祖级列表
   * @param {number} deptId - 部门ID
   * @param {string} newAncestors - 新祖级列表
   * @param {string} oldAncestors - 旧祖级列表
   */
  async updateDeptChildren(deptId, newAncestors, oldAncestors) {
    const { ctx } = this;
    
    // 查询所有子部门
    const sql = `
      SELECT * FROM sys_dept WHERE FIND_IN_SET(?, ancestors)
    `;
    
    const children = await ctx.app.mysql.get('ruoyi').query(sql, [deptId]);
    
    if (children.length === 0) {
      return;
    }
    
    // 更新子部门的祖级列表
    for (const child of children) {
      child.ancestors = child.ancestors.replace(oldAncestors, newAncestors);
    }
    
    // 批量更新
    await ctx.service.db.mysql.ruoyi.sysDeptMapper.updateDeptChildren([children]);
  }

  /**
   * 更新上级部门状态为正常
   * @param {object} dept - 部门对象
   */
  async updateParentDeptStatusNormal(dept) {
    const { ctx } = this;
    
    // 获取所有上级部门ID
    const ancestorIds = dept.ancestors.split(',').map(id => parseInt(id)).filter(id => id > 0);
    
    if (ancestorIds.length === 0) {
      return;
    }
    
    // 批量更新状态
    await ctx.service.db.mysql.ruoyi.sysDeptMapper.updateDeptStatusNormal([ancestorIds]);
  }

  /**
   * 删除部门
   * @param {number} deptId - 部门ID
   * @return {number} 影响行数
   */
  async deleteDeptById(deptId) {
    const { ctx } = this;
    
    // 删除部门（软删除）
    const result = await ctx.service.db.mysql.ruoyi.sysDeptMapper.deleteDeptById([deptId]);
    
    return result && result.length > 0 ? 1 : 0;
  }
}

module.exports = DeptService;

