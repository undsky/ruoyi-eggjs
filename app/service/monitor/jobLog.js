/*
 * @Description: 定时任务调度日志服务层
 * @Author: AI Assistant
 * @Date: 2025-10-27
 */

const Service = require('egg').Service;
const dayjs = require('dayjs');

class JobLogService extends Service {

  /**
   * 查询调度日志列表
   * @param {object} page - 分页参数 {pageNum, pageSize}
   * @param {object} jobLog - 查询条件
   * @return {array} 调度日志列表
   */
  async selectJobLogList(page, jobLog = {}) {
    const { ctx } = this;
    
    try {
      // 从数据库查询调度日志列表
      const mapper = ctx.service.db.mysql.ruoyi.sysJobLogMapper;
      const offset = (page.pageNum - 1) * page.pageSize;
      
      const list = await mapper.selectJobLogList(
        [offset, page.pageSize],
        jobLog
      );
      
      return list || [];
    } catch (err) {
      ctx.logger.error('查询调度日志列表失败:', err);
      throw err;
    }
  }

  /**
   * 查询调度日志总数
   * @param {object} jobLog - 查询条件
   * @return {number} 总数
   */
  async selectJobLogCount(jobLog = {}) {
    const { ctx } = this;
    
    try {
      const mapper = ctx.service.db.mysql.ruoyi.sysJobLogMapper;
      const result = await mapper.countJobLogList([], jobLog);
      
      return result ? result[0].count : 0;
    } catch (err) {
      ctx.logger.error('查询调度日志总数失败:', err);
      return 0;
    }
  }

  /**
   * 批量删除调度日志
   * @param {array} jobLogIds - 调度日志ID数组
   * @return {number} 影响行数
   */
  async deleteJobLogByIds(jobLogIds) {
    const { ctx } = this;
    
    try {
      const mapper = ctx.service.db.mysql.ruoyi.sysJobLogMapper;
      const result = await mapper.deleteJobLogByIds([jobLogIds]);
      
      return result.affectedRows;
    } catch (err) {
      ctx.logger.error('删除调度日志失败:', err);
      throw err;
    }
  }

  /**
   * 清空调度日志
   * @return {number} 影响行数
   */
  async cleanJobLog() {
    const { ctx } = this;
    
    try {
      const mapper = ctx.service.db.mysql.ruoyi.sysJobLogMapper;
      const result = await mapper.cleanJobLog([]);
      
      return result.affectedRows;
    } catch (err) {
      ctx.logger.error('清空调度日志失败:', err);
      throw err;
    }
  }

  /**
   * 新增调度日志
   * @param {object} jobLog - 调度日志信息
   * @return {number} 影响行数
   */
  async insertJobLog(jobLog) {
    const { ctx } = this;
    
    try {
      const mapper = ctx.service.db.mysql.ruoyi.sysJobLogMapper;
      const result = await mapper.insertJobLog([], jobLog);
      
      return result.affectedRows;
    } catch (err) {
      ctx.logger.error('新增调度日志失败:', err);
      throw err;
    }
  }

  /**
   * 记录任务执行日志
   * @param {string} jobName - 任务名称
   * @param {string} jobGroup - 任务组名
   * @param {string} invokeTarget - 调用目标
   * @param {string} status - 执行状态 (0成功 1失败)
   * @param {string} jobMessage - 日志信息
   * @param {string} exceptionInfo - 异常信息
   */
  async recordJobLog(jobName, jobGroup, invokeTarget, status, jobMessage, exceptionInfo = '') {
    const { ctx } = this;
    
    try {
      const jobLog = {
        jobName,
        jobGroup,
        invokeTarget,
        status,
        jobMessage,
        exceptionInfo: exceptionInfo.substring(0, 2000), // 限制长度
        createTime: dayjs().format('YYYY-MM-DD HH:mm:ss')
      };
      
      await this.insertJobLog(jobLog);
    } catch (err) {
      ctx.logger.error('记录任务执行日志失败:', err);
    }
  }

  /**
   * 导出调度日志
   * @param {array} list - 调度日志列表
   * @return {buffer} Excel 文件 Buffer
   */
  async exportJobLog(list) {
    const { ctx } = this;
    
    try {
      // 这里简化处理，实际项目中应该使用 Excel 导出库
      // 例如：exceljs、xlsx 等
      const headers = ['日志编号', '任务名称', '任务组名', '调用目标', '日志信息', '执行状态', '异常信息', '执行时间'];
      
      // 构造 CSV 数据（简化实现）
      let csv = headers.join(',') + '\n';
      list.forEach(item => {
        const row = [
          item.jobLogId,
          item.jobName,
          item.jobGroup,
          item.invokeTarget,
          item.jobMessage,
          item.status === '0' ? '成功' : '失败',
          item.exceptionInfo || '',
          item.createTime
        ];
        csv += row.map(cell => `"${cell}"`).join(',') + '\n';
      });
      
      return Buffer.from('\ufeff' + csv, 'utf8'); // 添加 BOM 以支持中文
    } catch (err) {
      ctx.logger.error('导出调度日志失败:', err);
      throw err;
    }
  }
}

module.exports = JobLogService;

