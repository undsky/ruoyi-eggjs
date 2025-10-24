/*
 * @Description: 通知公告服务层
 * @Author: AI Assistant
 * @Date: 2025-10-24
 */

const Service = require('egg').Service;

class NoticeService extends Service {

  /**
   * 查询通知公告列表
   * @param {object} notice - 查询参数
   * @return {array} 通知公告列表
   */
  async selectNoticeList(notice = {}) {
    const { ctx } = this;
    
    // 查询条件
    const conditions = {
      noticeTitle: notice.noticeTitle,
      noticeType: notice.noticeType,
      createBy: notice.createBy
    };

    // 查询列表
    const notices = await ctx.service.db.mysql.ruoyi.sysNoticeMapper.selectNoticeList([conditions]);
    
    return notices || [];
  }

  /**
   * 根据通知公告ID查询通知公告
   * @param {number} noticeId - 通知公告ID
   * @return {object} 通知公告信息
   */
  async selectNoticeById(noticeId) {
    const { ctx } = this;
    
    const notices = await ctx.service.db.mysql.ruoyi.sysNoticeMapper.selectNoticeById([noticeId]);
    
    return notices && notices.length > 0 ? notices[0] : null;
  }

  /**
   * 新增通知公告
   * @param {object} notice - 通知公告对象
   * @return {number} 影响行数
   */
  async insertNotice(notice) {
    const { ctx } = this;
    
    // 设置创建信息
    notice.createBy = ctx.state.user.userName;
    
    // 插入通知公告
    const result = await ctx.service.db.mysql.ruoyi.sysNoticeMapper.insertNotice([notice]);
    
    return result && result.length > 0 ? 1 : 0;
  }

  /**
   * 修改通知公告
   * @param {object} notice - 通知公告对象
   * @return {number} 影响行数
   */
  async updateNotice(notice) {
    const { ctx } = this;
    
    // 设置更新信息
    notice.updateBy = ctx.state.user.userName;
    
    // 更新通知公告
    const result = await ctx.service.db.mysql.ruoyi.sysNoticeMapper.updateNotice([notice]);
    
    return result && result.length > 0 ? 1 : 0;
  }

  /**
   * 删除通知公告
   * @param {array} noticeIds - 通知公告ID数组
   * @return {number} 影响行数
   */
  async deleteNoticeByIds(noticeIds) {
    const { ctx } = this;
    
    // 删除通知公告
    const result = await ctx.service.db.mysql.ruoyi.sysNoticeMapper.deleteNoticeByIds([noticeIds]);
    
    return result && result.length > 0 ? noticeIds.length : 0;
  }
}

module.exports = NoticeService;

