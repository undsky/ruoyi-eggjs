/*
 * @Description: 菜单服务层
 * @Author: AI Assistant
 * @Date: 2025-10-23
 */

const Service = require('egg').Service;

class MenuService extends Service {

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
               m.query, m.visible, m.status, m.perms, m.is_frame, m.is_cache, m.menu_type,
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
               m.query, m.visible, m.status, m.perms, m.is_frame, m.is_cache, m.menu_type,
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
    return this.buildMenuTree(menus, 0);
  }

  /**
   * 构建菜单树
   * @param {array} menus - 菜单列表
   * @param {number} parentId - 父菜单ID
   * @return {array} 菜单树
   */
  buildMenuTree(menus, parentId) {
    const tree = [];
    
    menus.forEach(menu => {
      if (menu.parent_id === parentId) {
        const children = this.buildMenuTree(menus, menu.menu_id);
        
        const menuNode = {
          name: menu.menu_name,
          path: menu.path,
          hidden: menu.visible === '1',
          component: menu.component,
          meta: {
            title: menu.menu_name,
            icon: menu.icon,
            noCache: menu.is_cache === '1'
          }
        };
        
        if (children.length > 0) {
          menuNode.children = children;
        }
        
        tree.push(menuNode);
      }
    });
    
    return tree;
  }
}

module.exports = MenuService;

