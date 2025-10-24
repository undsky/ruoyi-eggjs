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
    
    const posts = await ctx.service.db.mysql.ruoyi.sysPostMapper.selectPostAll([]);
    
    return posts || [];
  }

  /**
   * 根据用户ID查询岗位列表
   * @param {number} userId - 用户ID
   * @return {array} 岗位ID列表
   */
  async selectPostListByUserId(userId) {
    const { ctx } = this;
    
    const posts = await ctx.service.db.mysql.ruoyi.sysPostMapper.selectPostListByUserId([userId]);
    
    return posts.map(p => p.post_id);
  }

  /**
   * 查询岗位列表
   * @param {object} post - 查询参数
   * @return {array} 岗位列表
   */
  async selectPostList(post = {}) {
    const { ctx } = this;
    
    // 查询条件
    const conditions = {
      postCode: post.postCode,
      postName: post.postName,
      status: post.status
    };

    // 查询列表
    const posts = await ctx.service.db.mysql.ruoyi.sysPostMapper.selectPostList([conditions]);
    
    return posts || [];
  }

  /**
   * 根据岗位ID查询岗位
   * @param {number} postId - 岗位ID
   * @return {object} 岗位信息
   */
  async selectPostById(postId) {
    const { ctx } = this;
    
    const posts = await ctx.service.db.mysql.ruoyi.sysPostMapper.selectPostById([postId]);
    
    return posts && posts.length > 0 ? posts[0] : null;
  }

  /**
   * 校验岗位名称是否唯一
   * @param {object} post - 岗位对象
   * @return {boolean} true-唯一 false-不唯一
   */
  async checkPostNameUnique(post) {
    const { ctx } = this;
    
    const postId = post.postId || -1;
    const posts = await ctx.service.db.mysql.ruoyi.sysPostMapper.checkPostNameUnique([post.postName]);
    
    if (posts && posts.length > 0 && posts[0].post_id !== postId) {
      return false;
    }
    
    return true;
  }

  /**
   * 校验岗位编码是否唯一
   * @param {object} post - 岗位对象
   * @return {boolean} true-唯一 false-不唯一
   */
  async checkPostCodeUnique(post) {
    const { ctx } = this;
    
    const postId = post.postId || -1;
    const posts = await ctx.service.db.mysql.ruoyi.sysPostMapper.checkPostCodeUnique([post.postCode]);
    
    if (posts && posts.length > 0 && posts[0].post_id !== postId) {
      return false;
    }
    
    return true;
  }

  /**
   * 新增岗位
   * @param {object} post - 岗位对象
   * @return {number} 影响行数
   */
  async insertPost(post) {
    const { ctx } = this;
    
    // 设置创建信息
    post.createBy = ctx.state.user.userName;
    
    // 插入岗位
    const result = await ctx.service.db.mysql.ruoyi.sysPostMapper.insertPost([post]);
    
    return result && result.length > 0 ? 1 : 0;
  }

  /**
   * 修改岗位
   * @param {object} post - 岗位对象
   * @return {number} 影响行数
   */
  async updatePost(post) {
    const { ctx } = this;
    
    // 设置更新信息
    post.updateBy = ctx.state.user.userName;
    
    // 更新岗位
    const result = await ctx.service.db.mysql.ruoyi.sysPostMapper.updatePost([post]);
    
    return result && result.length > 0 ? 1 : 0;
  }

  /**
   * 删除岗位
   * @param {array} postIds - 岗位ID数组
   * @return {number} 影响行数
   */
  async deletePostByIds(postIds) {
    const { ctx } = this;
    
    // 删除岗位
    const result = await ctx.service.db.mysql.ruoyi.sysPostMapper.deletePostByIds([postIds]);
    
    return result && result.length > 0 ? postIds.length : 0;
  }
}

module.exports = PostService;

