/*
 * @Description: Helper 扩展
 * @Author: AI Assistant
 * @Date: 2025-10-23
 */

const bcrypt = require('bcryptjs');
const dayjs = require('dayjs');

module.exports = {
  /**
   * 安全工具类
   */
  security: {
    /**
     * 加密密码
     * @param {string} password - 明文密码
     * @return {string} 加密后的密码
     */
    async encryptPassword(password) {
      const salt = await bcrypt.genSalt(10);
      return await bcrypt.hash(password, salt);
    },

    /**
     * 比对密码
     * @param {string} password - 明文密码
     * @param {string} hash - 加密后的密码
     * @return {boolean} 是否匹配
     */
    async comparePassword(password, hash) {
      return await bcrypt.compare(password, hash);
    }
  },

  /**
   * 分页参数处理
   * @param {object} params - 请求参数
   * @return {array} [offset, limit]
   */
  page(params = {}) {
    const pageNum = parseInt(params.pageNum) || 1;
    const pageSize = parseInt(params.pageSize) || 10;
    const offset = (pageNum - 1) * pageSize;
    return [offset, pageSize];
  },

  /**
   * 日期格式化
   * @param {Date|string} date - 日期
   * @param {string} format - 格式
   * @return {string} 格式化后的日期
   */
  formatDate(date, format = 'YYYY-MM-DD HH:mm:ss') {
    if (!date) return '';
    return dayjs(date).format(format);
  },

  /**
   * 构建树形结构
   * @param {array} list - 列表数据
   * @param {string} idKey - ID 字段名
   * @param {string} parentKey - 父ID 字段名
   * @param {number} parentId - 父ID
   * @return {array} 树形结构
   */
  buildTree(list, idKey = 'id', parentKey = 'parentId', parentId = 0) {
    const tree = [];
    
    list.forEach(item => {
      if (item[parentKey] === parentId) {
        const children = this.buildTree(list, idKey, parentKey, item[idKey]);
        if (children.length > 0) {
          item.children = children;
        }
        tree.push(item);
      }
    });
    
    return tree;
  },

  /**
   * 获取客户端 IP
   * @param {object} ctx - 上下文
   * @return {string} IP 地址
   */
  getClientIP(ctx) {
    return ctx.request.ip || 
           ctx.get('x-forwarded-for') || 
           ctx.get('x-real-ip') || 
           '0.0.0.0';
  },

  /**
   * 判断是否为管理员
   * @param {number} userId - 用户ID
   * @return {boolean}
   */
  isAdmin(userId) {
    return userId === 1;
  }
};

