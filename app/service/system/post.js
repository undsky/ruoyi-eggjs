/*
 * @Description: 岗位服务层
 * @Author: AI Assistant
 * @Date: 2025-10-24
 */

const Service = require('egg').Service;

class PostService extends Service {

  /**
   * 查询所有岗位
   * @return {array} 岗位列表
   */
  async selectPostAll() {
    const { ctx } = this;
    
    const sql = `
      SELECT post_id, post_code, post_name, post_sort, status, 
             create_time, remark
      FROM sys_post
      WHERE del_flag = '0'
      ORDER BY post_sort
    `;
    
    return await ctx.app.mysql.get('ruoyi').query(sql);
  }

  /**
   * 根据用户ID查询岗位列表
   * @param {number} userId - 用户ID
   * @return {array} 岗位ID列表
   */
  async selectPostListByUserId(userId) {
    const { ctx } = this;
    
    const sql = `
      SELECT p.post_id
      FROM sys_post p
      LEFT JOIN sys_user_post up ON up.post_id = p.post_id
      WHERE up.user_id = ? AND p.del_flag = '0'
    `;
    
    const posts = await ctx.app.mysql.get('ruoyi').query(sql, [userId]);
    
    return posts.map(p => p.post_id);
  }

  /**
   * 查询岗位列表
   * @param {object} post - 查询参数
   * @return {array} 岗位列表
   */
  async selectPostList(post = {}) {
    const { ctx } = this;
    
    const sql = `
      SELECT post_id, post_code, post_name, post_sort, status, 
             create_time, remark
      FROM sys_post
      WHERE del_flag = '0'
      ${post.postCode ? "AND post_code LIKE CONCAT('%', ?, '%')" : ''}
      ${post.postName ? "AND post_name LIKE CONCAT('%', ?, '%')" : ''}
      ${post.status ? 'AND status = ?' : ''}
      ORDER BY post_sort
    `;
    
    const params = [];
    if (post.postCode) params.push(post.postCode);
    if (post.postName) params.push(post.postName);
    if (post.status) params.push(post.status);
    
    return await ctx.app.mysql.get('ruoyi').query(sql, params);
  }
}

module.exports = PostService;

