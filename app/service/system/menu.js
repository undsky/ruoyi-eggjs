/*
 * @Description: 菜单服务层
 * @Author: AI Assistant
 * @Date: 2025-10-23
 */

const Service = require('egg').Service;

class MenuService extends Service {

  /**
   * 查询菜单列表
   * @param {object} menu - 查询参数
   * @param {number} userId - 用户ID
   * @return {array} 菜单列表
   */
  async selectMenuList(menu = {}, userId) {
    const { ctx } = this;
    
    let menus;
    
    // 管理员显示所有菜单信息
    if (ctx.helper.isAdmin(userId)) {
      const conditions = {
        menuName: menu.menuName,
        visible: menu.visible,
        status: menu.status
      };
      menus = await ctx.service.db.mysql.ruoyi.sysMenuMapper.selectMenuList([conditions]);
    } else {
      // 普通用户显示有权限的菜单
      const conditions = {
        menuName: menu.menuName,
        visible: menu.visible,
        status: menu.status,
        params: {
          userId
        }
      };
      menus = await ctx.service.db.mysql.ruoyi.sysMenuMapper.selectMenuListByUserId([conditions]);
    }
    
    return menus || [];
  }

  /**
   * 根据菜单ID查询菜单
   * @param {number} menuId - 菜单ID
   * @return {object} 菜单信息
   */
  async selectMenuById(menuId) {
    const { ctx } = this;
    
    const menus = await ctx.service.db.mysql.ruoyi.sysMenuMapper.selectMenuById([menuId]);
    
    return menus && menus.length > 0 ? menus[0] : null;
  }

  /**
   * 根据用户ID查询权限标识
   * @param {number} userId - 用户ID
   * @return {array} 权限标识列表
   */
  async selectPermsByUserId(userId) {
    const { ctx } = this;
    
    // 如果是管理员，返回所有权限
    if (ctx.helper.isAdmin(userId)) {
      return ['*:*:*'];
    }
    
    // 查询用户权限
    const sql = `
      SELECT DISTINCT m.perms
      FROM sys_menu m
      LEFT JOIN sys_role_menu rm ON m.menu_id = rm.menu_id
      LEFT JOIN sys_user_role ur ON ur.role_id = rm.role_id
      LEFT JOIN sys_role r ON r.role_id = ur.role_id
      WHERE m.status = '0' AND r.status = '0' AND ur.user_id = ?
    `;
    
    const rows = await ctx.app.mysql.get('ruoyi').query(sql, [userId]);
    
    const perms = [];
    rows.forEach(row => {
      if (row.perms && row.perms.trim()) {
        perms.push(...row.perms.trim().split(','));
      }
    });
    
    return [...new Set(perms)];  // 去重
  }

  /**
   * 根据用户ID查询菜单树
   * @param {number} userId - 用户ID
   * @return {array} 菜单树
   */
  async selectMenuTreeByUserId(userId) {
    const { ctx } = this;
    
    let menus;
    
    // 如果是管理员，查询所有菜单
    if (ctx.helper.isAdmin(userId)) {
      const sql = `
        SELECT DISTINCT m.menu_id, m.parent_id, m.menu_name, m.path, m.component,
               m.query, m.route_name, m.visible, m.status, m.perms, m.is_frame, m.is_cache, m.menu_type,
               m.icon, m.order_num, m.create_time
        FROM sys_menu m
        WHERE m.menu_type IN ('M', 'C') AND m.status = '0'
        ORDER BY m.parent_id, m.order_num
      `;
      menus = await ctx.app.mysql.get('ruoyi').query(sql);
    } else {
      // 查询用户菜单
      const sql = `
        SELECT DISTINCT m.menu_id, m.parent_id, m.menu_name, m.path, m.component,
               m.query, m.route_name, m.visible, m.status, m.perms, m.is_frame, m.is_cache, m.menu_type,
               m.icon, m.order_num, m.create_time
        FROM sys_menu m
        LEFT JOIN sys_role_menu rm ON m.menu_id = rm.menu_id
        LEFT JOIN sys_user_role ur ON ur.role_id = rm.role_id
        LEFT JOIN sys_role ro ON ro.role_id = ur.role_id
        WHERE ur.user_id = ? AND m.menu_type IN ('M', 'C') AND m.status = '0' AND ro.status = '0'
        ORDER BY m.parent_id, m.order_num
      `;
      menus = await ctx.app.mysql.get('ruoyi').query(sql, [userId]);
    }
    
    // 构建菜单树
    return this.buildRouterMenuTree(menus, 0);
  }

  /**
   * 构建前端路由菜单树
   * @param {array} menus - 菜单列表
   * @param {number} parentId - 父菜单ID
   * @return {array} 菜单树
   */
  buildRouterMenuTree(menus, parentId) {
    const tree = [];
    
    menus.forEach(menu => {
      if (menu.parent_id === parentId) {
        const children = this.buildRouterMenuTree(menus, menu.menu_id);
        
        const menuNode = {
          name: menu.route_name || menu.menu_name,
          path: menu.path,
          hidden: menu.visible === '1',
          component: menu.component,
          query: menu.query,
          meta: {
            title: menu.menu_name,
            icon: menu.icon,
            noCache: menu.is_cache === '1',
            link: menu.path
          }
        };
        
        if (children.length > 0) {
          menuNode.children = children;
          menuNode.alwaysShow = true;
          menuNode.redirect = 'noRedirect';
        }
        
        tree.push(menuNode);
      }
    });
    
    return tree;
  }

  /**
   * 构建菜单树（用于管理界面）
   * @param {array} menus - 菜单列表
   * @return {array} 菜单树
   */
  buildMenuTree(menus) {
    const { ctx } = this;
    
    // 找出所有菜单ID
    const menuIds = menus.map(m => m.menu_id);
    
    // 找出顶级节点（父节点不在列表中的）
    const tree = [];
    menus.forEach(menu => {
      if (!menuIds.includes(menu.parent_id)) {
        this.recursionFn(menus, menu);
        tree.push(menu);
      }
    });
    
    return tree.length > 0 ? tree : menus;
  }

  /**
   * 递归查找子菜单
   * @param {array} menus - 菜单列表
   * @param {object} menu - 当前菜单
   */
  recursionFn(menus, menu) {
    const children = menus.filter(m => m.parent_id === menu.menu_id);
    
    if (children.length > 0) {
      menu.children = children;
      children.forEach(child => {
        this.recursionFn(menus, child);
      });
    }
  }

  /**
   * 构建菜单树选择结构
   * @param {array} menus - 菜单列表
   * @return {array} 树选择结构
   */
  buildMenuTreeSelect(menus) {
    const menuTree = this.buildMenuTree(menus);
    return this.convertToTreeSelect(menuTree);
  }

  /**
   * 转换为树选择结构
   * @param {array} menus - 菜单树
   * @return {array} 树选择结构
   */
  convertToTreeSelect(menus) {
    const treeSelect = [];
    
    menus.forEach(menu => {
      const node = {
        id: menu.menu_id,
        label: menu.menu_name
      };
      
      if (menu.children && menu.children.length > 0) {
        node.children = this.convertToTreeSelect(menu.children);
      }
      
      treeSelect.push(node);
    });
    
    return treeSelect;
  }

  /**
   * 根据角色ID查询菜单ID列表
   * @param {number} roleId - 角色ID
   * @return {array} 菜单ID列表
   */
  async selectMenuListByRoleId(roleId) {
    const { ctx } = this;
    
    // 查询角色信息
    const role = await ctx.service.system.role.selectRoleById(roleId);
    const menuCheckStrictly = role && role.menu_check_strictly;
    
    const sql = `
      SELECT m.menu_id
      FROM sys_menu m
      LEFT JOIN sys_role_menu rm ON m.menu_id = rm.menu_id
      WHERE rm.role_id = ?
      ${menuCheckStrictly ? 'AND m.menu_id NOT IN (SELECT m.parent_id FROM sys_menu m INNER JOIN sys_role_menu rm ON m.menu_id = rm.menu_id AND rm.role_id = ?)' : ''}
      ORDER BY m.parent_id, m.order_num
    `;
    
    const params = menuCheckStrictly ? [roleId, roleId] : [roleId];
    const menus = await ctx.app.mysql.get('ruoyi').query(sql, params);
    
    return menus.map(m => m.menu_id);
  }

  /**
   * 校验菜单名称是否唯一
   * @param {object} menu - 菜单对象
   * @return {boolean} true-唯一 false-不唯一
   */
  async checkMenuNameUnique(menu) {
    const { ctx } = this;
    
    const menuId = menu.menuId || -1;
    const conditions = {
      menuName: menu.menuName,
      parentId: menu.parentId
    };
    
    const menus = await ctx.service.db.mysql.ruoyi.sysMenuMapper.checkMenuNameUnique([conditions]);
    
    if (menus && menus.length > 0 && menus[0].menu_id !== menuId) {
      return false;
    }
    
    return true;
  }

  /**
   * 是否存在子菜单
   * @param {number} menuId - 菜单ID
   * @return {boolean} true-存在 false-不存在
   */
  async hasChildByMenuId(menuId) {
    const { ctx } = this;
    
    const result = await ctx.service.db.mysql.ruoyi.sysMenuMapper.hasChildByMenuId([menuId]);
    
    return result && result.length > 0 && result[0].count > 0;
  }

  /**
   * 检查菜单是否已分配给角色
   * @param {number} menuId - 菜单ID
   * @return {boolean} true-已分配 false-未分配
   */
  async checkMenuExistRole(menuId) {
    const { ctx } = this;
    
    const sql = `
      SELECT COUNT(1) as count FROM sys_role_menu WHERE menu_id = ?
    `;
    
    const result = await ctx.app.mysql.get('ruoyi').query(sql, [menuId]);
    
    return result && result.length > 0 && result[0].count > 0;
  }

  /**
   * 新增菜单
   * @param {object} menu - 菜单对象
   * @return {number} 影响行数
   */
  async insertMenu(menu) {
    const { ctx } = this;
    
    // 设置创建信息
    menu.createBy = ctx.state.user.userName;
    
    // 插入菜单
    const result = await ctx.service.db.mysql.ruoyi.sysMenuMapper.insertMenu([menu]);
    
    return result && result.length > 0 ? 1 : 0;
  }

  /**
   * 修改菜单
   * @param {object} menu - 菜单对象
   * @return {number} 影响行数
   */
  async updateMenu(menu) {
    const { ctx } = this;
    
    // 设置更新信息
    menu.updateBy = ctx.state.user.userName;
    
    // 更新菜单
    const result = await ctx.service.db.mysql.ruoyi.sysMenuMapper.updateMenu([menu]);
    
    return result && result.length > 0 ? 1 : 0;
  }

  /**
   * 删除菜单
   * @param {number} menuId - 菜单ID
   * @return {number} 影响行数
   */
  async deleteMenuById(menuId) {
    const { ctx } = this;
    
    // 删除菜单
    const result = await ctx.service.db.mysql.ruoyi.sysMenuMapper.deleteMenuById([menuId]);
    
    return result && result.length > 0 ? 1 : 0;
  }
}

module.exports = MenuService;

